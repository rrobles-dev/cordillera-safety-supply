# ADR 0005: Live local filter instead of a search button

- **Status:** Accepted
- **Date:** 2026-10-29

## Context

The wireframe shows a name filter with a "Buscar" (search) button. The challenge
requires filtering posts by name locally.

## Decision

Filter as the user types, replacing the search button with a "Clear" button. The store
keeps only the filter term; the visible list is derived with a memoized selector.

## Alternatives considered

- **Filter on button click (wireframe):** adds a step with no benefit, since filtering
  happens in memory and is instant.
- **Storing the filtered list in the store:** duplicates state that could drift from
  the source list after creating or deleting posts.

## Consequences

- Faster feedback and one less click; a conscious, documented deviation from the wireframe.
- No debounce is needed because no network request is involved.