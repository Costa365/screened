import httpx
from typing import Optional, List
from app.config import get_settings
from app.schemas.tmdb import TMDBMovieResult, TMDBSearchResponse, TMDBMovieDetails

settings = get_settings()

TMDB_BASE_URL = "https://api.themoviedb.org/3"


async def search_movies(query: str, year: Optional[int] = None) -> TMDBSearchResponse:
    async with httpx.AsyncClient() as client:
        params = {
            "api_key": settings.tmdb_api_key,
            "query": query,
            "include_adult": "false"
        }
        if year:
            params["year"] = str(year)

        response = await client.get(f"{TMDB_BASE_URL}/search/movie", params=params)
        response.raise_for_status()
        data = response.json()

        results = [
            TMDBMovieResult(
                id=movie["id"],
                title=movie["title"],
                release_date=movie.get("release_date"),
                poster_path=movie.get("poster_path"),
                overview=movie.get("overview")
            )
            for movie in data.get("results", [])
        ]

        return TMDBSearchResponse(
            results=results,
            total_results=data.get("total_results", 0)
        )


async def get_movie_details(tmdb_id: int) -> TMDBMovieDetails:
    async with httpx.AsyncClient() as client:
        params = {"api_key": settings.tmdb_api_key}
        response = await client.get(f"{TMDB_BASE_URL}/movie/{tmdb_id}", params=params)
        response.raise_for_status()
        data = response.json()

        return TMDBMovieDetails(
            id=data["id"],
            title=data["title"],
            release_date=data.get("release_date"),
            poster_path=data.get("poster_path"),
            overview=data.get("overview"),
            runtime=data.get("runtime"),
            vote_average=data.get("vote_average")
        )
