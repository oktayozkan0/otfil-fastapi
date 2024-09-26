from pydantic import BaseModel, Field

from stories.constants import SceneTypes


class StoryCreateModel(BaseModel):
    title: str = Field(max_length=100)
    description: str = Field(max_length=500)

class StoryCreateResponseModel(BaseModel):
    slug: str
    title: str = Field(max_length=100)
    description: str = Field(max_length=500)

class StoryGetModel(StoryCreateResponseModel):
    id: int
    slug: str
    title: str = Field(max_length=100)
    description: str = Field(max_length=500)
    img: str

class StoryUpdateModel(BaseModel):
    title: str = Field(max_length=100)
    description: str = Field(max_length=500)

class StoryUpdateResponseModel(BaseModel):
    slug: str
    title: str = Field(max_length=100)
    description: str = Field(max_length=500)

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
