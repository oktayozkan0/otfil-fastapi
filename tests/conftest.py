import sys
import pathlib

p = str(pathlib.Path(__file__).resolve().parent.parent)
p2 = str(pathlib.Path(__file__).resolve().parent.parent / "app")
sys.path.append(p)
sys.path.append(p2)

from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi import FastAPI
from httpx import AsyncClient, ASGITransport
import pytest

from app.core.db import get_db

@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"

@pytest.fixture
def app() -> FastAPI:
    from app.main import get_app

    return get_app()

@pytest.fixture(scope="module")
def test_db():
    engine = create_engine("sqlite:///:memory:")
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    alembic_cfg = Config("alembic.ini")
    alembic_cfg.attributes["bind"] = engine
    command.upgrade(alembic_cfg, "head")
    yield SessionLocal
    engine.dispose()

@pytest.fixture
async def client(app: FastAPI, test_db):
    app.dependency_overrides[get_db] = lambda: test_db
    async with AsyncClient(transport=ASGITransport(app), base_url="http://testserver") as client:
        yield client
