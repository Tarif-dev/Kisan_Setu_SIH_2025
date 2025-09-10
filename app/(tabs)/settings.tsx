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

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    voiceSupport: false,
    locationSharing: true,
  });

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ScrollView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="pt-12 pb-4 px-4 bg-gray-900">
        <View className="flex-row items-center">
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white ml-4">Settings</Text>
        </View>
      </View>

      {/* Preferences Section */}
      <View className="mx-4 mb-6">
        <Text className="text-xl font-bold text-white mb-4">Preferences</Text>

        <View className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
          <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-700">
            <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-4">
              <Ionicons name="location" size={20} color="#22C55E" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-medium text-base">Location</Text>
              <Text className="text-gray-400 text-sm">
                Current location: Farmville
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <View className="flex-row items-center p-4 border-b border-gray-700">
            <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-4">
              <Ionicons name="notifications" size={20} color="#22C55E" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-medium text-base">
                Notifications
              </Text>
              <Text className="text-gray-400 text-sm">On</Text>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={(value) => updateSetting("notifications", value)}
              trackColor={{ false: "#374151", true: "#22C55E" }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity className="flex-row items-center p-4">
            <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-4">
              <Ionicons name="language" size={20} color="#22C55E" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-medium text-base">Language</Text>
              <Text className="text-gray-400 text-sm">English</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Accessibility Section */}
      <View className="mx-4 mb-6">
        <Text className="text-xl font-bold text-white mb-4">Accessibility</Text>

        <View className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-4">
                <Ionicons name="mic" size={20} color="#22C55E" />
              </View>
              <Text className="text-white font-medium text-base">
                Voice Support
              </Text>
            </View>
            <Switch
              value={settings.voiceSupport}
              onValueChange={(value) => updateSetting("voiceSupport", value)}
              trackColor={{ false: "#374151", true: "#22C55E" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </View>

      {/* Feedback Section */}
      <View className="mx-4 mb-8">
        <Text className="text-xl font-bold text-white mb-4">Feedback</Text>

        <View className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
          <TouchableOpacity
            className="flex-row items-center p-4 border-b border-gray-700"
            onPress={() => Alert.alert("Report Issue", "Contact support")}
          >
            <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-4">
              <Ionicons name="bug" size={20} color="#22C55E" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-medium text-base">
                Report an Issue
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center p-4"
            onPress={() => Alert.alert("Feedback", "Send us your feedback")}
          >
            <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-4">
              <Ionicons name="chatbubble" size={20} color="#22C55E" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-medium text-base">
                Provide Feedback
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Settings;
