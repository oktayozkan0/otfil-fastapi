from datetime import datetime
from fastapi import HTTPException, status
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy import select, update
from sqlalchemy.orm import load_only, joinedload
from sqlalchemy.exc import IntegrityError

from auth.schemas import UserSystem
from core.exceptions import NotFoundException
from core.services import BaseService
from stories.models import Scenes, Stories, Choices, StoryCategories
from stories.schemas import (
    SceneCreateRequest,
    StoryCreateModel,
    SceneUpdateRequest,
    ChoiceCreateRequest,
    SceneInternal,
    ChoiceUpdate
)
from stories.exceptions import CheckSlugsException, BeginningSceneAlreadyExistException
from stories.constants import SceneTypes


class StoryService(BaseService):
    
    async def create_story(self, payload: StoryCreateModel, user: UserSystem):
        """Creates a new story."""
        data = Stories(**payload.model_dump(), owner_id=user.id, is_active=True)
        self.db.add(data)
        await self.db.commit()
        return data

    async def list_stories(self, categories: list[str] | None):
        """Returns a paginated list of active stories."""
        stmt = (select(Stories)
            .where(Stories.is_active == True)
            .options(joinedload(Stories.categories).joinedload(StoryCategories.category), load_only(Stories.description, Stories.title, Stories.slug)))
        if categories:
            stmt = stmt.where(Stories.categories.and_(StoryCategories.category_slug.in_(categories)))
        stories = await paginate(
            self.db,
            stmt
        )
        return stories

    async def list_user_stories(self, user: UserSystem):
        stmt = select(Stories).where(Stories.is_active==True, Stories.owner_id == user.id).options(load_only(Stories.description, Stories.title, Stories.slug))
        stories = await paginate(self.db, stmt)
        return stories

    async def get_detailed_story(self, slug: str):
        stmt = (select(Stories)
                .where(Stories.is_active==True, Stories.slug==slug)
                .options(
                    joinedload(Stories.categories).joinedload(StoryCategories.category),
                    load_only(
                        Stories.id,Stories.slug,Stories.title,Stories.description,Stories.img
                    )
                    .joinedload(Stories.scenes)
                    .load_only(Scenes.text,Scenes.title,Scenes.slug,Scenes.x,Scenes.y,Scenes.type,Scenes.img)
                    .joinedload(Scenes.choices).load_only(Choices.scene_slug,Choices.next_scene_slug,Choices.text)))
        results = await self.db.execute(stmt)
        instance = results.unique().scalar_one_or_none()
        return instance

    async def get_story_by_slug(self, slug: str):
        """Fetches a story by its slug if it is active."""
        stmt = (
            select(Stories)
            .where(Stories.slug == slug, Stories.is_active == True)
            .options(load_only(Stories.description, Stories.title, Stories.slug))
        )
        result = await self.db.execute(stmt)
        instance = result.scalar_one_or_none()
        if not instance:
            raise NotFoundException(detail=f"Story with slug '{slug}' not found")
        return instance

    async def update_story_by_slug(self, slug: str, update_data: StoryCreateModel, user: UserSystem):
        """Updates story by its slug and ensures the user is the owner."""
        stmt = select(Stories).where(Stories.slug == slug, Stories.owner_id == user.id)
        story = await self.db.execute(stmt)
        instance = story.scalar_one_or_none()
        if not instance:
            raise NotFoundException(detail=f"Story with slug '{slug}' not found")

        update_stmt = (
            update(Stories)
            .where(Stories.slug == slug)
            .values(**update_data.model_dump(exclude_none=True))
            .returning(Stories)
            .options(load_only(Stories.slug, Stories.title, Stories.description))
        )
        update_story = await self.db.execute(update_stmt)
        await self.db.commit()
        update_instance = update_story.scalar_one_or_none()
        return update_instance

    async def delete_story_by_slug(self, slug: str, user: UserSystem):
        """Soft deletes a story by setting it inactive and marking the deletion time."""
        stmt = select(Stories).where(Stories.slug == slug, Stories.owner_id == user.id)
        story = await self.db.execute(stmt)
        instance = story.scalar_one_or_none()
        if not instance or not instance.is_active:
            raise NotFoundException(detail=f"Story with slug '{slug}' not found")

        delete_stmt = update(Stories).where(Stories.slug == slug).values(
            is_active=False, deleted_at=datetime.now()
        )
        await self.db.execute(delete_stmt)
        await self.db.commit()

    async def get_scenes_of_a_story(self, slug: str, type: SceneTypes = None):
        """Returns a paginated list of scenes for a specific story and type."""
        stmt = select(Scenes).where(Scenes.story_slug == slug, Scenes.is_active == True)
        if type:
            stmt = stmt.where(Scenes.type == type)
        scenes = await paginate(self.db, stmt)
        return scenes

    async def create_scene(self, slug: str, payload: SceneCreateRequest):
        """Creates a scene for a specific story and enforces only one beginning scene."""
        if payload.type == SceneTypes.BEGINNING:
            stmt = select(Scenes).where(
                Scenes.story_slug == slug,
                Scenes.type == SceneTypes.BEGINNING,
                Scenes.is_active == True
            )
            result = await self.db.execute(stmt)
            instance = result.scalar_one_or_none()
            if instance:
                raise BeginningSceneAlreadyExistException
        data = Scenes(**payload.model_dump(), story_slug=slug)
        self.db.add(data)
        await self.db.commit()
        return data

    async def get_scene_by_slug(self, slug: str, scene_slug: str):
        """Fetches a scene by story and scene slugs."""
        stmt = select(Scenes).where(Scenes.story_slug == slug, Scenes.slug == scene_slug)
        result = await self.db.execute(stmt)
        instance = result.scalar_one_or_none()
        if not instance:
            raise NotFoundException(detail=f"Scene with slug '{scene_slug}' not found")
        return instance

    async def update_scene_by_slug(self, slug: str, scene_slug: str, payload: SceneUpdateRequest):
        """Updates a scene by its slug and story slug."""
        stmt = select(Scenes).where(Scenes.slug == scene_slug, Scenes.story_slug == slug, Scenes.is_active == True)
        result = await self.db.execute(stmt)
        instance = result.scalar_one_or_none()
        if not instance:
            raise NotFoundException(detail=f"Scene with slug '{scene_slug}' not found")

        update_stmt = (
            update(Scenes)
            .where(Scenes.slug == scene_slug, Scenes.story_slug == slug)
            .values(**payload.model_dump(exclude_none=True))
            .returning(Scenes)
            .options(load_only(Scenes.text, Scenes.title, Scenes.x, Scenes.y))
        )
        update_scene = await self.db.execute(update_stmt)
        await self.db.commit()
        return update_scene.scalar_one_or_none()

    async def delete_scene(self, slug: str, scene_slug: str):
        """Soft deletes a scene by setting it inactive and marking the deletion time."""
        stmt = select(Scenes).where(Scenes.slug == scene_slug, Scenes.story_slug == slug, Scenes.is_active == True)
        result = await self.db.execute(stmt)
        instance = result.scalar_one_or_none()
        if not instance:
            raise NotFoundException(detail=f"Scene with slug '{scene_slug}' not found")

        del_stmt = update(Scenes).where(Scenes.slug == scene_slug).values(
            is_active=False, deleted_at=datetime.now()
        )
        await self.db.execute(del_stmt)
        await self.db.commit()

    async def create_choice(self, payload: ChoiceCreateRequest, scene_slug: str):
        """Creates a choice, ensuring uniqueness on scene and next scene slugs."""
        stmt = select(Choices).where(
            Choices.scene_slug == scene_slug,
            Choices.next_scene_slug == payload.next_scene_slug,
            Choices.is_active == True
        )
        result = await self.db.execute(stmt)
        instance = result.scalar_one_or_none()
        if instance:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Choice not unique")

        data = Choices(**payload.model_dump(), scene_slug=scene_slug)
        self.db.add(data)
        try:
            await self.db.commit()
        except IntegrityError:
            raise CheckSlugsException
        return data

    async def get_choices_of_a_scene(self, scene: SceneInternal):
        """Fetches all active choices associated with a scene."""
        stmt = select(Scenes).where(Scenes.id == scene.id).options(joinedload(Scenes.choices))
        result = await self.db.execute(stmt)
        instance = result.scalars().first()
        if not instance:
            raise NotFoundException(detail=f"Scene with id '{scene.id}' not found")
        return instance.choices

    async def delete_choice_by_id(self, choice: Choices):
        """Soft deletes a choice by setting it inactive and marking the deletion time."""
        choice.is_active = False
        choice.deleted_at = datetime.now()
        await self.db.commit()

    async def update_choice(self, payload: ChoiceUpdate, choice: Choices):
        """Updates a choice's properties."""
        stmt = update(Choices).where(Choices.id == choice.id).values(
            **payload.model_dump(exclude_none=True)
        ).returning(Choices).options(
            load_only(Choices.scene_slug, Choices.next_scene_slug, Choices.text)
        )
        result = await self.db.execute(stmt)
        await self.db.commit()
        return result.scalar_one_or_none()
