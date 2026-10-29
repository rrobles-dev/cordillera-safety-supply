import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';
import { app } from '../src/app';
import { pool } from '../src/db/pool';

afterAll(async () => {
  await pool.end();
});

describe('CORS', () => {
  it('allows the configured frontend origin', async () => {
    const res = await request(app).get('/api/health').set('Origin', 'http://localhost:5173');

    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });

  it('does not allow unknown origins', async () => {
    const res = await request(app).get('/api/health').set('Origin', 'https://evil.example.com');

    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});