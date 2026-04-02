# Messagespring

Full-stack "Request a Demo" implementation based on the provided Figma landing page.

## Stack

- `frontend/`: Next.js 16 App Router
- `backend/`: NestJS 11
- Database: PostgreSQL

## What’s Implemented

- Responsive landing page rebuilt in Next.js from the Figma structure
- Local image assets served from `frontend/public/images/landing`
- Client-side form validation and submission states
- NestJS API with:
  - `GET /api/health`
  - `POST /api/contact`
- PostgreSQL persistence for contact request submissions
- Validation, input normalization, throttling, CORS, and helmet hardening
- Postman collection for local API testing

## Project Structure

```text
.
├── frontend/
│   ├── app/
│   └── public/images/landing/
├── backend/
│   └── src/
├── plans/
└── postman/
```

## Prerequisites

- Node.js 20+
- npm 10+
- A local PostgreSQL instance

## Local Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
```

Set `DATABASE_URL` in `backend/.env` to your local PostgreSQL connection string.

Example:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/messagespring
FRONTEND_ORIGIN=http://localhost:3001
```

Install dependencies and start the API:

```bash
cd backend
npm install
npm run start:dev
```

The backend runs on `http://localhost:3000` by default.

Notes:

- The `demo_requests` table is created automatically on first write if it does not already exist.
- The API is prefixed with `/api`, so the submission endpoint is `POST /api/contact`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local
```

Default frontend environment:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

Install dependencies and start the Next.js app on a different port from the backend:

```bash
cd frontend
npm install
npm run dev -- --port 3001
```

Open `http://localhost:3001`.

## Validation Commands

### Backend

```bash
cd backend
npm run lint
npm run build
npm run test
npm run test:e2e
```

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

## Postman

Import these files into Postman:

- `postman/messagespring-backend.postman_collection.json`
- `postman/messagespring-local.postman_environment.json`

They include:

- `GET /api/health`
- `POST /api/contact`
- an invalid submission request for validation testing

## Approach

### Frontend

- Kept the landing page as a Server Component and isolated browser-only form behavior in a Client Component.
- Used local `next/image` assets for stable production-friendly image handling.
- Matched the Figma layout direction with a responsive hero, category mosaic, and split form panel.
- Added inline validation, accessible labels, error messaging, loading state, and success feedback.

### Backend

- Replaced the Nest starter route with a dedicated request-demo flow.
- Centralized app hardening with global validation, CORS, throttling, and helmet.
- Used PostgreSQL via `pg` with a small database service instead of adding a heavier ORM.
- Normalized incoming values before persistence and returned a compact submission payload to the frontend.

## Current Notes

- The bonus AWS EC2 + GitHub Actions deployment work is not implemented yet.
- Package-level `frontend/README.md` and `backend/README.md` are still the generated starter files; use this root README as the current project documentation.
