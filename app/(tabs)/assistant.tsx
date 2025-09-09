import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface VoiceAssistantMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Assistant = () => {
  const [messages, setMessages] = useState<VoiceAssistantMessage[]>([
    {
      id: "1",
      text: "Hello! I'm your AgriAssist voice assistant. Ask me anything about farming, crops, or agriculture.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const startListening = () => {
    setIsListening(true);

    // Simulate speech recognition
    setTimeout(() => {
      const userMessage =
        "What are the best practices for managing pests in my area?";
      addMessage(userMessage, true);
      setIsListening(false);

      // Generate AI response
      setTimeout(() => {
        generateResponse(userMessage);
      }, 1000);
    }, 3000);
  };

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: VoiceAssistantMessage = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const generateResponse = async (userQuery: string) => {
    // Mock AI responses based on common farming queries
    const responses = {
      pest: "For pest management in your area, I recommend: 1) Regular field inspection every 2-3 days, 2) Use neem-based organic pesticides, 3) Install yellow sticky traps, 4) Maintain crop rotation, 5) Remove infected plants immediately. Apply treatments during early morning or evening for best results.",
      weather:
        "Based on current weather conditions, there's a 70% chance of rain tomorrow. I recommend covering young plants and ensuring proper drainage. Heavy rainfall is expected, so prepare for potential waterlogging.",
      fertilizer:
        "For healthy crop growth, apply balanced NPK fertilizer in a 4:2:1 ratio. Use organic compost to improve soil structure. Apply fertilizers in split doses - 50% during sowing and 50% during flowering stage.",
      default:
        "I understand your concern. As an agricultural assistant, I recommend consulting with local agricultural experts for specific guidance. You can also visit your nearest Krishi Vigyan Kendra for detailed advice.",
    };

    let response = responses.default;
    if (userQuery.toLowerCase().includes("pest")) response = responses.pest;
    else if (userQuery.toLowerCase().includes("weather"))
      response = responses.weather;
    else if (userQuery.toLowerCase().includes("fertilizer"))
      response = responses.fertilizer;

    addMessage(response, false);

    // Speak the response
    speakText(response);
  };

  const speakText = async (text: string) => {
    try {
      setIsSpeaking(true);
      await Speech.speak(text, {
        language: "en",
        pitch: 1.0,
        rate: 0.8,
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.error("Speech error:", error);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  const quickQuestions = [
    "What fertilizer should I use for wheat?",
    "How to prevent crop diseases?",
    "When should I harvest my crops?",
    "Best irrigation practices?",
  ];

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="pt-12 pb-6 px-4 bg-gray-800">
        <Text className="text-2xl font-bold text-white">Voice Assistant</Text>
        <Text className="text-gray-400 mt-1">
          Ask questions about farming and get instant advice
        </Text>
      </View>

      {/* Messages */}
      <ScrollView className="flex-1 px-4 py-4">
        {messages.map((message) => (
          <View
            key={message.id}
            className={`mb-4 ${message.isUser ? "items-end" : "items-start"}`}
          >
            <View
              className={`max-w-[80%] rounded-2xl p-4 ${
                message.isUser
                  ? "bg-green-500"
                  : "bg-gray-700 border border-gray-600"
              }`}
            >
              <Text className="text-white text-base leading-6">
                {message.text}
              </Text>
              <Text className="text-gray-300 text-xs mt-2">
                {message.timestamp.toLocaleTimeString()}
              </Text>
            </View>
          </View>
        ))}

        {isListening && (
          <View className="items-center mb-4">
            <View className="bg-gray-700 rounded-2xl p-4 border border-green-500">
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse" />
                <Text className="text-white">Listening...</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Questions */}
      <View className="px-4 py-2">
        <Text className="text-white font-medium mb-3">Quick Questions:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quickQuestions.map((question, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                addMessage(question, true);
                setTimeout(() => generateResponse(question), 500);
              }}
              className="bg-gray-700 rounded-full px-4 py-2 mr-3 border border-gray-600"
            >
              <Text className="text-gray-300 text-sm">{question}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Voice Controls */}
      <View className="px-4 pb-8 pt-4">
        <View className="flex-row justify-center items-center space-x-4">
          <TouchableOpacity
            onPress={startListening}
            disabled={isListening || isSpeaking}
            className={`w-20 h-20 rounded-full items-center justify-center ${
              isListening ? "bg-red-500" : "bg-green-500"
            }`}
          >
            <Ionicons
              name={isListening ? "stop" : "mic"}
              size={32}
              color="white"
            />
          </TouchableOpacity>

          {isSpeaking && (
            <TouchableOpacity
              onPress={stopSpeaking}
              className="w-16 h-16 rounded-full items-center justify-center bg-red-500"
            >
              <Ionicons name="volume-off" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>

        <Text className="text-center text-gray-400 mt-4">
          {isListening
            ? "Listening... Tap to stop"
            : isSpeaking
              ? "Speaking... Tap to stop"
              : "Tap to speak"}
        </Text>
      </View>

      {/* Language Selection */}
      <View className="px-4 pb-4">
        <View className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <Text className="text-white font-medium mb-3">Language:</Text>
          <View className="flex-row justify-between">
            {["English", "हिंदी", "ਪੰਜਾਬੀ"].map((lang, index) => (
              <TouchableOpacity
                key={index}
                className={`flex-1 py-2 px-3 rounded-lg mx-1 ${
                  index === 0 ? "bg-green-500" : "bg-gray-700"
                }`}
              >
                <Text className="text-white text-center font-medium">
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Assistant;
