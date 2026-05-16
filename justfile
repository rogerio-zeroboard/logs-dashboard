@_default:
    just --list

# Start in production mode, or dev mode with --dev
start dev="":
    #!/usr/bin/env sh
    if [ "{{ dev }}" = "--dev" ]; then
        docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
    else
        docker compose up -d
    fi

# Build for production
build:
    docker compose up -d --build

# Ensure containers are running (used by recipes that depend on Docker)
_ensure-up:
    #!/usr/bin/env sh
    if ! docker compose ps --format json 2>/dev/null | grep -q '"Health"'; then
        echo "Containers not running, starting them..."
        docker compose up -d
    fi

# Seed the database
seed: _ensure-up
    docker compose exec backend python -m app.seed

# Reset database (delete all logs)
reset: _ensure-up
    docker compose exec backend python -c "from app.database import SessionLocal; from app.models import Log; s = SessionLocal(); s.query(Log).delete(); s.commit(); s.close()"
    @echo "Database reset complete"

# Run backend tests (SQLite — no DB container required)
test-backend:
    @echo "=== Backend Tests ==="
    cd backend && python3 -m pytest -v

# Run frontend tests
test-frontend:
    @echo "=== Frontend Tests ==="
    cd frontend && npm test

# Run all tests
test: test-backend test-frontend

# Lint all code (check only, no fixes)
lint:
    @echo "=== Backend Lint ==="
    cd backend && ruff check app tests
    @echo ""
    @echo "=== Frontend Lint ==="
    cd frontend && npm run lint

# Format all code
format:
    @echo "=== Backend Format ==="
    cd backend && ruff format app tests
    @echo ""
    @echo "=== Frontend Format ==="
    cd frontend && npm run format

# Stop all containers
stop:
    docker compose down
