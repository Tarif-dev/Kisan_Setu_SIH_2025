import { voiceAssistantService } from "@/services/voiceAssistantService";
import { useVoiceAssistantStore } from "@/stores/voiceAssistantStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

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
      text: "Hello! I'm your AgriAssist voice assistant. Ask me anything about farming, crops, or agriculture. Tap the microphone to start speaking.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const {
    isListening,
    isProcessing,
    isSpeaking,
    transcript,
    response,
    error,
    language,
    isSupported,
    startListening,
    stopListening,
    setLanguage,
    clearError,
    reset,
    checkSupport,
    stopAll,
  } = useVoiceAssistantStore();

  useEffect(() => {
    // Check voice support on component mount
    checkSupport();

    // Cleanup on unmount
    return () => {
      stopAll();
    };
  }, []);

  useEffect(() => {
    // Add user message when transcript is available
    if (transcript && transcript.trim()) {
      addMessage(transcript, true);
    }
  }, [transcript]);

  useEffect(() => {
    // Add AI response when available
    if (response && response.trim()) {
      addMessage(response, false);
    }
  }, [response]);

  useEffect(() => {
    // Show error alerts
    if (error) {
      Alert.alert("Voice Assistant Error", error, [
        { text: "OK", onPress: clearError },
      ]);
    }
  }, [error]);

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: VoiceAssistantMessage = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleVoiceInput = async () => {
    if (isListening) {
      await stopListening();
    } else {
      if (!isSupported.recording) {
        Alert.alert(
          "Microphone Access Required",
          "Please allow microphone access to use voice features.",
          [{ text: "OK" }]
        );
        return;
      }
      await startListening();
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    addMessage(
      `Language changed to ${newLanguage === "en-US" ? "English" : newLanguage === "hi-IN" ? "Hindi" : "Punjabi"}`,
      false
    );
  };

  const getVoiceButtonColor = () => {
    if (isListening) return "#EF4444"; // Red when listening
    if (isProcessing || isSpeaking) return "#F59E0B"; // Orange when processing
    return "#22C55E"; // Green when ready
  };

  const getVoiceButtonIcon = () => {
    if (isListening) return "mic";
    if (isProcessing) return "hourglass";
    if (isSpeaking) return "volume-high";
    return "mic-outline";
  };

  const getStatusText = () => {
    if (isListening) return "Listening... Tap to stop";
    if (isProcessing) return "Processing your request...";
    if (isSpeaking) return "Speaking response...";
    return "Tap microphone to speak";
  };

  const handleQuickQuestion = async (question: string) => {
    // Add user message immediately
    addMessage(question, true);

    // Process the question through the voice assistant service
    try {
      const response = await voiceAssistantService.getAIResponse(question);
      addMessage(response.text, false);

      // Optionally speak the response
      if (response.text) {
        await voiceAssistantService.speakResponse(response.text);
      }
    } catch (error) {
      console.error("Error processing quick question:", error);
      addMessage(
        "Sorry, I couldn't process your question at the moment. Please try again.",
        false
      );
    }
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
              onPress={() => handleQuickQuestion(question)}
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
            onPress={handleVoiceInput}
            disabled={isProcessing}
            className={`w-20 h-20 rounded-full items-center justify-center`}
            style={{ backgroundColor: getVoiceButtonColor() }}
          >
            <Ionicons name={getVoiceButtonIcon()} size={32} color="white" />
          </TouchableOpacity>

          {isSpeaking && (
            <TouchableOpacity
              onPress={stopAll}
              className="w-16 h-16 rounded-full items-center justify-center bg-red-500"
            >
              <Ionicons name="volume-off" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>

        <Text className="text-center text-gray-400 mt-4">
          {getStatusText()}
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
