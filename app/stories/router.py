from auth.dependencies import get_current_user
from auth.schemas import UserSystem
from core.pagination import LimitOffsetPage
from fastapi import APIRouter, Depends, status
from stories.dependencies import get_story_dep, get_scene_dep
from stories.schemas import (SceneCreateRequest, SceneCreateResponse,
                             StoryCreateModel, StoryCreateResponseModel,
                             StoryGetModel, StoryInternal, StoryUpdateModel,
                             StoryUpdateResponseModel, SceneUpdateRequest,
                             SceneUpdateResponse,SceneInternal, ChoiceCreateRequest)
from stories.service import StoryService


router = APIRouter(prefix="/stories")

@router.post("", response_model=StoryCreateResponseModel, tags=["Story"])
async def create_story(
    story: StoryCreateModel,
    service: StoryService = Depends(StoryService),
    user: UserSystem = Depends(get_current_user)
):
    return await service.create_story(payload=story, user=user)

@router.get("", tags=["Story"])
async def list_stories(
    service: StoryService = Depends(StoryService)
) -> LimitOffsetPage[StoryGetModel]:
    return await service.list_stories()

@router.get("/{slug}", response_model=StoryCreateResponseModel, tags=["Story"])
async def get_story(
    slug: str,
    service: StoryService = Depends(StoryService)
):
    return await service.get_story_by_slug(slug)

@router.patch("/{slug}", response_model=StoryUpdateResponseModel, tags=["Story"])
async def update_story(
    slug: str,
    update_data: StoryUpdateModel,
    service: StoryService = Depends(StoryService),
    user: UserSystem = Depends(get_current_user)
):
    return await service.update_story_by_slug(
        slug=slug,
        update_data=update_data,
        user=user
    )

@router.delete("/{slug}", status_code=status.HTTP_204_NO_CONTENT, tags=["Story"])
async def delete_story(
    slug: str,
    service: StoryService = Depends(StoryService),
    user: UserSystem = Depends(get_current_user)
):
    return await service.delete_story_by_slug(slug=slug, user=user)

@router.post("/{slug}/scenes", response_model=SceneCreateResponse, tags=["Scene"])
async def create_scene(
    payload: SceneCreateRequest,
    service: StoryService = Depends(StoryService),
    story: StoryInternal = Depends(get_story_dep),
    user: UserSystem = Depends(get_current_user)
):
    return await service.create_scene(story=story, payload=payload, user=user)

@router.get("/{slug}/scenes/{scene_slug}", tags=["Scene"])
async def get_scene(
    scene_slug: str,
    service: StoryService = Depends(StoryService),
    story: StoryInternal = Depends(get_story_dep)
):
    return await service.get_scene_by_slug(scene_slug=scene_slug, story=story)

@router.patch("/{slug}/scenes/{scene_slug}", response_model=SceneUpdateResponse, tags=["Scene"])
async def update_scene(
    scene_slug: str,
    payload: SceneUpdateRequest,
    service: StoryService = Depends(StoryService),
    story: StoryInternal = Depends(get_story_dep),
    user: UserSystem = Depends(get_current_user)
):
    return await service.update_scene_by_slug(
        scene_slug=scene_slug,
        payload=payload,
        story=story,
        user=user
    )

@router.delete("/{slug}/scenes/{scene_slug}", tags=["Scene"])
async def delete_scene(
    scene_slug: str,
    service: StoryService = Depends(StoryService),
    story: StoryInternal = Depends(get_story_dep),
    user: UserSystem = Depends(get_current_user)
):
    return await service.delete_scene(scene_slug=scene_slug,story=story,user=user)

@router.post("/{slug}/scenes/{scene_slug}/choices", tags=["Choices"])
async def create_choice(
    payload: ChoiceCreateRequest,
    service: StoryService = Depends(StoryService),
    story: StoryInternal = Depends(get_story_dep),
    scene: SceneInternal = Depends(get_scene_dep),
    user: UserSystem = Depends(get_current_user)
):
    return await service.create_choice(payload=payload, story=story, scene=scene, user=user)
