import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "NIRIKSHAN"
    PROJECT_TITLE: str = "NIRIKSHAN - MPLADS Forensic Intelligence & Early-Warning Platform"
    API_V1_STR: str = "/api"
    VERSION: str = "0.1.0"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "sqlite:///./nirikshan.db"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="allow"
    )


settings = Settings()
