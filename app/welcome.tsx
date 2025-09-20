import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { setAppLanguage } from "../config/i18n";

const WelcomeScreen = () => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>('en');

  const languages = [
    { label: "English", value: "en" },
    { label: "हिंदी", value: "hi" }
  ];

  const handleLanguageSelect = (value: 'en' | 'hi') => {
    setSelectedLanguage(value);
    setAppLanguage(value);
  };

  const handleContinue = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-1 justify-center items-center px-8">
        {/* Success Icon */}
        <View className="w-24 h-24 bg-green-500 rounded-full items-center justify-center mb-8">
          <Ionicons name="checkmark" size={48} color="white" />
        </View>

        {/* Welcome Text */}
        <Text className="text-white text-3xl font-bold text-center mb-4">
          {t('welcome.title')}
        </Text>
        <Text className="text-white text-3xl font-bold text-center mb-8">
          {t('welcome.description')}
        </Text>

        {/* Subtitle */}
        <Text className="text-gray-400 text-lg text-center mb-12 leading-6">
          {t('settings.selectLanguage')}
        </Text>

        {/* Language Selection */}
        <View className="w-full mb-8 space-y-2">
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.value}
              onPress={() => handleLanguageSelect(lang.value as 'en' | 'hi')}
              className={`bg-gray-800 border ${
                selectedLanguage === lang.value ? 'border-green-500' : 'border-gray-600'
              } rounded-2xl p-4 flex-row items-center justify-between`}
            >
              <Text className="text-white text-lg">{lang.label}</Text>
              {selectedLanguage === lang.value && (
                <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          className="w-full bg-green-500 rounded-2xl py-4 px-6"
        >
          <Text className="text-white font-semibold text-xl text-center">
            {t('onboarding.startButton')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
