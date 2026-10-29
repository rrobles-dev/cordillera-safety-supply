import { createEntityAdapter, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { Post } from './types';

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id,
});

const initialState = postsAdapter.getInitialState({
  status: 'idle' as RequestStatus,
  error: null as string | null,
  filter: '',
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    filterChanged(state, action: PayloadAction<string>) {
      state.filter = action.payload;
    },
  },
});

export const { filterChanged } = postsSlice.actions;
export const postsReducer = postsSlice.reducer;
export const postsSelectors = postsAdapter.getSelectors<RootState>((state) => state.posts);