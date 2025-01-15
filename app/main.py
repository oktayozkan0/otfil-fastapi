import pathlib
import sys

sys.path.append(str(pathlib.Path(__file__).resolve().parent))

import uvicorn # noqa
from admin.router import router as admin_router # noqa
from auth.router import router as auth_router # noqa
from healthcheck import router as health_check_router # noqa
from stories.router import router as story_router # noqa
from stories.router import image_router as image_router # noqa
from categories.router import router as category_router # noqa
from core.config import get_app_settings # noqa
from core.exceptions import http_error_handler # noqa
from fastapi import FastAPI, HTTPException, staticfiles # noqa
from fastapi_pagination import add_pagination # noqa
from fastapi.middleware.cors import CORSMiddleware # noqa


def get_app() -> FastAPI:
    settings = get_app_settings()
    application = FastAPI(**settings.model_dump())

    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.add_exception_handler(HTTPException, http_error_handler)

    v1_prefix = "/v1"
    application.mount(
        "/staticfiles",
        staticfiles.StaticFiles(directory="app/staticfiles"),
        name="static"
    )
    application.include_router(health_check_router, prefix=v1_prefix)
    application.include_router(story_router, prefix=v1_prefix)
    application.include_router(image_router)
    application.include_router(auth_router, prefix=v1_prefix)
    application.include_router(category_router, prefix=v1_prefix)
    application.include_router(admin_router, prefix=v1_prefix)
    add_pagination(application)
    return application


app = get_app()

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port="8000")
