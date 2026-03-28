from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    tmdb_api_key: str = ""
    secret_key: str = "dev-secret-key-change-in-production"
    database_url: str = "sqlite:///./data/screened.db"

    # JWT settings
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 1 week

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
