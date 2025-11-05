# File: create_tables.py

from app.db.session import engine
from app.models.base import Base

# Import all of your models here so that SQLAlchemy knows about them
# and can create the corresponding tables.
from app.models import user, hospital, appointment, vaccine
def reset_database():
    """
    Drops all tables and re-creates them based on the current models.
    """
    print("--- Dropping all tables (if they exist)... ---")
    try:
        # The drop_all command will drop all tables known to this Base metadata.
        Base.metadata.drop_all(bind=engine)
        print("--- Tables dropped successfully. ---")
    except Exception as e:
        print(f"--- Error dropping tables: {e} ---")

    print("--- Creating all tables... ---")
    # The create_all command creates all tables known to this Base metadata.
    Base.metadata.create_all(bind=engine)
    print("--- Tables created successfully! ---")


if __name__ == "__main__":
    reset_database()