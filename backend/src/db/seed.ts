import path from 'node:path';
import { pool } from './pool';
import { runSqlFile } from './run-sql-file';

runSqlFile(path.join(__dirname, 'seed.sql'))
  .then(() => pool.end())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
