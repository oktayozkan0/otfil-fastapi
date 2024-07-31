from collections.abc import AsyncGenerator

from core.config import get_app_settings
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

app_settings = get_app_settings()

engine = create_async_engine(
    app_settings.database_url.unicode_string(),
    future=True,
    echo=True,
)

AsyncSessionFactory = async_sessionmaker(
    engine,
    autoflush=False,
    expire_on_commit=False,
)

async def get_db() -> AsyncGenerator:
    async with AsyncSessionFactory() as session:
        yield session
