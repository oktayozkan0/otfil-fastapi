from sqlalchemy import Column, String

from core.models import Base


class Stories(Base):
    title = Column(String(100))
    description = Column(String(500))
    slug = Column()
