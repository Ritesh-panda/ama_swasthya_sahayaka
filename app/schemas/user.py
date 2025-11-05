# File: app/schemas/user.py

import datetime
from pydantic import BaseModel

# This is the base schema with fields common to all user-related operations.
class UserBase(BaseModel):
    id: str
    language_preference: str | None = 'or-IN'

# This schema is used specifically when creating a new user.
class UserCreate(UserBase):
    pass

# This schema is used when reading a user from the database.
# It includes all fields from UserBase plus the created_at field.
class User(UserBase):
    created_at: datetime.datetime

    # This config class tells Pydantic to read data even if it's not a dict,
    # but an ORM model (like our SQLAlchemy user objects).
    class Config:
        from_attributes = True