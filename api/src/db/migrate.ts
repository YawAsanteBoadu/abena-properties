import fs from 'fs';
import path from 'path';
import { initDatabase, getDb, saveDatabase } from '../config/database';

async function migrate() {
  await initDatabase();
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  getDb().exec(schema);
  saveDatabase();
  process.stderr.write('[migrate] Schema applied successfully.\n');
  process.exit(0);
}

migrate().catch((err) => {
  process.stderr.write(`[migrate] Error: ${err.message}\n`);
  process.exit(1);
});
