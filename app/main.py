from fastapi import FastAPI

from core.config import get_app_settings
from healthcheck import router


def get_app() -> FastAPI:
    settings = get_app_settings()
    application = FastAPI(**settings.model_dump())
    application.include_router(router)
    return application

app = get_app()
