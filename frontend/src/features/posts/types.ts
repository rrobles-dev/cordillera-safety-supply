export type Post = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
};

export type NewPost = Pick<Post, 'name' | 'description'>;