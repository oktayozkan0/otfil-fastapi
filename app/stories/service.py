from sqlalchemy import select, update
from sqlalchemy.orm import load_only

from stories.models import Stories
from stories.schemas import StoryCreateModel
from core.services import BaseService
from core.exceptions import NotFoundException


class StoryService(BaseService):
    async def create_story(self, payload: StoryCreateModel):
        data = Stories(**payload.model_dump())
        self.db.add(data)
        await self.db.commit()
        return data

    async def list_stories(self):
        stmt = select(Stories).options(load_only(Stories.description, Stories.title, Stories.slug))
        result = await self.db.execute(stmt)
        instance = result.scalars().all()
        return instance

    async def get_story_by_slug(self, slug: str):
        stmt = select(Stories).where(Stories.slug == slug).options(load_only(Stories.description, Stories.title, Stories.slug))
        result = await self.db.execute(stmt)
        instance = result.scalar_one_or_none()
        return instance or {}

    async def update_story_by_slug(self, slug: str, update_data: StoryCreateModel):
        stmt = select(Stories).where(Stories.slug == slug).options(load_only(Stories.slug))
        story = await self.db.execute(stmt)
        instance = story.scalar_one_or_none()
        if not instance:
            raise NotFoundException(detail=f"Slug {slug} not found")
        update_stmt = update(Stories).where(Stories.slug == slug).values(**update_data.model_dump(exclude_none=True)).returning(Stories).options(load_only(Stories.slug, Stories.title, Stories.description))
        update_story = await self.db.execute(update_stmt)
        update_instance = update_story.scalar_one_or_none()
        return update_instance or {}
