import type { SQLiteDatabase } from "expo-sqlite";
import { randomUUID } from "expo-crypto";

import type {
  CreateLocalReportInput,
  LocalReport,
  ReportSyncStatus,
} from "../types/report";
import type { CrmType } from "../../types/crm";

export interface ReportRepository {
  createDraft(input: CreateLocalReportInput): Promise<LocalReport>;
  getById(id: string): Promise<LocalReport | null>;
  listQueue(): Promise<LocalReport[]>;
  updateStatus(id: string, status: ReportSyncStatus): Promise<void>;
}

type ReportRow = {
  id: string;
  user_id: string | null;
  status: string;
  raw_transcript: string | null;
  structured_data: string | null;
  crm_type: string;
  crm_contact_id: string | null;
  offline_created_at: number;
  synced_at: number | null;
  remote_id: string | null;
  local_audio_uri: string | null;
  retry_count: number;
  last_error: string | null;
};

function parseCrmType(value: string): CrmType {
  if (value === "hubspot" || value === "pipedrive") {
    return value;
  }
  return "hubspot";
}

function parseStatus(value: string): ReportSyncStatus {
  if (
    value === "pending" ||
    value === "processing" ||
    value === "synced" ||
    value === "failed"
  ) {
    return value;
  }
  return "pending";
}

function parseStructuredData(
  value: string | null,
): Record<string, unknown> | null {
  if (value === null || value === "") {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(value);
    if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}

function mapRow(row: ReportRow): LocalReport {
  return {
    id: row.id,
    userId: row.user_id,
    status: parseStatus(row.status),
    rawTranscript: row.raw_transcript,
    structuredData: parseStructuredData(row.structured_data),
    crmType: parseCrmType(row.crm_type),
    crmContactId: row.crm_contact_id,
    offlineCreatedAtMs: row.offline_created_at,
    syncedAtMs: row.synced_at,
    remoteId: row.remote_id,
    localAudioUri: row.local_audio_uri,
    retryCount: row.retry_count,
    lastError: row.last_error,
  };
}

export class SqlReportRepository implements ReportRepository {
  constructor(private readonly getDb: () => Promise<SQLiteDatabase>) {}

  async createDraft(input: CreateLocalReportInput): Promise<LocalReport> {
    const db = await this.getDb();
    const id = randomUUID();
    const now = Date.now();
    await db.runAsync(
      `INSERT INTO reports (
        id, user_id, status, crm_type, crm_contact_id,
        offline_created_at, local_audio_uri, raw_transcript, structured_data, retry_count
      ) VALUES (?, ?, 'pending', ?, ?, ?, ?, NULL, NULL, 0)`,
      [
        id,
        input.userId ?? null,
        input.crmType,
        input.crmContactId ?? null,
        now,
        input.localAudioUri ?? null,
      ],
    );
    const created = await this.getById(id);
    if (created === null) {
      throw new Error("Failed to read report after insert");
    }
    return created;
  }

  async getById(id: string): Promise<LocalReport | null> {
    const db = await this.getDb();
    const row = await db.getFirstAsync<ReportRow>(
      "SELECT * FROM reports WHERE id = ?",
      [id],
    );
    if (row === null) {
      return null;
    }
    return mapRow(row);
  }

  /** Items waiting for or retrying background processing / sync. */
  async listQueue(): Promise<LocalReport[]> {
    const db = await this.getDb();
    const rows = await db.getAllAsync<ReportRow>(
      `SELECT * FROM reports
       WHERE status IN ('pending', 'failed', 'processing')
       ORDER BY offline_created_at ASC`,
    );
    return rows.map(mapRow);
  }

  async updateStatus(id: string, status: ReportSyncStatus): Promise<void> {
    const db = await this.getDb();
    const result = await db.runAsync(
      "UPDATE reports SET status = ? WHERE id = ?",
      [status, id],
    );
    if (result.changes === 0) {
      throw new Error(`No report updated for id ${id}`);
    }
  }
}
