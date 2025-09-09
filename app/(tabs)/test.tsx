
import { View, Text, Button, ActivityIndicator, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { useState } from 'react';
import { WeatherAPI, WeatherData as APIWeatherData } from '../../utils/weatherAPI';

export default function TestScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [weatherData, setWeatherData] = useState<APIWeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getWeather = async () => {
    setLoading(true);
    setError('');
    try {
      const { location: userLocation, weather } = await WeatherAPI.fetchCompleteWeatherData();
      setLocation(userLocation);
      setWeatherData(weather);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to get weather data.';
      setError(errorMessage);
    }
    setLoading(false);
  };

  return (
    <ScrollView className="flex-1 bg-slate-900">
      <View className="items-center justify-center px-4 py-8">
        <Text className="text-white text-2xl font-bold mb-6">Agricultural Weather Dashboard</Text>
        <Button title="Get My Weather" onPress={getWeather} color="#22c55e" />
        {loading && <ActivityIndicator size="large" color="#22c55e" className="mt-4" />}
        {error ? <Text className="text-red-400 mt-4 text-center">{error}</Text> : null}
        
        {weatherData && (
          <View className="mt-8 w-full">
            {/* Current Weather */}
            <View className="bg-slate-800 rounded-lg p-4 mb-4">
              <Text className="text-white text-xl font-bold mb-3">🌤️ Current Weather</Text>
              <Text className="text-white text-lg">🌡️ {weatherData.current_weather.temperature}°C (Feels like {weatherData.hourly.apparent_temperature[0].toFixed(1)}°C)</Text>
              <Text className="text-white text-base">🌤️ {WeatherAPI.getWeatherDescription(weatherData.current_weather.weathercode)}</Text>
              <Text className="text-white text-base">💨 Wind: {weatherData.current_weather.windspeed} km/h, Direction: {weatherData.current_weather.winddirection}°</Text>
              <Text className="text-white text-base">☁️ Cloud Cover: {weatherData.hourly.cloud_cover[0]}%</Text>
              <Text className="text-white text-sm text-gray-300 mt-2">📅 {new Date(weatherData.current_weather.time).toLocaleString()}</Text>
            </View>

            {/* Agricultural Conditions */}
            <View className="bg-green-800 rounded-lg p-4 mb-4">
              <Text className="text-white text-xl font-bold mb-3">🌱 Agricultural Conditions</Text>
              <Text className="text-white text-base">💧 Humidity: {weatherData.hourly.relative_humidity_2m[0]}%</Text>
              <Text className="text-white text-base">💧 Dew Point: {weatherData.hourly.dewpoint_2m[0].toFixed(1)}°C</Text>
              <Text className="text-white text-base">🌿 Evapotranspiration: {weatherData.hourly.evapotranspiration[0].toFixed(2)}mm</Text>
              <Text className="text-white text-base">📊 Pressure: {weatherData.hourly.pressure_msl[0].toFixed(1)} hPa</Text>
              <Text className="text-white text-base">💨 Vapor Pressure Deficit: {weatherData.hourly.vapour_pressure_deficit[0].toFixed(2)} kPa</Text>
              <Text className="text-white text-base">☀️ UV Index: {weatherData.hourly.uv_index[0]} ({WeatherAPI.getUVRiskLevel(weatherData.hourly.uv_index[0])})</Text>
            </View>

            {/* Soil Conditions */}
            <View className="bg-amber-800 rounded-lg p-4 mb-4">
              <Text className="text-white text-xl font-bold mb-3">🌍 Soil Conditions</Text>
              <Text className="text-white text-base">🌡️ Surface Temp: {weatherData.hourly.soil_temperature_0cm[0].toFixed(1)}°C</Text>
              <Text className="text-white text-base">🌡️ 6cm Deep: {weatherData.hourly.soil_temperature_6cm[0].toFixed(1)}°C</Text>
              <Text className="text-white text-base">🌡️ 18cm Deep: {weatherData.hourly.soil_temperature_18cm[0].toFixed(1)}°C</Text>
              <Text className="text-white text-base">💧 Surface: {weatherData.hourly.soil_moisture_0_1cm[0].toFixed(2)} m³/m³ ({WeatherAPI.getSoilMoistureLevel(weatherData.hourly.soil_moisture_0_1cm[0])})</Text>
              <Text className="text-white text-base">💧 1-3cm: {weatherData.hourly.soil_moisture_1_3cm[0].toFixed(2)} m³/m³ ({WeatherAPI.getSoilMoistureLevel(weatherData.hourly.soil_moisture_1_3cm[0])})</Text>
              <Text className="text-white text-base">💧 3-9cm: {weatherData.hourly.soil_moisture_3_9cm[0].toFixed(2)} m³/m³ ({WeatherAPI.getSoilMoistureLevel(weatherData.hourly.soil_moisture_3_9cm[0])})</Text>
            </View>

            {/* Precipitation & Wind */}
            <View className="bg-blue-800 rounded-lg p-4 mb-4">
              <Text className="text-white text-xl font-bold mb-3">🌧️ Precipitation & Wind</Text>
              <Text className="text-white text-base">🌧️ Current Rain: {weatherData.hourly.precipitation[0]}mm</Text>
              <Text className="text-white text-base">� Rain Probability: {weatherData.hourly.precipitation_probability[0]}%</Text>
              <Text className="text-white text-base">💨 Wind Speed: {weatherData.hourly.wind_speed_10m[0].toFixed(1)} km/h</Text>
              <Text className="text-white text-base">🧭 Wind Direction: {weatherData.hourly.wind_direction_10m[0]}°</Text>
              <Text className="text-white text-base">👁️ Visibility: {(weatherData.hourly.visibility[0] / 1000).toFixed(1)} km</Text>
            </View>

            {/* Today's Summary */}
            <View className="bg-slate-800 rounded-lg p-4 mb-4">
              <Text className="text-white text-xl font-bold mb-3">📊 Today's Summary</Text>
              <Text className="text-white text-base">🌅 Sunrise: {new Date(weatherData.daily.sunrise[0]).toLocaleTimeString()}</Text>
              <Text className="text-white text-base">🌇 Sunset: {new Date(weatherData.daily.sunset[0]).toLocaleTimeString()}</Text>
              <Text className="text-white text-base">☀️ Daylight: {(weatherData.daily.daylight_duration[0] / 3600).toFixed(1)} hours</Text>
              <Text className="text-white text-base">🌞 Sunshine: {(weatherData.daily.sunshine_duration[0] / 3600).toFixed(1)} hours</Text>
              <Text className="text-white text-base">🔥 Max: {weatherData.daily.temperature_2m_max[0]}°C | ❄️ Min: {weatherData.daily.temperature_2m_min[0]}°C</Text>
              <Text className="text-white text-base">🌧️ Total Rain: {weatherData.daily.precipitation_sum[0]}mm ({weatherData.daily.precipitation_hours[0]}h)</Text>
              <Text className="text-white text-base">💨 Max Wind: {weatherData.daily.wind_speed_10m_max[0]} km/h</Text>
              <Text className="text-white text-base">💥 Wind Gusts: {weatherData.daily.wind_gusts_10m_max[0]} km/h</Text>
              <Text className="text-white text-base">☀️ Max UV: {weatherData.daily.uv_index_max[0]}</Text>
              <Text className="text-white text-base">� ET₀: {weatherData.daily.et0_fao_evapotranspiration[0].toFixed(2)}mm</Text>
            </View>

            {/* 14-Day Forecast */}
            <View className="bg-purple-800 rounded-lg p-4 mb-4">
              <Text className="text-white text-xl font-bold mb-3">📅 14-Day Forecast</Text>
              {weatherData.daily.time.slice(0, 7).map((date, index) => (
                <View key={index} className="flex-row justify-between items-center py-1 border-b border-gray-600">
                  <Text className="text-white text-sm flex-1">{new Date(date).toLocaleDateString('en', {weekday: 'short', month: 'short', day: 'numeric'})}</Text>
                  <Text className="text-white text-sm">{weatherData.daily.temperature_2m_max[index]}°/{weatherData.daily.temperature_2m_min[index]}°</Text>
                  <Text className="text-blue-300 text-sm">{weatherData.daily.precipitation_sum[index]}mm</Text>
                  <Text className="text-green-300 text-sm">{weatherData.daily.precipitation_probability_max[index]}%</Text>
                </View>
              ))}
            </View>

            {/* Location Info */}
            {location && (
              <View className="bg-slate-800 rounded-lg p-4">
                <Text className="text-white text-xl font-bold mb-3">📍 Location</Text>
                <Text className="text-white text-base">Lat: {location.coords.latitude.toFixed(4)}, Lon: {location.coords.longitude.toFixed(4)}</Text>
                <Text className="text-white text-base">� Accuracy: ±{location.coords.accuracy?.toFixed(0)}m</Text>
                <Text className="text-white text-base">⛰️ Altitude: {location.coords.altitude?.toFixed(0) || 'N/A'}m</Text>
                <Text className="text-white text-base">🕐 Speed: {location.coords.speed?.toFixed(1) || '0'} m/s</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
