// Environment configuration utility
export const config = {
  // API Keys
  GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY || "",
  GOOGLE_WEATHER_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_WEATHER_API_KEY || "",

  // App Configuration
  APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || "AgriAssist",
  APP_VERSION: process.env.EXPO_PUBLIC_APP_VERSION || "1.0.0",
  ENVIRONMENT: process.env.EXPO_PUBLIC_ENVIRONMENT || "development",

  // Feature Toggles
  ENABLE_VOICE_ASSISTANT:
    process.env.EXPO_PUBLIC_ENABLE_VOICE_ASSISTANT === "true",
  ENABLE_PUSH_NOTIFICATIONS:
    process.env.EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === "true",
  ENABLE_OFFLINE_MODE: process.env.EXPO_PUBLIC_ENABLE_OFFLINE_MODE === "true",

  // API URLs
  GEMINI_API_URL:
    process.env.EXPO_PUBLIC_GEMINI_API_URL ||
    "https://generativelanguage.googleapis.com/v1beta",
  GOOGLE_WEATHER_API_URL: "https://maps.googleapis.com/maps/api",

  // Validation
  isConfigured: (): boolean => {
    return !!(config.GEMINI_API_KEY && config.GOOGLE_WEATHER_API_KEY);
  },

  getAPIStatus: () => {
    return {
      gemini: !!config.GEMINI_API_KEY,
      weather: !!config.GOOGLE_WEATHER_API_KEY,
    };
  },
};

export default config;
