from sqlalchemy import Column, String, Boolean, event
from slugify import slugify
from time import time

from app.core.models import Base


class Stories(Base):
    title = Column(String(100))
    description = Column(String(500))
    slug = Column(String(50))
    is_active = Column(Boolean, default=False)

    @staticmethod
    def generate_slug(target, value, oldvalue, initiator):
        if value and (not target.slug or value != oldvalue):
            target.slug = f"{slugify(value, max_length=30)}-{int(time() * 1000)}"

event.listen(Stories.title, "set", Stories.generate_slug, retval=False)

class Scenes(Base):
    title = Column(String(100))
