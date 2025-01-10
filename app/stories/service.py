import uuid
from datetime import datetime
from fastapi import HTTPException, status, UploadFile
from fastapi.responses import JSONResponse
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy import select, update, or_, delete
from sqlalchemy.orm import load_only, joinedload
from sqlalchemy.exc import IntegrityError

from auth.schemas import UserSystem
from auth.models import Users
from auth.exceptions import UserNotFoundException, NotAllowedException
from auth.constants import UserTypes
from core.exceptions import NotFoundException
from core.services import BaseService
from categories.models import Categories
from stories.models import Scenes, Stories, Choices, StoryCategories
from stories.schemas import (
    SceneCreateRequest,
    StoryCreateModel,
    SceneUpdateRequest,
    ChoiceCreateRequest,
    SceneInternal,
    ChoiceUpdate,
    StoryUpdateModel,
    AddCategoryRequest
)
from stories.exceptions import (
    CheckSlugsException,
    BeginningSceneAlreadyExistException,
    CannotUploadImageException
)
from stories.constants import SceneTypes, ALLOWED_IMAGE_TYPES
from s3.client import upload_to_s3, delete_from_s3


class StoryService(BaseService):
    async def create_story(self, payload: StoryCreateModel, user: UserSystem):
        """Creates a new story."""
        data = Stories(**payload.model_dump(
            exclude={"categories"}), owner_id=user.id, is_active=False
        )
        data.categories = []
        if payload.categories:
            stmt = (
                select(Categories)
                .where(
                    or_(
                        *[Categories.slug == category for category in payload.categories]  # noqa
                    )
                )
            )
            result = await self.db.execute(stmt)
            instances = result.scalars().all()
            data.categories = instances
        self.db.add(data)
        await self.db.commit()
        return data

    async def publish_story(self, slug: str, user: UserSystem):
        if user.user_type == UserTypes.USER:
            raise NotAllowedException
        stmt = select(Stories).where(Stories.slug == slug).options(
            joinedload(Stories.scenes).joinedload(Scenes.choices)
        )
        result = await self.db.execute(stmt)
        instance = result.unique().scalar_one_or_none()
        if not instance:
            raise NotFoundException
        instance.is_active = True
        for scene in instance.scenes:
            scene.is_active = True
            for choice in scene.choices:
                choice.is_active = True
        await self.db.commit()
        return instance

    async def list_stories(self, categories: list[str] | None):
        """Returns a paginated list of active stories."""
        stmt = (
            select(Stories)
            .where(Stories.is_active == True)
            .options(
                joinedload(Stories.categories),
                joinedload(Stories.user)
                .load_only(Users.first_name, Users.last_name, Users.username)
            )
        )
        if categories:
            stmt = stmt.where(
                Stories
                .categories
                .and_(StoryCategories.category_slug.in_(categories))
            )
        stories = await paginate(
            self.db,
            stmt
        )
        return stories

    async def list_user_stories(self, username: str, user: UserSystem | str):
        user_stmt = select(Users).where(Users.username == username)
        user_results = await self.db.execute(user_stmt)
        user_instance = user_results.unique().scalar_one_or_none()
        if not user_instance:
            raise UserNotFoundException
        stmt = (
            select(Stories)
            .where(
                Stories.owner_id == user_instance.id
            )
            .options(load_only(
                Stories.description,
                Stories.title,
                Stories.slug
            ))
        )
        if isinstance(user, Users) and user.username != username:
            stmt = stmt.where(Stories.is_active == True)
        elif user == "unauthorized":
            stmt = stmt.where(Stories.is_active == True)
        stories = await paginate(self.db, stmt)
        return stories

    async def get_detailed_story(self, slug: str, user: UserSystem | str):
        stmt = (select(Stories)
                .where(Stories.slug == slug)
                .options(
                    joinedload(Stories.categories),
                    joinedload(Stories.user),
                    load_only(
                        Stories.id,
                        Stories.slug,
                        Stories.title,
                        Stories.description,
                        Stories.img,
                        Stories.is_active
                    )
                    .joinedload(
                        Stories.scenes.and_(Scenes.is_active.is_(True))
                    )
                    .load_only(
                        Scenes.text,
                        Scenes.title,
                        Scenes.slug,
                        Scenes.x,
                        Scenes.y,
                        Scenes.type,
                        Scenes.img
                    )
                    .joinedload(Scenes.choices.and_(
                        Choices.is_active.is_(True))
                    ).load_only(
                        Choices.scene_slug,
                        Choices.next_scene_slug,
                        Choices.text
                    )))
        if user == "unauthorized":
            stmt = stmt.where(Stories.is_active == True)
        results = await self.db.execute(stmt)
        instance = results.unique().scalar_one_or_none()
        if not instance:
            raise NotFoundException
        if (isinstance(user, Users) and (
            user.username != instance.user.username
        ) and (instance.is_active == False)):
            raise NotFoundException
        return instance

    async def get_story_by_slug(self, slug: str):
        """Fetches a story by its slug if it is active."""
        stmt = (
            select(Stories)
            .where(Stories.slug == slug, Stories.is_active == True)
            .options(joinedload(Stories.categories), joinedload(Stories.user))
        )
        result = await self.db.execute(stmt)
        instance = result.unique().scalar_one_or_none()
        if not instance:
            raise NotFoundException(
                detail=f"Story with slug '{slug}' not found"
            )
        return instance

    async def update_story_by_slug(
            self, slug: str,
            update_data: StoryUpdateModel,
            user: UserSystem
    ):
        """Updates story by its slug and ensures the user is the owner."""
        stmt = select(Stories).where(
            Stories.slug == slug,
            Stories.owner_id == user.id
        )
        story = await self.db.execute(stmt)
        instance = story.scalar_one_or_none()
        if not instance:
            raise NotFoundException(
                detail=f"Story with slug '{slug}' not found"
            )

        update_stmt = (
            update(Stories)
            .where(Stories.slug == slug)
            .values(**update_data.model_dump(
                exclude_none=True
            ))
            .returning(Stories)
            .options(load_only(
                Stories.slug,
                Stories.title,
                Stories.description,
                Stories.img
            ))
        )
        update_story = await self.db.execute(update_stmt)
        await self.db.commit()
        update_instance = update_story.scalar_one_or_none()
        return update_instance

    async def upload_image_to_story(self, slug: str, image: UploadFile):
        if not image:
            return
        if image.content_type not in ALLOWED_IMAGE_TYPES:
            return JSONResponse({"allowed_types": ALLOWED_IMAGE_TYPES}, 500)
        key = f"{str(uuid.uuid4())}.{image.content_type.split('/')[1]}"
        try:
            existing_img_stmt = (
                select(Stories)
                .where(Stories.slug == slug)
                .options(load_only(Stories.img))
            )
            existing_img = await self.db.execute(existing_img_stmt)
            instance = existing_img.scalar_one_or_none()
            if instance:
                delete_from_s3(instance.img)
            upload_to_s3(image.file.read(), key)
        except Exception:
            raise CannotUploadImageException
        stmt = (
            update(Stories)
            .where(Stories.slug == slug)
            .values(img=key)
            .returning(Stories)
            .options(load_only(
                Stories.slug,
                Stories.title,
                Stories.description,
                Stories.img
            ))
        )
        story = await self.db.execute(stmt)
        await self.db.commit()
        instance = story.scalar_one_or_none()
        return instance

    async def delete_story_by_slug(self, slug: str, user: UserSystem):
        """
        Soft deletes a story by setting it
        inactive and marking the deletion time.
        """  # noqa
        stmt = select(Stories).where(
            Stories.slug == slug,
            Stories.owner_id == user.id
        ).options(joinedload(Stories.scenes).joinedload(Scenes.choices))
        story = await self.db.execute(stmt)
        instance = story.unique().scalar_one_or_none()
        if not instance or not instance.is_active:
            raise NotFoundException(
                detail=f"Story with slug '{slug}' not found"
            )
        instance.is_active = False
        instance.deleted_at = datetime.now()
        if instance.scenes:
            for scene in instance.scenes:
                scene.is_active = False
                scene.deleted_at = datetime.now()
                if scene.choices:
                    for choice in scene.choices:
                        choice.is_active = False
                        choice.deleted_at = datetime.now()
        await self.db.commit()

    async def get_scenes_of_a_story(self, slug: str, type: SceneTypes = None):
        """Returns a paginated list of scenes for a specific story and type."""
        stmt = select(Scenes).where(
            Scenes.story_slug == slug,
            Scenes.is_active == True
        )
        if type:
            stmt = stmt.where(Scenes.type == type)
        scenes = await paginate(self.db, stmt)
        return scenes

    async def create_scene(self, slug: str, payload: SceneCreateRequest):
        """
        Creates a scene for a specific story
        and enforces only one beginning scene.
        """
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
        stmt = select(Scenes).where(
            Scenes.story_slug == slug,
            Scenes.slug == scene_slug
        )
        result = await self.db.execute(stmt)
        instance = result.scalar_one_or_none()
        if not instance:
            raise NotFoundException(
                detail=f"Scene with slug '{scene_slug}' not found"
            )
        return instance

    async def update_scene_by_slug(
            self,
            slug: str,
            scene_slug: str,
            payload: SceneUpdateRequest
    ):
        """Updates a scene by its slug and story slug."""
        stmt = select(Scenes).where(
            Scenes.slug == scene_slug,
            Scenes.story_slug == slug,
            Scenes.is_active == True
        )
        result = await self.db.execute(stmt)
        instance = result.scalar_one_or_none()
        if not instance:
            raise NotFoundException(
                detail=f"Scene with slug '{scene_slug}' not found"
            )

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

    async def upload_image_to_scene(
            self,
            slug: str,
            scene_slug: str,
            image: UploadFile
    ):
        if not image:
            return
        if image.content_type not in ALLOWED_IMAGE_TYPES:
            return JSONResponse({"allowed_types": ALLOWED_IMAGE_TYPES}, 500)
        key = f"{str(uuid.uuid4())}.{image.content_type.split('/')[1]}"
        try:
            existing_img_stmt = (
                select(Scenes)
                .where(Scenes.slug == scene_slug, Scenes.story_slug == slug)
                .options(load_only(Scenes.img))
            )
            existing_img = await self.db.execute(existing_img_stmt)
            instance = existing_img.scalar_one_or_none()
            print(instance)
            if instance:
                delete_from_s3(instance.img)
            upload_to_s3(image.file.read(), key)
        except Exception:
            raise CannotUploadImageException
        stmt = (
            update(Scenes)
            .where(Scenes.story_slug == slug, Scenes.slug == scene_slug)
            .values(img=key)
            .returning(Scenes)
            .options(load_only(
                Scenes.text,
                Scenes.title,
                Scenes.x,
                Scenes.y,
                Scenes.img
            ))
        )
        scene = await self.db.execute(stmt)
        await self.db.commit()
        instance = scene.scalar_one_or_none()
        return instance

    async def delete_scene(self, slug: str, scene_slug: str):
        """
        Soft deletes a scene by setting it
        inactive and marking the deletion time.
        """
        stmt = select(Scenes).where(
            Scenes.slug == scene_slug,
            Scenes.story_slug == slug,
            Scenes.is_active == True
        ).options(joinedload(Scenes.choices))
        result = await self.db.execute(stmt)
        instance = result.unique().scalar_one_or_none()
        if not instance:
            raise NotFoundException(
                detail=f"Scene with slug '{scene_slug}' not found"
            )

        instance.is_active = False
        instance.deleted_at = datetime.now()
        if instance.choices:
            for choice in instance.choices:
                choice.is_active = False
                choice.deleted_at = datetime.now()
                stmt = select(Choices).where(
                    Choices.next_scene_slug == choice.scene_slug
                )
                result = await self.db.execute(stmt)
                instance = result.scalar_one_or_none()
                instance.next_scene_slug = None
        await self.db.commit()

    async def create_choice(
            self,
            payload: ChoiceCreateRequest,
            scene_slug: str
    ):
        """
        Creates a choice, ensuring
        uniqueness on scene and next scene slugs.
        """
        stmt = select(Choices).where(
            Choices.scene_slug == scene_slug,
            Choices.next_scene_slug == payload.next_scene_slug
        )
        result = await self.db.execute(stmt)
        instance = result.scalar_one_or_none()

        if instance and not instance.is_active:
            instance.is_active = True
            await self.db.commit()
            return instance
        elif instance and instance.is_active:
            return instance

        data = Choices(**payload.model_dump(), scene_slug=scene_slug)
        self.db.add(data)
        try:
            await self.db.commit()
        except IntegrityError:
            raise CheckSlugsException
        return data

    async def get_choices_of_a_scene(self, scene: SceneInternal):
        """Fetches all active choices associated with a scene."""
        stmt = (
            select(Scenes)
            .where(Scenes.id == scene.id)
            .options(joinedload(Scenes.choices))
        )
        result = await self.db.execute(stmt)
        instance = result.scalars().first()
        if not instance:
            raise NotFoundException(
                detail=f"Scene with id '{scene.id}' not found"
            )
        return instance.choices

    async def delete_choice_by_id(self, choice: Choices):
        """
        Soft deletes a choice by setting it
        inactive and marking the deletion time.
        """
        choice.is_active = False
        choice.deleted_at = datetime.now()
        await self.db.commit()

    async def update_choice(self, payload: ChoiceUpdate, choice: Choices):
        """Updates a choice's properties."""
        stmt = update(Choices).where(Choices.id == choice.id).values(
            **payload.model_dump(exclude_none=True)
        ).returning(Choices).options(
            load_only(
                Choices.scene_slug,
                Choices.next_scene_slug,
                Choices.text
            )
        )
        result = await self.db.execute(stmt)
        await self.db.commit()
        return result.scalar_one_or_none()

    async def add_category_to_story(
            self,
            payload: AddCategoryRequest,
            slug: str
    ):
        stmt = select(Categories).where(Categories.slug == payload.category)
        result = await self.db.execute(stmt)
        instance = result.scalar_one_or_none()
        if not instance:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                "category not found"
            )
        stmt = select(StoryCategories).where(
            StoryCategories.story_slug == slug,
            StoryCategories.category_slug == payload.category
        )
        result = await self.db.execute(stmt)
        instance = result.scalar_one_or_none()
        if instance:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                "story already belongs to this category"
            )
        data = StoryCategories(story_slug=slug, category_slug=payload.category)
        self.db.add(data)
        await self.db.commit()
        return data

    async def delete_category_from_story(
            self,
            payload: AddCategoryRequest,
            slug: str
    ):
        stmt = select(StoryCategories).where(
            StoryCategories.story_slug == slug,
            StoryCategories.category_slug == payload.category
        )
        result = await self.db.execute(stmt)
        instance = result.scalar_one_or_none()
        if not instance:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                "story does not belongs to this category"
            )
        stmt = delete(StoryCategories).where(
            StoryCategories.story_slug == slug,
            StoryCategories.category_slug == payload.category
        )
        await self.db.execute(stmt)
        await self.db.commit()
