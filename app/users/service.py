from sqlalchemy import select
from sqlalchemy.orm import load_only

from auth.models import Users
from auth.exceptions import UserNotFoundException
from core.services import BaseService


class UserService(BaseService):
    async def get_user(self, username: str):
        stmt = select(Users).where(Users.username == username).options(
            load_only(
                Users.email,
                Users.username,
                Users.first_name,
                Users.last_name,
                Users.user_type,
                Users.avatar,
                Users.created_at
            )
        )
        results = await self.db.execute(stmt)
        instance = results.scalar_one_or_none()
        if not instance:
            raise UserNotFoundException
        return instance
