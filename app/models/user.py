import datetime
from sqlalchemy import Column, String, DateTime
from app.models.base import Base

class User(Base):
    id = Column(String, primary_key=True, index=True) # WhatsApp number
    language_preference = Column(String, default='or-IN')
    created_at = Column(DateTime, default=datetime.datetime.utcnow)