import { z } from 'zod';

export const createPostSchema = z.object({
  name: z
    .string({ error: 'Product is required' })
    .trim()
    .min(1, 'Product is required')
    .max(50, 'Product must be at most 50 characters'),
  description: z
    .string({ error: 'Copy is required' })
    .trim()
    .min(1, 'Copy is required')
    .max(250, 'Copy must be at most 250 characters'),
});

export const postIdSchema = z.coerce.number().int().positive();

export type CreatePostInput = z.infer<typeof createPostSchema>;

export type Post = {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
};