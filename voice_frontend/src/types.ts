export type LanguageCode =
  | "as-IN"
  | "or-IN"
  | "gu-IN"
  | "hi-IN"
  | "en-IN"
  | "mr-IN"
  | "ta-IN"
  | "te-IN"
  | "bn-BD";

export type LanguageAvailability = "official-live" | "prompt-guided";

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  region: string;
  description: string;
  availability: LanguageAvailability;
}

export interface StateProfile {
  code: string;
  name: string;
  centroid: {
    lat: number;
    lng: number;
  };
  majorLanguage: string;
  liveLanguage: LanguageCode;
  fallbackReason?: string;
}

export interface VoiceProfileDoc {
  stateCode: string;
  stateName: string;
  majorLanguage: string;
  liveLanguage: LanguageCode;
  source: PreferenceSource;
  usedFallback: boolean;
  updatedAt?: unknown;
}

export type PreferenceSource = "default" | "location" | "manual" | "saved";

export type CallState = "idle" | "connecting" | "live" | "ending" | "error";

export type LocationState =
  | "idle"
  | "locating"
  | "granted"
  | "denied"
  | "unsupported"
  | "error";
