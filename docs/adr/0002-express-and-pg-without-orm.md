# ADR 0002: Express and pg without an ORM

- **Status:** Accepted
- **Date:** 2026-10-28

## Context

The API exposes three endpoints over a single table, built and defended within
a 12-hour window.

## Decision

Use Express 5 with TypeScript and the `pg` driver, writing parameterized SQL by hand,
organized in routes, controllers, services and repositories.

## Alternatives considered

- **NestJS + TypeORM:** modules and dependency injection add structure that three
  endpoints do not need, and ORM-generated queries are harder to explain line by line.

## Consequences

- Every query is visible: `RETURNING` covers "return the created/deleted post" in one
  round trip, and column aliases map snake_case to camelCase.
- Migrations run through a minimal custom script with no applied-migrations history;
  a dedicated tool (node-pg-migrate) is listed in the roadmap.
