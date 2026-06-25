import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(__dirname, '../../database.db');

let db: SqlJsDatabase;

export async function initDatabase(): Promise<SqlJsDatabase> {
  if (db) return db;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA foreign_keys = ON');

  return db;
}

export function getDb(): SqlJsDatabase {
  if (!db) throw new Error('Database not initialized. Call initDatabase() first.');
  return db;
}

export function saveDatabase(): void {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

export function runQuery(sql: string, params?: unknown[]): void {
  const d = getDb();
  d.run(sql, params as any[]);
  saveDatabase();
}

export function getOne<T = Record<string, unknown>>(sql: string, params?: unknown[]): T | undefined {
  const d = getDb();
  const stmt = d.prepare(sql);
  if (params) stmt.bind(params as any[]);
  const result = stmt.step() ? stmt.getAsObject() : undefined;
  stmt.free();
  return result as T | undefined;
}

export function getAll<T = Record<string, unknown>>(sql: string, params?: unknown[]): T[] {
  const d = getDb();
  const results: T[] = [];
  const stmt = d.prepare(sql);
  if (params) stmt.bind(params as any[]);
  while (stmt.step()) {
    results.push(stmt.getAsObject() as T);
  }
  stmt.free();
  return results;
}

export function runInsert(sql: string, params?: unknown[]): number {
  const d = getDb();
  d.run(sql, params as any[]);
  const lastId = (d.exec('SELECT last_insert_rowid() as id')[0]?.values[0]?.[0] as number) || 0;
  saveDatabase();
  return lastId;
}
