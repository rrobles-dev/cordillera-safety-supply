import type { Request, Response } from 'express';
import { createPostSchema, postIdSchema } from './posts.schema';
import * as service from './posts.service';

export async function list(_req: Request, res: Response) {
  res.json(await service.listPosts());
}

export async function create(req: Request, res: Response) {
  const input = createPostSchema.parse(req.body);
  res.status(201).json(await service.createPost(input));
}

export async function remove(req: Request, res: Response) {
  const id = postIdSchema.parse(req.params.id);
  res.json(await service.deletePost(id));
}