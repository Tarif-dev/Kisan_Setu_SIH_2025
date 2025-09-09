import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { weatherService } from "../services/weatherService";

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  icon: string;
}

interface WeatherStore {
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  fetchWeather: () => Promise<void>;
  clearWeather: () => void;
}

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  weather: null,
  isLoading: false,
  error: null,

  fetchWeather: async () => {
    set({ isLoading: true, error: null });

    try {
      // Get current location - for now using default coordinates (New Delhi)
      const latitude = 28.6139;
      const longitude = 77.209;

      // Use actual weather service
      const weatherData = await weatherService.getCurrentWeather(
        latitude,
        longitude
      );

      set({ weather: weatherData, isLoading: false });

      // Cache weather data
      await AsyncStorage.setItem(
        "weather_data",
        JSON.stringify({
          data: weatherData,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("Failed to fetch weather:", error);

      // Try to load cached data
      try {
        const cachedData = await AsyncStorage.getItem("weather_data");
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          // Use cached data if it's less than 1 hour old
          if (Date.now() - timestamp < 3600000) {
            set({ weather: data, isLoading: false });
            return;
          }
        }
      } catch (cacheError) {
        console.error("Cache error:", cacheError);
      }

      // Fallback to mock data
      set({
        weather: {
          temperature: 28,
          description: "Partly cloudy",
          humidity: 65,
          windSpeed: 12,
          visibility: 10,
          icon: "partly-sunny",
        },
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch weather",
      });
    }
  },

  clearWeather: () => {
    set({ weather: null, error: null });
  },
}));
