from core.db import get_db
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession


class BaseService:
    def __init__(self, db: AsyncSession = Depends(get_db)) -> None:
        self.db = db
