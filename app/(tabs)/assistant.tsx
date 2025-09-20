import { useVoiceAssistantStore } from "@/stores/voiceAssistantStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    FlatList,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  language?: string;
}

const Assistant = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState("");

  const {
    isListening,
    isProcessing,
    isSpeaking,
    transcript,
    response,
    error,
    language,
    isSupported,
    supportedLanguages,
    startListening,
    stopListening,
    processTextQuery,
    setLanguage,
    clearError,
    checkSupport,
    stopAll,
  } = useVoiceAssistantStore();

  const addMessage = useCallback((text: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      language: language,
    };
    setMessages((prev) => [...prev, newMessage]);
  }, [language]);

  const addWelcomeMessage = useCallback(() => {
    const welcomeMessages = {
      "en-US": t('assistant.welcomeMessage'),
      "hi-IN": t('assistant.welcomeMessage'),
      // Keep other languages as is for now
      "pa-IN":
        "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਖੇਤੀ ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਪੰਜਾਬੀ, ਹਿੰਦੀ, ਅੰਗਰੇਜ਼ੀ ਜਾਂ ਬੰਗਾਲੀ ਵਿੱਚ ਖੇਤੀ ਬਾਰੇ ਤੁਹਾਡੇ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦੇ ਸਕਦਾ ਹਾਂ। ਫਸਲਾਂ, ਕੀੜੇ, ਖਾਦ ਜਾਂ ਖੇਤੀ ਦੀਆਂ ਤਕਨੀਕਾਂ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ।",
      "bn-IN":
        "নমস্কার! আমি আপনার কৃষি সহায়ক। আমি বাংলা, হিন্দি, ইংরেজি বা পাঞ্জাবিতে কৃষি সম্পর্কে আপনার প্রশ্নের উত্তর দিতে পারি। ফসল, কীটপতঙ্গ, সার বা কৃষি কৌশল সম্পর্কে যেকোনো কিছু জিজ্ঞাসা করুন।",
    };

    // Only add welcome message if no messages exist
    if (messages.length === 0) {
      const welcomeText =
        welcomeMessages[language as keyof typeof welcomeMessages] ||
        welcomeMessages["en-US"];
      setMessages([
        {
          id: "welcome-" + Date.now(),
          text: welcomeText,
          isUser: false,
          timestamp: new Date(),
          language: language,
        },
      ]);
    }
  }, [messages, language, t]);

  useEffect(() => {
    // Check voice support on component mount
    checkSupport();

    // Add welcome message based on current language
    addWelcomeMessage();

    // Cleanup on unmount
    return () => {
      stopAll();
    };
  }, [checkSupport, addWelcomeMessage, stopAll]);

  useEffect(() => {
    // Add user message when transcript is available
    if (transcript && transcript.trim()) {
      addMessage(transcript, true);
    }
  }, [transcript, addMessage]);

  useEffect(() => {
    // Add AI response when available
    if (response && response.trim()) {
      addMessage(response, false);
    }
  }, [response, addMessage]);

  useEffect(() => {
    // Show error alerts
    if (error) {
      Alert.alert(t('assistant.title'), error, [
        { text: "OK", onPress: clearError },
      ]);
    }
  }, [error, clearError, t]);

  useEffect(() => {
    // Add welcome message when language changes
    addWelcomeMessage();
  }, [language, addWelcomeMessage]);



  const handleVoiceInput = async () => {
    if (isListening) {
      await stopListening();
    } else {
      if (!isSupported.recording) {
        Alert.alert(
          t('assistant.microphoneAccess.title'),
          t('assistant.microphoneAccess.message'),
          [{ text: "OK" }]
        );
        return;
      }
      await startListening();
    }
  };

  const handleTextSubmit = async () => {
    if (textInput.trim()) {
      const userText = textInput.trim();
      setTextInput("");
      addMessage(userText, true);
      await processTextQuery(userText);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    const langName =
      supportedLanguages.find(
        (lang: { code: string; name: string }) => lang.code === newLanguage
      )?.name || "Unknown";
    addMessage(`${t('assistant.languageChanged')} ${langName}`, false);
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
    if (isListening) return t('assistant.listening');
    if (isProcessing) return t('assistant.processing');
    if (isSpeaking) return t('assistant.speaking');
    return t('assistant.defaultPrompt');
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View className={`mb-4 ${item.isUser ? "items-end" : "items-start"}`}>
      <View className="flex-row items-start max-w-[85%]">
        {!item.isUser && (
          <View className="w-8 h-8 bg-green-500 rounded-full items-center justify-center mr-3">
            <Ionicons name="leaf" size={16} color="white" />
          </View>
        )}
        <View
          className={`rounded-2xl p-4 ${
            item.isUser
              ? "bg-green-500 rounded-br-sm"
              : "bg-gray-800 border border-gray-700 rounded-tl-sm"
          }`}
        >
          <Text
            className={`text-base leading-6 ${
              item.isUser ? "text-white" : "text-white"
            }`}
          >
            {item.text}
          </Text>
          <Text
            className={`text-xs mt-2 ${
              item.isUser ? "text-green-100" : "text-gray-400"
            }`}
          >
            {item.timestamp.toLocaleTimeString()}
          </Text>
        </View>
        {item.isUser && (
          <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center ml-3">
            <Ionicons name="person" size={16} color="white" />
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="pt-12 pb-4 px-4 bg-gray-900 border-b border-gray-800">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white ml-4">
              {t('assistant.title')}
            </Text>
          </View>

          {/* Language Selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {supportedLanguages.map(
              (lang: {
                code: string;
                name: string;
                speechCode: string;
                geminiPrompt: string;
              }) => (
                <TouchableOpacity
                  key={lang.code}
                  onPress={() => handleLanguageChange(lang.code)}
                  className={`mx-1 px-3 py-1 rounded-full ${
                    language === lang.code ? "bg-green-500" : "bg-gray-700"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      language === lang.code ? "text-white" : "text-gray-300"
                    }`}
                  >
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>
        </View>
      </View>

      {/* Chat Area */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      />

      {/* Voice Visualization */}
      {isListening && (
        <View className="items-center py-4">
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

      {/* Status Text */}
      <View className="px-4 py-2">
        <Text className="text-gray-400 text-center text-sm">
          {getStatusText()}
        </Text>
      </View>

      {/* Input Area */}
      <View className="px-4 pb-4">
        {/* Text Input */}
        <View className="flex-row items-center mb-4 bg-gray-800 rounded-xl border border-gray-700">
          <TextInput
            value={textInput}
            onChangeText={setTextInput}
            placeholder={t('assistant.placeholder')}
            placeholderTextColor="#9CA3AF"
            className="flex-1 p-4 text-white"
            multiline
            onSubmitEditing={handleTextSubmit}
          />
          <TouchableOpacity
            onPress={handleTextSubmit}
            disabled={!textInput.trim() || isProcessing}
            className={`p-3 m-2 rounded-lg ${
              textInput.trim() && !isProcessing ? "bg-green-500" : "bg-gray-600"
            }`}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Voice Button */}
        <View className="items-center">
          <TouchableOpacity
            onPress={handleVoiceInput}
            disabled={isProcessing}
            className="w-16 h-16 rounded-full items-center justify-center"
            style={{ backgroundColor: getVoiceButtonColor() }}
          >
            <Ionicons name={getVoiceButtonIcon()} size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Assistant;
