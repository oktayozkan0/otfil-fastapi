from fastapi import FastAPI
from core.settings.app_settings import get_app_settings
from api.routes import routes


def get_app() -> FastAPI:
    settings = get_app_settings()
    print(settings)
    application = FastAPI(**settings.model_dump())
    application.include_router(routes)
    return application

app = get_app()
