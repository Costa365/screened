from datetime import date, datetime

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app import database
from app.models.movie import Movie


def test_add_watched_on_to_existing_database(monkeypatch, tmp_path):
    engine = create_engine(f"sqlite:///{tmp_path / 'existing.db'}")
    monkeypatch.setattr(database, "engine", engine)
    with engine.begin() as conn:
        conn.exec_driver_sql("""
            CREATE TABLE movies (
                id INTEGER PRIMARY KEY, title VARCHAR NOT NULL, year INTEGER NOT NULL,
                tmdb_id INTEGER NOT NULL, poster_path VARCHAR, position INTEGER NOT NULL,
                user_id INTEGER NOT NULL REFERENCES users(id), added_at DATETIME
            )
        """)
        conn.exec_driver_sql("""
            INSERT INTO movies VALUES (1, 'The Matrix', 1999, 603, NULL, 1, 1, '2020-05-20 10:00:00')
        """)

    database.init_db()
    with Session(engine) as db:
        movie = db.get(Movie, 1)
        assert movie.title == "The Matrix"
        assert movie.added_at == datetime(2020, 5, 20, 10)
        assert movie.watched_on is None
        movie.watched_on = date(2024, 2, 29)
        db.commit()

    database.init_db()
    with Session(engine) as db:
        assert db.get(Movie, 1).watched_on == date(2024, 2, 29)
    engine.dispose()
