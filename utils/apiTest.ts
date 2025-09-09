// API Integration Test Utility
import config from "../config/environment";
import { geminiService } from "../services/geminiService";
import { weatherService } from "../services/weatherService";

export class APITestUtility {
  static async testAPIs() {
    const results = {
      config: config.getAPIStatus(),
      weather: { success: false, error: null as string | null },
      gemini: { success: false, error: null as string | null },
    };

    // Test Weather API
    try {
      console.log("Testing Weather API...");
      const weatherData = await weatherService.getCurrentWeather(
        28.6139,
        77.209
      );
      results.weather.success = true;
      console.log("Weather API: SUCCESS", weatherData);
    } catch (error) {
      results.weather.error =
        error instanceof Error ? error.message : "Unknown error";
      console.log("Weather API: FAILED", error);
    }

    // Test Gemini API
    try {
      console.log("Testing Gemini API...");
      const response = await geminiService.generateTextResponse(
        "What is the best fertilizer for wheat?"
      );
      results.gemini.success = true;
      console.log("Gemini API: SUCCESS", response);
    } catch (error) {
      results.gemini.error =
        error instanceof Error ? error.message : "Unknown error";
      console.log("Gemini API: FAILED", error);
    }

    return results;
  }

  static logAPIConfiguration() {
    console.log("=== API Configuration ===");
    console.log(
      "Gemini API Key:",
      config.GEMINI_API_KEY ? "✓ Configured" : "✗ Missing"
    );
    console.log(
      "Google Weather API Key:",
      config.GOOGLE_WEATHER_API_KEY ? "✓ Configured" : "✗ Missing"
    );
    console.log("Environment:", config.ENVIRONMENT);
    console.log("App Name:", config.APP_NAME);
    console.log("========================");
  }
}

export default APITestUtility;
