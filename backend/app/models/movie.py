from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.database import Base


class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    tmdb_id = Column(Integer, nullable=False)
    poster_path = Column(String, nullable=True)
    position = Column(Integer, nullable=False)
    added_at = Column(DateTime, default=datetime.utcnow)
