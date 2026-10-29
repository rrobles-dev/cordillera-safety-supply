import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { pool } from './pool';
import { runSqlFile } from './run-sql-file';

async function migrate() {
  const dir = path.join(__dirname, 'migrations');
  const files = (await readdir(dir)).filter((f) => f.endsWith('.sql')).sort();
  for (const file of files) await runSqlFile(path.join(dir, file));
  await pool.end();
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
