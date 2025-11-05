# File: app/services/ai_service.py

import json
import redis
import google.generativeai as genai
from app.core.config import settings

# --- Redis Setup ---
redis_client = None
try:
    redis_client = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)
    redis_client.ping()
    print("--- Successfully connected to Redis. ---")
except Exception as e:
    print(f"--- ERROR: Could not connect to Redis: {e} ---")

# --- Gemini Model Setup ---
model = None
try:
    if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "YOUR_GEMINI_API_KEY_HERE":
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')
        print("--- Successfully connected to Gemini API. ---")
    else:
        print("--- WARNING: GEMINI_API_KEY is not set. AI service will be disabled. ---")
except Exception as e:
    print(f"--- ERROR: Failed to configure Gemini API: {e} ---")


def get_ai_response(user_id: str, user_message: str) -> str:
    if not model or not redis_client:
        return "I'm sorry, a core service is not configured correctly. Please check the logs."

    history_key = f"history:{user_id}"
    try:
        # History is now a list of dictionaries: [{"role": "user", "parts": [...]}]
        conversation_history = json.loads(redis_client.get(history_key) or "[]")
    except Exception as e:
        print(f"--- Redis/JSON Error: {e}. Resetting history. ---")
        conversation_history = []

    system_prompt = """
    You are Arogya Mitra, an empathetic AI public health assistant for the people of India...
    (Your full, detailed prompt goes here)
    """

    # --- THIS IS THE CORRECTED HISTORY FORMAT ---
    # 1. Add the new user message in the correct format
    conversation_history.append({"role": "user", "parts": [user_message]})
    # ---------------------------------------------

    try:
        # Use the newer `start_chat` method which is designed for history
        chat = model.start_chat(history=conversation_history[:-1]) # History without the latest message
        response = chat.send_message(
            f"{system_prompt}\n\nPlease respond to the last user message based on the history provided."
        )
        ai_reply = response.text.strip()

        # --- THIS IS THE CORRECTED HISTORY FORMAT ---
        # 2. Add the AI's reply in the correct format
        conversation_history.append({"role": "model", "parts": [ai_reply]})
        # ---------------------------------------------

        short_history = conversation_history[-6:]
        redis_client.set(history_key, json.dumps(short_history))
        redis_client.expire(history_key, 3600)

        return ai_reply
    except Exception as e:
        print(f"--- Gemini API Error: {e} ---")
        return "I'm sorry, I'm having a little trouble thinking right now. Please try again."