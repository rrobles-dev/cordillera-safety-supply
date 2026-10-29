import { AppError } from '../errors/app-error';
import * as repository from './posts.repository';
import type { CreatePostInput, Post } from './posts.schema';

const UNIQUE_VIOLATION = '23505';

function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: unknown }).code === UNIQUE_VIOLATION
  );
}

export function listPosts(): Promise<Post[]> {
  return repository.findAll();
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  try {
    return await repository.create(input);
  } catch (err) {
    if (isUniqueViolation(err)) {
      throw new AppError(409, 'DUPLICATE_POST', 'A post with this product and copy already exists');
    }
    throw err;
  }
}

export async function deletePost(id: number): Promise<Post> {
  const deleted = await repository.deleteById(id);
  if (!deleted) throw new AppError(404, 'NOT_FOUND', `Post ${id} not found`);
  return deleted;
}