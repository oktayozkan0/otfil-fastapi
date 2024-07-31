from auth.dependencies import get_current_user
from auth.schemas import UserSystem
from core.pagination import LimitOffsetPage
from fastapi import APIRouter, Depends, status
from stories.dependencies import get_story_dep
from stories.schemas import (SceneCreateRequest, SceneCreateResponse,
                             StoryCreateModel, StoryCreateResponseModel,
                             StoryGetModel, StoryInternal, StoryUpdateModel,
                             StoryUpdateResponseModel)
from stories.service import StoryService

router = APIRouter(tags=["Stories"], prefix="/stories")

@router.post("", response_model=StoryCreateResponseModel)
async def create_story(story: StoryCreateModel, service: StoryService = Depends(StoryService), user: UserSystem = Depends(get_current_user)):
    return await service.create_story(payload=story, user=user)

@router.get("")
async def list_stories(service: StoryService = Depends(StoryService)) -> LimitOffsetPage[StoryGetModel]:
    return await service.list_stories()

@router.get("/{slug}", response_model=StoryCreateResponseModel)
async def get_story(slug: str, service: StoryService = Depends(StoryService)):
    return await service.get_story_by_slug(slug)

@router.patch("/{slug}", response_model=StoryUpdateResponseModel)
async def update_story(slug: str, update_data: StoryUpdateModel, service: StoryService = Depends(StoryService), user: UserSystem = Depends(get_current_user)):
    return await service.update_story_by_slug(slug=slug, update_data=update_data, user=user)

@router.delete("/{slug}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_story(slug: str, service: StoryService = Depends(StoryService), user: UserSystem = Depends(get_current_user)):
    return await service.delete_story_by_slug(slug=slug, user=user)

@router.post("/{slug}/scenes", response_model=SceneCreateResponse)
async def create_scene(
    payload: SceneCreateRequest,
    service: StoryService = Depends(StoryService),
    story: StoryInternal = Depends(get_story_dep),
    user: UserSystem = Depends(get_current_user)
):
    return await service.create_scene(story=story, payload=payload, user=user)
