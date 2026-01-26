from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.database import get_db
from app.models.movie import Movie as MovieModel
from app.schemas.movie import Movie, MovieCreate, MovieUpdate
from app.routers.auth import get_current_user
from app.schemas.auth import User

router = APIRouter(prefix="/api/movies", tags=["movies"])


@router.get("", response_model=List[Movie])
def list_movies(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    movies = db.query(MovieModel).order_by(MovieModel.added_at.desc()).all()
    return movies


@router.post("", response_model=Movie, status_code=status.HTTP_201_CREATED)
def create_movie(
    movie: MovieCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get the next position
    max_position = db.query(func.max(MovieModel.position)).scalar()
    next_position = (max_position or 0) + 1

    db_movie = MovieModel(
        title=movie.title,
        year=movie.year,
        tmdb_id=movie.tmdb_id,
        poster_path=movie.poster_path,
        position=next_position
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie


@router.patch("/{movie_id}", response_model=Movie)
def update_movie(
    movie_id: int,
    movie_update: MovieUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_movie = db.query(MovieModel).filter(MovieModel.id == movie_id).first()
    if not db_movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    update_data = movie_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_movie, field, value)

    db.commit()
    db.refresh(db_movie)
    return db_movie


@router.delete("/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_movie(
    movie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_movie = db.query(MovieModel).filter(MovieModel.id == movie_id).first()
    if not db_movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    db.delete(db_movie)
    db.commit()
    return None
