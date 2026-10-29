import { pool } from '../db/pool';
import type { CreatePostInput, Post } from './posts.schema';

const COLUMNS = 'id, name, description, created_at AS "createdAt"';

export async function findAll(): Promise<Post[]> {
  const { rows } = await pool.query<Post>(
    `SELECT ${COLUMNS} FROM posts ORDER BY created_at DESC, id DESC`,
  );
  return rows;
}

export async function create({ name, description }: CreatePostInput): Promise<Post> {
  const { rows } = await pool.query<Post>(
    `INSERT INTO posts (name, description) VALUES ($1, $2) RETURNING ${COLUMNS}`,
    [name, description],
  );
  return rows[0];
}

export async function deleteById(id: number): Promise<Post | null> {
  const { rows } = await pool.query<Post>(
    `DELETE FROM posts WHERE id = $1 RETURNING ${COLUMNS}`,
    [id],
  );
  return rows[0] ?? null;
}