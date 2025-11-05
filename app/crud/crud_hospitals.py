# File: app/crud/crud_hospital.py

from sqlalchemy.orm import Session
from app.models.hospital import Hospital, Doctor

def get_hospital_by_name(db: Session, hospital_name: str):
    """
    Fetches a hospital by its name.
    """
    # We use ilike for a case-insensitive search
    return db.query(Hospital).filter(Hospital.name.ilike(f"%{hospital_name}%")).first()