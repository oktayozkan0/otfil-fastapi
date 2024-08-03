from pydantic import BaseModel, Field


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

class SceneCreateRequest(BaseModel):
    text: str
    title: str
    x: float
    y: float

class SceneCreateResponse(BaseModel):
    text: str
    slug: str
    title: str
    x: float
    y: float
    is_active: bool

class SceneUpdateRequest(BaseModel):
    text: str = Field(max_length=255)
    title: str = Field(max_length=50)
    x: float = None
    y: float = None

class SceneUpdateResponse(BaseModel):
    text: str
    title: str
    x: float
    y: float

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
