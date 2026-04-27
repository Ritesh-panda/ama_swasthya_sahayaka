# Jeevanrekha

An India-first, shortlist-focused health voice assistant prototype built for the browser. The app behaves like a call screen, optionally infers the user's state from browser geolocation, maps that state to a major language or MVP fallback language, starts a Gemini Live audio session in that language, and saves the preference in Firestore.

## What this MVP does

- creates a call-like voice screen for a health bot demo
- uses optional location permission to infer a likely Indian state
- maps state to a major language and an MVP-ready live language
- starts a Gemini Live session with strict health guardrails
- stores the selected state and language in Firestore
- supports typed prompts as a demo fallback if the room is noisy

## Health scope

The agent is deliberately constrained. It can help with:

- symptom intake
- clinic or hospital guidance
- appointment pre-screening
- health scheme and FAQ explanation
- medication reminder support
- post-visit instructions from approved content

The agent is instructed not to:

- diagnose diseases with confidence
- prescribe medicines
- change dosage
- interpret lab reports definitively
- manage emergencies without escalation

Red flags trigger emergency advice immediately:

- chest pain
- breathing difficulty
- stroke-like symptoms
- pregnancy emergencies
- severe bleeding
- suicidal intent
- unconsciousness
- seizures
- baby or child not responding

## Google products used

- Firebase AI Logic with the Gemini Developer API backend
- Gemini Live API for real-time audio
- Firebase Authentication with anonymous sign-in
- Cloud Firestore for user preference persistence

## Setup

1. Create a Firebase project and add a Web app.
2. In Firebase console, go to **AI Services > AI Logic** and complete the guided setup with the **Gemini Developer API** backend.
3. Enable **Anonymous Authentication** in Firebase Authentication.
4. Create a **Cloud Firestore** database.
5. Copy `.env.example` to `.env` and fill in your Firebase web config values.
6. Install dependencies:

   ```bash
   npm install
   ```

7. Start the app:

   ```bash
   npm run dev
   ```

## Demo flow

1. Open the app in a secure context like `http://localhost`.
2. Click **Use My Location** to infer the likely state.
3. Confirm the selected state and language.
4. Click **Start Call** to begin the Gemini Live voice session.
5. Try prompt chips or speak into the microphone.
6. Switch language mid-session if you want to demonstrate multilingual continuity.

## Notes

- The Gemini Live API is currently a preview capability.
- For the MVP, full regional language coverage is not implemented for every state. Unsupported state languages fall back to a supported live language, usually Hindi or English, and the UI makes that explicit.
- Official Firebase AI Logic docs show these India-relevant Live API languages: `hi-IN`, `en-IN`, `mr-IN`, `ta-IN`, `te-IN`, and Bengali via `bn-BD`.
