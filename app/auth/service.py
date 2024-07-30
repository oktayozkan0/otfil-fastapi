from datetime import datetime, UTC
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from jose import jwt

from core.services import BaseService
from core.redis import get_user_refresh_token, set_user_refresh_token
from auth.schemas import UserSignupRequest, TokenResponse, RefreshTokenRequest, TokenPayload
from auth.models import Users
from auth.exceptions import AlreadyExistsException, InvalidCredentialsException, UnauthorizedException
from auth.utils import get_hashed_password, verify_password, create_access_token, create_refresh_token, JWT_REFRESH_SECRET_KEY, ALGORITHM


class AuthService(BaseService):
    async def create_user(self, payload: UserSignupRequest):
        stmt = select(Users).where((Users.email==payload.email) | (Users.username==payload.username))
        result = await self.db.execute(stmt)
        instances = result.scalars().all()
        in_uses = []

        if instances:
            for i in instances:
                if payload.email == i.email and ("email" not in in_uses):
                    in_uses.append("email")
                if payload.username == i.username and ("username" not in in_uses):
                    in_uses.append("username")

        if in_uses:
            detail = " and ".join(in_uses)
            verb = "are" if len(in_uses) == 2 else "is"
            raise AlreadyExistsException(detail=f"{detail} {verb} already in use")

        payload.password = get_hashed_password(payload.password)
        data = Users(**payload.model_dump())
        self.db.add(data)
        await self.db.commit()

    async def login_user(self, form_data: OAuth2PasswordRequestForm):
        user = select(Users).where((Users.username==form_data.username) | (Users.email==form_data.username))
        results = await self.db.execute(user)
        instance = results.scalar_one_or_none()
        if not instance:
            raise InvalidCredentialsException
        hashed_pass = instance.password
        if not verify_password(form_data.password, hashed_pass):
            raise InvalidCredentialsException

        access_token = create_access_token(instance.email)
        refresh_token = await get_user_refresh_token(email=instance.email)

        if not refresh_token:
            refresh_token = create_refresh_token(instance.email)
            await set_user_refresh_token(refresh_token, instance.email)

        return TokenResponse(access_token=access_token, refresh_token=refresh_token)

    async def refresh_access_token(self, token: RefreshTokenRequest):
        try:
            payload = jwt.decode(
                token=token.refresh_token,
                key=JWT_REFRESH_SECRET_KEY,
                algorithms=[ALGORITHM]
            )
            token_data = TokenPayload(**payload)
            token_timestamp = datetime.fromtimestamp(token_data.exp, UTC)
            now = datetime.now(UTC)
            if token_timestamp < now:
                raise UnauthorizedException
        except:
            raise InvalidCredentialsException

        db_refresh_token: bytes = await get_user_refresh_token(token_data.sub)
        user_refresh_token = token.refresh_token
        if not db_refresh_token.decode("utf-8") == user_refresh_token:
            raise InvalidCredentialsException
        new_access_token = create_refresh_token(token_data.sub)
        return TokenResponse(
            access_token=new_access_token,
            refresh_token=db_refresh_token
        )
