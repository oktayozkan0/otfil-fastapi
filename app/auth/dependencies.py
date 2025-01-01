from datetime import UTC, datetime

from auth.exceptions import (
    InvalidCredentialsException,
    UnauthorizedException,
    UserNotFoundException
)
from auth.models import Users
from auth.schemas import TokenPayload
from auth.utils import ALGORITHM, JWT_SECRET_KEY
from core.db import get_db
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from sqlalchemy import select
from sqlalchemy.orm import load_only
from sqlalchemy.ext.asyncio import AsyncSession


reusable_oauth = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
    scheme_name="JWT"
)


async def get_current_user(
        token: str = Depends(reusable_oauth),
        db: AsyncSession = Depends(get_db)
):
    try:
        payload = jwt.decode(
            token=token,
            key=JWT_SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        token_data = TokenPayload(**payload)
        token_timestamp = datetime.fromtimestamp(token_data.exp, UTC)
        now = datetime.now(UTC)
        if token_timestamp < now:
            raise UnauthorizedException
    except Exception:
        raise InvalidCredentialsException

    stmt = select(Users).where(Users.email == token_data.sub).options(
        load_only(
            Users.email,
            Users.username,
            Users.first_name,
            Users.last_name,
            Users.is_active,
            Users.is_approved,
            Users.user_type
        )
    )

    result = await db.execute(stmt)
    instance = result.scalar_one_or_none()
    if not instance:
        raise UserNotFoundException
    return instance
