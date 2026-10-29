import { Modal } from '../../../components/Modal';
import type { Post } from '../types';

type ConfirmDeleteModalProps = {
  post: Post | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDeleteModal({ post, deleting, onCancel, onConfirm }: ConfirmDeleteModalProps) {
  return (
    <Modal
      open={post !== null}
      title="Delete post"
      onClose={onCancel}
      actions={
        <>
          <button type="button" className="btn-secondary" disabled={deleting} onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn-danger" disabled={deleting} onClick={onConfirm}>
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </>
      }
    >
      <p className="confirm-text">
        Delete the post for <strong>{post?.name}</strong>? This cannot be undone.
      </p>
    </Modal>
  );
}