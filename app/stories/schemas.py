from typing import Optional
from pydantic import BaseModel, Field

from stories.constants import SceneTypes
from categories.schemas import GetCategoriesResponse
from auth.schemas import UserGetResponse


class StoryCreateModel(BaseModel):
    title: str = Field(max_length=100)
    description: str = Field(max_length=500)
    categories: list | None = None


class StoryCreateResponseModel(BaseModel):
    slug: str
    title: str = Field(max_length=100)
    description: str = Field(max_length=500)
    categories: list[GetCategoriesResponse] | None = None


class StoryCategoriesModel(BaseModel):
    category: GetCategoriesResponse


class StoryGetModel(StoryCreateResponseModel):
    slug: str
    title: str = Field(max_length=100)
    description: str = Field(max_length=500)
    img: str
    categories: list[GetCategoriesResponse] | None = None
    is_active: bool
    user: UserGetResponse


class StoryUpdateModel(BaseModel):
    title: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = Field(None, max_length=500)


class StoryImageModel(BaseModel):
    img: str | None = None


class StoryUpdateResponseModel(BaseModel):
    slug: str
    title: str = Field(max_length=100)
    description: str = Field(max_length=500)
    is_active: bool


class StoryInternal(BaseModel):
    id: int
    title: str
    description: str
    slug: str
    is_active: bool
    owner_id: int


class SceneGet(BaseModel):
    text: str
    slug: str
    title: str
    x: float
    y: float
    type: SceneTypes
    img: str


class SceneCreateRequest(BaseModel):
    text: str
    title: str
    x: float
    y: float
    type: SceneTypes = SceneTypes.DEFAULT


class SceneCreateResponse(BaseModel):
    text: str
    slug: str
    title: str
    x: float
    y: float
    type: SceneTypes
    is_active: bool


class SceneUpdateRequest(BaseModel):
    text: str = Field(max_length=255)
    title: str = Field(max_length=50)
    x: float = None
    y: float = None
    type: SceneTypes = SceneTypes.DEFAULT


class SceneUpdateResponse(BaseModel):
    text: str
    title: str
    x: float
    y: float
    type: SceneTypes


class ChoiceCreateRequest(BaseModel):
    text: str
    next_scene_slug: str


class ChoiceUpdate(BaseModel):
    text: str | None = None
    scene_slug: str | None = None
    next_scene_slug: str | None = None


class ChoiceInternal(BaseModel):
    id: int
    text: str
    scene_id: int
    next_scene_id: int
    is_active: bool


class SceneInternal(BaseModel):
    id: int
    text: str
    title: str
    x: float
    y: float
    is_active: bool
    slug: str
    story_id: int
    choices: ChoiceInternal | None = None


class ChoiceGet(BaseModel):
    id: int
    scene_slug: str
    next_scene_slug: str | None
    text: str


class SceneDetailed(SceneGet):
    choices: list[ChoiceGet]


class StoryDetailed(StoryGetModel):
    scenes: list[SceneDetailed]


class AddCategoryRequest(BaseModel):
    category: str
