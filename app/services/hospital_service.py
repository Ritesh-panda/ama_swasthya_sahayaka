# File: app/services/hospital_service.py

from sqlalchemy.orm import Session
from sqlalchemy import func
from geoalchemy2.elements import WKTElement

from app.models.hospital import Hospital

def get_nearest_hospitals(db: Session, latitude: float, longitude: float):
    """
    Finds the 3 nearest hospitals to the given latitude and longitude.
    """
    # Create a representation of the user's location in a format
    # that the database understands (Well-Known Text).
    user_location_point = WKTElement(f'POINT({longitude} {latitude})', srid=4326)

    # This is the core of the location search.
    # It queries the database and uses the powerful PostGIS function `ST_Distance`
    # to calculate the distance between the user's point and every hospital's point.
    # It then orders the results by that distance and returns the top 3.
    nearest_hospitals = db.query(Hospital).order_by(
        func.ST_Distance(Hospital.location, user_location_point)
    ).limit(3).all()

    return nearest_hospitals