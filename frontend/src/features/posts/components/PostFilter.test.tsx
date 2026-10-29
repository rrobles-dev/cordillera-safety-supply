import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import { postsReducer } from '../postsSlice';
import { PostFilter } from './PostFilter';

describe('PostFilter', () => {
  it('updates the filter as the user types and clears it', async () => {
    const user = userEvent.setup();
    const store = configureStore({ reducer: { posts: postsReducer } });
    render(
      <Provider store={store}>
        <PostFilter />
      </Provider>,
    );

    const input = screen.getByLabelText('Filter by product');
    await user.type(input, 'helmet');
    expect(store.getState().posts.filter).toBe('helmet');

    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(store.getState().posts.filter).toBe('');
    expect(input).toHaveValue('');
  });
});
