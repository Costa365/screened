def test_list_movies_empty(client, auth_headers):
    response = client.get("/api/movies", headers=auth_headers)
    assert response.status_code == 200
    assert response.json() == []


def test_create_movie(client, auth_headers):
    movie_data = {
        "title": "The Matrix",
        "year": 1999,
        "tmdb_id": 603,
        "poster_path": "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"
    }
    response = client.post("/api/movies", json=movie_data, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "The Matrix"
    assert data["year"] == 1999
    assert data["tmdb_id"] == 603
    assert data["position"] == 1
    assert data["watched_on"] is None
    assert "id" in data
    assert "added_at" in data


def test_create_multiple_movies_position(client, auth_headers):
    movie1 = {"title": "Movie 1", "year": 2020, "tmdb_id": 1, "poster_path": None}
    movie2 = {"title": "Movie 2", "year": 2021, "tmdb_id": 2, "poster_path": None}

    response1 = client.post("/api/movies", json=movie1, headers=auth_headers)
    response2 = client.post("/api/movies", json=movie2, headers=auth_headers)

    assert response1.json()["position"] == 1
    assert response2.json()["position"] == 2


def test_list_movies(client, auth_headers):
    movie_data = {"title": "Test Movie", "year": 2020, "tmdb_id": 123, "poster_path": None}
    client.post("/api/movies", json=movie_data, headers=auth_headers)

    response = client.get("/api/movies", headers=auth_headers)
    assert response.status_code == 200
    movies = response.json()
    assert len(movies) == 1
    assert movies[0]["title"] == "Test Movie"


def test_update_movie(client, auth_headers):
    movie_data = {"title": "Original", "year": 2020, "tmdb_id": 100, "poster_path": None}
    create_response = client.post("/api/movies", json=movie_data, headers=auth_headers)
    movie_id = create_response.json()["id"]

    update_data = {"tmdb_id": 200, "title": "Updated"}
    response = client.patch(f"/api/movies/{movie_id}", json=update_data, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["tmdb_id"] == 200
    assert data["title"] == "Updated"


def test_update_movie_not_found(client, auth_headers):
    response = client.patch("/api/movies/99999", json={"title": "New"}, headers=auth_headers)
    assert response.status_code == 404


def test_watched_date_lifecycle(client, auth_headers):
    movie = {"title": "The Matrix", "year": 1999, "tmdb_id": 603, "watched_on": "2024-02-29"}
    created = client.post("/api/movies", json=movie, headers=auth_headers)
    assert created.status_code == 201
    assert created.json()["watched_on"] == "2024-02-29"
    path = f"/api/movies/{created.json()['id']}"

    renamed = client.patch(path, json={"title": "Updated title"}, headers=auth_headers)
    assert renamed.json()["watched_on"] == "2024-02-29"
    invalid = client.patch(path, json={"watched_on": "2023-02-29"}, headers=auth_headers)
    assert invalid.status_code == 422

    for date in ("2025-06-07", None, "2026-01-01"):
        updated = client.patch(path, json={"watched_on": date}, headers=auth_headers)
        assert updated.status_code == 200
        saved = client.get("/api/movies", headers=auth_headers).json()[0]
        assert saved["watched_on"] == date
        assert saved["title"] == "Updated title"


def test_delete_movie(client, auth_headers):
    movie_data = {"title": "To Delete", "year": 2020, "tmdb_id": 456, "poster_path": None}
    create_response = client.post("/api/movies", json=movie_data, headers=auth_headers)
    movie_id = create_response.json()["id"]

    response = client.delete(f"/api/movies/{movie_id}", headers=auth_headers)
    assert response.status_code == 204

    list_response = client.get("/api/movies", headers=auth_headers)
    assert len(list_response.json()) == 0


def test_delete_movie_not_found(client, auth_headers):
    response = client.delete("/api/movies/99999", headers=auth_headers)
    assert response.status_code == 404


def test_movies_unauthorized(client):
    response = client.get("/api/movies")
    assert response.status_code == 401
