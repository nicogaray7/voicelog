import type { CrmType } from "../../types/crm";

/** Mirrors Supabase `reports.status` CHECK constraint (guidelines.md). */
export type ReportSyncStatus = "pending" | "processing" | "synced" | "failed";

/** Local-first report row — source of truth on device until Ghost Sync completes. */
export interface LocalReport {
  id: string;
  userId: string | null;
  status: ReportSyncStatus;
  rawTranscript: string | null;
  structuredData: Record<string, unknown> | null;
  crmType: CrmType;
  crmContactId: string | null;
  offlineCreatedAtMs: number;
  syncedAtMs: number | null;
  remoteId: string | null;
  localAudioUri: string | null;
  retryCount: number;
  lastError: string | null;
}

export interface CreateLocalReportInput {
  crmType: CrmType;
  userId?: string;
  crmContactId?: string;
  localAudioUri?: string;
}
