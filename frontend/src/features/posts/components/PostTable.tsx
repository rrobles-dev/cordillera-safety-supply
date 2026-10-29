import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  fetchPosts,
  retryRequested,
  selectAllPosts,
  selectPostsError,
  selectPostsStatus,
} from '../postsSlice';

export function PostTable() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectPostsStatus);
  const error = useAppSelector(selectPostsError);
  const posts = useAppSelector(selectAllPosts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  function handleRetry() {
    dispatch(retryRequested());
    dispatch(fetchPosts());
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

  if (posts.length === 0) {
    return <p className="placeholder">No posts yet. Create the first one below.</p>;
  }

  return (
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
              <td>{/* Delete button arrives in the delete PR */}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}