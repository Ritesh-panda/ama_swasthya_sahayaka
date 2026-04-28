import { initializeApp } from "firebase/app";
import { getAI, GoogleAIBackend } from "firebase/ai";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔍 DEBUG: Check if env variables are loading
console.log("ENV CHECK:", import.meta.env);
console.log("API KEY:", import.meta.env.VITE_FIREBASE_API_KEY);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// 🚨 Strict validation (NEW)
if (!firebaseConfig.apiKey) {
  console.error("❌ Firebase API KEY is missing. You must set VITE_FIREBASE_API_KEY in your .env or Vercel dashboard.");
}

export const hasFirebaseConfig = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.storageBucket,
  firebaseConfig.messagingSenderId,
  firebaseConfig.appId,
].every(Boolean);

let cachedServices:
  | {
    auth: ReturnType<typeof getAuth>;
    db: ReturnType<typeof getFirestore>;
    ai: ReturnType<typeof getAI>;
  }
  | null
  | undefined;

export function getFirebaseServices() {
  if (cachedServices !== undefined) {
    return cachedServices;
  }

  if (!hasFirebaseConfig) {
    console.error("❌ Firebase config incomplete:", firebaseConfig);
    cachedServices = null;
    return cachedServices;
  }

  const app = initializeApp(firebaseConfig);

  cachedServices = {
    auth: getAuth(app),
    db: getFirestore(app),
    ai: getAI(app, { backend: new GoogleAIBackend() }),
  };

  return cachedServices;
}

export const GEMINI_LIVE_MODEL =
  "gemini-2.5-flash-native-audio-preview-12-2025";
