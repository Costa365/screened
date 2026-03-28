def test_login_success(client):
    response = client.post(
        "/api/auth/login",
        data={"username": "test@example.com", "password": "testpass"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_credentials(client):
    response = client.post(
        "/api/auth/login",
        data={"username": "wrong@example.com", "password": "wrong"},
    )
    assert response.status_code == 401


def test_get_me(client, auth_headers):
    response = client.get("/api/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data


def test_get_me_unauthorized(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401


def test_register_success(client):
    response = client.post(
        "/api/auth/register",
        json={"email": "new@example.com", "password": "newpass123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

    # Verify can login with new account
    login_response = client.post(
        "/api/auth/login",
        data={"username": "new@example.com", "password": "newpass123"},
    )
    assert login_response.status_code == 200


def test_register_duplicate_email(client):
    response = client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "anotherpass"},
    )
    assert response.status_code == 409
