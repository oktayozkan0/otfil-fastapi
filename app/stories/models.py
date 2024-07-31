from time import time
from slugify import slugify

from core.models import Base
from sqlalchemy import (Boolean, Column, Float, ForeignKey, Integer, String,
                        event)
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
    story_id = Column(Integer, ForeignKey("stories.id"))

    story = relationship("Stories", back_populates="scenes")



def generate_slug(target, value, oldvalue, initiator):
    if value and (not target.slug or value != oldvalue):
        target.slug = f"{slugify(value, max_length=30)}-{int(time() * 1000)}"


event.listen(Stories.title, "set", generate_slug, retval=False)
event.listen(Scenes.title, "set", generate_slug, retval=False)
