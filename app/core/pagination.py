from fastapi_pagination.limit_offset import LimitOffsetPage as LimitOffsetPage, LimitOffsetParams as BaseLimitOffsetParams
from fastapi_pagination.ext.sqlalchemy import paginate
from typing import TypeVar, Generic
from fastapi import Query


T = TypeVar("T")

class LimitOffsetParams(BaseLimitOffsetParams):
    limit: int = Query(default=10, ge=1, le=50, description="Page size limit")
    offset: int = Query(default=0, ge=0, description="Page offset")

class LimitOffsetPage(LimitOffsetPage[T], Generic[T]):
    __params_type__ = LimitOffsetParams
