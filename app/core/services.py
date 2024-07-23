from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.db import get_db


class BaseService:
    def __init__(self, db: AsyncSession = Depends(get_db)) -> None:
        self.db = db
