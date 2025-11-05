# File: app/api/v1/chat_routes.py

from fastapi import APIRouter, Depends, Form, Response
from sqlalchemy.orm import Session
from twilio.twiml.messaging_response import MessagingResponse
from typing import Optional
from datetime import datetime

from app.crud import crud_user, crud_hospitals
from app.schemas.user import UserCreate
from app.db.session import SessionLocal
from app.services import (
    ai_service, maps_service, vaccine_service, alert_service, translation_service
)

# --- THE COMPLETE MENU TEXT ---
MENU_TEXT = """Hi! I am Ama Swasthya Sahayaka. I can help you with:

*1. Symptom Analysis* 🔎
(e.g., "I have a fever and headache")

*2. Hospital Finder* 🏥
(e.g., "find a hospital near me")

*3. Vaccination Schedule* 💉
(e.g., "vaccine schedule for baby born on 10 Jan 2025")

*4. Latest Health Alerts* 🚨
(e.g., "what are the latest health alerts?")

just ask your question directly!"""
# ------------------------------

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

router = APIRouter()

@router.post("/chat")
def handle_chat_message(
    From: str = Form(...),
    Body: Optional[str] = Form(None),
    Latitude: Optional[float] = Form(None),
    Longitude: Optional[float] = Form(None),
    db: Session = Depends(get_db)
):
    user_id = From
    user = crud_user.get_user(db, user_id=user_id)
    twiml_response = MessagingResponse()
    
    source_language = "en"
    message_body_en = Body.strip().lower() if Body else ""

    if Body:
        source_language = translation_service.detect_language(Body)
        if source_language not in ["en", "und"]:
             message_body_en = translation_service.translate_text(Body, 'en')
    
    reply_en = ""

    if not user:
        user_in = UserCreate(id=user_id)
        crud_user.create_user(db=db, user=user_in) # Corrected to use 'user'
        reply_en = MENU_TEXT
    
    elif Latitude and Longitude:
        reply_en = maps_service.find_nearby_hospitals(latitude=Latitude, longitude=Longitude)
    
    elif message_body_en in ["1", "2", "3", "4"]:
        if message_body_en == "1":
            reply_en = "You've selected Symptom Analysis. Please describe your symptoms in detail."
        elif message_body_en == "2":
            reply_en = "You've selected Hospital Finder. Please use the WhatsApp location feature to share your current location with me."
        elif message_body_en == "3":
            reply_en = "You've selected Vaccination Schedule. Please tell me the child's date of birth, for example: 'baby born on 10 January 2025'."
        elif message_body_en == "4":
            reply_en = alert_service.get_health_alerts()
    else:
        ai_reply = ai_service.get_ai_response(user_id=user_id, user_message=message_body_en)

        if ai_reply == "show_menu":
            reply_en = MENU_TEXT
        elif ai_reply.startswith("vaccine_schedule:"):
            try:
                date_str = ai_reply.split(":")[1].strip()
                date_of_birth = datetime.strptime(date_str, "%Y-%m-%d").date()
                reply_en = vaccine_service.calculate_vaccine_schedule(db, date_of_birth=date_of_birth)
            except Exception as e:
                reply_en = "I couldn't understand that date. Please try again."
        
        elif ai_reply.startswith("find_doctors:"):
            hospital_name = ai_reply.split(":")[1].strip()
            hospital = crud_hospital.get_hospital_by_name(db, hospital_name=hospital_name)
            if hospital and hospital.doctors:
                doctor_list = f"Here are the doctors for *{hospital.name}*:\n\n"
                for doc in hospital.doctors:
                    doctor_list += f"🩺 *Dr. {doc.name}* ({doc.specialty})\n"
                reply_en = doctor_list
            else:
                reply_en = f"I couldn't find any doctors for '{hospital_name}'."
        
        elif ai_reply == "get_alerts":
            reply_en = alert_service.get_health_alerts()
        else:
            reply_en = ai_reply
    
    final_reply = reply_en
    if source_language not in ["en", "und"]:
        final_reply = translation_service.translate_text(reply_en, source_language)
    
    twiml_response.message(final_reply)
    return Response(content=str(twiml_response), media_type="application/xml")