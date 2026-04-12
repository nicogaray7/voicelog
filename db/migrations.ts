import type { SQLiteDatabase } from "expo-sqlite";

const CURRENT_VERSION = 1;

const MIGRATIONS: Record<number, string> = {
  1: `
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT,
      status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'synced', 'failed')),
      raw_transcript TEXT,
      structured_data TEXT,
      crm_type TEXT NOT NULL CHECK (crm_type IN ('hubspot', 'pipedrive')),
      crm_contact_id TEXT,
      offline_created_at INTEGER NOT NULL,
      synced_at INTEGER,
      remote_id TEXT,
      local_audio_uri TEXT,
      retry_count INTEGER NOT NULL DEFAULT 0,
      last_error TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
    CREATE INDEX IF NOT EXISTS idx_reports_offline_created ON reports(offline_created_at DESC);
  `,
};

async function readUserVersion(db: SQLiteDatabase): Promise<number> {
  const row = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  return row?.user_version ?? 0;
}

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  let version = await readUserVersion(db);
  while (version < CURRENT_VERSION) {
    const nextVersion = version + 1;
    const sql = MIGRATIONS[nextVersion];
    if (sql === undefined) {
      throw new Error(`Missing migration for version ${nextVersion}`);
    }
    await db.withTransactionAsync(async () => {
      await db.execAsync(sql);
      await db.execAsync(`PRAGMA user_version = ${nextVersion}`);
    });
    version = nextVersion;
  }
}
