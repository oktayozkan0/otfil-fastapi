from sqlalchemy import Column, String, Boolean, Integer, event, ForeignKey, Float
from sqlalchemy.orm import relationship


from core.models import Base


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

event.listen(Stories.title, "set", Stories.generate_slug, retval=False)
event.listen(Scenes.title, "set", Scenes.generate_slug, retval=False)
