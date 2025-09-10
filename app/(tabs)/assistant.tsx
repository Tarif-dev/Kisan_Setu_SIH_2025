import { voiceAssistantService } from "@/services/voiceAssistantService";
import { useVoiceAssistantStore } from "@/stores/voiceAssistantStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

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
      <View className="pt-12 pb-4 px-4 bg-gray-900">
        <View className="flex-row items-center">
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white ml-4">
            Voice Assistant
          </Text>
        </View>
      </View>

      {/* Chat Area */}
      <View className="flex-1 px-4">
        {/* Assistant Message */}
        <View className="items-start mb-4">
          <View className="flex-row items-start">
            <View className="w-8 h-8 bg-green-500 rounded-full items-center justify-center mr-3">
              <Ionicons name="person" size={16} color="white" />
            </View>
            <View className="bg-gray-800 rounded-2xl rounded-tl-sm p-4 max-w-[80%] border border-gray-700">
              <Text className="text-white text-base leading-6">
                To provide the best advice, could you please share your current
                location?
              </Text>
            </View>
          </View>
        </View>

        {/* Location Info */}
        <View className="items-center mb-6">
          <Text className="text-gray-400 text-sm">
            Location: Lagos, Nigeria
          </Text>
        </View>

        {/* Voice Visualization */}
        {isListening && (
          <View className="items-center mb-6">
            <View className="flex-row items-center justify-center space-x-1">
              {[...Array(11)].map((_, i) => (
                <View
                  key={i}
                  className="bg-green-500 rounded-full"
                  style={{
                    width: 4,
                    height: Math.random() * 40 + 10,
                    opacity: 0.7 + Math.random() * 0.3,
                  }}
                />
              ))}
            </View>
          </View>
        )}

        {/* User Message */}
        {transcript && (
          <View className="items-center mb-6">
            <View className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
              <Text className="text-white text-center">
                "
                {transcript ||
                  "What are the best practices for managing pests in my area?"}
                "
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Voice Button */}
      <View className="items-center pb-8">
        <TouchableOpacity
          onPress={handleVoiceInput}
          disabled={isProcessing}
          className="w-20 h-20 rounded-full items-center justify-center mb-4"
          style={{ backgroundColor: getVoiceButtonColor() }}
        >
          <Ionicons name={getVoiceButtonIcon()} size={32} color="white" />
        </TouchableOpacity>

        <Text className="text-gray-400 text-center">Tap to speak</Text>
      </View>
    </View>
  );
};

export default Assistant;
