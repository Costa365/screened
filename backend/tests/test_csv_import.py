from app.routers import import_csv
from app.schemas.tmdb import TMDBMovieResult, TMDBSearchResponse
from app.services.csv_import import parse_csv


def test_parse_csv_basic():
    content = """title,year
The Matrix,1999
Inception,2010"""
    result = parse_csv(content)
    assert len(result) == 2
    assert result[0].title == "The Matrix"
    assert result[0].year == 1999
    assert result[0].watched_on is None
    assert result[1].title == "Inception"
    assert result[1].year == 2010


def test_parse_csv_different_column_names():
    content = """Title,Year
Parasite,2019"""
    result = parse_csv(content)
    assert len(result) == 1
    assert result[0].title == "Parasite"
    assert result[0].year == 2019


def test_parse_csv_invalid_year():
    content = """title,year
Valid Movie,2020
Invalid Movie,not_a_year"""
    result = parse_csv(content)
    assert len(result) == 1
    assert result[0].title == "Valid Movie"


def test_parse_csv_empty():
    content = """title,year"""
    result = parse_csv(content)
    assert len(result) == 0


def test_import_csv_optional_watched_on(client, auth_headers, monkeypatch):
    async def search(title, year):
        ids = {"The Matrix": 603, "Inception": 27205}
        result = TMDBMovieResult(id=ids[title], title=title, release_date=f"{year}-01-01")
        return TMDBSearchResponse(results=[result], total_results=1)

    monkeypatch.setattr(import_csv, "search_movies", search)
    content = "title,year,watched_on\nThe Matrix,1999,2024-02-29\nInception,2010,"
    imported = client.post("/api/import/csv", headers=auth_headers, files={"file": ("movies.csv", content)})
    assert imported.json()["imported"] == 2
    movies = client.get("/api/movies", headers=auth_headers).json()
    assert {m["title"]: m["watched_on"] for m in movies} == {"The Matrix": "2024-02-29", "Inception": None}


def test_parse_csv_whitespace():
    content = """title,year
  The Matrix  ,  1999  """
    result = parse_csv(content)
    assert len(result) == 1
    assert result[0].title == "The Matrix"
    assert result[0].year == 1999
