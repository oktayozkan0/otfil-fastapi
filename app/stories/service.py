from datetime import datetime

from auth.schemas import UserSystem
from core.exceptions import NotFoundException
from core.services import BaseService
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy import select, update
from sqlalchemy.orm import load_only
from sqlalchemy.exc import IntegrityError
from stories.models import Scenes, Stories, Choices
from stories.schemas import SceneCreateRequest, StoryCreateModel, StoryInternal, SceneUpdateRequest, ChoiceCreateRequest, SceneInternal
from stories.exceptions import UniqueConstraintException


class StoryService(BaseService):
    async def create_story(self, payload: StoryCreateModel, user: UserSystem):
        data = Stories(**payload.model_dump(), owner_id=user.id)
        self.db.add(data)
        await self.db.commit()
        return data

    async def list_stories(self):
        stories = await paginate(
            self.db,
            select(Stories).where(Stories.is_active==True).options(
                load_only(Stories.description, Stories.title, Stories.slug)
            )
        )
        return stories

    async def get_story_by_slug(self, slug: str):
        stmt = select(Stories).where(
            Stories.slug==slug,
            Stories.is_active==True
        ).options(load_only(Stories.description, Stories.title, Stories.slug))
        result = await self.db.execute(stmt)
        instance = result.scalar_one_or_none()
        return instance or {}

    async def update_story_by_slug(
            self,
            slug: str,
            update_data: StoryCreateModel,
            user: UserSystem
    ):
        stmt = select(Stories).where(
            Stories.slug==slug,
            Stories.owner_id==user.id
        ).options(load_only(Stories.slug))

        story = await self.db.execute(stmt)
        instance = story.scalar_one_or_none()

        if not instance:
            raise NotFoundException(detail=f"Slug {slug} not found")

        update_stmt = update(Stories).where(Stories.slug==slug).values(
            **update_data.model_dump(exclude_none=True)
        ).returning(Stories).options(
            load_only(Stories.slug, Stories.title, Stories.description)
        )

        update_story = await self.db.execute(update_stmt)
        await self.db.commit()
        update_instance = update_story.scalar_one_or_none()
        return update_instance or {}

    async def delete_story_by_slug(self, slug: str, user: UserSystem) -> None:
        stmt = select(Stories).where(
            Stories.slug==slug,
            Stories.owner_id==user.id
        ).options(load_only(Stories.slug, Stories.is_active))

        story = await self.db.execute(stmt)
        instance = story.scalar_one_or_none()

        if not instance or not instance.is_active:
            raise NotFoundException(detail=f"Slug {slug} not found")

        delete_stmt = update(Stories).where(Stories.slug==slug).values(
            is_active=False,deleted_at=datetime.now()
        )
        await self.db.execute(delete_stmt)
        await self.db.commit()

    async def create_scene(
            self,
            story: StoryInternal,
            payload: SceneCreateRequest,
            user: UserSystem
    ):
        if story.owner_id != user.id:
            raise NotFoundException(detail=f"Slug {story.slug} not found")
        data = Scenes(**payload.model_dump(), story_id=story.id)
        self.db.add(data)
        await self.db.commit()
        return data

    async def get_scene_by_slug(
            self,
            scene_slug: str,
            story: StoryInternal
    ):
        stmt = select(Scenes).where(
            Scenes.slug==scene_slug,
            Scenes.story_id==story.id,
            Scenes.is_active==True
        )
        result = await self.db.execute(stmt)
        instance = result.scalar_one_or_none()
        if not instance:
            raise NotFoundException(detail=f"Slug {scene_slug} not found")
        return instance

    async def update_scene_by_slug(
            self,
            scene_slug: str,
            payload: SceneUpdateRequest,
            story: StoryInternal,
            user: UserSystem
    ):
        if story.owner_id != user.id:
            raise NotFoundException(detail=f"Slug {story.slug} not found")

        stmt = select(Stories).where(
            Scenes.slug==scene_slug,
            Scenes.story_id==story.id,
            Scenes.is_active==True
        )
        result = await self.db.execute(stmt)
        instance = result.scalar_one_or_none()
        if not instance:
            raise NotFoundException(detail=f"Slug {story.slug} not found")

        update_stmt = update(Scenes).where(
            Scenes.slug==scene_slug,
            Scenes.story_id==story.id
        ).values(**payload.model_dump(exclude_none=True)).returning(Scenes).options(
            load_only(Scenes.text, Scenes.title, Scenes.x, Scenes.y)
        )

        update_scene = await self.db.execute(update_stmt)
        await self.db.commit()
        instance = update_scene.scalar_one_or_none()
        return instance or {}

    async def delete_scene(
            self,
            scene_slug: str,
            story: StoryInternal,
            user: UserSystem
    ):
        if story.owner_id != user.id:
            raise NotFoundException(detail=f"Slug {story.slug} not found")

        stmt = select(Scenes).where(
            Scenes.slug==scene_slug,
            Scenes.story_id==story.id,
            Scenes.is_active==True
        ).options(load_only(Scenes.slug,Scenes.is_active))
        
        result = await self.db.execute(stmt)
        instance = result.scalar_one_or_none()
        
        if not instance:
            raise NotFoundException(detail=f"Slug {story.slug} not found")
        
        del_stmt = update(Scenes).where(
            Scenes.slug==scene_slug,
            Scenes.story_id==story.id
        ).values(is_active=False,deleted_at=datetime.now())

        await self.db.execute(del_stmt)
        await self.db.commit()

    async def create_choice(self, payload: ChoiceCreateRequest, story: StoryInternal, scene: SceneInternal, user: UserSystem):
        if story.owner_id != user.id:
            raise NotFoundException(detail=f"Slug {story.slug} not found")
        if scene.story_id != story.id:
            raise NotFoundException(detail=f"Slug {scene.slug} not found")

        get_next_scene = select(Scenes).where(Scenes.slug==payload.next_scene_slug)
        results = await self.db.execute(get_next_scene)
        instance = results.scalar_one_or_none()
        if not instance:
            raise NotFoundException(detail=f"Slug {payload.next_scene_slug} not found")

        data = Choices(**payload.model_dump(exclude={"next_scene_slug"}), scene_id=scene.id, next_scene_id=instance.id)
        self.db.add(data)
        try:
            await self.db.commit()
        except IntegrityError:
            raise UniqueConstraintException
        return data
