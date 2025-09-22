import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { geminiService } from "../../services/geminiService";
import { languageDetectionService } from "../../services/languageDetectionService";
import {
  LanguageOption,
  Message,
  testService,
} from "../../services/testService";
import { textToSpeechService } from "../../services/textToSpeechService";
import { voiceInputService } from "../../services/voiceInputService";
import { useLocationStore } from "../../stores/locationStore";

export default function VoiceAssistantScreen() {
  const [userInput, setUserInput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "hi" | "pa">(
    "en"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [languageOptions] = useState<LanguageOption[]>(
    testService.getLanguageOptions()
  );
  const [messageCounter, setMessageCounter] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [speechMode, setSpeechMode] = useState<"text" | "voice">("text");

  // Get location context
  const { getCurrentLocation, location } = useLocationStore();

  // Welcome messages for each language
  const welcomeMessages = useMemo(
    () => ({
      en: "Hello! I'm your Kisan Setu agricultural assistant. You can either type your farming questions or tap the microphone to speak. I'll provide helpful advice with speech output. Ask me about crops, pests, fertilizers, or farming techniques.",
      hi: "नमस्ते! मैं आपका कृषि सहायक हूं। आप कृषि प्रश्न टाइप कर सकते हैं या माइक्रोफोन दबाकर बोल सकते हैं। मैं आवाज़ के साथ उपयोगी सलाह दूंगा। फसल, कीट, उर्वरक या खेती की तकनीक के बारे में पूछें।",
      pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਖੇਤੀ ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਖੇਤੀ ਦੇ ਸਵਾਲ ਟਾਈਪ ਕਰ ਸਕਦੇ ਹੋ ਜਾਂ ਮਾਈਕ ਦਬਾ ਕੇ ਬੋਲ ਸਕਦੇ ਹੋ। ਮੈਂ ਆਵਾਜ਼ ਨਾਲ ਲਾਭਦਾਇਕ ਸਲਾਹ ਦਿਆਂਗਾ। ਫਸਲਾਂ, ਕੀੜੇ, ਖਾਦ ਜਾਂ ਖੇਤੀ ਦੀਆਂ ਤਕਨੀਕਾਂ ਬਾਰੇ ਪੁੱਛੋ।",
    }),
    []
  );

  useEffect(() => {
    // Check speech and recording status periodically
    const checkStatus = async () => {
      const speaking = textToSpeechService.isSpeechActive();
      const recording = voiceInputService.getIsRecording();

      setIsSpeaking(speaking);
      setIsListening(recording);
    };

    const interval = setInterval(checkStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const addWelcomeMessage = useCallback(() => {
    const welcomeText = welcomeMessages[selectedLanguage];
    setMessageCounter((prev) => prev + 1);
    setMessages([
      {
        id: `welcome-${selectedLanguage}-${Date.now()}`,
        text: welcomeText,
        isUser: false,
        timestamp: new Date(),
        language: selectedLanguage,
      },
    ]);
  }, [selectedLanguage, welcomeMessages]);

  useEffect(() => {
    // Add welcome message when language changes
    addWelcomeMessage();
    return () => {
      testService.stopAll();
    };
  }, [addWelcomeMessage]);

  const addMessage = (text: string, isUser: boolean) => {
    setMessageCounter((prev) => {
      const newId = prev + 1;
      const newMessage: Message = {
        id: `${isUser ? "user" : "ai"}-${newId}-${Date.now()}`,
        text,
        isUser,
        timestamp: new Date(),
        language: selectedLanguage,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      return newId;
    });
  };

  const handleTextSubmit = async () => {
    if (!userInput.trim()) {
      Alert.alert("Error", "Please enter some text to process");
      return;
    }

    await processUserInput(userInput.trim(), "text");
    setUserInput("");
  };

  const processUserInput = async (
    inputText: string,
    inputMode: "text" | "voice"
  ) => {
    addMessage(inputText, true);
    setIsProcessing(true);

    try {
      // Auto-detect language if input is not in selected language
      const detectedLang = languageDetectionService.quickDetect(inputText);
      let responseLanguage = selectedLanguage;

      // If detected language is different and has confidence, switch to detected language
      if (detectedLang !== selectedLanguage && detectedLang !== "en") {
        const detection = languageDetectionService.detectLanguage(inputText);
        if (detection.confidence > 0.4) {
          responseLanguage = detectedLang as "en" | "hi" | "pa";
          // Update UI language if auto-detected language is supported
          if (["en", "hi", "pa"].includes(detectedLang)) {
            setSelectedLanguage(detectedLang as "en" | "hi" | "pa");
          }
        }
      }

      // Get current location context
      const locationContext = location
        ? {
            latitude: location.latitude,
            longitude: location.longitude,
            region: location.region,
            country: location.country,
          }
        : undefined;

      // Get AI response with location context
      const response = await geminiService.getAssistantResponse(
        inputText,
        responseLanguage,
        locationContext
      );

      // Add AI response to messages
      addMessage(response.text, false);

      // Speak the response
      if (speechMode === "voice" || inputMode === "voice") {
        await textToSpeechService.speak(response.text, responseLanguage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to process input";
      Alert.alert("Error", errorMessage);
      addMessage("Sorry, I encountered an error. Please try again.", false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      // Stop recording and process
      try {
        setIsRecording(false);
        setIsProcessing(true);

        const result = await voiceInputService.stopRecording();

        if (result.success && result.transcript) {
          await processUserInput(result.transcript, "voice");
        } else {
          Alert.alert("Error", result.error || "Failed to process voice input");
        }
      } catch (error) {
        Alert.alert(
          "Error",
          error instanceof Error
            ? error.message
            : "Failed to process voice input"
        );
      } finally {
        setIsProcessing(false);
        setIsRecording(false);
      }
    } else {
      // Start recording
      try {
        setIsRecording(true);
        const success = await voiceInputService.startRecording({
          language: selectedLanguage,
        });

        if (!success) {
          setIsRecording(false);
          Alert.alert("Error", "Failed to start voice recording");
        }
      } catch (error) {
        setIsRecording(false);
        Alert.alert(
          "Error",
          error instanceof Error
            ? error.message
            : "Failed to start voice recording"
        );
      }
    }
  };

  const handleStopSpeech = async () => {
    try {
      await textToSpeechService.stop();
    } catch {
      Alert.alert("Error", "Failed to stop speech");
    }
  };

  // Initialize location on component mount
  useEffect(() => {
    getCurrentLocation().catch(console.error);
  }, [getCurrentLocation]);

  const selectedLanguageLabel =
    languageOptions.find((lang) => lang.code === selectedLanguage)?.label ||
    "English";

  const renderMessage = ({ item }: { item: Message }) => (
    <View className={`mb-4 ${item.isUser ? "items-end" : "items-start"}`}>
      <View
        className={`max-w-[80%] p-3 rounded-lg ${
          item.isUser
            ? "bg-green-500 rounded-br-sm"
            : "bg-white border border-gray-200 rounded-bl-sm shadow-sm"
        }`}
      >
        <Text
          className={`text-base leading-5 ${
            item.isUser ? "text-white" : "text-gray-800"
          }`}
        >
          {item.text}
        </Text>
        <Text
          className={`text-xs mt-1 ${
            item.isUser ? "text-green-100" : "text-gray-500"
          }`}
        >
          {item.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-green-50">
      {/* Header */}
      <View className="px-4 py-3 bg-white border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="chatbubbles" size={24} color="#166534" />
            <Text className="text-lg font-bold text-green-800 ml-2">
              Voice Assistant
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            {isRecording && (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="#dc2626" />
                <Text className="text-red-600 text-xs ml-1">Recording</Text>
              </View>
            )}
            {isSpeaking && (
              <View className="flex-row items-center">
                <Ionicons name="volume-high" size={20} color="#166534" />
                <Text className="text-green-600 text-xs ml-1">Speaking</Text>
              </View>
            )}
            {isProcessing && (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="#166534" />
                <Text className="text-green-600 text-xs ml-1">Processing</Text>
              </View>
            )}
          </View>
        </View>

        {/* Language Selection and Speech Mode */}
        <View className="flex-row justify-between items-center mt-3">
          <View className="flex-row gap-2">
            {languageOptions.map((language) => (
              <TouchableOpacity
                key={language.code}
                onPress={() => setSelectedLanguage(language.code)}
                className={`px-3 py-1 rounded-full ${
                  selectedLanguage === language.code
                    ? "bg-green-500"
                    : "bg-gray-200"
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    selectedLanguage === language.code
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  {language.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Speech Mode Toggle */}
          <TouchableOpacity
            onPress={() =>
              setSpeechMode(speechMode === "text" ? "voice" : "text")
            }
            className={`px-3 py-1 rounded-full ${
              speechMode === "voice" ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <View className="flex-row items-center">
              <Ionicons
                name={speechMode === "voice" ? "volume-high" : "volume-mute"}
                size={16}
                color={speechMode === "voice" ? "white" : "gray"}
              />
              <Text
                className={`text-xs font-medium ml-1 ${
                  speechMode === "voice" ? "text-white" : "text-gray-600"
                }`}
              >
                {speechMode === "voice" ? "Voice" : "Text"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 16 }}
      />

      {/* Input Area */}
      <View className="px-4 py-3 bg-white border-t border-gray-200">
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <TextInput
              value={userInput}
              onChangeText={setUserInput}
              placeholder={`Ask me about farming in ${selectedLanguageLabel}...`}
              className="bg-gray-100 border border-gray-300 rounded-full px-4 py-3 text-base"
              multiline
              maxLength={500}
            />
          </View>

          {/* Voice Button */}
          <TouchableOpacity
            onPress={handleVoiceInput}
            disabled={isProcessing}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              isRecording
                ? "bg-red-500"
                : isProcessing
                  ? "bg-gray-300"
                  : "bg-green-500"
            }`}
          >
            {isProcessing && !isRecording ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons
                name={isRecording ? "stop" : "mic"}
                size={20}
                color="white"
              />
            )}
          </TouchableOpacity>

          {/* Send Button */}
          <TouchableOpacity
            onPress={handleTextSubmit}
            disabled={!userInput.trim() || isProcessing}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              !userInput.trim() || isProcessing ? "bg-gray-300" : "bg-blue-500"
            }`}
          >
            <Ionicons
              name="send"
              size={20}
              color={!userInput.trim() || isProcessing ? "gray" : "white"}
            />
          </TouchableOpacity>

          {/* Stop Speech Button (when speaking) */}
          {isSpeaking && (
            <TouchableOpacity
              onPress={handleStopSpeech}
              className="w-12 h-12 rounded-full items-center justify-center bg-orange-500"
            >
              <Ionicons name="volume-mute" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {/* Status Messages */}
        {isListening && (
          <View className="flex-row items-center justify-center mt-2">
            <ActivityIndicator size="small" color="#dc2626" />
            <Text className="text-red-600 ml-2 text-sm">
              Listening... Tap stop when done speaking
            </Text>
          </View>
        )}

        {isProcessing && !isListening && (
          <View className="flex-row items-center justify-center mt-2">
            <ActivityIndicator size="small" color="#2563eb" />
            <Text className="text-blue-600 ml-2 text-sm">
              Processing your request...
            </Text>
          </View>
        )}

        {isSpeaking && (
          <View className="flex-row items-center justify-center mt-2">
            <Ionicons name="volume-high" size={16} color="#22c55e" />
            <Text className="text-green-600 ml-2 text-sm">
              Speaking response... Tap mute to stop
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
