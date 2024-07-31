from core.exceptions import NotFoundException
from core.services import get_db
from fastapi import Depends, Path
from sqlalchemy import select
from sqlalchemy.orm import lazyload, joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from stories.models import Stories, Scenes
from stories.schemas import StoryInternal


async def get_story_dep(slug: str = Path(...), db: AsyncSession = Depends(get_db)):
    stmt = select(Stories).where(Stories.slug==slug)
    results = await db.execute(stmt)
    instance = results.scalar_one_or_none()
    if not instance:
        raise NotFoundException(detail=f"Slug {slug} not found")
    return instance

async def get_scene_dep(slug: str = Path(...), scene_slug: str = Path(...), db: AsyncSession = Depends(get_db)):
    stmt = select(Scenes).where(Scenes.slug==scene_slug,Scenes.story_slug==slug)
    results = await db.execute(stmt)
    instance = results.scalar_one_or_none()
    if not instance:
        raise NotFoundException(detail=f"Slug {scene_slug} not found")
    return instance
