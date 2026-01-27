
from fastapi import APIRouter, Depends, HTTPException, Query

from app.routers.auth import get_current_user
from app.schemas.auth import User
from app.schemas.tmdb import TMDBMovieDetails, TMDBSearchResponse
from app.services.tmdb import get_movie_details, search_movies

router = APIRouter(prefix="/api/tmdb", tags=["tmdb"])


@router.get("/search", response_model=TMDBSearchResponse)
async def search_tmdb(
    query: str = Query(..., min_length=1),
    year: int | None = None,
    current_user: User = Depends(get_current_user)
):
    try:
        return await search_movies(query, year)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TMDB API error: {str(e)}") from e


@router.get("/movie/{tmdb_id}", response_model=TMDBMovieDetails)
async def get_tmdb_movie(
    tmdb_id: int,
    current_user: User = Depends(get_current_user)
):
    try:
        return await get_movie_details(tmdb_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TMDB API error: {str(e)}") from e
