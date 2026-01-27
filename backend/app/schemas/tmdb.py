
from pydantic import BaseModel


class TMDBMovieResult(BaseModel):
    id: int
    title: str
    release_date: str | None = None
    poster_path: str | None = None
    overview: str | None = None


class TMDBSearchResponse(BaseModel):
    results: list[TMDBMovieResult]
    total_results: int


class TMDBMovieDetails(BaseModel):
    id: int
    title: str
    release_date: str | None = None
    poster_path: str | None = None
    overview: str | None = None
    runtime: int | None = None
    vote_average: float | None = None
