from auth.dependencies import get_current_user
from auth.schemas import UserSystem
from auth.exceptions import UnauthorizedException
from core.exceptions import NotFoundException
from core.services import get_db
from fastapi import Depends, Path
from sqlalchemy import select
from sqlalchemy.orm import load_only, joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from stories.models import Stories, Scenes, Choices


async def must_story_owner(
        slug: str = Path(...),
        user: UserSystem = Depends(get_current_user),
        db: AsyncSession = Depends(get_db)
):
    stmt = select(Stories).where(Stories.slug == slug).options(
        load_only(Stories.id, Stories.owner_id)
    )
    results = await db.execute(stmt)
    instance = results.scalar_one_or_none()
    if not instance:
        raise NotFoundException(detail=f"Slug {slug} not found")
    if instance.owner_id != user.id:
        raise UnauthorizedException(detail=f"You are not the owner of {slug}")


async def must_scene_belongs_to_choice_or_exist(
    slug: str = Path(...),
    scene_slug: str = Path(...),
    choice_id: int = Path(...),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(Stories)
        .where(Stories.slug == slug)
        .options(
            joinedload(
                Stories.scenes.and_(
                    Scenes.slug == scene_slug,
                    Scenes.story_slug == slug
                ),
                innerjoin=True
            ).options(
                joinedload(
                    Scenes.choices.and_(
                        Choices.scene_slug == scene_slug,
                        Choices.id == choice_id
                    ),
                    innerjoin=True
                )
            )
        )
    )
    results = await db.execute(stmt)
    instance = results.scalars().first()
    if not instance:
        raise NotFoundException(detail=f"ID {choice_id} not found")
    return instance.scenes[0].choices[0]


async def get_story_dep(
        slug: str = Path(...),
        db: AsyncSession = Depends(get_db)
):
    stmt = select(Stories).where(Stories.slug == slug)
    results = await db.execute(stmt)
    instance = results.scalar_one_or_none()
    if not instance:
        raise NotFoundException(detail=f"Slug {slug} not found")
    return instance


async def get_scene_dep(
        slug: str = Path(...),
        scene_slug: str = Path(...),
        db: AsyncSession = Depends(get_db)
):
    stmt = select(Scenes).where(
        Scenes.slug == scene_slug,
        Scenes.story_slug == slug
    )
    results = await db.execute(stmt)
    instance = results.scalar_one_or_none()
    if not instance:
        raise NotFoundException(detail=f"Slug {scene_slug} not found")
    return instance


async def check_scene_slugs_of_choice(scene_slug: str = Path(...)):
    pass
