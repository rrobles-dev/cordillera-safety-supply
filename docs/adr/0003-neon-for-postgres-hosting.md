# ADR 0003: Neon for PostgreSQL hosting

- **Status:** Accepted
- **Date:** 2026-10-28

## Context

The public demo needs a free PostgreSQL instance that stays available after the review.

## Decision

Host the database on Neon's free plan; the API runs on Render's free tier.

## Alternatives considered

- **Render Postgres (free):** expires 30 days after creation, so the demo would break
  after the selection process.

## Consequences

- The database does not expire and scales to zero when idle.
- API and database live on different providers, connected over TLS via `DATABASE_URL`.
