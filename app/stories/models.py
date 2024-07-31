from time import time
from slugify import slugify

from core.models import Base
from sqlalchemy import (Boolean, Column, Float, ForeignKey, Integer, String,
                        event, UniqueConstraint)
from sqlalchemy.orm import relationship


class Stories(Base):
    title = Column(String(100))
    description = Column(String(500))
    slug = Column(String(50))
    is_active = Column(Boolean, default=False)
    owner_id = Column(Integer, ForeignKey("users.id"))

    scenes = relationship("Scenes", back_populates="story")

class Scenes(Base):
    text = Column(String(255), nullable=False)
    title = Column(String(50), nullable=True, default=None)
    x = Column(Float, default=0)
    y = Column(Float, default=0)
    is_active = Column(Boolean, default=True)
    slug = Column(String(50))
    story_slug = Column(String, ForeignKey("stories.slug"))

    story = relationship("Stories", back_populates="scenes", foreign_keys=[story_slug])
    choices = relationship("Choices", back_populates="scenes", foreign_keys="Choices.scene_id")

class Choices(Base):
    __table_args__ = (
        UniqueConstraint("scene_id", "next_scene_id"),
    )
    text = Column(String(100), nullable=False)
    scene_slug = Column(String, ForeignKey("scenes.slug"), name="scene_slug")
    next_scene_slug = Column(String, ForeignKey("scenes.slug"), name="next_scene_slug")
    is_active = Column(Boolean, default=True)

    scenes = relationship("Scenes", back_populates="choices", foreign_keys=[scene_slug])

def generate_slug(target, value, oldvalue, initiator):
    if value and (not target.slug or value != oldvalue):
        target.slug = f"{slugify(value, max_length=30)}-{int(time() * 1000)}"


event.listen(Stories.title, "set", generate_slug, retval=False)
event.listen(Scenes.title, "set", generate_slug, retval=False)
