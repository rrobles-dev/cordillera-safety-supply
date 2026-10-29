import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { filterChanged, selectFilter } from '../postsSlice';

export function PostFilter() {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);

  return (
    <div className="filter">
      <label htmlFor="post-filter">Filter by product</label>
      <div className="filter-row">
        <input
          id="post-filter"
          type="search"
          value={filter}
          placeholder="e.g. helmet"
          onChange={(e) => dispatch(filterChanged(e.target.value))}
        />
        <button
          type="button"
          className="btn-secondary"
          disabled={!filter}
          onClick={() => dispatch(filterChanged(''))}
        >
          Clear
        </button>
      </div>
    </div>
  );
}