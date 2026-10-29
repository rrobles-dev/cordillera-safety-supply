import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  deletePost,
  fetchPosts,
  retryRequested,
  selectAllPosts,
  selectPostsError,
  selectPostsStatus,
  type RejectValue,
} from '../postsSlice';
import type { Post } from '../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

type Feedback = { type: 'success' | 'error'; text: string };

export function PostTable() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectPostsStatus);
  const error = useAppSelector(selectPostsError);
  const posts = useAppSelector(selectAllPosts);

  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  function handleRetry() {
    dispatch(retryRequested());
    dispatch(fetchPosts());
  }

  async function handleConfirmDelete() {
    if (!postToDelete) return;
    setDeleting(true);
    setFeedback(null);
    try {
      const deleted = await dispatch(deletePost(postToDelete.id)).unwrap();
      setFeedback({ type: 'success', text: `Post for "${deleted.name}" deleted.` });
    } catch (err) {
      const { code, message } = err as RejectValue;
      setFeedback({
        type: 'error',
        text: code === 'NOT_FOUND' ? 'This post had already been deleted.' : message,
      });
    } finally {
      setDeleting(false);
      setPostToDelete(null);
    }
  }

  if (status === 'idle' || status === 'loading') {
    return (
      <p className="placeholder" role="status">
        Connecting to the server... The first load can take up to a minute.
      </p>
    );
  }

  if (status === 'failed') {
    return (
      <div className="alert" role="alert">
        <p>{error}</p>
        <button type="button" onClick={handleRetry}>Retry</button>
      </div>
    );
  }

  return (
    <>
      {feedback && (
        <p className={feedback.type === 'success' ? 'success feedback' : 'error-text feedback'} role="status">
          {feedback.text}
        </p>
      )}

      {posts.length === 0 ? (
        <p className="placeholder">No posts yet. Create the first one below.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Copy</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="cell-product">{post.name}</td>
                  <td>{post.description}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-danger"
                      aria-label={`Delete post for ${post.name}`}
                      onClick={() => setPostToDelete(post)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDeleteModal
        post={postToDelete}
        deleting={deleting}
        onCancel={() => setPostToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
