from sqlalchemy import select
from sqlalchemy.orm import load_only
from slugify import slugify

from auth.schemas import UserSystem
from auth.constants import UserTypes
from auth.exceptions import NotAllowedException
from categories.models import Categories
from categories.schemas import CreateCategoryRequest
from core.services import BaseService


class CategoryService(BaseService):
    async def create_category(self, payload: CreateCategoryRequest, user: UserSystem):
        if user.user_type != UserTypes.ADMIN:
            raise NotAllowedException
        slug = slugify(payload.title)
        data = Categories(**payload.model_dump(), slug=slug)
        self.db.add(data)
        await self.db.commit()
        return data
    
    async def get_categories(self):
        stmt = select(Categories).options(load_only(Categories.slug,Categories.title))
        result = await self.db.execute(stmt)
        instance = result.scalars().all()
        return instance
