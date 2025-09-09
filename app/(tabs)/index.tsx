import { useLocationStore } from "@/stores/locationStore";
import { useWeatherStore } from "@/stores/weatherStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const {
    weather,
    isLoading: weatherLoading,
    fetchWeather,
  } = useWeatherStore();
  const { location, getCurrentLocation } = useLocationStore();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      await getCurrentLocation();
      await fetchWeather();
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to load data. Please check your connection."
      );
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const quickAccessItems = [
    {
      title: "Soil Health",
      icon: "leaf",
      description: "Test your soil",
      route: "/soil-health",
      color: "#22C55E",
    },
    {
      title: "Pest Detection",
      icon: "camera",
      description: "Scan crop diseases",
      route: "/pest-detection",
      color: "#EF4444",
    },
    {
      title: "Market Prices",
      icon: "trending-up",
      description: "Check crop prices",
      route: "/(tabs)/market",
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
      <View className="pt-12 pb-6 px-4 bg-gray-800">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-white">AgriAssist</Text>
            <Text className="text-gray-400">Welcome back, Farmer</Text>
          </View>
          <TouchableOpacity
            onPress={() => Alert.alert("Notifications", "No new notifications")}
            className="p-2"
          >
            <Ionicons name="notifications" size={24} color="#22C55E" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Today's Advisory */}
      <View className="mx-4 mb-6 -mt-3">
        <View className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <View className="flex-row items-center mb-4">
            <Ionicons name="sunny" size={20} color="#22C55E" />
            <Text className="text-lg font-semibold text-white ml-2">
              Today's Advisory
            </Text>
          </View>

          <View className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-4">
            <View className="flex-row items-start">
              <Ionicons name="warning" size={16} color="#EAB308" />
              <View className="flex-1 ml-2">
                <Text className="text-yellow-400 font-medium">
                  Wheat Advisory
                </Text>
                <Text className="text-gray-300 text-sm mt-1">
                  High risk of fungal diseases due to recent rainfall. Apply
                  fungicide within 48 hours.
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/advisory" as any)}
            className="bg-green-500 rounded-xl py-3 px-4"
          >
            <Text className="text-white font-semibold text-center">
              View Full Advisory
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Weather */}
      <View className="mx-4 mb-6">
        <View className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-white">Weather</Text>
            <TouchableOpacity onPress={fetchWeather}>
              <Ionicons name="refresh" size={20} color="#22C55E" />
            </TouchableOpacity>
          </View>

          {weatherLoading ? (
            <Text className="text-gray-400">Loading weather...</Text>
          ) : weather ? (
            <View>
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-3xl font-bold text-white">
                    {Math.round(weather.temperature)}°C
                  </Text>
                  <Text className="text-gray-400 capitalize">
                    {weather.description}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {location?.city || "Current Location"}
                  </Text>
                </View>
                <Ionicons name="partly-sunny" size={48} color="#FFA500" />
              </View>

              <View className="flex-row justify-between mt-4 pt-4 border-t border-gray-700">
                <View className="items-center">
                  <Ionicons name="water" size={16} color="#60A5FA" />
                  <Text className="text-gray-400 text-xs mt-1">Humidity</Text>
                  <Text className="text-white font-medium">
                    {weather.humidity}%
                  </Text>
                </View>
                <View className="items-center">
                  <Ionicons name="speedometer" size={16} color="#60A5FA" />
                  <Text className="text-gray-400 text-xs mt-1">Wind</Text>
                  <Text className="text-white font-medium">
                    {weather.windSpeed} km/h
                  </Text>
                </View>
                <View className="items-center">
                  <Ionicons name="eye" size={16} color="#60A5FA" />
                  <Text className="text-gray-400 text-xs mt-1">Visibility</Text>
                  <Text className="text-white font-medium">
                    {weather.visibility} km
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <Text className="text-gray-400">Unable to load weather data</Text>
          )}
        </View>
      </View>

      {/* Quick Access */}
      <View className="mx-4 mb-8">
        <Text className="text-lg font-semibold text-white mb-4">
          Quick Access
        </Text>
        <View className="flex-row flex-wrap justify-between">
          {quickAccessItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(item.route as any)}
              className="w-[48%] bg-gray-800 rounded-2xl p-4 mb-4 border border-gray-700"
            >
              <View className="items-center">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mb-3"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={item.color}
                  />
                </View>
                <Text className="text-white font-medium text-center mb-1">
                  {item.title}
                </Text>
                <Text className="text-gray-400 text-xs text-center">
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
