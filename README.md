# ZeroBoard Logs Dashboard

For the `ZeroBoard Lead Full Stack Engineer` take-home assignment.

## Tech Stack

- **Backend:** Python 3.11+ / FastAPI / SQLAlchemy / PostgreSQL (SQLite for tests)
- **Frontend:** Next.js 16 / TypeScript / Bulma CSS / Recharts / TanStack Query
- **Testing:** pytest (backend) / Vitest + Testing Library (frontend)
- **Infrastructure:** Docker / Docker Compose / just (task runner)

## Prerequisites

- Docker and Docker Compose
- [just](https://github.com/casey/just) task runner (install via `brew install just` on macOS)

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd zeroboard

# Copy environment file
cp .env.example .env

# Start in dev mode (hot-reload for frontend)
just start --dev

# Or start in production mode
just start

# Seed the database with 1.5M sample logs (takes ~5 min)
just seed
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Development

### Hot-Reload Mode

```bash
just start --dev
```

This uses `docker-compose.dev.yml` to mount the frontend source code and run `next dev` with hot-reload. Backend still runs via the production Dockerfile.

### Common Commands

| Command               | Description                                         |
| --------------------- | --------------------------------------------------- |
| `just start`          | Start all services in production mode               |
| `just start --dev`    | Start all services with frontend hot-reload         |
| `just build`          | Rebuild all containers for production               |
| `just seed`           | Seed the database with 1.5M sample logs (auto-starts containers if needed) |
| `just reset`          | Delete all logs from the database (auto-starts containers if needed)    |
| `just test`           | Run all backend and frontend tests                  |
| `just test-backend`   | Run backend tests (SQLite — no Docker needed)     |
| `just test-frontend`  | Run frontend tests                                  |
| `just stop`           | Stop all containers                                 |

### Running Tests

```bash
# Run all tests
just test

# Or run individually:
just test-backend   # uses SQLite — no Docker needed
just test-frontend
```

## API Endpoints

| Method   | Path                     | Description                          |
| -------- | ------------------------ | ------------------------------------ |
| `GET`    | `/api/v1/health`         | Health check                         |
| `GET`    | `/api/v1/logs`           | List logs (paginated, filterable)    |
| `POST`   | `/api/v1/logs`           | Create a new log                     |
| `GET`    | `/api/v1/logs/sources`   | Get distinct source names            |
| `GET`    | `/api/v1/logs/aggregate` | Get aggregated data                  |
| `GET`    | `/api/v1/logs/export`    | Export logs as CSV                   |
| `POST`   | `/api/v1/logs/ingest`    | Simulate log acquisition (~500 logs) |
| `GET`    | `/api/v1/logs/{id}`      | Get log by ID                        |
| `PUT`    | `/api/v1/logs/{id}`      | Update log                           |
| `DELETE` | `/api/v1/logs/{id}`      | Delete log                           |

## Seed Data

The seed script generates **1,500,000** log records spanning 365 days with:

- **6 severity levels:** DEBUG (10%), INFO (40%), WARNING (25%), ERROR (20%), CRITICAL (5%)
- **6 sources:** api-gateway, auth-service, user-service, payment-service, notification-service, scheduler
- **Batched inserts** of 10K records per batch (~5-6 minutes total)

## Design Decisions

- **FastAPI:** Async support, automatic OpenAPI docs, Pydantic validation
- **SQLAlchemy 2.0:** Modern ORM with excellent typing
- **TanStack Query:** Handles caching, loading states, and error handling for frontend data fetching
- **Bulma CSS:** Component-based CSS framework with clean defaults
- **Recharts:** Simple declarative charting library for the dashboard
- **TDD:** Tests written first, implementation second (Red → Green → Refactor)
- **Teal branding:** Primary color `#2d8a7e` matching ZeroBoard/Dataseed branding
- **Light theme only:** Forced via CSS overrides (dark theme out of scope)

## Security Considerations

- **No authentication:** This is a demo / take-home project. Authentication and authorization are intentionally out of scope.
- **Hardcoded credentials:** The `docker-compose.yml` intentionally uses default PostgreSQL credentials for local development convenience only.
- **Input validation:** All parameters validated via Pydantic schemas
- **XSS prevention:** React escapes content by default
- **Do not expose to untrusted networks:** This application is intended for local development and demonstration purposes only.

## License

MIT
