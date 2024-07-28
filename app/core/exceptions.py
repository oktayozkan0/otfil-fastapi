from typing import Any, Dict
from fastapi import HTTPException
from fastapi import status
from starlette.requests import Request
from starlette.responses import JSONResponse


async def http_error_handler(_: Request, exc: HTTPException) -> JSONResponse:
    return JSONResponse({"errors": [exc.detail]}, status_code=exc.status_code)

class NotFoundException(HTTPException):
    def __init__(self, status_code: int = None, detail: Any = None, headers: Dict[str, str] | None = None) -> None:
        status_code = status.HTTP_404_NOT_FOUND
        super().__init__(status_code, detail, headers)
