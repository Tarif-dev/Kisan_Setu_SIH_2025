import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SettingsItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  type: "navigation" | "toggle" | "action";
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    voiceSupport: false,
    locationSharing: true,
    autoUpdate: true,
  });

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const settingsItems: SettingsItem[] = [
    {
      id: "location",
      title: "Location",
      subtitle: "Current location: Farmville",
      icon: "location",
      type: "navigation",
      onPress: () => Alert.alert("Location", "Location settings"),
    },
    {
      id: "notifications",
      title: "Notifications",
      subtitle: "Weather alerts and reminders",
      icon: "notifications",
      type: "toggle",
      value: settings.notifications,
      onToggle: (value) => updateSetting("notifications", value),
    },
    {
      id: "language",
      title: "Language",
      subtitle: "English",
      icon: "language",
      type: "navigation",
      onPress: () => Alert.alert("Language", "Language selection"),
    },
    {
      id: "voiceSupport",
      title: "Voice Support",
      subtitle: "Enable voice commands",
      icon: "mic",
      type: "toggle",
      value: settings.voiceSupport,
      onToggle: (value) => updateSetting("voiceSupport", value),
    },
    {
      id: "autoUpdate",
      title: "Auto Update",
      subtitle: "Automatically update market prices",
      icon: "refresh",
      type: "toggle",
      value: settings.autoUpdate,
      onToggle: (value) => updateSetting("autoUpdate", value),
    },
  ];

  const feedbackItems: SettingsItem[] = [
    {
      id: "report",
      title: "Report an Issue",
      icon: "bug",
      type: "navigation",
      onPress: () => Alert.alert("Report Issue", "Contact support"),
    },
    {
      id: "feedback",
      title: "Provide Feedback",
      icon: "chatbubble",
      type: "navigation",
      onPress: () => Alert.alert("Feedback", "Send us your feedback"),
    },
    {
      id: "about",
      title: "About AgriAssist",
      icon: "information-circle",
      type: "navigation",
      onPress: () =>
        Alert.alert("About", "AgriAssist v1.0.0\nYour farming companion"),
    },
  ];

  const SettingsSection = ({
    title,
    items,
  }: {
    title: string;
    items: SettingsItem[];
  }) => (
    <View className="mb-8">
      <Text className="text-lg font-semibold text-white mb-4 px-4">
        {title}
      </Text>
      <View className="bg-gray-800 rounded-2xl mx-4 border border-gray-700">
        {items.map((item, index) => (
          <View key={item.id}>
            <TouchableOpacity
              onPress={item.onPress}
              disabled={item.type === "toggle"}
              className="flex-row items-center p-4"
            >
              <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-4">
                <Ionicons name={item.icon as any} size={20} color="#22C55E" />
              </View>

              <View className="flex-1">
                <Text className="text-white font-medium text-lg">
                  {item.title}
                </Text>
                {item.subtitle && (
                  <Text className="text-gray-400 text-sm mt-1">
                    {item.subtitle}
                  </Text>
                )}
              </View>

              {item.type === "toggle" ? (
                <Switch
                  value={item.value}
                  onValueChange={item.onToggle}
                  trackColor={{ false: "#374151", true: "#22C55E" }}
                  thumbColor={item.value ? "#ffffff" : "#9CA3AF"}
                />
              ) : (
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              )}
            </TouchableOpacity>
            {index < items.length - 1 && (
              <View className="h-px bg-gray-700 ml-14" />
            )}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="pt-12 pb-6 px-4 bg-gray-800">
        <Text className="text-2xl font-bold text-white">Settings</Text>
        <Text className="text-gray-400 mt-1">
          Customize your AgriAssist experience
        </Text>
      </View>

      <ScrollView className="flex-1 py-6">
        {/* Preferences */}
        <SettingsSection title="Preferences" items={settingsItems} />

        {/* Accessibility */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-white mb-4 px-4">
            Accessibility
          </Text>
          <View className="bg-gray-800 rounded-2xl mx-4 border border-gray-700">
            <TouchableOpacity className="flex-row items-center p-4">
              <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-4">
                <Ionicons name="accessibility" size={20} color="#22C55E" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-medium text-lg">
                  Voice Support
                </Text>
                <Text className="text-gray-400 text-sm mt-1">
                  Enable voice commands and text-to-speech
                </Text>
              </View>
              <Switch
                value={settings.voiceSupport}
                onValueChange={(value) => updateSetting("voiceSupport", value)}
                trackColor={{ false: "#374151", true: "#22C55E" }}
                thumbColor={settings.voiceSupport ? "#ffffff" : "#9CA3AF"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Feedback */}
        <SettingsSection title="Feedback" items={feedbackItems} />

        {/* App Info */}
        <View className="mx-4 mb-8">
          <View className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <View className="items-center">
              <View className="w-16 h-16 bg-green-500/20 rounded-full items-center justify-center mb-4">
                <Ionicons name="leaf" size={32} color="#22C55E" />
              </View>
              <Text className="text-white font-bold text-xl mb-2">
                AgriAssist
              </Text>
              <Text className="text-gray-400 text-center mb-4">
                Your intelligent farming companion for better crop management,
                weather insights, and agricultural guidance.
              </Text>
              <Text className="text-gray-500 text-sm">Version 1.0.0</Text>
            </View>
          </View>
        </View>

        {/* Support */}
        <View className="mx-4 mb-8">
          <TouchableOpacity
            onPress={() => Alert.alert("Support", "Contact our support team")}
            className="bg-green-500 rounded-2xl p-4"
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="help-circle" size={20} color="white" />
              <Text className="text-white font-semibold text-lg ml-2">
                Get Help & Support
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;
