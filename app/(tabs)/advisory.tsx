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
import { useLanguage } from "../../contexts/LanguageContext";

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
  const { t } = useLanguage();
  const [refreshing, setRefreshing] = useState(false);
  const { weather, fetchWeather } = useWeatherStore();
  const { location, getCurrentLocation } = useLocationStore();

  const [advisories] = useState<Advisory[]>([
    {
      id: "1",
      title: t("advisory.advisoryCards.wheatDisease.title"),
      type: "warning",
      description: t("advisory.advisoryCards.wheatDisease.description"),
      icon: "warning",
      priority: "high",
      actionItems: t(
        "advisory.advisoryCards.wheatDisease.actionItems"
      ) as unknown as string[],
    },
    {
      id: "2",
      title: t("advisory.advisoryCards.irrigation.title"),
      type: "info",
      description: t("advisory.advisoryCards.irrigation.description"),
      icon: "water",
      priority: "medium",
      actionItems: t(
        "advisory.advisoryCards.irrigation.actionItems"
      ) as unknown as string[],
    },
    {
      id: "3",
      title: t("advisory.advisoryCards.harvest.title"),
      type: "success",
      description: t("advisory.advisoryCards.harvest.description"),
      icon: "checkmark-circle",
      priority: "high",
      actionItems: t(
        "advisory.advisoryCards.harvest.actionItems"
      ) as unknown as string[],
    },
    {
      id: "4",
      title: t("advisory.advisoryCards.fertilizer.title"),
      type: "info",
      description: t("advisory.advisoryCards.fertilizer.description"),
      icon: "leaf",
      priority: "medium",
      actionItems: t(
        "advisory.advisoryCards.fertilizer.actionItems"
      ) as unknown as string[],
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
                  {t("advisory.actionItems")}:
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
            <Text className="text-2xl font-bold text-white">
              {t("advisory.title")}
            </Text>
            <Text className="text-gray-400 mt-1">{t("advisory.subtitle")}</Text>
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
              {t("advisory.currentConditions")}
            </Text>
            <Ionicons name="location" size={16} color="#22C55E" />
          </View>

          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-gray-400 text-sm">
                {t("advisory.location")}
              </Text>
              <Text className="text-white font-medium">
                {location?.city || t("advisory.currentLocation")}
              </Text>
            </View>

            <View className="items-center">
              <Text className="text-gray-400 text-sm">
                {t("weather.temperature")}
              </Text>
              <Text className="text-white font-medium">
                {weather?.temperature || "--"}°C
              </Text>
            </View>

            <View className="items-end">
              <Text className="text-gray-400 text-sm">
                {t("weather.humidity")}
              </Text>
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
              {t("advisory.highPriority")}
            </Text>
          </View>

          <View className="flex-1 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mx-1">
            <Text className="text-yellow-400 font-semibold text-center">
              {advisories.filter((a) => a.priority === "medium").length}
            </Text>
            <Text className="text-yellow-400 text-xs text-center mt-1">
              {t("advisory.mediumPriority")}
            </Text>
          </View>

          <View className="flex-1 bg-green-500/10 border border-green-500/20 rounded-xl p-3 ml-2">
            <Text className="text-green-400 font-semibold text-center">
              {advisories.filter((a) => a.priority === "low").length}
            </Text>
            <Text className="text-green-400 text-xs text-center mt-1">
              {t("advisory.lowPriority")}
            </Text>
          </View>
        </View>

        {/* Advisory List */}
        <View className="mb-8">
          <Text className="text-white font-semibold text-lg mb-4">
            {t("advisory.todaysRecommendations")}
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
              {t("advisory.weatherAlert")}
            </Text>
          </View>

          <Text className="text-gray-300 text-sm leading-5">
            {t("advisory.weatherAlertDescription")}
          </Text>
        </View>

        {/* Tips */}
        <View className="bg-gray-800 rounded-2xl p-4 mb-8 border border-gray-700">
          <View className="flex-row items-center mb-3">
            <Ionicons name="bulb" size={20} color="#22C55E" />
            <Text className="text-white font-semibold ml-2">
              {t("advisory.farmingTip")}
            </Text>
          </View>

          <Text className="text-gray-300 text-sm leading-5">
            {t("advisory.farmingTipDescription")}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Advisory;
