# File: app/services/translation_service.py

from deep_translator import GoogleTranslator

def translate_text(text: str, target_language: str):
    """Translates text using the free deep-translator (Google backend)."""
    try:
        # Map some common language codes if needed, but deep-translator is robust
        translated = GoogleTranslator(source='auto', target=target_language).translate(text)
        return translated
    except Exception as e:
        print(f"--- Translation Error: {e} ---")
        return text

def detect_language(text: str):
    """
    Detects the language. deep-translator doesn't have a standalone detector,
    so we can use 'auto' in translation or a simple detector. 
    For now, we'll let GoogleTranslator handle 'auto'.
    If we strictly need to return a code, we can use langdetect or just assume 
    Gemini will handle the 'context' anyway.
    """
    # For our orchestrator, usually 'auto' is enough for the translation call.
    # If we need a code for state, we'll return 'en' as fallback.
    return "auto" 