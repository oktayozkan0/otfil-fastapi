from fastapi import APIRouter, Depends

from auth.dependencies import get_current_user
from auth.schemas import UserSystem
from categories.schemas import CreateCategoryRequest, GetCategoriesResponse
from categories.service import CategoryService


router = APIRouter(prefix="/categories")

@router.post("", tags=["Categories"])
async def create_category(
    payload: CreateCategoryRequest,
    user: UserSystem = Depends(get_current_user),
    service: CategoryService = Depends(CategoryService)
):
    return await service.create_category(payload=payload, user=user)

@router.get("", tags=["Categories"], response_model=list[GetCategoriesResponse])
async def get_categories(
    service: CategoryService = Depends(CategoryService)
):
    return await service.get_categories()
