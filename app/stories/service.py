from datetime import datetime
from sqlalchemy import select, update
from sqlalchemy.orm import load_only
from fastapi_pagination.ext.sqlalchemy import paginate

from stories.models import Stories, Scenes
from stories.schemas import StoryCreateModel, SceneCreateRequest, StoryInternal
from core.services import BaseService
from core.exceptions import NotFoundException
from auth.schemas import UserSystem


class StoryService(BaseService):
    async def create_story(self, payload: StoryCreateModel, user: UserSystem):
        data = Stories(**payload.model_dump(), owner_id=user.id)
        self.db.add(data)
        await self.db.commit()
        return data

    async def list_stories(self):
        stories = await paginate(self.db, select(Stories).where(Stories.is_active==True).options(load_only(Stories.description, Stories.title, Stories.slug)))
        return stories

    async def get_story_by_slug(self, slug: str):
        stmt = select(Stories).where(Stories.slug==slug,Stories.is_active==True).options(load_only(Stories.description, Stories.title, Stories.slug))
        result = await self.db.execute(stmt)
        instance = result.scalar_one_or_none()
        return instance or {}

    async def update_story_by_slug(self, slug: str, update_data: StoryCreateModel, user: UserSystem):
        stmt = select(Stories).where(Stories.slug==slug, Stories.owner_id==user.id).options(load_only(Stories.slug))
        story = await self.db.execute(stmt)
        instance = story.scalar_one_or_none()
        if not instance:
            raise NotFoundException(detail=f"Slug {slug} not found")
        update_stmt = update(Stories).where(Stories.slug==slug).values(**update_data.model_dump(exclude_none=True)).returning(Stories).options(load_only(Stories.slug, Stories.title, Stories.description))
        update_story = await self.db.execute(update_stmt)
        update_instance = update_story.scalar_one_or_none()
        return update_instance or {}

    async def delete_story_by_slug(self, slug: str, user: UserSystem) -> None:
        stmt = select(Stories).where(Stories.slug==slug,Stories.owner_id==user.id).options(load_only(Stories.slug, Stories.is_active))
        story = await self.db.execute(stmt)
        instance = story.scalar_one_or_none()
        if not instance or not instance.is_active:
            raise NotFoundException(detail=f"Slug {slug} not found")
        delete_stmt = update(Stories).where(Stories.slug==slug).values(is_active=False,deleted_at=datetime.now())
        await self.db.execute(delete_stmt)
        await self.db.commit()

    async def create_scene(self, story: StoryInternal, payload: SceneCreateRequest, user: UserSystem):
        if story.owner_id != user.id:
            raise NotFoundException(detail=f"Slug {story.slug} not found")
        data = Scenes(**payload.model_dump(), story_id=story.id)
        self.db.add(data)
        await self.db.commit()
        return data
