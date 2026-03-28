# CLAUDE.md

This file provides context for Claude Code when working on this project.

## Project Overview

Screened is a personal movie logging web application. Users can track movies they've watched, with automatic metadata and poster fetching from TMDB (The Movie Database).

## Architecture

### Backend (Python/FastAPI)
- **Location**: `backend/`
- **Entry point**: `backend/app/main.py`
- **Framework**: FastAPI with SQLAlchemy ORM
- **Database**: SQLite stored in `data/screened.db`
- **Auth**: JWT tokens with bcrypt-hashed passwords, DB-backed user accounts

Key files:
- `app/config.py` - Settings loaded from environment
- `app/database.py` - SQLAlchemy engine and session setup
- `app/models/user.py` - User SQLAlchemy model (email, password_hash)
- `app/models/movie.py` - Movie SQLAlchemy model (scoped to user via user_id FK)
- `app/routers/` - API endpoint handlers
- `app/services/tmdb.py` - TMDB API client
- `app/services/csv_import.py` - CSV parsing logic

### Frontend (React/TypeScript)
- **Location**: `frontend/`
- **Entry point**: `frontend/src/main.tsx`
- **Framework**: React 18 with Vite bundler
- **Styling**: TailwindCSS with dark theme

Key files:
- `src/App.tsx` - Main app with routing
- `src/api/client.ts` - API client with types
- `src/context/AuthContext.tsx` - Authentication state
- `src/hooks/useMovies.ts` - Movie data hook
- `src/components/movies/` - Movie-related components
- `src/pages/` - Page components

## Common Tasks

### Adding a new API endpoint
1. Create/update schema in `backend/app/schemas/`
2. Add route handler in appropriate `backend/app/routers/` file
3. Update `backend/app/main.py` if new router
4. Add corresponding function in `frontend/src/api/client.ts`

### Adding a new frontend page
1. Create page component in `frontend/src/pages/`
2. Add route in `frontend/src/App.tsx`
3. Add navigation link in `frontend/src/components/layout/Header.tsx`

### Running tests
```bash
# In Docker (recommended)
docker run --rm -v $(pwd)/backend:/app -w /app screened-screened pytest -v

# Or locally with venv
cd backend && pytest -v
```

### Database changes
- Modify model in `backend/app/models/movie.py`
- Database is auto-created on startup via `init_db()` in main.py
- For schema changes, delete `data/screened.db` to recreate (loses data)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TMDB_API_KEY` | TMDB API key | (required for search) |
| `SECRET_KEY` | JWT signing key | dev default |
| `DATABASE_URL` | SQLite path | `sqlite:///./data/screened.db` |

## Code Style

- Backend: Python with type hints, Pydantic for validation
- Frontend: TypeScript strict mode, functional React components
- Use existing patterns when adding new features
- Keep components focused and small

## Testing

Backend tests use pytest with FastAPI TestClient:
- `tests/conftest.py` - Fixtures for test client and auth
- `tests/test_auth.py` - Authentication tests
- `tests/test_movies.py` - Movie CRUD tests
- `tests/test_csv_import.py` - CSV parsing tests

Tests use an in-memory SQLite database and override settings.

## Docker

- `Dockerfile` - Multi-stage build (frontend build → Python runtime)
- `docker-compose.yml` - Production configuration
- Port 8080 exposed, maps to internal 8000
- `data/` volume persists SQLite database

## CI/CD

GitHub Actions workflow in `.github/workflows/tests.yml`:
- Runs backend pytest
- Builds frontend
- Builds Docker image
