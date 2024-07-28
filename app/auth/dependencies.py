from datetime import datetime, UTC
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from auth.utils import JWT_SECRET_KEY, ALGORITHM
from auth.schemas import TokenPayload, UserSystem
from auth.exceptions import UnauthorizedException, InvalidCredentialsException, UserNotFoundException
from auth.models import Users
from core.db import get_db


reusable_oauth = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
    scheme_name="JWT"
)

async def get_current_user(token: str = Depends(reusable_oauth), db: AsyncSession = Depends(get_db)):
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
    except:
        raise InvalidCredentialsException

    stmt = select(Users).where(Users.email==token_data.sub)
    result = await db.execute(stmt)
    instance = result.scalar_one_or_none()
    if not instance:
        raise UserNotFoundException
    return UserSystem(**instance.__dict__)
