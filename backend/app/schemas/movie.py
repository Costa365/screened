from datetime import datetime

from pydantic import BaseModel


class MovieBase(BaseModel):
    title: str
    year: int
    tmdb_id: int
    poster_path: str | None = None


class MovieCreate(MovieBase):
    pass


class MovieUpdate(BaseModel):
    tmdb_id: int | None = None
    title: str | None = None
    year: int | None = None
    poster_path: str | None = None


class Movie(MovieBase):
    id: int
    position: int
    added_at: datetime

    class Config:
        from_attributes = True
