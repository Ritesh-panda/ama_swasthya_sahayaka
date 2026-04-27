# File: app/api/v1/process_routes.py
# New JSON API endpoint for the Voice Frontend (React App)

import logging
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.services.process_query import process_query

logger = logging.getLogger(__name__)

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class QueryRequest(BaseModel):
    input: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    user_id: Optional[str] = "web_voice_user"


@router.post("/process-query")
async def handle_query(req: QueryRequest, db: Session = Depends(get_db)):
    """
    JSON endpoint for the Voice Frontend.
    Accepts user speech as text, runs it through the central AI orchestrator,
    and returns a clean JSON response for the React app to speak aloud.
    """
    logger.info(f"Voice query received for user '{req.user_id}': {req.input[:60]}...")
    return await process_query(
        input_text=req.input,
        db=db,
        source="voice",
        lat=req.lat,
        lng=req.lng,
        user_id=req.user_id,
    )
