from dotenv import dotenv_values
from pydantic import BaseModel, PostgresDsn, RedisDsn


DEFAULTS = {
    "openapi_url": "/openapi.json",
    "docs_url": "/docs",
    "redoc_url": "/redoc",
    "title": "OTFIL API",
    "summary": "OTFIL API Swagger UI"
}

class AppSettings(BaseModel):
    debug: bool = True
    database_url: PostgresDsn
    openapi_url: str = None
    docs_url: str = None
    redoc_url: str = None
    title: str = None
    summary: str = None
    jwt_secret_key: str = "SUPER_SECRET_KEY"
    jwt_refresh_secret_key: str = "SUPER_SECRET_REFRESH_KEY"
    access_token_expire_minutes: int = 30
    refresh_token_expire_minutes: int = 60 * 24 * 7
    redis_url: RedisDsn

def get_app_settings() -> AppSettings:
    config = {k.lower():v for k,v in dotenv_values().items()}
    settings = AppSettings(**config)
    if settings.debug:
        settings.__dict__.update(DEFAULTS)
    return settings
