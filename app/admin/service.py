from sqlalchemy import select, and_, func, update
from fastapi_pagination.ext.sqlalchemy import paginate
from enum import StrEnum

from admin.schemas import UserSearchParams, UserEditRequest
from auth.models import Users
from auth.utils import get_hashed_password
from auth.exceptions import UserNotFoundException
from core.services import BaseService


class AdminService(BaseService):
    async def get_users(self, params: UserSearchParams | None = None):
        stmt = select(Users)
        conditions = []
        if params:
            params_dict = params.model_dump(exclude_none=True)
            for field, value in params_dict.items():
                column = getattr(Users, field)
                if not isinstance(value, StrEnum):
                    conditions.append(func.lower(column) == value.lower())
                else:
                    conditions.append(column == value)
        if conditions:
            stmt = stmt.where(and_(*conditions))
        results = await paginate(
            self.db,
            stmt
        )
        return results

    async def edit_user(self, username: str, data: UserEditRequest):
        stmt = select(Users).where(Users.username == username)
        result = await self.db.execute(stmt)
        instance = result.scalar_one_or_none()
        if not instance:
            raise UserNotFoundException
        if data.password:
            data.password = get_hashed_password(data.password)
        dump_data = data.model_dump(exclude_none=True)
        update_stmt = update(Users).where(
            Users.username == username
        ).values(**dump_data).returning(Users)
        result = await self.db.execute(update_stmt)
        await self.db.commit()
        instance = result.scalar_one_or_none()
        return instance
