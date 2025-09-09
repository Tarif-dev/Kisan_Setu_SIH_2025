import axios from 'axios';
import * as Location from 'expo-location';

export type Weather = {
  temperature: number;
  windspeed: number;
  weathercode: number;
  winddirection: number;
  time: string;
};

export type WeatherData = {
  current_weather: Weather;
  hourly: {
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation: number[];
    visibility: number[];
    uv_index: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    pressure_msl: number[];
    soil_temperature_0cm: number[];
    soil_temperature_6cm: number[];
    soil_temperature_18cm: number[];
    soil_moisture_0_1cm: number[];
    soil_moisture_1_3cm: number[];
    soil_moisture_3_9cm: number[];
    dewpoint_2m: number[];
    apparent_temperature: number[];
    precipitation_probability: number[];
    cloud_cover: number[];
    evapotranspiration: number[];
    vapour_pressure_deficit: number[];
    surface_pressure: number[];
    time: string[];
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    precipitation_sum: number[];
    precipitation_hours: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    wind_gusts_10m_max: number[];
    wind_direction_10m_dominant: number[];
    daylight_duration: number[];
    sunshine_duration: number[];
    uv_index_max: number[];
    et0_fao_evapotranspiration: number[];
    time: string[];
  };
};

export class WeatherAPI {
  /**
   * Request location permissions from the user
   */
  static async requestLocationPermission(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  /**
   * Get the user's current location
   */
  static async getCurrentLocation(): Promise<Location.LocationObject> {
    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
  }

  /**
   * Fetch comprehensive agricultural weather data
   */
  static async getWeatherData(latitude: number, longitude: number, forecastDays: number = 14): Promise<WeatherData> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,precipitation,visibility,uv_index,wind_speed_10m,wind_direction_10m,pressure_msl,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_moisture_0_1cm,soil_moisture_1_3cm,soil_moisture_3_9cm,dewpoint_2m,apparent_temperature,precipitation_probability,cloud_cover,evapotranspiration,vapour_pressure_deficit,surface_pressure&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,daylight_duration,sunshine_duration,uv_index_max,et0_fao_evapotranspiration&timezone=auto&forecast_days=${forecastDays}`;
    
    const response = await axios.get(url);
    return response.data as WeatherData;
  }

  /**
   * Get current weather only (lightweight)
   */
  static async getCurrentWeather(latitude: number, longitude: number): Promise<Weather> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const response = await axios.get(url);
    return response.data.current_weather as Weather;
  }

  /**
   * Get weather description from weather code
   */
  static getWeatherDescription(code: number): string {
    const codes: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };
    return codes[code] || `Weather code: ${code}`;
  }

  /**
   * Get soil moisture level description
   */
  static getSoilMoistureLevel(moisture: number): string {
    if (moisture < 0.1) return 'Very Dry';
    if (moisture < 0.2) return 'Dry';
    if (moisture < 0.3) return 'Moderate';
    if (moisture < 0.4) return 'Moist';
    return 'Very Moist';
  }

  /**
   * Get UV Index risk level
   */
  static getUVRiskLevel(uvIndex: number): string {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Moderate';
    if (uvIndex <= 7) return 'High';
    if (uvIndex <= 10) return 'Very High';
    return 'Extreme';
  }

  /**
   * Get wind condition for agricultural activities
   */
  static getWindCondition(windSpeed: number): string {
    if (windSpeed < 5) return 'Calm - Ideal for spraying';
    if (windSpeed < 10) return 'Light - Good for field work';
    if (windSpeed < 20) return 'Moderate - Caution for spraying';
    if (windSpeed < 30) return 'Strong - Avoid spraying';
    return 'Very Strong - Avoid field work';
  }

  /**
   * Get precipitation risk level
   */
  static getPrecipitationRisk(probability: number): string {
    if (probability < 20) return 'Low';
    if (probability < 50) return 'Moderate';
    if (probability < 70) return 'High';
    return 'Very High';
  }

  /**
   * Complete weather fetch with location
   */
  static async fetchCompleteWeatherData(): Promise<{
    location: Location.LocationObject;
    weather: WeatherData;
  }> {
    // Request permission
    const hasPermission = await this.requestLocationPermission();
    if (!hasPermission) {
      throw new Error('Location permission denied');
    }

    // Get location
    const location = await this.getCurrentLocation();
    
    // Fetch weather data
    const weather = await this.getWeatherData(
      location.coords.latitude,
      location.coords.longitude
    );

    return { location, weather };
  }
}
