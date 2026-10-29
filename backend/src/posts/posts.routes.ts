import { Router } from 'express';
import * as controller from './posts.controller';

export const postsRouter = Router();

postsRouter.get('/', controller.list);
postsRouter.post('/', controller.create);
postsRouter.delete('/:id', controller.remove);