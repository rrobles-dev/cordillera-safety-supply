import { configureStore } from '@reduxjs/toolkit';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createPost,
  deletePost,
  fetchPosts,
  filterChanged,
  postsReducer,
  selectAllPosts,
  selectFilteredPosts,
} from './postsSlice';
import type { Post } from './types';

const older: Post = {
  id: 1,
  name: 'Full-Body Harness',
  description: 'Trust your gear.',
  createdAt: '2026-10-28T10:00:00.000Z',
};

const newer: Post = {
  id: 2,
  name: 'Class E Dielectric Helmet',
  description: 'Safety on every shift.',
  createdAt: '2026-10-29T10:00:00.000Z',
};

const makeStore = () => configureStore({ reducer: { posts: postsReducer } });

afterEach(() => {
  vi.restoreAllMocks();
});

describe('posts reducer', () => {
  it('adds a created post first, without refetching', () => {
    const store = makeStore();
    store.dispatch(fetchPosts.fulfilled([older], 'req-1'));
    store.dispatch(createPost.fulfilled(newer, 'req-2', { name: newer.name, description: newer.description }));

    expect(selectAllPosts(store.getState()).map((p) => p.id)).toEqual([2, 1]);
  });

  it('removes a post using the id returned by the API', () => {
    const store = makeStore();
    store.dispatch(fetchPosts.fulfilled([older], 'req-1'));
    store.dispatch(deletePost.fulfilled(older, 'req-2', older.id));

    expect(selectAllPosts(store.getState())).toEqual([]);
  });

  it('removes a post that someone else already deleted (404)', () => {
    const store = makeStore();
    store.dispatch(fetchPosts.fulfilled([older], 'req-1'));
    store.dispatch(
      deletePost.rejected(null, 'req-2', older.id, { code: 'NOT_FOUND', message: 'Post 1 not found' }),
    );

    expect(selectAllPosts(store.getState())).toEqual([]);
  });
});

describe('selectFilteredPosts', () => {
  it('filters by product ignoring case and surrounding spaces', () => {
    const store = makeStore();
    store.dispatch(fetchPosts.fulfilled([older, newer], 'req-1'));
    store.dispatch(filterChanged('  HELMET '));

    expect(selectFilteredPosts(store.getState()).map((p) => p.name)).toEqual(['Class E Dielectric Helmet']);
  });
});

describe('fetchPosts', () => {
  it('requests the list only once even if dispatched twice (StrictMode)', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify([older]), { status: 200 }));
    const store = makeStore();

    await Promise.all([store.dispatch(fetchPosts()), store.dispatch(fetchPosts())]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(selectAllPosts(store.getState())).toHaveLength(1);
  });
});
