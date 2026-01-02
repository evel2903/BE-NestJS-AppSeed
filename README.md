# BE-NestJS-AppSeed

NestJS + MySQL seed project following Clean Architecture per-module.

## Prerequisites

- Node.js 18+
- MySQL 8+ (or Docker)
- (Optional) Redis (or Docker)

## Setup

1) Install dependencies

```bash
npm install
```

2) Create `.env`

```bash
cp .env.example .env
```

3) Start dependencies (MySQL + Redis) with Docker (recommended)

```bash
docker compose up -d mysql redis
```

4) Run migrations + seed

```bash
npm run db:prepare
```

## Run

Dev:

```bash
npm run dev
```

Dev (write stdout/stderr to `logs/`):

```bash
npm run dev:log
```

Build + start:

```bash
npm run build
npm start
```

## Tests / Lint / Format

```bash
npm test
npm run lint
npm run format
```

## Swagger

- Swagger UI: `http://localhost:3000/docs`

## Notes

- API versioning uses header `X-API-Version` (defaults to `1` if missing).
