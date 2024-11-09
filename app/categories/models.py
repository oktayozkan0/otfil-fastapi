from sqlalchemy import Column, String
from sqlalchemy.orm import relationship

from core.models import Base


class Categories(Base):
    title = Column(String(50))
    slug = Column(String(50), unique=True)

    stories = relationship("StoryCategories", back_populates="category", foreign_keys="StoryCategories.category_slug")
