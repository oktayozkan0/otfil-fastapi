import pathlib
import sys

sys.path.append(str(pathlib.Path(__file__).resolve().parent))

import uvicorn
from auth.router import router as auth_router
from core.config import get_app_settings
from core.exceptions import http_error_handler
from fastapi import FastAPI, HTTPException
from fastapi_pagination import add_pagination
from healthcheck import router as health_check_router
from stories.router import router as story_router


def get_app() -> FastAPI:
    settings = get_app_settings()
    application = FastAPI(**settings.model_dump())
    application.add_exception_handler(HTTPException, http_error_handler)
    v1_prefix = "/api/v1"
    application.include_router(health_check_router, prefix=v1_prefix)
    application.include_router(story_router, prefix=v1_prefix)
    application.include_router(auth_router, prefix=v1_prefix)

    add_pagination(application)
    return application

app = get_app()

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port="8000")
