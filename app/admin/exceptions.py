from typing import Any, Dict

from fastapi import HTTPException, status


class MustBeAdminException(HTTPException):
    def __init__(
        self,
        status_code: int = None,
        detail: Any = None,
        headers: Dict[str, str] | None = None
    ) -> None:
        status_code = status.HTTP_401_UNAUTHORIZED
        detail = "you must be admin for this action"
        super().__init__(status_code, detail, headers)
