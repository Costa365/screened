import bcrypt
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.config import Settings, get_settings
from app.database import Base, get_db
from app.main import app
from app.models.user import User

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


def override_get_settings():
    return Settings(
        tmdb_api_key="test_api_key",
        secret_key="test_secret_key",
    )


@pytest.fixture
def client():
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_settings] = override_get_settings

    # Seed test user
    db = TestingSessionLocal()
    test_user = User(
        email="test@example.com",
        password_hash=bcrypt.hashpw(b"testpass", bcrypt.gensalt()).decode(),
    )
    db.add(test_user)
    db.commit()
    db.close()

    with TestClient(app) as test_client:
        yield test_client

    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()


@pytest.fixture
def auth_headers(client):
    response = client.post(
        "/api/auth/login",
        data={"username": "test@example.com", "password": "testpass"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
