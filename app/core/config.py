from pydantic import PostgresDsn, BaseModel
from dotenv import dotenv_values


DEFAULTS = {
    "openapi_url": "/openapi.json",
    "docs_url": "/docs",
    "redoc_url": "/redoc"
}

class AppSettings(BaseModel):
    debug: bool = True
    database_url: PostgresDsn
    openapi_url: str = None
    docs_url: str = None
    redoc_url: str = None
    jwt_secret_key: str = "SUPER_SECRET_KEY"
    jwt_refresh_secret_key: str = "SUPER_SECRET_REFRESH_KEY"

def get_app_settings() -> AppSettings:
    config = {k.lower():v for k,v in dotenv_values().items()}
    settings = AppSettings(**config)
    if settings.debug:
        settings.openapi_url = DEFAULTS.get("openapi_url")
        settings.docs_url = DEFAULTS.get("docs_url")
        settings.redoc_url = DEFAULTS.get("redoc_url")
    return settings
