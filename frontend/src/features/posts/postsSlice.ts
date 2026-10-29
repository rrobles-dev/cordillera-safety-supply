import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { ApiError, apiRequest } from '../../api/client';
import type { RootState } from '../../app/store';
import type { Post } from './types';

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