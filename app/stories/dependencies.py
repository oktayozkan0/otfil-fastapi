from fastapi import Path, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from stories.models import Stories
from core.services import get_db
from core.exceptions import NotFoundException


async def get_story_dep(slug: str = Path(...), db: AsyncSession = Depends(get_db)):
    stmt = select(Stories).where(Stories.slug==slug)
    results = await db.execute(stmt)
    instance = results.scalar_one_or_none()
    if not instance:
        raise NotFoundException(detail=f"Slug {slug} not found")
    return instance
