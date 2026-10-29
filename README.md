# Cordillera Safety Supply — Social Post Planner

[![CI](https://github.com/rrobles-dev/cordillera-safety-supply/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/rrobles-dev/cordillera-safety-supply/actions/workflows/ci.yml)

> Technical challenge for TCIT Cloud Solutions (Fullstack Developer, second round).

**Live demo:** https://cordillera-safety-supply.vercel.app
**API:** https://cordillera-api.onrender.com/api/posts

> The API runs on Render's free tier and sleeps after 15 minutes without traffic.
> The first load can take up to a minute while it wakes up.

Internal tool for the marketing team of **Cordillera Safety Supply (CSS)**, a fictional
supplier of personal protective equipment (PPE) for the mining industry. The team uses it
to plan the social media posts that promote its products.

## Challenge mapping

| Challenge                         | This project                                   |
| --------------------------------- | ---------------------------------------------- |
| Post                              | Social media post                              |
| Name                              | Product being promoted                         |
| Description                       | Post copy                                      |
| Insert / delete / list posts      | Create, delete and list, returning the entity  |
| Filter by name locally            | Live, case-insensitive filter by product       |
| List endpoint called once per view | Guarded thunk; mutations update the store     |

## Features

- **List** posts newest first, fetched once per view load.
- **Create** posts with character counters and a preview step before publishing.
- **Copy reuse warning:** reusing a copy for another product requires explicit confirmation.
- **Duplicate detection:** the same product and copy is rejected, with a shortcut to the existing post.
- **Delete** with a confirmation modal that focuses Cancel by default.
- **Filter** by product as you type.

## Business rules

| #  | Rule                                                        | Enforced in              |
| -- | ----------------------------------------------------------- | ------------------------ |
| R1 | Product is required, 1–50 characters after trimming         | UI, API (Zod), database  |
| R2 | Copy is required, 1–250 characters after trimming           | UI, API (Zod), database  |
| R3 | Same product + same copy is a duplicate (case-insensitive)  | Database unique index → 409 |
| R4 | Posts are reviewed in a preview before publishing           | UI                       |
| R5 | Deleting requires confirmation showing the product          | UI                       |
| R6 | The full list is requested once per view load               | Redux thunk `condition`  |
| R7 | Filtering is local, live and case-insensitive               | Memoized selector        |
| R8 | Reusing a copy for another product warns and asks to confirm | UI                      |

## Architecture

```
Browser ── loads the app ──> Vercel (React + Redux SPA)
   │
   └── fetch JSON ──> Render (Express API) ── SQL over TLS ──> Neon (PostgreSQL)
```

- **Backend:** routes → controllers (HTTP + Zod validation) → services (business rules)
  → repositories (parameterized SQL). A single error handler returns consistent JSON errors.
- **Frontend:** feature-based structure. Posts are stored in a Redux entity adapter;
  create and delete add or remove the entity returned by the API, so the list is never refetched.
- **API reference:** [docs/api.md](./docs/api.md)

## Tech stack

| Layer    | Technologies                                                      |
| -------- | ----------------------------------------------------------------- |
| Frontend | React 19, TypeScript, Redux Toolkit, Vite                         |
| Backend  | Node.js 22, Express 5, TypeScript, pg, Zod                        |
| Database | PostgreSQL (Neon)                                                 |
| Testing  | Vitest, Testing Library, supertest                                |
| Delivery | GitHub Actions, Render (API), Vercel (frontend)                   |

## Running locally

**Prerequisites:** Node.js 22 (`nvm use` reads `.nvmrc`) and a PostgreSQL database
(a free [Neon](https://neon.com) project works).

### Backend

```bash
cd backend
cp .env.example .env        # set DATABASE_URL
npm install
npm run db:migrate
npm run db:seed
npm run dev                 # http://localhost:3000/api/health
```

### Frontend

```bash
cd frontend
cp .env.example .env.local  # VITE_API_URL=http://localhost:3000/api
npm install
npm run dev                 # http://localhost:5173
```

## Tests

```bash
cd backend && npm test      # 11 integration tests (needs .env.test with a test database)
cd frontend && npm test     # 9 unit and component tests
```

Backend tests run against a real PostgreSQL database and truncate the table before each
test, so they must use a dedicated database (a Neon branch locally, a disposable
PostgreSQL service in CI). Frontend tests mock `fetch` to test store logic in isolation.

Every pull request runs lint, tests and build for both apps in GitHub Actions, and merging
requires both checks to pass.

## Engineering decisions

Recorded as Architecture Decision Records in [docs/adr](./docs/adr):

1. [Marketing posts as the product domain](./docs/adr/0001-marketing-posts-domain.md)
2. [Express and pg without an ORM](./docs/adr/0002-express-and-pg-without-orm.md)
3. [Neon for PostgreSQL hosting](./docs/adr/0003-neon-for-postgres-hosting.md)
4. [Async thunks instead of RTK Query](./docs/adr/0004-thunks-instead-of-rtk-query.md)
5. [Live local filter instead of a search button](./docs/adr/0005-live-local-filter.md)

Conscious deviations from the brief: the filter runs as you type instead of on a
"Search" button (ADR 0005), and the app uses React 19, the current version.

## Git workflow

- `feature/*` → `develop` via pull request, squash merged (one commit per feature).
- `develop` → `main` via release pull request, merged with a merge commit to keep both branches in sync.
- Conventional Commits, a pull request template, and a [changelog](./CHANGELOG.md).
- Built solo, following a team workflow to show how I work with pull requests and reviews.

## Roadmap

| Version   | Improvement                                                                 |
| --------- | --------------------------------------------------------------------------- |
| v1.1      | Media per post, extra notes for the designer, target channels (multi-select) |
| v1.1      | Edit posts                                                                  |
| v1.2      | Scheduled publishing date; duplicate rule extends to product + copy + date  |
| v1.2      | Post status: draft → in review → approved                                   |
| v2        | Authentication and roles (editor, reviewer, admin) to protect write endpoints |
| v2        | Real-time updates with Server-Sent Events when other users change posts     |
| v2        | AI detection of near-duplicate copies with embeddings (pgvector)            |
| v2        | Product catalog as its own entity                                           |
| Technical | Server-side pagination, migration tool with history, Playwright E2E tests   |

## Author

**Ricardo Robles** · [GitHub](https://github.com/rrobles-dev)