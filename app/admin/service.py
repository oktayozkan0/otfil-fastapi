from sqlalchemy import select, and_, func
from fastapi_pagination.ext.sqlalchemy import paginate
from enum import StrEnum

from admin.schemas import UserSearchParams
from auth.models import Users
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
