import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { ApiError, apiRequest } from '../../api/client';
import type { RootState } from '../../app/store';
import type { NewPost, Post } from './types';

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
export type RejectValue = { code: string; message: string };

export function toRejectValue(err: unknown): RejectValue {
  return err instanceof ApiError
    ? { code: err.code, message: err.message }
    : { code: 'UNKNOWN_ERROR', message: 'Unexpected error' };
}

export const fetchPosts = createAsyncThunk<
  Post[],
  void,
  { state: RootState; rejectValue: RejectValue }
>(
  'posts/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await apiRequest<Post[]>('/posts');
    } catch (err) {
      return rejectWithValue(toRejectValue(err));
    }
  },
  {
    // Challenge rule: the full list is requested once per view load.
    // Also prevents the duplicate request caused by StrictMode running effects twice.
    condition: (_, { getState }) => getState().posts.status === 'idle',
  },
);

export const createPost = createAsyncThunk<Post, NewPost, { rejectValue: RejectValue }>(
  'posts/create',
  async (newPost, { rejectWithValue }) => {
    try {
      return await apiRequest<Post>('/posts', {
        method: 'POST',
        body: JSON.stringify(newPost),
      });
    } catch (err) {
      return rejectWithValue(toRejectValue(err));
    }
  },
);

export const deletePost = createAsyncThunk<Post, number, { rejectValue: RejectValue }>(
  'posts/delete',
  async (id, { rejectWithValue }) => {
    try {
      return await apiRequest<Post>(`/posts/${id}`, { method: 'DELETE' });
    } catch (err) {
      return rejectWithValue(toRejectValue(err));
    }
  },
);

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
    retryRequested(state) {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        postsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message ?? 'Could not load posts';
      })
      // The API returns the created post: add it to the store, no refetch
      .addCase(createPost.fulfilled, (state, action) => {
        postsAdapter.addOne(state, action.payload);
      })
      // The API returns the deleted post: remove it by the id it confirms
      .addCase(deletePost.fulfilled, (state, action) => {
        postsAdapter.removeOne(state, action.payload.id);
      })
      // Someone else already deleted it: keep the store in sync with the server
      .addCase(deletePost.rejected, (state, action) => {
        if (action.payload?.code === 'NOT_FOUND') {
          postsAdapter.removeOne(state, action.meta.arg);
        }
      });
  },
});

export const { filterChanged, retryRequested } = postsSlice.actions;
export const postsReducer = postsSlice.reducer;

export const { selectAll: selectAllPosts } = postsAdapter.getSelectors<RootState>(
  (state) => state.posts,
);
export const selectPostsStatus = (state: RootState) => state.posts.status;
export const selectPostsError = (state: RootState) => state.posts.error;