import type { LanguageCode, LanguageOption, StateProfile } from "../types";

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: "as-IN",
    label: "Assamese",
    nativeLabel: "অসমীয়া",
    region: "Assam",
    description:
      "Prototype prompt-guided option for Assam while Live API audio support remains undocumented.",
    availability: "prompt-guided",
  },
  {
    code: "or-IN",
    label: "Odia",
    nativeLabel: "ଓଡ଼ିଆ",
    region: "Odisha",
    description:
      "Prototype prompt-guided option for Odisha while Live API audio support remains undocumented.",
    availability: "prompt-guided",
  },
  {
    code: "gu-IN",
    label: "Gujarati",
    nativeLabel: "ગુજરાતી",
    region: "Gujarat",
    description: "Direct live support for Gujarati-speaking users.",
    availability: "official-live",
  },
  {
    code: "hi-IN",
    label: "Hindi",
    nativeLabel: "हिन्दी",
    region: "Hindi belt / India",
    description: "Best for north and central India in this MVP.",
    availability: "official-live",
  },
  {
    code: "en-IN",
    label: "English",
    nativeLabel: "English",
    region: "Pan-India fallback",
    description: "Neutral fallback for states whose major language is not yet live.",
    availability: "official-live",
  },
  {
    code: "mr-IN",
    label: "Marathi",
    nativeLabel: "मराठी",
    region: "Maharashtra",
    description: "Direct live support for Maharashtra demos.",
    availability: "official-live",
  },
  {
    code: "ta-IN",
    label: "Tamil",
    nativeLabel: "தமிழ்",
    region: "Tamil Nadu / Puducherry",
    description: "Direct live support for Tamil-first demos.",
    availability: "official-live",
  },
  {
    code: "te-IN",
    label: "Telugu",
    nativeLabel: "తెలుగు",
    region: "Andhra Pradesh / Telangana",
    description: "Direct live support for Telugu-speaking users.",
    availability: "official-live",
  },
  {
    code: "bn-BD",
    label: "Bengali",
    nativeLabel: "বাংলা",
    region: "West Bengal / Tripura",
    description: "Live API currently lists Bengali under `bn-BD`.",
    availability: "official-live",
  },
];

export const LANGUAGE_BY_CODE = LANGUAGE_OPTIONS.reduce<
  Record<LanguageCode, LanguageOption>
>((accumulator, language) => {
  accumulator[language.code] = language;
  return accumulator;
}, {} as Record<LanguageCode, LanguageOption>);

export const INDIA_STATE_PROFILES: StateProfile[] = [
  { code: "AN", name: "Andaman and Nicobar Islands", centroid: { lat: 11.7401, lng: 92.6586 }, majorLanguage: "Bengali / Hindi", liveLanguage: "en-IN", fallbackReason: "MVP falls back to English for this union territory." },
  { code: "AP", name: "Andhra Pradesh", centroid: { lat: 15.9129, lng: 79.74 }, majorLanguage: "Telugu", liveLanguage: "te-IN" },
  { code: "AR", name: "Arunachal Pradesh", centroid: { lat: 28.218, lng: 94.7278 }, majorLanguage: "English / Hindi", liveLanguage: "en-IN" },
  { code: "AS", name: "Assam", centroid: { lat: 26.2006, lng: 92.9376 }, majorLanguage: "Assamese", liveLanguage: "as-IN", fallbackReason: "Assamese is added as a prompt-guided prototype language. Firebase Live audio docs do not list official Assamese audio support yet." },
  { code: "BR", name: "Bihar", centroid: { lat: 25.0961, lng: 85.3131 }, majorLanguage: "Hindi", liveLanguage: "hi-IN" },
  { code: "CG", name: "Chhattisgarh", centroid: { lat: 21.2787, lng: 81.8661 }, majorLanguage: "Hindi", liveLanguage: "hi-IN" },
  { code: "CH", name: "Chandigarh", centroid: { lat: 30.7333, lng: 76.7794 }, majorLanguage: "Hindi / Punjabi", liveLanguage: "hi-IN" },
  { code: "DD", name: "Dadra and Nagar Haveli and Daman and Diu", centroid: { lat: 20.4283, lng: 72.8397 }, majorLanguage: "Gujarati", liveLanguage: "gu-IN" },
  { code: "DL", name: "Delhi", centroid: { lat: 28.7041, lng: 77.1025 }, majorLanguage: "Hindi", liveLanguage: "hi-IN" },
  { code: "GA", name: "Goa", centroid: { lat: 15.2993, lng: 74.124 }, majorLanguage: "Konkani", liveLanguage: "en-IN", fallbackReason: "Konkani is outside the Phase 1 live language set." },
  { code: "GJ", name: "Gujarat", centroid: { lat: 22.2587, lng: 71.1924 }, majorLanguage: "Gujarati", liveLanguage: "gu-IN" },
  { code: "HP", name: "Himachal Pradesh", centroid: { lat: 31.1048, lng: 77.1734 }, majorLanguage: "Hindi", liveLanguage: "hi-IN" },
  { code: "HR", name: "Haryana", centroid: { lat: 29.0588, lng: 76.0856 }, majorLanguage: "Hindi", liveLanguage: "hi-IN" },
  { code: "JH", name: "Jharkhand", centroid: { lat: 23.6102, lng: 85.2799 }, majorLanguage: "Hindi", liveLanguage: "hi-IN" },
  { code: "JK", name: "Jammu and Kashmir", centroid: { lat: 33.7782, lng: 76.5762 }, majorLanguage: "Urdu / Hindi", liveLanguage: "hi-IN" },
  { code: "KA", name: "Karnataka", centroid: { lat: 15.3173, lng: 75.7139 }, majorLanguage: "Kannada", liveLanguage: "en-IN", fallbackReason: "Kannada is outside the Phase 1 live language set." },
  { code: "KL", name: "Kerala", centroid: { lat: 10.8505, lng: 76.2711 }, majorLanguage: "Malayalam", liveLanguage: "en-IN", fallbackReason: "Malayalam is planned for a later phase." },
  { code: "LA", name: "Ladakh", centroid: { lat: 34.1526, lng: 77.577 }, majorLanguage: "Ladakhi / Hindi", liveLanguage: "hi-IN" },
  { code: "LD", name: "Lakshadweep", centroid: { lat: 10.5667, lng: 72.6417 }, majorLanguage: "Malayalam", liveLanguage: "en-IN", fallbackReason: "Malayalam is not yet in the live voice MVP." },
  { code: "MH", name: "Maharashtra", centroid: { lat: 19.7515, lng: 75.7139 }, majorLanguage: "Marathi", liveLanguage: "mr-IN" },
  { code: "ML", name: "Meghalaya", centroid: { lat: 25.467, lng: 91.3662 }, majorLanguage: "Khasi / English", liveLanguage: "en-IN" },
  { code: "MN", name: "Manipur", centroid: { lat: 24.6637, lng: 93.9063 }, majorLanguage: "Meiteilon", liveLanguage: "en-IN", fallbackReason: "Meiteilon is not yet supported in the Phase 1 voice stack." },
  { code: "MP", name: "Madhya Pradesh", centroid: { lat: 22.9734, lng: 78.6569 }, majorLanguage: "Hindi", liveLanguage: "hi-IN" },
  { code: "MZ", name: "Mizoram", centroid: { lat: 23.1645, lng: 92.9376 }, majorLanguage: "Mizo", liveLanguage: "en-IN", fallbackReason: "Mizo is not yet supported in the live voice MVP." },
  { code: "NL", name: "Nagaland", centroid: { lat: 26.1584, lng: 94.5624 }, majorLanguage: "English / Nagamese", liveLanguage: "en-IN" },
  { code: "OD", name: "Odisha", centroid: { lat: 20.9517, lng: 85.0985 }, majorLanguage: "Odia", liveLanguage: "or-IN", fallbackReason: "Odia is added as a prompt-guided prototype language. Firebase Live audio docs do not list official Odia audio support yet." },
  { code: "PB", name: "Punjab", centroid: { lat: 31.1471, lng: 75.3412 }, majorLanguage: "Punjabi", liveLanguage: "en-IN", fallbackReason: "Punjabi will need a later voice rollout in this prototype." },
  { code: "PY", name: "Puducherry", centroid: { lat: 11.9416, lng: 79.8083 }, majorLanguage: "Tamil", liveLanguage: "ta-IN" },
  { code: "RJ", name: "Rajasthan", centroid: { lat: 27.0238, lng: 74.2179 }, majorLanguage: "Hindi", liveLanguage: "hi-IN" },
  { code: "SK", name: "Sikkim", centroid: { lat: 27.533, lng: 88.5122 }, majorLanguage: "Nepali / English", liveLanguage: "en-IN" },
  { code: "TN", name: "Tamil Nadu", centroid: { lat: 11.1271, lng: 78.6569 }, majorLanguage: "Tamil", liveLanguage: "ta-IN" },
  { code: "TR", name: "Tripura", centroid: { lat: 23.9408, lng: 91.9882 }, majorLanguage: "Bengali", liveLanguage: "bn-BD" },
  { code: "TS", name: "Telangana", centroid: { lat: 18.1124, lng: 79.0193 }, majorLanguage: "Telugu", liveLanguage: "te-IN" },
  { code: "UK", name: "Uttarakhand", centroid: { lat: 30.0668, lng: 79.0193 }, majorLanguage: "Hindi", liveLanguage: "hi-IN" },
  { code: "UP", name: "Uttar Pradesh", centroid: { lat: 26.8467, lng: 80.9462 }, majorLanguage: "Hindi", liveLanguage: "hi-IN" },
  { code: "WB", name: "West Bengal", centroid: { lat: 22.9868, lng: 87.855 }, majorLanguage: "Bengali", liveLanguage: "bn-BD" },
];

export const DEFAULT_STATE_CODE = "MH";

export const STATE_BY_CODE = INDIA_STATE_PROFILES.reduce<
  Record<string, StateProfile>
>((accumulator, profile) => {
  accumulator[profile.code] = profile;
  return accumulator;
}, {});

export function getStateProfile(stateCode: string): StateProfile {
  return STATE_BY_CODE[stateCode] ?? STATE_BY_CODE[DEFAULT_STATE_CODE];
}
