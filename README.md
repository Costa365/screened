# Screened

[![Tests](https://github.com/<owner>/<repo>/actions/workflows/tests.yml/badge.svg)](https://github.com/<owner>/<repo>/actions/workflows/tests.yml)

A personal movie logging web app with TMDB integration. Track the movies you've watched with automatic poster and metadata fetching.

## Features

- **Movie Logging**: Add movies by title and year, automatically matched with TMDB
- **TMDB Integration**: Posters, metadata, and links to TMDB pages
- **CSV Import**: Bulk import movies from a CSV file
- **Edit Support**: Correct TMDB matches by updating the TMDB ID
- **Dark Theme**: Modern dark UI built with TailwindCSS
- **Single User**: Simple JWT auth with credentials from environment variables

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Python, FastAPI, SQLAlchemy
- **Database**: SQLite
- **Deployment**: Docker

## Quick Start

### Prerequisites

- Docker and Docker Compose
- TMDB API key ([get one here](https://www.themoviedb.org/settings/api))

### Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd screened
   ```

2. Create your environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your settings:
   ```
   AUTH_USERNAME=admin
   AUTH_PASSWORD=your-secure-password
   TMDB_API_KEY=your-tmdb-api-key
   SECRET_KEY=your-random-secret-key
   ```

4. Start the application:
   ```bash
   docker compose up -d
   ```

5. Open http://localhost:8080 and login with your credentials.

### Stopping

```bash
docker compose down
```

## Development

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server proxies API requests to `localhost:8000`.

### Running Tests

```bash
cd backend
pytest -v
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/movies` | List all movies |
| POST | `/api/movies` | Add a movie |
| PATCH | `/api/movies/{id}` | Update a movie |
| DELETE | `/api/movies/{id}` | Delete a movie |
| GET | `/api/tmdb/search` | Search TMDB |
| GET | `/api/tmdb/movie/{id}` | Get TMDB movie details |
| POST | `/api/import/csv` | Import movies from CSV |

## CSV Import Format

```csv
title,year
The Matrix,1999
Inception,2010
Parasite,2019
```

## Project Structure

```
screened/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI entry point
│   │   ├── config.py         # Environment settings
│   │   ├── database.py       # SQLite setup
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── routers/          # API endpoints
│   │   └── services/         # Business logic
│   └── tests/                # Pytest tests
├── frontend/
│   ├── src/
│   │   ├── api/              # API client
│   │   ├── components/       # React components
│   │   ├── context/          # Auth context
│   │   ├── hooks/            # Custom hooks
│   │   └── pages/            # Page components
│   └── public/               # Static assets
├── data/                     # SQLite database (docker volume)
├── Dockerfile
├── docker-compose.yml
└── .github/workflows/        # CI pipeline
```

## License

MIT
