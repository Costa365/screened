from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class MovieBase(BaseModel):
    title: str
    year: int
    tmdb_id: int
    poster_path: Optional[str] = None


class MovieCreate(MovieBase):
    pass


class MovieUpdate(BaseModel):
    tmdb_id: Optional[int] = None
    title: Optional[str] = None
    year: Optional[int] = None
    poster_path: Optional[str] = None


class Movie(MovieBase):
    id: int
    position: int
    added_at: datetime

    class Config:
        from_attributes = True
