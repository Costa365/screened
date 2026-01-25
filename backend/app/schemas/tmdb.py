from pydantic import BaseModel
from typing import Optional, List


class TMDBMovieResult(BaseModel):
    id: int
    title: str
    release_date: Optional[str] = None
    poster_path: Optional[str] = None
    overview: Optional[str] = None


class TMDBSearchResponse(BaseModel):
    results: List[TMDBMovieResult]
    total_results: int


class TMDBMovieDetails(BaseModel):
    id: int
    title: str
    release_date: Optional[str] = None
    poster_path: Optional[str] = None
    overview: Optional[str] = None
    runtime: Optional[int] = None
    vote_average: Optional[float] = None
