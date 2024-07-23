from pydantic import BaseModel, Field


class StoryCreateModel(BaseModel):
    title: str = Field(max_length=100)
    description: str = Field(max_length=500)

class StoryCreateResponseModel(StoryCreateModel):
    id: int
    slug: str

class StoryListModel(StoryCreateResponseModel):
    pass
