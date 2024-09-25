import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from fastapi import status


@pytest.mark.anyio
async def test_list_stories(
        app: FastAPI, client: AsyncClient
) -> None:
    response = await client.get(app.url_path_for("stories:list-stories"))
    json_response: dict = response.json()
    assert response.status_code == status.HTTP_200_OK
    assert "limit" in json_response.keys()
    assert "offset" in json_response.keys()
    assert "items" in json_response.keys()
    assert "total" in json_response.keys()
