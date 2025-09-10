import { useLocationStore } from "@/stores/locationStore";
import { useWeatherStore } from "@/stores/weatherStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
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
      <View className="pt-12 pb-6 px-4 bg-gray-900">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">AgriAssist</Text>
          <TouchableOpacity
            onPress={() => Alert.alert("Notifications", "No new notifications")}
          >
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="bg-gray-800 rounded-xl flex-row items-center px-4 py-3">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <Text className="text-gray-400 ml-3 flex-1">
            Search for crops, diseases...
          </Text>
        </View>
      </View>

      {/* Today's Advisory */}
      <View className="mx-4 mb-6">
        <Text className="text-xl font-bold text-white mb-4">
          Today's Advisory
        </Text>
        <View className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
          {/* Advisory Image */}
          <View className="h-40 bg-gradient-to-r from-yellow-600 to-orange-600 relative">
            <View className="absolute inset-0 bg-black/20" />
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=200&fit=crop",
              }}
              className="w-full h-full"
              style={{ opacity: 0.7 }}
            />
          </View>

          <View className="p-4">
            <Text className="text-lg font-bold text-white mb-2">
              Wheat Advisory
            </Text>
            <Text className="text-gray-300 text-sm mb-3 leading-5">
              High risk of fungal diseases due to recent rainfall. Apply
              fungicide within 48 hours.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/advisory" as any)}
              className="bg-transparent border border-gray-600 rounded-lg py-2 px-4 self-start"
            >
              <Text className="text-gray-300 font-medium">Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Weather */}
      <View className="mx-4 mb-6">
        <Text className="text-xl font-bold text-white mb-4">Weather</Text>

        {/* Current Conditions */}
        <View className="bg-gray-800 rounded-2xl p-4 border border-gray-700 mb-4">
          <Text className="text-gray-400 text-sm mb-2">Current Conditions</Text>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-bold text-white">
                {weather ? Math.round(weather.temperature) : 28}°C
              </Text>
              <Text className="text-gray-400 capitalize">
                {weather ? weather.description : "Partly Cloudy"}
              </Text>
            </View>
            <Ionicons name="partly-sunny" size={48} color="#F59E0B" />
          </View>
        </View>

        {/* Weather Alert */}
        <View className="bg-blue-900/30 border border-blue-700/50 rounded-2xl p-4">
          <View className="flex-row items-center">
            <Ionicons name="water" size={20} color="#60A5FA" />
            <View className="ml-3 flex-1">
              <Text className="text-blue-400 font-medium">Weather Alert</Text>
              <Text className="text-gray-300 text-sm mt-1">
                Heavy rainfall expected tomorrow. Prepare for waterlogging.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Access */}
      <View className="mx-4 mb-8">
        <Text className="text-xl font-bold text-white mb-4">Quick Access</Text>
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
    </ScrollView>
  );
};

export default Home;
