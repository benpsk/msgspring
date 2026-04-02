# MsgSpring 

Local development setup for the `frontend` and `backend` apps in this repository.

## Apps

- `frontend/`: Next.js 16 App Router app
- `backend/`: NestJS 11 API
- Database: PostgreSQL

## Prerequisites

- Node.js 20+
- npm 10+
- A local PostgreSQL instance

## Install Dependencies

Install each app separately:

```bash
cd frontend
npm install
```

```bash
cd backend
npm install
```

## Backend Setup

1. Copy the example environment file:

```bash
cd backend
cp .env.example .env
```

2. Create the PostgreSQL database used by `DATABASE_URL`.

Example:

```bash
createdb messagespring
```

3. Review `backend/.env` and update values if your local setup differs:

```env
PORT=3000
DATABASE_URL=postgres://db_user:db_pwd@localhost:5432/msgspring
DATABASE_SSL=false
DATABASE_MAX_CONNECTIONS=10
FRONTEND_ORIGIN=http://localhost:3001
THROTTLE_TTL_MS=60000
THROTTLE_LIMIT=10
```

4. Run migrations:

```bash
cd backend
npm run migrate
```

5. Start the API:

```bash
cd backend
npm run start:dev
```

6. Run the backend tests:

```bash
npm run test
npm run test:e2e
```

The backend listens on `http://localhost:3000` by default.

Useful backend endpoints:

- `GET /api/health`
- `POST /api/contact`

## Frontend Setup

1. Copy the example environment file:

```bash
cd frontend
cp .env.example .env.local
```

2. Confirm the API base URL points to the backend:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

3. Start the frontend on a different port from the backend:

```bash
cd frontend
npm run dev -- --port 3001
```

Open `http://localhost:3001`.

4. Run the frontend end-to-end tests.

```bash
npm run test:e2e
```

### Approach
- this is an ai-driven project.
- almost all of the code were written by ai.
- i use codex cli.
- the development of both backend + frontend take almost 2 hours.
- the github ci directly deploy to digital ocean instance.
- you can access the demo here - 
- https://msgspring.lexerlabs.com


