import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { speechToTextService } from "../../services/speechToTextService";

export default function APISetupScreen() {
  const [apiKey, setApiKey] = useState("");
  const [isConfigured, setIsConfigured] = useState(
    speechToTextService.isRealAPIConfigured()
  );

  const testAPIConnection = async () => {
    try {
      await speechToTextService.testService();
      Alert.alert("Success", "Speech-to-Text service is configured correctly!");
    } catch (error) {
      Alert.alert(
        "Error",
        `API test failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="bg-white rounded-lg p-6 shadow-sm">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          🔑 Voice Assistant Setup
        </Text>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-600 mb-2">
            API Status:
          </Text>
          <View
            className={`p-3 rounded-lg ${isConfigured ? "bg-green-100" : "bg-orange-100"}`}
          >
            <Text
              className={`font-medium ${isConfigured ? "text-green-800" : "text-orange-800"}`}
            >
              {isConfigured
                ? "✅ Real Speech-to-Text Enabled"
                : "⚠️ Using Mock Implementation"}
            </Text>
            <Text
              className={`text-sm mt-1 ${isConfigured ? "text-green-600" : "text-orange-600"}`}
            >
              {isConfigured
                ? "Your voice assistant will transcribe real speech"
                : "Add Google Speech API key for real transcription"}
            </Text>
          </View>
        </View>

        {!isConfigured && (
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-600 mb-2">
              Google Speech API Key:
            </Text>
            <TextInput
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="AIza... (paste your Google Cloud API key)"
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              secureTextEntry
              multiline={false}
            />
            <Text className="text-xs text-gray-500 mt-1">
              Get your API key from Google Cloud Console → Speech-to-Text API
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={testAPIConnection}
          className="bg-blue-500 rounded-lg py-3 px-6 mb-4"
        >
          <Text className="text-white font-medium text-center">
            Test API Connection
          </Text>
        </TouchableOpacity>

        <View className="border-t border-gray-200 pt-4">
          <Text className="text-sm font-medium text-gray-800 mb-2">
            🎯 Current Functionality:
          </Text>
          <View className="space-y-2">
            <Text className="text-sm text-gray-600">
              ✅ Voice recording (real)
            </Text>
            <Text className="text-sm text-gray-600">
              ✅ Text-to-Speech (real)
            </Text>
            <Text className="text-sm text-gray-600">
              ✅ Gemini AI responses (real)
            </Text>
            <Text className="text-sm text-gray-600">
              ✅ Location context (real)
            </Text>
            <Text className="text-sm text-gray-600">
              ✅ Language detection (real)
            </Text>
            <Text
              className={`text-sm ${isConfigured ? "text-green-600" : "text-orange-600"}`}
            >
              {isConfigured ? "✅" : "⚠️"} Speech-to-Text{" "}
              {isConfigured ? "(real)" : "(mock)"}
            </Text>
          </View>
        </View>

        <View className="bg-blue-50 p-4 rounded-lg mt-4">
          <Text className="text-sm font-medium text-blue-800 mb-1">
            💡 How to get Google Speech API Key:
          </Text>
          <Text className="text-xs text-blue-600">
            1. Go to Google Cloud Console{"\n"}
            2. Create/select project{"\n"}
            3. Enable "Cloud Speech-to-Text API"{"\n"}
            4. Create API key in Credentials{"\n"}
            5. Add to .env: EXPO_PUBLIC_GOOGLE_SPEECH_API_KEY=your_key
          </Text>
        </View>
      </View>
    </View>
  );
}
