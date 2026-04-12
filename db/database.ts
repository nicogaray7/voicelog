import * as SQLite from "expo-sqlite";

import { runMigrations } from "./migrations";

const DATABASE_NAME = "voicelog.db";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * Single shared SQLite handle. WAL + migrations run once per app cold start.
 * See [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) for async API guidance.
 */
export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (databasePromise === null) {
    databasePromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      await db.execAsync("PRAGMA foreign_keys = ON;");
      await db.execAsync("PRAGMA journal_mode = WAL;");
      await runMigrations(db);
      return db;
    })();
  }
  return databasePromise;
}
