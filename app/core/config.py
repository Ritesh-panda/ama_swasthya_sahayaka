import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID")
    TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN")
    TWILIO_WHATSAPP_NUMBER: str = os.getenv("TWILIO_WHATSAPP_NUMBER")
    REDIS_URL: str = os.getenv("REDIS_URL")
# In the Settings class
    NEWS_API_KEY: str = os.getenv("NEWS_API_KEY")
    GOOGLE_MAPS_API_KEY: str = os.getenv("GOOGLE_MAPS_API_KEY")
    class Config:
        case_sensitive = True

settings = Settings()