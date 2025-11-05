# File: app/main.py

from fastapi import FastAPI
from app.api.v1 import chat_routes  # <--- 1. IMPORT THE NEW ROUTER

app = FastAPI(
    title="Ama Swasthya Sahayaka",
    description="An AI-driven public health chatbot for the people of Odisha.",
    version="1.0.0"
)

@app.get("/", tags=["Health Check"])
def read_root():
    """A simple health check endpoint."""
    return {"status": "ok", "message": "Welcome to Ama Swasthya Sahayaka API!"}

# 2. INCLUDE THE ROUTER IN THE MAIN APP
app.include_router(chat_routes.router, prefix="/api/v1", tags=["Chat"])