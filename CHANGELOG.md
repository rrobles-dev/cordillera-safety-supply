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