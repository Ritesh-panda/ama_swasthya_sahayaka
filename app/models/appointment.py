import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

class Appointment(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))
    appointment_time = Column(DateTime)
    status = Column(String, default="SCHEDULED")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    user = relationship("User")
    doctor = relationship("Doctor")
    hospital = relationship("Hospital")