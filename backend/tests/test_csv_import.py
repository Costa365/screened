from app.services.csv_import import parse_csv


def test_parse_csv_basic():
    content = """title,year
The Matrix,1999
Inception,2010"""
    result = parse_csv(content)
    assert len(result) == 2
    assert result[0].title == "The Matrix"
    assert result[0].year == 1999
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


def test_parse_csv_whitespace():
    content = """title,year
  The Matrix  ,  1999  """
    result = parse_csv(content)
    assert len(result) == 1
    assert result[0].title == "The Matrix"
    assert result[0].year == 1999
