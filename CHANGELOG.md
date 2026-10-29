# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Repository structure, README, changelog and pull request template.
- ADR 0001: marketing posts as the product domain.
- Express + TypeScript API with environment validation and health check endpoint.
- PostgreSQL connection pool (Neon).
- `posts` table migration and case-insensitive duplicate index on product + copy.
- Idempotent seed with sample marketing posts.
- ADR 0002 (Express and pg without an ORM) and ADR 0003 (Neon for hosting).
- Posts endpoints: list (newest first), create and delete, returning the full entity.
- Zod validation for product (1-50) and copy (1-250), trimming whitespace.
- Centralized error handler with consistent JSON errors; no stack traces exposed.
- Integration tests with Vitest and supertest against a dedicated Neon test branch.
- API reference in `docs/api.md`.
- Frontend scaffold with Vite, React 19, TypeScript and Redux Toolkit.
- Posts slice skeleton with entity adapter sorted newest first.
- API client that maps HTTP and network failures to typed errors.
- Page layout with filter, posts and new post areas, following the wireframe.
- Posts table loaded from the API once per view load, with loading, empty and error states and a retry action.
- ADR 0004: async thunks instead of RTK Query.
- Post form with character counters and a preview step before publishing.
- Copy reuse warning that requires explicit confirmation when the copy is used by another product.
- Duplicate post feedback when the API responds with 409.
- Reusable modal based on the native dialog element.
- Delete action per post with a confirmation modal that focuses Cancel by default.
- Posts already deleted by someone else are removed from the view when the API responds with 404.
- Live, case-insensitive local filter by product with a clear action.
- "Show existing post" action on duplicate errors, which applies the filter.
- Frontend tests with Vitest and Testing Library for reducers, selectors, the copy reuse rule and the filter.
- ADR 0005: live local filter instead of a search button.
- Continuous integration with GitHub Actions: lint, tests and build for backend and frontend on every pull request, with a disposable PostgreSQL service for backend integration tests.

### Changed

- CORS accepts a comma-separated list of allowed origins, so local development and the deployed frontend can both reach the API.