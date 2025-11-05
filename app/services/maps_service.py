# File: app/services/maps_service.py

import requests
import json
from app.core.config import settings

def find_nearby_hospitals(latitude: float, longitude: float):
    """
    Finds nearby hospitals and then gets detailed contact info for each one.
    """
    search_url = "https://places.googleapis.com/v1/places:searchNearby"
    details_url = "https://places.googleapis.com/v1/places/"

    # --- Step 1: Nearby Search to get Place IDs ---
    search_payload = {
        "includedTypes": ["hospital"],
        "maxResultCount": 3, # Let's get the top 3
        "locationRestriction": {
            "circle": { "center": { "latitude": latitude, "longitude": longitude }, "radius": 10000.0 } # 10km radius
        }
    }
    search_headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': settings.GOOGLE_MAPS_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName' # We only need the ID and name initially
    }

    try:
        response = requests.post(search_url, data=json.dumps(search_payload), headers=search_headers)
        response.raise_for_status()

        places = response.json().get('places', [])
        if not places:
            return "I couldn't find any hospitals within 10km of your location."

        # --- Step 2: Get Details for Each Place ---
        reply = "Here are the nearest hospitals I found on Google Maps:\n\n"

        for place in places:
            place_id = place.get('id')
            place_name = place.get('displayName', {}).get('text', 'N/A')

            # Make a new request for details for this specific place
            details_headers = {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': settings.GOOGLE_MAPS_API_KEY,
                'X-Goog-FieldMask': 'formattedAddress,nationalPhoneNumber,websiteUri'
            }
            details_response = requests.get(f"{details_url}{place_id}", headers=details_headers)
            details_data = details_response.json()

            address = details_data.get('formattedAddress', 'Address not available')
            phone = details_data.get('nationalPhoneNumber', 'Phone not available')
            website = details_data.get('websiteUri', '')

            reply += f"🏥 *{place_name}*\n"
            reply += f"_{address}_\n"
            reply += f"📞 Phone: {phone}\n"
            if website:
                reply += f"🌐 Website: {website}\n"
            reply += "\n"

        return reply

    except Exception as e:
        print(f"--- Google Maps API Error: {e} ---")
        return "Sorry, I'm having trouble searching for hospitals right now."