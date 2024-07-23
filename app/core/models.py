from sqlalchemy import Column, DateTime
from sqlalchemy.orm import as_declarative, declared_attr
from sqlalchemy import Integer
from sqlalchemy.sql import func


@as_declarative()
class Base:
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    deleted_at = Column(DateTime)
    __name__: str

    @declared_attr
    def __tablename__(self) -> str:
        return self.__name__.lower()
