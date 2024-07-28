import sys
import pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parent.parent / "app"))

import asyncio
import importlib
import inspect

from alembic import context
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import MetaData

from app.core.config import get_app_settings
from app.apps import APPS

# this is pretty painful
LOADED_MODELS = []
for app in APPS:
    try:
        module = f"app.{app}.models"
        loaded_module = importlib.import_module(f"app.{app}.models")
        classes = inspect.getmembers(loaded_module, inspect.isclass)
        LOADED_MODELS.extend([
            class_obj
            for _, class_obj in inspect.getmembers(loaded_module, inspect.isclass)
            if class_obj.__module__ == module
        ])
    except ModuleNotFoundError:
        raise ImportError

def combine_metadata(*args):
    m = MetaData()
    for metadata in args:
        for t in metadata.tables.values():
            t.tometadata(m)
    return m

target_metadata = combine_metadata(*[i.metadata for i in LOADED_MODELS])

settings = get_app_settings()
DB_URL = settings.database_url


def do_run_migrations(connection):
    context.configure(
        compare_type=True,
        dialect_opts={"paramstyle": "named"},
        connection=connection,
        target_metadata=target_metadata,
        include_schemas=True,
        # literal_binds=True,
        version_table_schema=target_metadata.schema,
    )

    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online():
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = create_async_engine(settings.database_url.unicode_string(), future=True)

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)


asyncio.run(run_migrations_online())
