from datetime import UTC, datetime
from auth.exceptions import (AlreadyExistsException, InvalidCredentialsException,
                             UnauthorizedException, WrongPasswordException)
from auth.models import Users
from auth.schemas import (RefreshTokenRequest, TokenPayload, TokenResponse,
                          UserSignupRequest, ChangePasswordRequest, UserSystem)
from auth.utils import (ALGORITHM, JWT_REFRESH_SECRET_KEY, create_access_token,
                        create_refresh_token, get_hashed_password,
                        verify_password)
from core.redis import get_user_refresh_token, set_user_refresh_token
from core.services import BaseService
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from sqlalchemy import select, update


class AuthService(BaseService):
    async def create_user(self, payload: UserSignupRequest):
        # Check if email or username is already in use
        stmt = select(Users).where((Users.email == payload.email) | (Users.username == payload.username))
        result = await self.db.execute(stmt)
        instances = result.scalars().all()
        in_uses = []

        if instances:
            for instance in instances:
                if payload.email == instance.email and "email" not in in_uses:
                    in_uses.append("email")
                if payload.username == instance.username and "username" not in in_uses:
                    in_uses.append("username")

        # Raise an exception if email or username is already taken
        if in_uses:
            detail = " and ".join(in_uses)
            verb = "are" if len(in_uses) == 2 else "is"
            raise AlreadyExistsException(detail=f"{detail} {verb} already in use")

        # Hash password and create the user
        payload.password = get_hashed_password(payload.password)
        new_user = Users(**payload.model_dump())
        self.db.add(new_user)
        await self.db.commit()
        await self.db.refresh(new_user)  # Refresh to get the new user's ID and other auto-filled fields

        return new_user  # Return the newly created user

    async def login_user(self, form_data: OAuth2PasswordRequestForm):
        # Fetch user by username or email
        stmt = select(Users).where((Users.username == form_data.username) | (Users.email == form_data.username))
        result = await self.db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user or not verify_password(form_data.password, user.password):
            raise InvalidCredentialsException

        # Generate tokens
        access_token = create_access_token(user.email)
        refresh_token = await get_user_refresh_token(email=user.email)

        if not refresh_token:
            refresh_token = create_refresh_token(user.email)
            await set_user_refresh_token(refresh_token, user.email)

        return TokenResponse(access_token=access_token, refresh_token=refresh_token)

    async def refresh_access_token(self, token: RefreshTokenRequest):
        # Decode and validate refresh token
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
        except jwt.JWTError:
            raise InvalidCredentialsException

        # Compare token in Redis
        db_refresh_token = await get_user_refresh_token(token_data.sub)
        if db_refresh_token.decode("utf-8") != token.refresh_token:
            raise InvalidCredentialsException

        # Generate a new access token
        new_access_token = create_access_token(token_data.sub)
        return TokenResponse(access_token=new_access_token, refresh_token=db_refresh_token)

    async def change_password(self, password: ChangePasswordRequest, user: UserSystem):
        # Verify current password
        if not verify_password(password.old_password, user.password):
            raise WrongPasswordException

        # Hash new password and update it in the database
        hashed_password = get_hashed_password(password.new_password)
        stmt = update(Users).where(Users.id == user.id).values(password=hashed_password)
        await self.db.execute(stmt)
        await self.db.commit()
