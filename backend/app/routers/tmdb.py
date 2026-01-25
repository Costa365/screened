from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional

from app.services.tmdb import search_movies, get_movie_details
from app.schemas.tmdb import TMDBSearchResponse, TMDBMovieDetails
from app.routers.auth import get_current_user
from app.schemas.auth import User

router = APIRouter(prefix="/api/tmdb", tags=["tmdb"])


@router.get("/search", response_model=TMDBSearchResponse)
async def search_tmdb(
    query: str = Query(..., min_length=1),
    year: Optional[int] = None,
    current_user: User = Depends(get_current_user)
):
    try:
        return await search_movies(query, year)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TMDB API error: {str(e)}")


@router.get("/movie/{tmdb_id}", response_model=TMDBMovieDetails)
async def get_tmdb_movie(
    tmdb_id: int,
    current_user: User = Depends(get_current_user)
):
    try:
        return await get_movie_details(tmdb_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TMDB API error: {str(e)}")
