from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select

from core.services import BaseService
from auth.schemas import UserSignupRequest
from auth.models import Users
from auth.exceptions import AlreadyExistsException, InvalidCredentialsException
from auth.utils import get_hashed_password, verify_password, create_access_token, create_refresh_token


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
        return {
            "access_token": create_access_token(instance.email),
            "refresh_token": create_refresh_token(instance.email)
        }
