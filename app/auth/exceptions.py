from typing import Any, Dict
from fastapi import HTTPException, status


class AlreadyExistsException(HTTPException):
    def __init__(self, status_code: int = None, detail: Any = None, headers: Dict[str, str] | None = None) -> None:
        status_code = status.HTTP_409_CONFLICT
        super().__init__(status_code, detail, headers)

class InvalidCredentialsException(HTTPException):
    def __init__(self, status_code: int = None, detail: Any = None, headers: Dict[str, str] | None = None) -> None:
        status_code = status.HTTP_400_BAD_REQUEST
        detail = "Invalid credentials"
        super().__init__(status_code, detail, headers)
