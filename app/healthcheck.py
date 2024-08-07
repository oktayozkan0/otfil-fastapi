from fastapi import APIRouter
from pydantic import BaseModel


class HealthCheckModel(BaseModel):
    status: str = "active"

router = APIRouter(tags=["Health Check"])

@router.get("/health", response_model=HealthCheckModel)
def health_check():
    return HealthCheckModel(
        status="active"
    )
