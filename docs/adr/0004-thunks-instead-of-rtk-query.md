# ADR 0004: Async thunks instead of RTK Query

- **Status:** Accepted
- **Date:** 2026-10-29

## Context

The challenge requires the full list of posts to be requested only once per view load.
Create and delete endpoints return the affected post.

## Decision

Use `createAsyncThunk` with an entity adapter. The list thunk has a `condition` that only
runs it when the status is `idle`. Create and delete update the store with the post
returned by the API instead of refetching the list.

## Alternatives considered

- **RTK Query:** less boilerplate and built-in caching, but its standard pattern
  (`invalidatesTags`) refetches the list after every mutation, which breaks the rule.
  Manual cache updates are possible but add complexity for this scope.
- **Plain `useEffect` + `fetch`:** React 18+ StrictMode runs effects twice in
  development, causing two requests unless guarded manually.

## Consequences

- The single-request rule is enforced in one place and verifiable in the Network tab.
- A retry action resets the status to `idle` so the guard allows a new attempt.
- Data can become stale if other users change posts; acceptable for this scope.
