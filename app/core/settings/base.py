from pydantic_settings import BaseSettings
from pydantic import PostgresDsn


class BaseAppSettings(BaseSettings):
    database_url: PostgresDsn
    debug: bool
    # title: str
    # summary: str
    # description: str
    # version: str
    # openapi_url: str
    # docs_url: str
    # redoc_url: str

    class Config:
        env_file = "../.env"
