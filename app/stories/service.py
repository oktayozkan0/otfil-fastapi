from sqlalchemy import select
from sqlalchemy.orm import load_only

from stories.models import Stories
from stories.schemas import StoryCreateModel, StoryListModel
from core.services import BaseService

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
        return instance if instance else {}
