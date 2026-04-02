# Repository Guidelines

## Project Structure & Module Organization
This repository contains two TypeScript apps. `frontend/` is a Next.js App Router project; routes, layouts, and styles live in `frontend/app/`, and static assets belong in `frontend/public/`. `backend/` is a NestJS service; application code is in `backend/src/`, unit tests live next to source as `*.spec.ts`, and end-to-end tests are in `backend/test/`. Treat `frontend/.next/` and `backend/dist/` as generated output.

## Build, Test, and Development Commands
- `cd frontend && npm run dev`: start the Next.js dev server.
- `cd frontend && npm run build && npm run start`: validate and serve a production build.
- `cd frontend && npm run lint`: run the frontend ESLint config.
- `cd backend && npm run start:dev`: run the Nest API in watch mode.
- `cd backend && npm run build`: compile the API to `backend/dist/`.
- `cd backend && npm run test`: run backend unit tests.
- `cd backend && npm run test:e2e`: run backend e2e tests.
- `cd backend && npm run test:cov`: generate backend coverage output.

Both apps default to port `3000`; if you run both, move one, for example `npm run dev -- --port 3001`.

## Coding Style & Naming Conventions
Use 2-space indentation. In `frontend/`, follow App Router file names such as `page.tsx` and `layout.tsx`, keep React components in PascalCase, and match the double-quote TypeScript style plus Tailwind-based styling in `app/globals.css`. In `backend/`, follow Nest naming patterns such as `app.module.ts`, `app.controller.ts`, and `app.service.ts`. For API JSON payloads and database/table/column naming, use `snake_case`, not camelCase. Backend formatting is enforced by Prettier with single quotes and trailing commas; run `cd backend && npm run format` after edits. Use `npm run lint` in each package before opening a PR.

## Testing Guidelines
Backend tests use Jest and Supertest. Keep unit tests as `*.spec.ts` alongside the code they cover, and keep API tests in `backend/test/*.e2e-spec.ts`. No frontend test runner is configured yet, so frontend changes should at minimum pass `npm run lint` and `npm run build`. No explicit coverage threshold is configured, but `npm run test:cov` should remain green.

## Commit & Pull Request Guidelines
This workspace does not include `.git` metadata, so commit conventions cannot be verified from local history. Use short imperative subjects with a package scope, such as `frontend: update landing page` or `backend: add health check`. Pull requests should identify the package, summarize behavior changes, list validation commands, link related issues, and include screenshots for UI work or request/response examples for API changes.
