from pathlib import Path

from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import get_settings

settings = get_settings()

# Ensure data directory exists
Path("./data").mkdir(exist_ok=True)

engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    from app.models.movie import Movie
    from app.models.user import User  # noqa: F401

    with engine.begin() as conn:
        # Serialize the schema check and upgrade across SQLite workers at startup.
        conn.exec_driver_sql("BEGIN IMMEDIATE")
        Base.metadata.create_all(bind=conn)
        columns = inspect(conn).get_columns(Movie.__tablename__)
        if not any(column["name"] == "watched_on" for column in columns):
            conn.exec_driver_sql("ALTER TABLE movies ADD COLUMN watched_on DATE")
