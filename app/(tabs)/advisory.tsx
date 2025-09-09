import { useLocationStore } from "@/stores/locationStore";
import { useWeatherStore } from "@/stores/weatherStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Advisory {
  id: string;
  title: string;
  type: "warning" | "info" | "success";
  description: string;
  icon: string;
  priority: "high" | "medium" | "low";
  actionItems: string[];
}

const Advisory = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { weather, fetchWeather } = useWeatherStore();
  const { location, getCurrentLocation } = useLocationStore();

  const [advisories] = useState<Advisory[]>([
    {
      id: "1",
      title: "Wheat Disease Warning",
      type: "warning",
      description:
        "High risk of fungal diseases due to recent rainfall and humid conditions.",
      icon: "warning",
      priority: "high",
      actionItems: [
        "Apply fungicide within 48 hours",
        "Inspect crops daily for early symptoms",
        "Ensure proper field drainage",
        "Remove infected plant debris",
      ],
    },
    {
      id: "2",
      title: "Optimal Irrigation Time",
      type: "info",
      description:
        "Current soil moisture levels suggest irrigation is needed for better crop yield.",
      icon: "water",
      priority: "medium",
      actionItems: [
        "Irrigate during early morning hours",
        "Check soil moisture at 6-inch depth",
        "Apply 2-3 inches of water per session",
        "Monitor weather forecast before irrigation",
      ],
    },
    {
      id: "3",
      title: "Harvest Recommendation",
      type: "success",
      description:
        "Rice crops in your area are ready for harvest based on maturity indicators.",
      icon: "checkmark-circle",
      priority: "high",
      actionItems: [
        "Begin harvest within next 5-7 days",
        "Check grain moisture content",
        "Prepare storage facilities",
        "Arrange transportation for harvested crops",
      ],
    },
    {
      id: "4",
      title: "Fertilizer Application",
      type: "info",
      description:
        "Second dose of fertilizer application is due for corn crops.",
      icon: "leaf",
      priority: "medium",
      actionItems: [
        "Apply NPK fertilizer in 4:2:1 ratio",
        "Water thoroughly after application",
        "Apply during cooler parts of the day",
        "Monitor crop response after 7 days",
      ],
    },
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchWeather(), getCurrentLocation()]);
    setRefreshing(false);
  };

  const getAdvisoryColor = (type: Advisory["type"]) => {
    switch (type) {
      case "warning":
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          text: "text-red-400",
        };
      case "info":
        return {
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
          text: "text-blue-400",
        };
      case "success":
        return {
          bg: "bg-green-500/10",
          border: "border-green-500/20",
          text: "text-green-400",
        };
    }
  };

  const getPriorityColor = (priority: Advisory["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
    }
  };

  const AdvisoryCard = ({ advisory }: { advisory: Advisory }) => {
    const colors = getAdvisoryColor(advisory.type);
    const [expanded, setExpanded] = useState(false);

    return (
      <View
        className={`${colors.bg} ${colors.border} border rounded-2xl p-4 mb-4`}
      >
        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          className="flex-row items-start"
        >
          <View className="mr-3 mt-1">
            <Ionicons
              name={advisory.icon as any}
              size={20}
              color={
                advisory.type === "warning"
                  ? "#EF4444"
                  : advisory.type === "info"
                    ? "#3B82F6"
                    : "#22C55E"
              }
            />
          </View>

          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-2">
              <Text className={`font-semibold text-lg ${colors.text}`}>
                {advisory.title}
              </Text>
              <Text
                className={`text-xs font-medium ${getPriorityColor(advisory.priority)}`}
              >
                {advisory.priority.toUpperCase()}
              </Text>
            </View>

            <Text className="text-gray-300 text-sm leading-5 mb-3">
              {advisory.description}
            </Text>

            {expanded && (
              <View className="mt-2">
                <Text className="text-gray-400 font-medium mb-2">
                  Action Items:
                </Text>
                {advisory.actionItems.map((item, index) => (
                  <View key={index} className="flex-row items-start mb-1">
                    <Text className="text-gray-400 mr-2">•</Text>
                    <Text className="text-gray-300 text-sm flex-1">{item}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={16}
            color="#9CA3AF"
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="pt-12 pb-6 px-4 bg-gray-800">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-white">Advisory</Text>
            <Text className="text-gray-400 mt-1">
              Personalized farming recommendations
            </Text>
          </View>
          <TouchableOpacity onPress={onRefresh}>
            <Ionicons name="refresh" size={24} color="#22C55E" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Location & Weather Summary */}
        <View className="bg-gray-800 rounded-2xl p-4 mb-6 border border-gray-700">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white font-semibold text-lg">
              Current Conditions
            </Text>
            <Ionicons name="location" size={16} color="#22C55E" />
          </View>

          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-gray-400 text-sm">Location</Text>
              <Text className="text-white font-medium">
                {location?.city || "Current Location"}
              </Text>
            </View>

            <View className="items-center">
              <Text className="text-gray-400 text-sm">Temperature</Text>
              <Text className="text-white font-medium">
                {weather?.temperature || "--"}°C
              </Text>
            </View>

            <View className="items-end">
              <Text className="text-gray-400 text-sm">Humidity</Text>
              <Text className="text-white font-medium">
                {weather?.humidity || "--"}%
              </Text>
            </View>
          </View>
        </View>

        {/* Priority Summary */}
        <View className="flex-row justify-between mb-6">
          <View className="flex-1 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mr-2">
            <Text className="text-red-400 font-semibold text-center">
              {advisories.filter((a) => a.priority === "high").length}
            </Text>
            <Text className="text-red-400 text-xs text-center mt-1">
              High Priority
            </Text>
          </View>

          <View className="flex-1 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mx-1">
            <Text className="text-yellow-400 font-semibold text-center">
              {advisories.filter((a) => a.priority === "medium").length}
            </Text>
            <Text className="text-yellow-400 text-xs text-center mt-1">
              Medium Priority
            </Text>
          </View>

          <View className="flex-1 bg-green-500/10 border border-green-500/20 rounded-xl p-3 ml-2">
            <Text className="text-green-400 font-semibold text-center">
              {advisories.filter((a) => a.priority === "low").length}
            </Text>
            <Text className="text-green-400 text-xs text-center mt-1">
              Low Priority
            </Text>
          </View>
        </View>

        {/* Advisory List */}
        <View className="mb-8">
          <Text className="text-white font-semibold text-lg mb-4">
            Today's Recommendations
          </Text>

          {advisories
            .sort((a, b) => {
              const priorityOrder = { high: 0, medium: 1, low: 2 };
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            })
            .map((advisory) => (
              <AdvisoryCard key={advisory.id} advisory={advisory} />
            ))}
        </View>

        {/* Weather Alert */}
        <View className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-8">
          <View className="flex-row items-center mb-3">
            <Ionicons name="cloud-outline" size={20} color="#3B82F6" />
            <Text className="text-blue-400 font-semibold ml-2">
              Weather Alert
            </Text>
          </View>

          <Text className="text-gray-300 text-sm leading-5">
            Heavy rainfall expected tomorrow. Prepare for potential waterlogging
            in low-lying areas. Postpone any planned fertilizer application
            until after the rain.
          </Text>
        </View>

        {/* Tips */}
        <View className="bg-gray-800 rounded-2xl p-4 mb-8 border border-gray-700">
          <View className="flex-row items-center mb-3">
            <Ionicons name="bulb" size={20} color="#22C55E" />
            <Text className="text-white font-semibold ml-2">Farming Tip</Text>
          </View>

          <Text className="text-gray-300 text-sm leading-5">
            Regularly monitor your crops for early signs of pest and disease
            problems. Early detection and treatment can prevent major crop
            losses and reduce treatment costs.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Advisory;
