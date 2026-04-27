import logging
from datetime import datetime
from sqlalchemy.orm import Session
from app.services import ai_service, maps_service, vaccine_service, alert_service
from app.schemas.ai import ChatIntent
from app.crud import crud_hospitals

logger = logging.getLogger(__name__)


async def process_query(
    input_text: str,
    db: Session,
    source: str = "whatsapp",
    lat: float = None,
    lng: float = None,
    user_id: str = "web_voice_user"
) -> dict:
    """
    Central AI Orchestrator.
    Accepts raw text from any channel (WhatsApp or Voice),
    routes it through Gemini, fetches external data if needed,
    and returns a channel-appropriate JSON response.
    """

    # 1. Analyze intent via Gemini
    ai_response = ai_service.get_ai_response(user_id=user_id, user_message=input_text)

    intent_type = "normal"
    final_message = ""
    hospitals = []

    # 2. Route based on detected intent
    if ai_response.intent == ChatIntent.EMERGENCY:
        intent_type = "EMERGENCY"
        logger.warning(f"EMERGENCY DETECTED: {ai_response.data.emergency_type} for User: {user_id}")

        if source == "voice":
            # Shorter, clean sentence for Text-to-Speech
            final_message = (
                f"Medical emergency detected. {ai_response.reply} "
                "Please call 1 0 8 immediately for emergency services."
            )
        else:
            # Rich formatted text for WhatsApp
            final_message = "🚨 *MEDICAL EMERGENCY DETECTED* 🚨\n\n"
            final_message += "Follow these steps IMMEDIATELY:\n\n"
            final_message += "1️⃣ *DIAL 108* (Ambulance/Emergency Services).\n"
            final_message += "2️⃣ Stay calm and ensure your safety.\n"
            if ai_response.data.emergency_type:
                final_message += f"\n*Detected Situation:* {ai_response.data.emergency_type}\n"
            final_message += f"\n*Guidance:* {ai_response.reply}\n\n"
            final_message += "Reply 'find a hospital near me' to share your location for nearby centers."

        # Auto-fetch nearby hospitals if coordinates were provided
        if lat and lng:
            hospital_text = maps_service.find_nearby_hospitals(latitude=lat, longitude=lng)
            if source == "voice":
                final_message += " I have found nearby hospitals — check the screen."
            else:
                final_message += "\n\n" + hospital_text

    elif ai_response.intent == ChatIntent.VACCINE_SCHEDULE:
        if ai_response.data.date_of_birth:
            try:
                date_of_birth = datetime.strptime(ai_response.data.date_of_birth, "%Y-%m-%d").date()
                schedule = vaccine_service.calculate_vaccine_schedule(db, date_of_birth=date_of_birth)
                final_message = schedule if source == "whatsapp" else "I have calculated the vaccine schedule. Please check the screen."
            except Exception as e:
                logger.error(f"Date format error: {e}")
                final_message = "I couldn't understand that date. Please provide the date of birth clearly."
        else:
            final_message = "Please provide the child's exact date of birth to calculate the vaccine schedule."

    elif ai_response.intent == ChatIntent.FIND_DOCTORS:
        if ai_response.data.hospital_name:
            hospital = crud_hospitals.get_hospital_by_name(db, hospital_name=ai_response.data.hospital_name)
            if hospital and hospital.doctors:
                if source == "voice":
                    final_message = f"I found doctors at {hospital.name}. Please check your screen for the full list."
                else:
                    doctor_list = f"Here are the doctors for *{hospital.name}*:\n\n"
                    for doc in hospital.doctors:
                        doctor_list += f"🩺 *Dr. {doc.name}* ({doc.specialty})\n"
                    final_message = doctor_list
            else:
                final_message = f"I couldn't find any doctors listed for '{ai_response.data.hospital_name}'."
        else:
            final_message = "Please specify the name of the hospital you are looking for."

    elif ai_response.intent == ChatIntent.GET_ALERTS:
        alerts = alert_service.get_health_alerts()
        final_message = alerts if source == "whatsapp" else "Here are the latest health alerts. Please read them on your screen."

    elif ai_response.intent == ChatIntent.SHOW_MENU:
        final_message = (
            "I can help with symptom analysis, finding a hospital near you, "
            "vaccination schedules, and the latest health alerts. Just ask!"
        )

    else:  # GENERAL_CHAT
        final_message = ai_response.reply

    return {
        "type": intent_type,
        "message": final_message,
        "hospitals": hospitals
    }
