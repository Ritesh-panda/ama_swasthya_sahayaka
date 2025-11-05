# File: app/crud/crud_user.py

from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate

def get_user(db: Session, user_id: str):
    """
    Fetches a single user from the database by their ID (phone number).
    """
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate):
    """
    Creates a new user row in the database.
    """
    # Create a new SQLAlchemy User model instance from the Pydantic schema data
    db_user = User(id=user.id, language_preference=user.language_preference)

    # Add the new user to the database session
    db.add(db_user)

    # Commit the transaction to save the user to the database
    db.commit()

    # Refresh the instance to get the new data from the DB, like created_at
    db.refresh(db_user)

    return db_user