import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { pool } from './db/pool';

export const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'ok' });
});
