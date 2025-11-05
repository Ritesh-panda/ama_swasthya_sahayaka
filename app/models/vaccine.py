# File: app/models/vaccine.py

from sqlalchemy import Column, String, Integer, Text
from app.models.base import Base

class Vaccine(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    due_at_weeks_min = Column(Integer, nullable=False) # The earliest week the vaccine is due
    due_at_weeks_max = Column(Integer, nullable=False) # The latest week the vaccine can be given
    details = Column(Text)