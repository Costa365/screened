import csv
import io

from pydantic import BaseModel


class CSVMovieRow(BaseModel):
    title: str
    year: int


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
                movies.append(CSVMovieRow(title=title.strip(), year=year))
            except ValueError:
                # Skip rows with invalid year
                continue

    return movies
