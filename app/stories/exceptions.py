from typing import Any, Dict
from fastapi import HTTPException, status


class CheckSlugsException(HTTPException):
    def __init__(
        self,
        status_code: int = None,
        detail: Any = None,
        headers: Dict[str, str] | None = None
    ) -> None:
        status_code = status.HTTP_400_BAD_REQUEST
        detail = "please check your scene slugs"
        super().__init__(status_code, detail, headers)


class BeginningSceneAlreadyExistException(HTTPException):
    def __init__(
        self,
        status_code: int = None,
        detail: Any = None,
        headers: Dict[str, str] | None = None
    ) -> None:
        status_code = status.HTTP_400_BAD_REQUEST
        detail = "Beginning scene already exists."
        super().__init__(status_code, detail, headers)


class CannotUploadImageException(HTTPException):
    def __init__(
            self,
            status_code: int,
            detail: Any = None,
            headers: Dict[str, str] | None = None
    ) -> None:
        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        detail = "Could not upload image"
        super().__init__(status_code, detail, headers)
