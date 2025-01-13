from typing import Annotated
from fastapi import APIRouter, Depends, status, Query, UploadFile
from fastapi.responses import StreamingResponse

from auth.dependencies import get_current_user, state_dependent_user
from auth.schemas import UserSystem
from core.pagination import LimitOffsetPage
from stories.dependencies import (
    get_scene_dep,
    must_story_owner,
    must_scene_belongs_to_choice_or_exist
)
from stories.schemas import (
    SceneCreateRequest,
    SceneCreateResponse,
    StoryCreateModel,
    StoryCreateResponseModel,
    StoryGetModel,
    StoryUpdateModel,
    StoryUpdateResponseModel,
    SceneUpdateRequest,
    SceneUpdateResponse,
    SceneInternal,
    ChoiceCreateRequest,
    ChoiceInternal,
    ChoiceUpdate,
    SceneGet,
    StoryDetailed,
    AddCategoryRequest
)
from stories.service import StoryService
from stories.constants import SceneTypes
from s3.client import get_from_s3


image_router = APIRouter(prefix="/images")


@image_router.get("/{image_id}")
async def get_image(image_id: str):
    data = get_from_s3(image_id)
    return StreamingResponse(data.get("Body"))

router = APIRouter(prefix="/stories")


@router.post("", response_model=StoryCreateResponseModel, tags=["Story"])
async def create_story(
    story: StoryCreateModel,
    service: StoryService = Depends(StoryService),
    user: UserSystem = Depends(get_current_user)
):
    return await service.create_story(payload=story, user=user)


@router.post(
    "/{slug}/publish",
    tags=["Story"],
    dependencies=[Depends(must_story_owner)],
    response_model=StoryUpdateResponseModel
)
async def publish_story(
    slug: str,
    service: StoryService = Depends(StoryService),
    user: UserSystem = Depends(get_current_user)
):
    return await service.publish_story(slug, user)


@router.post(
    "/{slug}/unpublish",
    tags=["Story"],
    dependencies=[Depends(must_story_owner)],
    response_model=StoryUpdateResponseModel
)
async def unpublish_story(
    slug: str,
    service: StoryService = Depends(StoryService),
    user: UserSystem = Depends(get_current_user)
):
    return await service.unpublish_story(slug, user)


@router.get("", tags=["Story"], name="stories:list-stories")
async def list_stories(
    service: StoryService = Depends(StoryService),
    categories: Annotated[list[str] | None, Query()] = None
) -> LimitOffsetPage[StoryGetModel]:
    return await service.list_stories(categories=categories)


@router.get("/me", tags=["Story"], name="stories:list-my-stories")
async def list_my_stories(
    service: StoryService = Depends(StoryService),
    user: UserSystem = Depends(get_current_user)
) -> LimitOffsetPage[StoryGetModel]:
    return await service.list_user_stories(user.username, user)


@router.get(
    "/user/{username}",
    tags=["Story"]
)
async def list_user_stories(
    username: str,
    user: UserSystem | str = Depends(state_dependent_user),
    service: StoryService = Depends(StoryService)
) -> LimitOffsetPage[StoryGetModel]:
    return await service.list_user_stories(username=username, user=user)


@router.get(
    "/{slug}/detailed",
    tags=["Story"],
    name="stories:detailed-story",
    response_model=StoryDetailed
)
async def detailed_story(
    slug: str,
    service: StoryService = Depends(StoryService),
    user: UserSystem = Depends(state_dependent_user)
):
    return await service.get_detailed_story(slug=slug, user=user)


@router.get("/{slug}", response_model=StoryGetModel, tags=["Story"])
async def get_story(
    slug: str,
    service: StoryService = Depends(StoryService)
):
    return await service.get_story_by_slug(slug)


@router.post(
    "/{slug}/upload",
    tags=["Story"],
    dependencies=[Depends(must_story_owner)]
)
async def upload_image_to_story(
    slug: str,
    image: UploadFile | None = None,
    service: StoryService = Depends(StoryService),
):
    return await service.upload_image_to_story(slug, image)


@router.patch(
    "/{slug}",
    response_model=StoryUpdateResponseModel,
    tags=["Story"],
    dependencies=[Depends(must_story_owner)]
)
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


@router.delete(
    "/{slug}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["Story"],
    dependencies=[Depends(must_story_owner)]
)
async def delete_story(
    slug: str,
    service: StoryService = Depends(StoryService),
    user: UserSystem = Depends(get_current_user)
):
    return await service.delete_story_by_slug(slug=slug, user=user)


@router.post(
    "/{slug}/categories",
    tags=["Story"],
    dependencies=[Depends(must_story_owner)]
)
async def add_story_to_category(
    slug: str,
    payload: AddCategoryRequest,
    service: StoryService = Depends(StoryService)
):
    return await service.add_category_to_story(payload, slug)


@router.delete(
    "/{slug}/categories",
    tags=["Story"],
    dependencies=[Depends(must_story_owner)]
)
async def delete_category_from_story(
    slug: str,
    payload: AddCategoryRequest,
    service: StoryService = Depends(StoryService)
):
    return await service.delete_category_from_story(payload, slug)


@router.get("/{slug}/scenes", tags=["Scene"])
async def get_scenes_of_story(
    slug: str,
    type: SceneTypes = None,
    service: StoryService = Depends(StoryService),
) -> LimitOffsetPage[SceneGet]:
    return await service.get_scenes_of_a_story(slug, type)


@router.post(
    "/{slug}/scenes",
    response_model=SceneCreateResponse,
    tags=["Scene"],
    dependencies=[Depends(must_story_owner)]
)
async def create_scene(
    slug: str,
    payload: SceneCreateRequest,
    service: StoryService = Depends(StoryService)
):
    return await service.create_scene(payload=payload, slug=slug)


@router.get("/{slug}/scenes/{scene_slug}", tags=["Scene"])
async def get_scene(
    slug: str,
    scene_slug: str,
    service: StoryService = Depends(StoryService)
):
    return await service.get_scene_by_slug(scene_slug=scene_slug, slug=slug)


@router.patch(
    "/{slug}/scenes/{scene_slug}",
    response_model=SceneUpdateResponse,
    tags=["Scene"],
    dependencies=[Depends(must_story_owner)]
)
async def update_scene(
    slug: str,
    scene_slug: str,
    payload: SceneUpdateRequest,
    service: StoryService = Depends(StoryService)
):
    return await service.update_scene_by_slug(
        slug=slug,
        scene_slug=scene_slug,
        payload=payload
    )


@router.post(
    "/{slug}/scenes/{scene_slug}/upload",
    tags=["Scene"],
    dependencies=[Depends(must_story_owner)]
)
async def upload_image_to_scene(
    slug: str,
    scene_slug: str,
    image: UploadFile | None = None,
    service: StoryService = Depends(StoryService),
):
    return await service.upload_image_to_scene(slug, scene_slug, image)


@router.delete(
    "/{slug}/scenes/{scene_slug}",
    tags=["Scene"],
    dependencies=[Depends(must_story_owner)]
)
async def delete_scene(
    slug: str,
    scene_slug: str,
    service: StoryService = Depends(StoryService)
):
    return await service.delete_scene(scene_slug=scene_slug, slug=slug)


@router.post(
    "/{slug}/scenes/{scene_slug}/choices",
    tags=["Choices"],
    dependencies=[Depends(must_story_owner)]
)
async def create_choice(
    scene_slug: str,
    payload: ChoiceCreateRequest,
    service: StoryService = Depends(StoryService)
):
    return await service.create_choice(payload=payload, scene_slug=scene_slug)


@router.get("/{slug}/scenes/{scene_slug}/choices", tags=["Choices"])
async def get_choices_of_a_scene(
    service: StoryService = Depends(StoryService),
    scene: SceneInternal = Depends(get_scene_dep)
):
    return await service.get_choices_of_a_scene(scene=scene)


@router.delete(
    "/{slug}/scenes/{scene_slug}/choices/{choice_id}",
    tags=["Choices"],
    dependencies=[Depends(must_story_owner)],
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_choice_by_id(
    service: StoryService = Depends(StoryService),
    choice: ChoiceInternal = Depends(must_scene_belongs_to_choice_or_exist)
):
    return await service.delete_choice_by_id(choice=choice)


@router.patch(
    "/{slug}/scenes/{scene_slug}/choices/{choice_id}",
    tags=["Choices"],
    dependencies=[Depends(must_story_owner)]
)
async def update_choice(
    payload: ChoiceUpdate,
    service: StoryService = Depends(StoryService),
    choice: ChoiceInternal = Depends(must_scene_belongs_to_choice_or_exist),
):
    return await service.update_choice(payload=payload, choice=choice)
