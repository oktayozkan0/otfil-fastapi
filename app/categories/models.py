from sqlalchemy import Column, String
from sqlalchemy.orm import relationship

from core.models import Base


class Categories(Base):
    title = Column(String(50))
    slug = Column(String(50), unique=True)

    stories = relationship("Stories", secondary="storycategories", back_populates="categories")
