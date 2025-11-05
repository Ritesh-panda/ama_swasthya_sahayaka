from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# The engine manages a pool of connections to the database.
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# The SessionLocal class is a "factory" for creating new database sessions.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)