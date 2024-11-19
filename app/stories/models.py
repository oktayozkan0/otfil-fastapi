from core.models import Base
from sqlalchemy import (Boolean, Column, Float, ForeignKey, Integer, String,
                        event, UniqueConstraint, Enum)
from sqlalchemy.orm import relationship, Mapped
from categories.models import Categories
from stories.constants import SceneTypes
from utils.utils import generate_slug


class StoryCategories(Base):
    story_slug = Column(String, ForeignKey("stories.slug"))
    category_slug = Column(String, ForeignKey("categories.slug"))

class Stories(Base):
    title = Column(String(100))
    description = Column(String(500))
    slug = Column(String(50), unique=True)
    img = Column(String, default="/staticfiles/story_img.jpg")
    is_active = Column(Boolean, default=False)
    owner_id = Column(Integer, ForeignKey("users.id"))

    scenes = relationship("Scenes", back_populates="story", foreign_keys="Scenes.story_slug")
    categories = relationship("Categories", secondary="storycategories", back_populates="stories")

class Scenes(Base):
    text = Column(String(255), nullable=False)
    title = Column(String(50), nullable=True, default=None)
    x = Column(Float, default=0)
    y = Column(Float, default=0)
    type = Column(Enum(SceneTypes), nullable=True, default=SceneTypes.DEFAULT)
    img = Column(String, default="/staticfiles/story_img.jpg")
    is_active = Column(Boolean, default=True)
    slug = Column(String(50), unique=True)
    story_slug = Column(String, ForeignKey("stories.slug"))

    story = relationship("Stories", back_populates="scenes", foreign_keys=[story_slug])
    choices = relationship("Choices", back_populates="scenes", foreign_keys="Choices.scene_slug")

class Choices(Base):
    __table_args__ = (
        UniqueConstraint("scene_slug", "next_scene_slug"),
    )
    text = Column(String(100), nullable=False)
    scene_slug = Column(String, ForeignKey("scenes.slug"), name="scene_slug")
    next_scene_slug = Column(String, ForeignKey("scenes.slug"), name="next_scene_slug")
    is_active = Column(Boolean, default=True)

    scenes = relationship("Scenes", back_populates="choices", foreign_keys=[scene_slug])

def target_slug(target, value, oldvalue, initiator):
    if value and (not target.slug or value != oldvalue):
        target.slug = generate_slug(value)

## burada olmaması gerekir. neden burada yazdım bilmiyorum. serviste oluşturmak daha mantıklı olabilir.
event.listen(Stories.title, "set", target_slug, retval=False)
event.listen(Scenes.title, "set", target_slug, retval=False)
