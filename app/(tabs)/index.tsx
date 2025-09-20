import { useLocationStore } from "@/stores/locationStore";
import { useWeatherStore } from "@/stores/weatherStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const Home = () => {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const {
    weather,
    fetchWeather,
  } = useWeatherStore();
  const { location, getCurrentLocation } = useLocationStore();

  const loadInitialData = React.useCallback(async () => {
    try {
      await getCurrentLocation();
      await fetchWeather();
    } catch {
      Alert.alert(
        t('common.error'),
        t('common.errorMessage')
      );
    }
  }, [getCurrentLocation, fetchWeather, t]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const quickAccessItems = [
    {
      title: t('soilHealth.title'),
      icon: "leaf",
      description: t('soilHealth.analyzeButton'),
      route: "/soil-health",
      color: "#22C55E",
    },
    {
      title: t('pestDetection.title'),
      icon: "camera",
      description: t('pestDetection.uploadImage'),
      route: "/pest-detection",
      color: "#EF4444",
    },
    {
      title: t('marketPrices.title'),
      icon: "trending-up",
      description: t('marketPrices.searchPlaceholder'),
      route: "/market-prices",
      color: "#3B82F6",
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-gray-900"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View className="pt-12 pb-6 px-4 bg-gray-900">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">{t('welcome.title')}</Text>
          <TouchableOpacity
            onPress={() => Alert.alert(t('common.notifications'), t('common.noNotifications'))}
          >
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Location Display */}
        <View className="flex-row items-center mb-4">
          <Ionicons name="location" size={16} color="#9CA3AF" />
          <Text className="text-gray-400 ml-2 text-sm">
            {location
              ? `${location.city || ""}, ${location.region || location.country || ""}`
              : t('common.fetchingLocation')}
          </Text>
        </View>

        {/* Search Bar */}
        <View className="bg-gray-800 rounded-xl flex-row items-center px-4 py-3">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <Text className="text-gray-400 ml-3 flex-1">
            {t('common.searchPlaceholder')}
          </Text>
        </View>
      </View>

      {/* Quick Access */}
      <View className="mx-4 mb-6">
        <Text className="text-xl font-bold text-white mb-4">{t('common.quickAccess')}</Text>
        <View className="flex-row justify-between">
          {quickAccessItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(item.route as any)}
              className="bg-gray-800 rounded-2xl p-4 border border-gray-700 items-center flex-1 mx-1"
            >
              <View
                className="w-12 h-12 rounded-xl items-center justify-center mb-3"
                style={{ backgroundColor: item.color }}
              >
                <Ionicons name={item.icon as any} size={24} color="white" />
              </View>
              <Text className="text-white font-medium text-center text-xs">
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Comprehensive Weather */}
      <View className="mx-4 mb-6">
        <Text className="text-xl font-bold text-white mb-4">{t('common.weather')}</Text>

        {/* Current Conditions - Enhanced */}
        <View className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-4">
          <Text className="text-gray-400 text-sm mb-4">{t('weather.currentConditions')}</Text>

          {/* Main Temperature and Description */}
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-4xl font-bold text-white mb-1">
                {weather ? Math.round(weather.temperature) : 28}°C
              </Text>
              <Text className="text-gray-400 capitalize text-base">
                {weather ? weather.description : t('weather.partlyCloudy')}
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                {t('weather.feelsLike')}{" "}
                {weather
                  ? Math.round(weather.feelsLike || weather.temperature)
                  : 30}
                °C
              </Text>
            </View>
            <Ionicons name="partly-sunny" size={64} color="#F59E0B" />
          </View>

          {/* Weather Details Grid */}
          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <Ionicons name="water" size={20} color="#60A5FA" />
              <Text className="text-gray-400 text-xs mt-1">{t('weather.humidity')}</Text>
              <Text className="text-white font-semibold">
                {weather ? weather.humidity : 65}%
              </Text>
            </View>
            <View className="items-center flex-1">
              <Ionicons name="eye" size={20} color="#34D399" />
              <Text className="text-gray-400 text-xs mt-1">{t('weather.visibility')}</Text>
              <Text className="text-white font-semibold">
                {weather ? weather.visibility : 10} km
              </Text>
            </View>
            <View className="items-center flex-1">
              <Ionicons name="speedometer" size={20} color="#A78BFA" />
              <Text className="text-gray-400 text-xs mt-1">{t('weather.wind')}</Text>
              <Text className="text-white font-semibold">
                {weather ? weather.windSpeed : 8} km/h
              </Text>
            </View>
            <View className="items-center flex-1">
              <Ionicons name="thermometer" size={20} color="#F87171" />
              <Text className="text-gray-400 text-xs mt-1">{t('weather.pressure')}</Text>
              <Text className="text-white font-semibold">
                {weather ? Math.round(weather.pressure || 1013) : 1013} mb
              </Text>
            </View>
          </View>
        </View>

        {/* Weather Alert */}
        <View className="bg-blue-900/30 border border-blue-700/50 rounded-2xl p-4 mb-4">
          <View className="flex-row items-center">
            <Ionicons name="water" size={20} color="#60A5FA" />
            <View className="ml-3 flex-1">
              <Text className="text-blue-400 font-medium">{t('weather.alert')}</Text>
              <Text className="text-gray-300 text-sm mt-1">
                {t('weather.alertMessage')}
              </Text>
            </View>
          </View>
        </View>

        {/* 7-Day Forecast */}
        <View className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
          <Text className="text-white font-semibold mb-4">{t('weather.forecast')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              {
                day: "Today",
                temp: "28°",
                icon: "partly-sunny",
                desc: "Partly Cloudy",
              },
              {
                day: "Tomorrow",
                temp: "26°",
                icon: "rainy",
                desc: "Heavy Rain",
              },
              { day: "Wed", temp: "24°", icon: "cloudy", desc: "Cloudy" },
              { day: "Thu", temp: "27°", icon: "sunny", desc: "Sunny" },
              {
                day: "Fri",
                temp: "29°",
                icon: "partly-sunny",
                desc: "Partly Cloudy",
              },
              { day: "Sat", temp: "25°", icon: "rainy", desc: "Light Rain" },
              { day: "Sun", temp: "28°", icon: "sunny", desc: "Sunny" },
            ].map((forecast, index) => (
              <View
                key={index}
                className="items-center mr-4 bg-gray-700 rounded-xl p-3 min-w-[80px]"
              >
                <Text className="text-gray-400 text-xs mb-2">
                  {forecast.day}
                </Text>
                <Ionicons
                  name={forecast.icon as any}
                  size={28}
                  color="#F59E0B"
                />
                <Text className="text-white font-semibold mt-2">
                  {forecast.temp}
                </Text>
                <Text className="text-gray-400 text-xs mt-1 text-center">
                  {forecast.desc}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
