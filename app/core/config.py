from dotenv import dotenv_values
from functools import lru_cache
from pydantic import BaseModel, PostgresDsn, RedisDsn, AnyUrl


DEFAULTS = {
    "openapi_url": "/openapi.json",
    "docs_url": "/docs",
    "redoc_url": "/redoc",
    "title": "OTFIL API",
    "summary": "OTFIL API"
}


class AppSettings(BaseModel):
    debug: bool = True
    database_url: PostgresDsn | AnyUrl
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
    aws_s3_bucket_name: str | None = None
    aws_region: str | None = None
    aws_access_key: str | None = None
    aws_secret_key: str | None = None
    mail_username: str | None = None
    mail_password: str | None = None
    mail_from: str | None = None
    mail_port: str | None = None
    mail_server: str | None = None
    mail_from_name: str | None = None
    mail_starttls: bool = True
    mail_ssl_tls: bool = False
    use_credentials: bool = True
    validate_certs: bool = True


@lru_cache
def get_app_settings() -> AppSettings:
    config = {k.lower(): v for k, v in dotenv_values().items()}
    settings = AppSettings(**config)
    if settings.debug:
        settings.__dict__.update(DEFAULTS)
    return settings
