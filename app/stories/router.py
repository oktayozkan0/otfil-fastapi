from fastapi import APIRouter, Depends

from stories.service import StoryService
from stories.schemas import StoryCreateResponseModel, StoryCreateModel, StoryListModel, StoryUpdateModel, StoryUpdateResponseModel


router = APIRouter()

@router.post("/stories", response_model=StoryCreateResponseModel)
async def create_story(game: StoryCreateModel, service: StoryService = Depends(StoryService)):
    return await service.create_story(payload=game)

@router.get("/stories", response_model=list[StoryListModel])
async def get_stories(service: StoryService = Depends(StoryService)):
    return await service.list_stories()

@router.get("/stories/{slug}", response_model=StoryCreateResponseModel)
async def get_story_by_slug(slug: str, service: StoryService = Depends(StoryService)):
    return await service.get_story_by_slug(slug)

@router.patch("/stories/{slug}", response_model=StoryUpdateResponseModel)
async def update_story(slug: str, update_data: StoryUpdateModel, service: StoryService = Depends(StoryService)):
    return await service.update_story_by_slug(slug=slug, update_data=update_data)
