import csv
import io
from datetime import date

from pydantic import BaseModel


class CSVMovieRow(BaseModel):
    title: str
    year: int
    watched_on: date | None = None


def parse_csv(content: str) -> list[CSVMovieRow]:
    """Parse CSV content and return list of movie rows.

    Expected CSV format:
    title,year
    The Matrix,1999
    Inception,2010
    """
    movies = []
    reader = csv.DictReader(io.StringIO(content))

    for row in reader:
        # Handle different possible column names
        title = row.get("title") or row.get("Title") or row.get("TITLE")
        year_str = row.get("year") or row.get("Year") or row.get("YEAR")

        if title and year_str:
            try:
                year = int(year_str.strip())
            except ValueError:
                # Skip rows with invalid year
                continue
            date_text = (row.get("watched_on") or "").strip()
            try:
                watched_on = date.fromisoformat(date_text) if date_text else None
            except ValueError as exc:
                raise ValueError(
                    f"Invalid watched_on date on CSV line {reader.line_num}. Use YYYY-MM-DD."
                ) from exc
            movies.append(CSVMovieRow(title=title.strip(), year=year, watched_on=watched_on))

    return movies
