from pydantic import BaseModel, Field


class CreateCategoryRequest(BaseModel):
    title: str = Field(max_length=50)


class GetCategoriesResponse(BaseModel):
    title: str
    slug: str
