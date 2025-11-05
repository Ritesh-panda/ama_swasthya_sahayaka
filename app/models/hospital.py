from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from app.models.base import Base

class Hospital(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    city = Column(String)
    location = Column(Geometry('POINT', srid=4326), index=True)
    doctors = relationship("Doctor", back_populates="hospital")

class Doctor(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    specialty = Column(String)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))
    hospital = relationship("Hospital", back_populates="doctors")