from datetime import datetime
from fastapi import HTTPException, status
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy import select, update
from sqlalchemy.orm import load_only, joinedload
from sqlalchemy.exc import IntegrityError

from auth.schemas import UserSystem
from core.exceptions import NotFoundException
from core.services import BaseService
from stories.models import Scenes, Stories, Choices
from stories.schemas import SceneCreateRequest, StoryCreateModel, SceneUpdateRequest, ChoiceCreateRequest, SceneInternal, ChoiceUpdate
from stories.exceptions import CheckSlugsException


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
            slug: str,
            payload: SceneCreateRequest
    ):
        data = Scenes(**payload.model_dump(), story_slug=slug)
        self.db.add(data)
        await self.db.commit()
        return data

    async def get_scene_by_slug(
            self,
            slug: str,
            scene_slug: str,
    ):
        stmt = select(Scenes).where(
            Scenes.slug==scene_slug,
            Scenes.story_slug==slug,
            Scenes.is_active==True
        )
        result = await self.db.execute(stmt)
        instance = result.scalar_one_or_none()
        if not instance:
            raise NotFoundException(detail=f"Slug {scene_slug} not found")
        return instance

    async def update_scene_by_slug(
            self,
            slug: str,
            scene_slug: str,
            payload: SceneUpdateRequest
    ):
        stmt = select(Scenes).where(
            Scenes.slug==scene_slug,
            Scenes.story_slug==slug,
            Scenes.is_active==True
        )
        result = await self.db.execute(stmt)
        instance = result.scalars().all()
        if not instance:
            raise NotFoundException(detail=f"Slug {slug} not found")

        update_stmt = update(Scenes).where(
            Scenes.slug==scene_slug,
            Scenes.story_slug==slug
        ).values(**payload.model_dump(exclude_none=True)).returning(Scenes).options(
            load_only(Scenes.text, Scenes.title, Scenes.x, Scenes.y)
        )

        update_scene = await self.db.execute(update_stmt)
        await self.db.commit()
        instance = update_scene.scalar_one_or_none()
        return instance or {}

    async def delete_scene(
            self,
            slug: str,
            scene_slug: str
    ):
        stmt = select(Scenes).where(
            Scenes.slug==scene_slug,
            Scenes.story_slug==slug,
            Scenes.is_active==True
        ).options(load_only(Scenes.slug,Scenes.is_active))
        
        result = await self.db.execute(stmt)
        instance = result.scalar_one_or_none()
        
        if not instance:
            raise NotFoundException(detail=f"Slug {slug} not found")
        
        del_stmt = update(Scenes).where(
            Scenes.slug==scene_slug,
            Scenes.story_slug==slug
        ).values(is_active=False,deleted_at=datetime.now())

        await self.db.execute(del_stmt)
        await self.db.commit()

    async def create_choice(self, payload: ChoiceCreateRequest, scene_slug: str):
        stmt = select(Scenes).where((Scenes.slug==payload.next_scene_slug) | (Scenes.slug==scene_slug))
        results = await self.db.execute(stmt)
        instances = results.scalars().all()
        if len(instances) == 2:
            if instances[0].story_slug != instances[1].story_slug:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="scene_slug and next_scene_slug must belong to same story"
                )
        else:
            raise CheckSlugsException

        data = Choices(**payload.model_dump(), scene_slug=scene_slug)
        self.db.add(data)
        try:
            await self.db.commit()
        except IntegrityError:
            raise CheckSlugsException
        return data

    async def get_choices_of_a_scene(self, scene: SceneInternal):
        stmt = select(Scenes).where(Scenes.id==scene.id).options(joinedload(Scenes.choices))
        results = await self.db.execute(stmt)
        instance = results.scalars().first()
        if not instance:
            raise NotFoundException(detail=f"Slug {scene.slug} not found")
        return instance.choices

    async def delete_choice_by_id(self, choice: Choices):
        choice.is_active = False
        choice.deleted_at = datetime.now()
        await self.db.commit()

    async def update_choice(self, payload: ChoiceUpdate, choice: Choices):
        stmt = update(Choices).where(Choices.id==choice.id).values(**payload.model_dump(exclude_none=True)).returning(Choices).options(load_only(Choices.scene_slug, Choices.next_scene_slug, Choices.text))
        result = await self.db.execute(stmt)
        await self.db.commit()
        instance = result.scalar_one_or_none()
        return instance or {}
