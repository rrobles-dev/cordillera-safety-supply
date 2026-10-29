# ADR 0001: Marketing posts as the product domain

- **Status:** Accepted
- **Date:** 2026-10-28

## Context

The challenge asks for an app that manages "Posts" with a name and a description,
supporting create, delete, list and local filtering by name. We want to frame it as
a realistic product instead of placeholder data, without changing the required contract.

## Decision

The app is a social media post planner for the marketing team of Cordillera Safety
Supply, a fictional mining PPE supplier:

- **Name** is the product being promoted.
- **Description** is the post copy.
- The same copy cannot be repeated for the same product (case-insensitive),
  enforced by the database. The UI explains the conflict and links to the
  existing post.
- Reusing a copy for a different product is allowed, but the UI warns the user
  and requires explicit confirmation.

## Alternatives considered

- **Product catalog:** fits name and description, but "Post" would need a mapping
  layer and drifts from the literal challenge.
- **Incident registry:** strong mining fit, but incidents must never be deleted
  (audit trail), which contradicts the required delete feature. Kept for v2 with
  voiding instead of deletion.
- **Generic multi-type post:** adds a type field, per-type validation and UI;
  out of scope for the timeframe (YAGNI).
- **Versioning by renaming:** appending versions to the name ("v2") would mix
  product and version in one field. Republishing is addressed instead by a
  scheduled date in v1.2, extending the duplicate rule to product + copy + date.

## Consequences

- The challenge contract is met literally; every rule has a business justification.
- The duplicate rule lives in its own migration so it can be extended later.
- Media, extra notes, target channels and scheduling are deferred to the roadmap.
