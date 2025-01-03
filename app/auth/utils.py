from datetime import UTC, datetime, timedelta
from typing import Any, Union
import secrets
import string

from core.config import get_app_settings
from jose import jwt
from passlib.context import CryptContext


settings = get_app_settings()

ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes
REFRESH_TOKEN_EXPIRE_MINUTES = settings.refresh_token_expire_minutes
ALGORITHM = "HS256"
JWT_SECRET_KEY = settings.jwt_secret_key
JWT_REFRESH_SECRET_KEY = settings.jwt_refresh_secret_key

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_hashed_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, hashed_pass: str) -> bool:
    return password_context.verify(password, hashed_pass)


def create_access_token(
    subject: Union[str, Any],
    expires_delta: int = None
) -> str:
    if expires_delta:
        expires_delta = datetime.now(UTC) + expires_delta
    else:
        expires_delta = datetime.now(UTC) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES) # noqa

    to_encode = {"exp": expires_delta, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, ALGORITHM)
    return encoded_jwt


def create_refresh_token(
    subject: Union[str, Any],
    expires_delta: int = None
) -> str:
    if expires_delta:
        expires_delta = datetime.now(UTC) + expires_delta
    else:
        expires_delta = datetime.now(UTC) + timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES) # noqa

    to_encode = {"exp": expires_delta, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, JWT_REFRESH_SECRET_KEY, ALGORITHM)
    return encoded_jwt


def generate_verification_code():
    return ''.join(secrets.choice(string.digits) for _ in range(6))
