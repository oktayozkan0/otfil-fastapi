from typing import Any, Dict
from fastapi import HTTPException, status


class UniqueConstraintException(HTTPException):
    def __init__(self, status_code: int = None, detail: Any = None, headers: Dict[str, str] | None = None) -> None:
        status_code = status.HTTP_400_BAD_REQUEST
        detail = "a choice cannot have 2 identical next scenes"
        super().__init__(status_code, detail, headers)
