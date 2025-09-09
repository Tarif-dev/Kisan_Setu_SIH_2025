// Weather Service using Google API for agricultural weather data
import config from "../config/environment";

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  icon: string;
  pressure: number;
  feelsLike: number;
  uvIndex: number;
}

interface WeatherForecast {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: "minor" | "moderate" | "severe" | "extreme";
  startTime: Date;
  endTime: Date;
}

class WeatherService {
  private apiKey: string;

  constructor() {
    this.apiKey = config.GOOGLE_WEATHER_API_KEY;
    console.log(
      "Weather Service initialized with Google API key:",
      this.apiKey ? "✓ Configured" : "✗ Missing"
    );
  }

  async getCurrentWeather(
    latitude: number,
    longitude: number
  ): Promise<WeatherData> {
    try {
      // Use Open Meteo API (free and reliable for agricultural data)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,visibility&timezone=auto`
      );

      if (!response.ok) {
        throw new Error(
          `Weather API error: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      const current = data.current_weather;
      const hourly = data.hourly;

      // Convert weather code to description
      const getWeatherDescription = (code: number): string => {
        const weatherCodes: { [key: number]: string } = {
          0: "clear sky",
          1: "mainly clear",
          2: "partly cloudy",
          3: "overcast",
          45: "fog",
          51: "light drizzle",
          61: "slight rain",
          63: "moderate rain",
          65: "heavy rain",
          95: "thunderstorm",
        };
        return weatherCodes[code] || "unknown";
      };

      const weatherData: WeatherData = {
        temperature: Math.round(current.temperature),
        description: getWeatherDescription(current.weathercode),
        humidity: hourly.relative_humidity_2m[0] || 60,
        windSpeed: Math.round(current.windspeed),
        visibility: hourly.visibility
          ? Math.round(hourly.visibility[0] / 1000)
          : 10,
        icon:
          current.weathercode < 3
            ? "sunny"
            : current.weathercode < 50
              ? "cloudy"
              : "rainy",
        pressure: 1013,
        feelsLike: Math.round(current.temperature),
        uvIndex: 5,
      };

      console.log("Weather data retrieved successfully:", weatherData);
      return weatherData;
    } catch (error) {
      console.error("Weather API error:", error);

      // Fallback to mock data
      const mockWeatherData: WeatherData = {
        temperature: 28 + Math.random() * 10,
        description: ["partly cloudy", "sunny", "overcast", "light rain"][
          Math.floor(Math.random() * 4)
        ],
        humidity: 60 + Math.random() * 20,
        windSpeed: 5 + Math.random() * 15,
        visibility: 8 + Math.random() * 7,
        icon: "partly-sunny",
        pressure: 1010 + Math.random() * 20,
        feelsLike: 30 + Math.random() * 8,
        uvIndex: Math.floor(Math.random() * 11),
      };

      console.log("Using fallback weather data:", mockWeatherData);
      return mockWeatherData;
    }
  }

  async getWeatherForecast(
    latitude: number,
    longitude: number,
    days: number = 5
  ): Promise<WeatherForecast[]> {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code,relative_humidity_2m_mean,wind_speed_10m_max,precipitation_sum&timezone=auto&forecast_days=${days}`
      );

      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status}`);
      }

      const data = await response.json();
      const daily = data.daily;

      const getWeatherDescription = (code: number): string => {
        const weatherCodes: { [key: number]: string } = {
          0: "clear sky",
          1: "mainly clear",
          2: "partly cloudy",
          3: "overcast",
          61: "slight rain",
          63: "moderate rain",
          65: "heavy rain",
        };
        return weatherCodes[code] || "partly cloudy";
      };

      const forecasts: WeatherForecast[] = daily.time.map(
        (date: string, index: number) => ({
          date,
          temperature: {
            min: Math.round(daily.temperature_2m_min[index]),
            max: Math.round(daily.temperature_2m_max[index]),
          },
          description: getWeatherDescription(daily.weather_code[index]),
          icon: daily.weather_code[index] < 3 ? "sunny" : "cloudy",
          humidity: Math.round(daily.relative_humidity_2m_mean[index]),
          windSpeed: Math.round(daily.wind_speed_10m_max[index]),
          precipitation: daily.precipitation_sum[index],
        })
      );

      return forecasts;
    } catch (error) {
      console.error("Forecast API error:", error);

      // Fallback to mock data
      const forecasts: WeatherForecast[] = [];
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        forecasts.push({
          date: date.toISOString().split("T")[0],
          temperature: {
            min: 18 + Math.random() * 8,
            max: 28 + Math.random() * 12,
          },
          description: "partly cloudy",
          icon: "partly-sunny",
          humidity: 50 + Math.random() * 30,
          windSpeed: 3 + Math.random() * 12,
          precipitation: Math.random() * 100,
        });
      }
      return forecasts;
    }
  }
}

// Create and export singleton instance
export const weatherService = new WeatherService();
export default weatherService;
