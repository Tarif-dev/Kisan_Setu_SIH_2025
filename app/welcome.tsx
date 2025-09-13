import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

const WelcomeScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const languages = [
    { label: "English", value: "en" },
    { label: "हिंदी", value: "hi" },
    { label: "ਪੰਜਾਬੀ", value: "pa" },
  ];

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
          Welcome to
        </Text>
        <Text className="text-white text-3xl font-bold text-center mb-8">
          Kisan Setu
        </Text>

        {/* Subtitle */}
        <Text className="text-gray-400 text-lg text-center mb-12 leading-6">
          Select your preferred language to get started.
        </Text>

        {/* Language Selection */}
        <View className="w-full mb-8">
          <TouchableOpacity className="bg-gray-800 border border-gray-600 rounded-2xl p-4 flex-row items-center justify-between">
            <Text className="text-white text-lg">{selectedLanguage}</Text>
            <Ionicons name="chevron-down" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          className="w-full bg-green-500 rounded-2xl py-4 px-6"
        >
          <Text className="text-white font-semibold text-xl text-center">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
