import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, TextInput, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Menu, 
  Bell, 
  Search, 
  Sun, 
  Droplets, 
  Leaf, 
  Bug, 
  TrendingUp 
} from 'lucide-react-native';
import { WeatherAPI, WeatherData } from '../../utils/weatherAPI';

export default function HomeScreen() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Load weather data on component mount
  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    setWeatherLoading(true);
    try {
      const { weather } = await WeatherAPI.fetchCompleteWeatherData();
      setWeatherData(weather);
    } catch (error) {
      console.log('Failed to load weather data:', error);
      // Fall back to default data if weather fails
    }
    setWeatherLoading(false);
  };

  const getWeatherAlert = () => {
    if (!weatherData) return 'Weather data loading...';
    
    const precipitation = weatherData.hourly.precipitation_probability[0];
    const windSpeed = weatherData.hourly.wind_speed_10m[0];
    const uvIndex = weatherData.hourly.uv_index[0];
    
    if (precipitation > 70) {
      return `High chance of rain (${precipitation}%) - Protect crops and avoid spraying.`;
    }
    if (windSpeed > 20) {
      return `Strong winds (${windSpeed.toFixed(1)} km/h) - Avoid field spraying today.`;
    }
    if (uvIndex > 7) {
      return `High UV index (${uvIndex}) - Ensure crop protection and worker safety.`;
    }
    if (weatherData.current_weather.temperature > 35) {
      return `High temperature (${weatherData.current_weather.temperature}°C) - Monitor crop stress and irrigation.`;
    }
    
    return `Weather conditions favorable for farming activities.`;
  };

  const quickAccessItems = [
    { 
      icon: Leaf, 
      title: 'Soil Health', 
      color: 'bg-emerald-500',
      description: 'Check soil conditions'
    },
    { 
      icon: Bug, 
      title: 'Pest Detection', 
      color: 'bg-orange-500',
      description: 'Identify pests & diseases'
    },
    { 
      icon: TrendingUp, 
      title: 'Market Prices', 
      color: 'bg-blue-500',
      description: 'Current market rates'
    }
  ];

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b']}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center px-6 py-4">
          <TouchableOpacity>
            <Menu size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">AgriAssist</Text>
          <TouchableOpacity>
            <Bell size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View className="px-6 mb-6">
            <View className="bg-slate-800/50 rounded-2xl px-4 py-3 flex-row items-center">
              <Search size={20} color="#64748b" />
              <TextInput
                placeholder="Search for crops, diseases..."
                placeholderTextColor="#64748b"
                className="flex-1 ml-3 text-white text-base"
              />
            </View>
          </View>

          {/* Today's Advisory */}
          <View className="px-6 mb-6">
            <Text className="text-white text-2xl font-bold mb-4">Today's Advisory</Text>
            <ImageBackground
              source={{ uri: 'https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg' }}
              className="rounded-2xl overflow-hidden"
            >
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                className="p-6 min-h-[200px] justify-end"
              >
                <Text className="text-white text-xl font-bold mb-2">Wheat Advisory</Text>
                <Text className="text-slate-300 text-base mb-3 leading-5">
                  High risk of fungal diseases due to recent rainfall. Apply fungicide within 48 hours.
                </Text>
                <TouchableOpacity className="bg-primary-500 rounded-xl py-2 px-4 self-start">
                  <Text className="text-white font-semibold">Learn More</Text>
                </TouchableOpacity>
              </LinearGradient>
            </ImageBackground>
          </View>

          {/* Weather Section */}
          <View className="px-6 mb-6">
            <Text className="text-white text-2xl font-bold mb-4">Weather</Text>
            
            {/* Current Conditions */}
            <View className="bg-slate-800/30 rounded-2xl p-6 mb-4">
              <Text className="text-slate-400 text-base mb-2">Current Conditions</Text>
              {weatherLoading ? (
                <View className="flex-row items-center justify-center py-4">
                  <ActivityIndicator size="large" color="#22c55e" />
                  <Text className="text-slate-400 ml-2">Loading weather...</Text>
                </View>
              ) : weatherData ? (
                <>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-white text-3xl font-bold">{weatherData.current_weather.temperature}°C</Text>
                    <Sun size={48} color="#fbbf24" />
                  </View>
                  <Text className="text-slate-400 text-lg">{WeatherAPI.getWeatherDescription(weatherData.current_weather.weathercode)}</Text>
                  <Text className="text-slate-300 text-sm mt-2">
                    Feels like {weatherData.hourly.apparent_temperature[0].toFixed(1)}°C • Humidity {weatherData.hourly.relative_humidity_2m[0]}%
                  </Text>
                </>
              ) : (
                <View className="flex-row items-center justify-between">
                  <Text className="text-white text-3xl font-bold">--°C</Text>
                  <Sun size={48} color="#fbbf24" />
                </View>
              )}
            </View>

            {/* Weather Alert */}
            <View className="bg-blue-900/30 border border-blue-700 rounded-2xl p-6">
              <View className="flex-row items-center mb-2">
                <Droplets size={20} color="#3b82f6" />
                <Text className="text-blue-400 text-base font-semibold ml-2">Weather Alert</Text>
              </View>
              <Text className="text-slate-300 text-base leading-5">
                {getWeatherAlert()}
              </Text>
            </View>
          </View>

          {/* Quick Access */}
          <View className="px-6 mb-8">
            <Text className="text-white text-2xl font-bold mb-4">Quick Access</Text>
            <View className="flex-row flex-wrap justify-between">
              {quickAccessItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-slate-800/30 rounded-2xl p-6 mb-4 w-[48%] items-center"
                >
                  <View className={`w-16 h-16 rounded-2xl ${item.color} items-center justify-center mb-3`}>
                    <item.icon size={28} color="#ffffff" />
                  </View>
                  <Text className="text-white text-base font-semibold text-center mb-1">
                    {item.title}
                  </Text>
                  <Text className="text-slate-400 text-sm text-center">
                    {item.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}