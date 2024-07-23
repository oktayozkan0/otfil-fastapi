import sys
import pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parent))

import uvicorn
from fastapi import FastAPI, HTTPException
from core.config import get_app_settings
from core.exceptions import http_error_handler
from healthcheck import router
from stories.router import router as story_router


def get_app() -> FastAPI:
    settings = get_app_settings()
    application = FastAPI(**settings.model_dump())
    application.add_exception_handler(HTTPException, http_error_handler)
    application.include_router(router)
    application.include_router(story_router)
    return application

app = get_app()

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port="8000")
