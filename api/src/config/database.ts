import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '../../database.db');

let db: Database.Database;

/**
 * Initialize the SQLite database.
 *
 * better-sqlite3 is synchronous, so this no longer needs to be async.
 * It still RETURNS the db (rather than void) so existing call sites that
 * do `await initDatabase()` keep working unchanged — awaiting a non-promise
 * value is a harmless no-op in JS/TS.
 */
export function initDatabase(): Database.Database {
  if (db) return db;

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL'); // matches the original plan's WAL mode
  db.pragma('foreign_keys = ON');

  return db;
}

export function getDb(): Database.Database {
  if (!db) throw new Error('Database not initialized. Call initDatabase() first.');
  return db;
}

/**
 * Kept as a no-op for compatibility.
 *
 * Under sql.js the whole DB lived in memory and had to be serialized to disk
 * on every write. better-sqlite3 persists writes immediately, so there is
 * nothing to flush. This stub means any existing `saveDatabase()` calls
 * (e.g. in seed.ts) still compile and run without modification.
 */
export function saveDatabase(): void {
  /* intentionally empty — writes are already durable */
}

/**
 * better-sqlite3 rejects `undefined` and raw JS booleans as bind parameters
 * (it only accepts null, number, bigint, string, and Buffer). sql.js tolerated
 * them, so normalize here to keep every existing call site working:
 *   undefined -> null,  true -> 1,  false -> 0
 * This prevents "Cannot bind undefined"-style runtime errors after the swap,
 * which would otherwise show up on nullable columns (e.g. land with no bedrooms).
 */
function normalizeParams(params?: unknown[]): unknown[] {
  if (!params) return [];
  return params.map((p) => {
    if (p === undefined) return null;
    if (typeof p === 'boolean') return p ? 1 : 0;
    return p;
  });
}

export function runQuery(sql: string, params?: unknown[]): void {
  const stmt = getDb().prepare(sql);
  stmt.run(...normalizeParams(params));
}

export function getOne<T = Record<string, unknown>>(sql: string, params?: unknown[]): T | undefined {
  const stmt = getDb().prepare(sql);
  return stmt.get(...normalizeParams(params)) as T | undefined;
}

export function getAll<T = Record<string, unknown>>(sql: string, params?: unknown[]): T[] {
  const stmt = getDb().prepare(sql);
  return stmt.all(...normalizeParams(params)) as T[];
}

export function runInsert(sql: string, params?: unknown[]): number {
  const stmt = getDb().prepare(sql);
  const info = stmt.run(...normalizeParams(params));
  return Number(info.lastInsertRowid); // lastInsertRowid can be bigint; coerce to number
}