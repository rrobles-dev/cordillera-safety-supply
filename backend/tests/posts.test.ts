import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/app';
import { pool } from '../src/db/pool';

const validPost = {
  name: 'Class E Dielectric Helmet',
  description: 'Safety you can feel on every shift.',
};

beforeEach(async () => {
  await pool.query('TRUNCATE posts RESTART IDENTITY');
});

afterAll(async () => {
  await pool.end();
});

describe('POST /api/posts', () => {
  it('creates a post and returns it with id and createdAt', async () => {
    const res = await request(app).post('/api/posts').send(validPost);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: expect.any(Number),
      ...validPost,
      createdAt: expect.any(String),
    });
  });

  it('rejects a product longer than 50 characters', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({ ...validPost, name: 'x'.repeat(51) });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects a product made only of spaces', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({ ...validPost, name: '   ' });

    expect(res.status).toBe(400);
  });

  it('returns 409 for the same product and copy with different casing', async () => {
    await request(app).post('/api/posts').send(validPost);
    const res = await request(app).post('/api/posts').send({
      name: validPost.name.toUpperCase(),
      description: validPost.description.toUpperCase(),
    });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('DUPLICATE_POST');
  });

  it('allows the same copy for a different product', async () => {
    await request(app).post('/api/posts').send(validPost);
    const res = await request(app)
      .post('/api/posts')
      .send({ ...validPost, name: 'Dielectric Safety Boots' });

    expect(res.status).toBe(201);
  });
});

describe('GET /api/posts', () => {
  it('returns all posts, newest first', async () => {
    await request(app).post('/api/posts').send(validPost);
    await request(app)
      .post('/api/posts')
      .send({ name: 'Full-Body Harness', description: 'Trust your gear.' });

    const res = await request(app).get('/api/posts');

    expect(res.status).toBe(200);
    expect(res.body.map((p: { name: string }) => p.name)).toEqual([
      'Full-Body Harness',
      'Class E Dielectric Helmet',
    ]);
  });
});

describe('DELETE /api/posts/:id', () => {
  it('returns the deleted post', async () => {
    const created = await request(app).post('/api/posts').send(validPost);
    const res = await request(app).delete(`/api/posts/${created.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(created.body);
  });

  it('returns 404 when the post does not exist', async () => {
    const res = await request(app).delete('/api/posts/999');

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('returns 400 for a non-numeric id', async () => {
    const res = await request(app).delete('/api/posts/abc');

    expect(res.status).toBe(400);
  });
});