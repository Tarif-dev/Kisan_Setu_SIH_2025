import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLanguage } from "../../contexts/LanguageContext";

const Settings = () => {
  const {
    t,
    currentLanguage,
    supportedLanguages,
    setLanguage,
    languageDetails,
  } = useLanguage();
  const [settings, setSettings] = useState({
    notifications: true,
    voiceSupport: false,
    locationSharing: true,
  });
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await setLanguage(languageCode);
      setShowLanguageModal(false);
    } catch (error) {
      Alert.alert(t("common.error"), "Failed to change language");
    }
  };

  const LanguageModal = () => (
    <Modal
      visible={showLanguageModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowLanguageModal(false)}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-gray-800 rounded-t-3xl p-6">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-white">
              {t("settings.languageSelection.title")}
            </Text>
            <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <Text className="text-gray-400 mb-4">
            {t("settings.languageSelection.subtitle")}
          </Text>

          {Object.entries(supportedLanguages).map(([code, lang]) => (
            <TouchableOpacity
              key={code}
              className={`flex-row items-center p-4 rounded-xl mb-2 ${
                currentLanguage === code
                  ? "bg-green-500/20 border border-green-500"
                  : "bg-gray-700"
              }`}
              onPress={() => handleLanguageChange(code)}
            >
              <View className="flex-1">
                <Text className="text-white font-medium text-lg">
                  {lang.nativeName}
                </Text>
                <Text className="text-gray-400 text-sm">{lang.name}</Text>
              </View>
              {currentLanguage === code && (
                <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="pt-12 pb-4 px-4 bg-gray-900">
        <View className="flex-row items-center">
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white ml-4">
            {t("settings.title")}
          </Text>
        </View>
      </View>

      {/* Preferences Section */}
      <View className="mx-4 mb-6">
        <Text className="text-xl font-bold text-white mb-4">
          {t("settings.profile")}
        </Text>

        <View className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
          <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-700">
            <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-4">
              <Ionicons name="location" size={20} color="#22C55E" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-medium text-base">
                {t("onboarding.location")}
              </Text>
              <Text className="text-gray-400 text-sm">
                {t("settings.currentLocation")}
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
                {t("settings.notifications")}
              </Text>
              <Text className="text-gray-400 text-sm">
                {settings.notifications ? t("common.yes") : t("common.no")}
              </Text>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={(value) => updateSetting("notifications", value)}
              trackColor={{ false: "#374151", true: "#22C55E" }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity
            className="flex-row items-center p-4"
            onPress={() => setShowLanguageModal(true)}
          >
            <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-4">
              <Ionicons name="language" size={20} color="#22C55E" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-medium text-base">
                {t("settings.language")}
              </Text>
              <Text className="text-gray-400 text-sm">
                {t("settings.languageSelection.current")}
                {languageDetails.nativeName}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Accessibility Section */}
      <View className="mx-4 mb-6">
        <Text className="text-xl font-bold text-white mb-4">
          {t("settings.accessibility")}
        </Text>

        <View className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-4">
                <Ionicons name="mic" size={20} color="#22C55E" />
              </View>
              <Text className="text-white font-medium text-base">
                {t("settings.voiceSupport")}
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
        <Text className="text-xl font-bold text-white mb-4">
          {t("settings.feedback")}
        </Text>

        <View className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
          <TouchableOpacity
            className="flex-row items-center p-4 border-b border-gray-700"
            onPress={() =>
              Alert.alert(t("settings.reportIssue"), "Contact support")
            }
          >
            <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-4">
              <Ionicons name="bug" size={20} color="#22C55E" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-medium text-base">
                {t("settings.reportIssue")}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center p-4"
            onPress={() =>
              Alert.alert(t("settings.feedback"), "Send us your feedback")
            }
          >
            <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-4">
              <Ionicons name="chatbubble" size={20} color="#22C55E" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-medium text-base">
                {t("settings.provideFeedback")}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      <LanguageModal />
    </ScrollView>
  );
};

export default Settings;
