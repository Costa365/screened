from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from pydantic import BaseModel

from app.database import get_db
from app.models.movie import Movie as MovieModel
from app.services.csv_import import parse_csv, CSVMovieRow
from app.services.tmdb import search_movies
from app.routers.auth import get_current_user
from app.schemas.auth import User

router = APIRouter(prefix="/api/import", tags=["import"])


class ImportResult(BaseModel):
    imported: int
    skipped: int
    errors: List[str]


@router.post("/csv", response_model=ImportResult)
async def import_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="File must be a CSV")

    content = await file.read()
    try:
        text_content = content.decode("utf-8")
    except UnicodeDecodeError:
        text_content = content.decode("latin-1")

    rows = parse_csv(text_content)

    imported = 0
    skipped = 0
    errors = []

    for row in rows:
        try:
            # Search TMDB for the movie
            search_result = await search_movies(row.title, row.year)

            if not search_result.results:
                # Try without year
                search_result = await search_movies(row.title)

            if not search_result.results:
                errors.append(f"No TMDB match found for: {row.title} ({row.year})")
                skipped += 1
                continue

            # Use the first result
            tmdb_movie = search_result.results[0]

            # Check if movie already exists
            existing = db.query(MovieModel).filter(
                MovieModel.tmdb_id == tmdb_movie.id
            ).first()

            if existing:
                skipped += 1
                continue

            # Get next position
            max_position = db.query(func.max(MovieModel.position)).scalar()
            next_position = (max_position or 0) + 1

            # Create movie
            db_movie = MovieModel(
                title=tmdb_movie.title,
                year=int(tmdb_movie.release_date[:4]) if tmdb_movie.release_date else row.year,
                tmdb_id=tmdb_movie.id,
                poster_path=tmdb_movie.poster_path,
                position=next_position
            )
            db.add(db_movie)
            db.commit()
            imported += 1

        except Exception as e:
            errors.append(f"Error importing {row.title}: {str(e)}")
            skipped += 1

    return ImportResult(imported=imported, skipped=skipped, errors=errors)
