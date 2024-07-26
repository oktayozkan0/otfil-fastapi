from fastapi import APIRouter, Depends, status

from stories.service import StoryService
from stories.schemas import StoryCreateResponseModel, StoryCreateModel, StoryGetModel, StoryUpdateModel, StoryUpdateResponseModel
from core.pagination import LimitOffsetPage

router = APIRouter()

@router.post("/stories", response_model=StoryCreateResponseModel)
async def create_story(game: StoryCreateModel, service: StoryService = Depends(StoryService)):
    return await service.create_story(payload=game)

@router.get("/stories")
async def list_stories(service: StoryService = Depends(StoryService)) -> LimitOffsetPage[StoryGetModel]:
    return await service.list_stories()

@router.get("/stories/{slug}", response_model=StoryCreateResponseModel)
async def get_story(slug: str, service: StoryService = Depends(StoryService)):
    return await service.get_story_by_slug(slug)

@router.patch("/stories/{slug}", response_model=StoryUpdateResponseModel)
async def update_story(slug: str, update_data: StoryUpdateModel, service: StoryService = Depends(StoryService)):
    return await service.update_story_by_slug(slug=slug, update_data=update_data)

@router.delete("/stories/{slug}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_story(slug: str, service: StoryService = Depends(StoryService)):
    return await service.delete_game_by_slug(slug=slug)
