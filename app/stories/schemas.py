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

class SceneCreateRequest(BaseModel):
    text: str
    title: str
    x: float
    y: float
