from typing import Any, Dict
from typing_extensions import Annotated, Doc

from fastapi import HTTPException, status


class AlreadyExistsException(HTTPException):
    def __init__(
        self,
        status_code: int = None,
        detail: Any = None,
        headers: Dict[str, str] | None = None
    ) -> None:
        status_code = status.HTTP_409_CONFLICT
        super().__init__(status_code, detail, headers)

class InvalidCredentialsException(HTTPException):
    def __init__(
        self,
        status_code: int = None,
        detail: Any = None,
        headers: Dict[str, str] | None = None
    ) -> None:
        status_code = status.HTTP_400_BAD_REQUEST
        detail = "Invalid credentials"
        headers={"WWW-Authenticate": "Bearer"}
        super().__init__(status_code, detail, headers)

class UnauthorizedException(HTTPException):
    def __init__(
        self,
        status_code: int = None,
        detail: Any = None,
        headers: Dict[str, str] | None = None
    ) -> None:
        status_code = status.HTTP_401_UNAUTHORIZED
        detail = "Token expired"
        headers = {"WWW-Authenticate": "Bearer"}
        super().__init__(status_code, detail, headers)

class UserNotFoundException(HTTPException):
    def __init__(
        self,
        status_code: int = None,
        detail: Any = None,
        headers: Dict[str, str] | None = None
    ) -> None:
        status_code = status.HTTP_404_NOT_FOUND
        detail = "User not found"
        super().__init__(status_code, detail, headers)

class PasswordsDoesNotMatchException(HTTPException):
    def __init__(self, status_code: int = None, detail: Any = None, headers: Dict[str, str] | None = None) -> None:
        status_code = status.HTTP_400_BAD_REQUEST
        detail = "passwords does not match"
        super().__init__(status_code, detail, headers)

class WrongPasswordException(HTTPException):
    def __init__(self, status_code: int = None, detail: Any = None, headers: Dict[str, str] | None = None) -> None:
        status_code = status.HTTP_400_BAD_REQUEST
        detail = "wrong password entered"
        super().__init__(status_code, detail, headers)

class NotAllowedException(HTTPException):
    def __init__(self, status_code: int = None, detail: Any = None, headers: Dict[str, str] | None = None) -> None:
        status_code = status.HTTP_401_UNAUTHORIZED
        detail = "you are not allowed for this action"
        super().__init__(status_code, detail, headers)
