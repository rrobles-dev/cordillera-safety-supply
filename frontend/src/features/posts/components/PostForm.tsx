import { useState, type FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Modal } from '../../../components/Modal';
import { findProductsUsingCopy } from '../postRules';
import { createPost, selectAllPosts, type RejectValue } from '../postsSlice';

const NAME_MAX = 50;
const COPY_MAX = 250;

export function PostForm() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectAllPosts);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [reuseConfirmed, setReuseConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const product = name.trim();
  const copy = description.trim();
  const isValid =
    product.length > 0 && product.length <= NAME_MAX && copy.length > 0 && copy.length <= COPY_MAX;

  const reusedIn = findProductsUsingCopy(posts, product, copy);
  const needsReuseConfirmation = reusedIn.length > 0;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValid) return;
    setError(null);
    setSuccess(null);
    setReuseConfirmed(false);
    setPreviewOpen(true);
  }

  async function handlePublish() {
    setSubmitting(true);
    try {
      await dispatch(createPost({ name: product, description: copy })).unwrap();
      setName('');
      setDescription('');
      setSuccess(`Post for "${product}" created.`);
    } catch (err) {
      const { code, message } = err as RejectValue;
      setError(
        code === 'DUPLICATE_POST'
          ? `A post for "${product}" with this copy already exists.`
          : message,
      );
    } finally {
      setSubmitting(false);
      setPreviewOpen(false);
    }
  }

  return (
    <>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <div className="field-label">
            <label htmlFor="post-name">Product</label>
            <span className="counter">{name.length}/{NAME_MAX}</span>
          </div>
          <input
            id="post-name"
            value={name}
            maxLength={NAME_MAX}
            placeholder="e.g. Class E Dielectric Helmet"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field">
          <div className="field-label">
            <label htmlFor="post-copy">Copy</label>
            <span className="counter">{description.length}/{COPY_MAX}</span>
          </div>
          <textarea
            id="post-copy"
            rows={3}
            value={description}
            maxLength={COPY_MAX}
            placeholder="What will this post say?"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {error && (
          <div className="alert" role="alert">
            <p>{error}</p>
          </div>
        )}
        {success && <p className="success" role="status">{success}</p>}

        <div>
          <button type="submit" disabled={!isValid}>Create</button>
        </div>
      </form>

      <Modal
        open={previewOpen}
        title="Review your post"
        onClose={() => setPreviewOpen(false)}
        actions={
          <>
            <button type="button" className="btn-secondary" disabled={submitting} onClick={() => setPreviewOpen(false)}>
              Edit
            </button>
            <button
              type="button"
              disabled={submitting || (needsReuseConfirmation && !reuseConfirmed)}
              onClick={handlePublish}
            >
              {submitting ? 'Publishing...' : 'Publish'}
            </button>
          </>
        }
      >
        <dl className="preview">
          <dt>Product</dt>
          <dd>{product}</dd>
          <dt>Copy</dt>
          <dd>{copy}</dd>
        </dl>

        {needsReuseConfirmation && (
          <div className="warning">
            <p>This copy is already used for: {reusedIn.join(', ')}.</p>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={reuseConfirmed}
                onChange={(e) => setReuseConfirmed(e.target.checked)}
              />
              Reuse this copy anyway
            </label>
          </div>
        )}
      </Modal>
    </>
  );
}
