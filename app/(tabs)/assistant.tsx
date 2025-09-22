import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLanguage } from "../../contexts/LanguageContext";
import { geminiService } from "../../services/geminiService";
import { speechToTextService } from "../../services/speechToTextService";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  language?: string;
}

interface VoiceState {
  isRecording: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  recordingUri?: string;
  duration: number;
}

const Assistant = () => {
  const { t, currentLanguage, supportedLanguages } = useLanguage();

  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState("");
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isRecording: false,
    isProcessing: false,
    isSpeaking: false,
    duration: 0,
  });
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  // Audio recording
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  // Animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  // Auto-scroll to bottom
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Add welcome message
    addMessage(t("assistant.askAnything"), false, currentLanguage);

    // Setup audio
    setupAudio();

    return () => {
      // Cleanup
      stopRecording();
      Speech.stop();
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  useEffect(() => {
    // Update selected language when app language changes
    setSelectedLanguage(currentLanguage);
  }, [currentLanguage]);

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    } catch (error) {
      console.warn("Audio setup failed:", error);
    }
  };

  const addMessage = (text: string, isUser: boolean, language?: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      language,
    };
    setMessages((prev) => [...prev, message]);
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const startWaveAnimation = () => {
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopWaveAnimation = () => {
    waveAnim.stopAnimation();
    Animated.timing(waveAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const startRecording = async () => {
    try {
      // Request permissions
      if (permissionResponse?.status !== "granted") {
        const permission = await requestPermission();
        if (permission.status !== "granted") {
          Alert.alert(t("common.error"), t("assistant.permissionDenied"));
          return;
        }
      }

      // Stop any existing recording
      if (recording) {
        await recording.stopAndUnloadAsync();
      }

      // Create new recording
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setVoiceState((prev) => ({
        ...prev,
        isRecording: true,
        duration: 0,
      }));

      // Start animations
      startPulseAnimation();
      startWaveAnimation();

      // Start duration counter
      const startTime = Date.now();
      const durationInterval = setInterval(() => {
        setVoiceState((prev) => ({
          ...prev,
          duration: Date.now() - startTime,
        }));
      }, 100);

      // Store interval for cleanup
      (newRecording as any).durationInterval = durationInterval;

      console.log("🎤 Recording started");
    } catch (error) {
      console.error("Failed to start recording:", error);
      Alert.alert(t("common.error"), "Failed to start recording");
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      console.log("🛑 Stopping recording...");

      // Stop animations
      stopPulseAnimation();
      stopWaveAnimation();

      // Clear duration interval
      if ((recording as any).durationInterval) {
        clearInterval((recording as any).durationInterval);
      }

      // Stop recording
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      setVoiceState((prev) => ({
        ...prev,
        isRecording: false,
        isProcessing: true,
        recordingUri: uri || undefined,
      }));

      setRecording(null);

      if (uri) {
        console.log("📁 Recording saved to:", uri);
        await processVoiceInput(uri);
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
      setVoiceState((prev) => ({
        ...prev,
        isRecording: false,
        isProcessing: false,
      }));
    }
  };

  const processVoiceInput = async (audioUri: string) => {
    try {
      console.log("🔄 Processing voice input...");

      // Step 1: Speech-to-Text (using enhanced mock)
      const transcriptionResult = await speechToTextService.transcribeAudio(
        audioUri,
        { language: selectedLanguage }
      );

      if (!transcriptionResult.success || !transcriptionResult.transcript) {
        throw new Error("Failed to transcribe audio");
      }

      const userQuery = transcriptionResult.transcript;
      console.log("📝 Transcribed:", userQuery);

      // Add user message
      addMessage(userQuery, true, selectedLanguage);

      // Step 2: Process with Gemini AI
      const aiResponse = await geminiService.getAssistantResponse(
        userQuery,
        selectedLanguage
      );

      if (!aiResponse || !aiResponse.text) {
        throw new Error("Failed to get AI response");
      }

      console.log("🤖 AI Response:", aiResponse.text);

      // Add AI message
      addMessage(aiResponse.text, false, selectedLanguage);

      // Step 3: Text-to-Speech
      await speakResponse(aiResponse.text, selectedLanguage);
    } catch (error) {
      console.error("Voice processing error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      addMessage(`Error: ${errorMessage}`, false, selectedLanguage);
    } finally {
      setVoiceState((prev) => ({
        ...prev,
        isProcessing: false,
      }));
    }
  };

  const speakResponse = async (text: string, language: string) => {
    try {
      setVoiceState((prev) => ({ ...prev, isSpeaking: true }));

      // Map language codes for TTS
      const speechLanguage =
        {
          en: "en-US",
          hi: "hi-IN",
          pa: "pa-IN",
        }[language] || "en-US";

      console.log("🔊 Speaking response in", speechLanguage);

      await Speech.speak(text, {
        language: speechLanguage,
        pitch: 1.0,
        rate: 0.9,
        onStart: () => {
          console.log("🎵 TTS started");
        },
        onDone: () => {
          console.log("✅ TTS completed");
          setVoiceState((prev) => ({ ...prev, isSpeaking: false }));
        },
        onStopped: () => {
          console.log("⏹️ TTS stopped");
          setVoiceState((prev) => ({ ...prev, isSpeaking: false }));
        },
        onError: (error) => {
          console.error("TTS error:", error);
          setVoiceState((prev) => ({ ...prev, isSpeaking: false }));
        },
      });
    } catch (error) {
      console.error("TTS error:", error);
      setVoiceState((prev) => ({ ...prev, isSpeaking: false }));
    }
  };

  const stopSpeaking = () => {
    console.log("🛑 Stopping TTS...");
    Speech.stop();
    setVoiceState((prev) => ({ ...prev, isSpeaking: false }));
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;

    const query = textInput.trim();
    setTextInput("");

    // Add user message
    addMessage(query, true, selectedLanguage);

    try {
      // Process with Gemini AI
      const aiResponse = await geminiService.getAssistantResponse(
        query,
        selectedLanguage
      );

      if (aiResponse && aiResponse.text) {
        addMessage(aiResponse.text, false, selectedLanguage);
        await speakResponse(aiResponse.text, selectedLanguage);
      } else {
        addMessage(
          "Sorry, I could not process your request.",
          false,
          selectedLanguage
        );
      }
    } catch (error) {
      console.error("Text processing error:", error);
      addMessage(
        "An error occurred while processing your request.",
        false,
        selectedLanguage
      );
    }
  };

  const handleVoiceToggle = () => {
    if (voiceState.isRecording) {
      stopRecording();
    } else if (voiceState.isSpeaking) {
      stopSpeaking();
    } else if (!voiceState.isProcessing) {
      startRecording();
    }
  };

  const clearConversation = () => {
    Alert.alert(
      "Clear Conversation",
      "Are you sure you want to clear all messages?",
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            setMessages([]);
            addMessage(t("assistant.askAnything"), false, currentLanguage);
          },
        },
      ]
    );
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View className={`mb-4 ${item.isUser ? "items-end" : "items-start"}`}>
      <View
        className={`max-w-[80%] p-4 rounded-2xl ${
          item.isUser
            ? "bg-green-500 rounded-br-md"
            : "bg-gray-700 rounded-bl-md"
        }`}
      >
        <Text
          className={`text-base ${item.isUser ? "text-white" : "text-gray-100"}`}
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
    </View>
  );

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
              Select Voice Language
            </Text>
            <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {Object.entries(supportedLanguages).map(([code, lang]) => (
            <TouchableOpacity
              key={code}
              className={`flex-row items-center p-4 rounded-xl mb-2 ${
                selectedLanguage === code
                  ? "bg-green-500/20 border border-green-500"
                  : "bg-gray-700"
              }`}
              onPress={() => {
                setSelectedLanguage(code);
                setShowLanguageModal(false);
              }}
            >
              <View className="flex-1">
                <Text className="text-white font-medium text-lg">
                  {lang.nativeName}
                </Text>
                <Text className="text-gray-400 text-sm">{lang.name}</Text>
              </View>
              {selectedLanguage === code && (
                <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  const getVoiceButtonText = () => {
    if (voiceState.isRecording) return t("assistant.listening");
    if (voiceState.isProcessing) return t("assistant.processing");
    if (voiceState.isSpeaking) return "Tap to Stop";
    return t("assistant.tapToSpeak");
  };

  const getVoiceButtonColor = () => {
    if (voiceState.isRecording) return "#EF4444"; // Red
    if (voiceState.isProcessing) return "#F59E0B"; // Yellow
    if (voiceState.isSpeaking) return "#3B82F6"; // Blue
    return "#22C55E"; // Green
  };

  // Get example questions based on current language
  const getExampleQuestions = () => {
    const examples = t("assistant.examples.questions");
    return Array.isArray(examples) ? examples : [];
  };

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="pt-12 pb-4 px-4 bg-gray-900 border-b border-gray-800">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-bold text-white">
            {t("assistant.title")}
          </Text>

          <View className="flex-row items-center space-x-2">
            <TouchableOpacity
              onPress={() => setShowLanguageModal(true)}
              className="bg-gray-700 px-3 py-2 rounded-lg"
            >
              <Text className="text-white text-sm">
                {supportedLanguages[
                  selectedLanguage as keyof typeof supportedLanguages
                ]?.nativeName || "EN"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={clearConversation}
              className="bg-gray-700 p-2 rounded-lg"
            >
              <Ionicons name="trash" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Chat Messages */}
      <View className="flex-1 px-4">
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingVertical: 16 }}
        />
      </View>

      {/* Voice Controls */}
      <View className="p-4 bg-gray-800 border-t border-gray-700">
        {/* Voice Button */}
        <View className="items-center mb-4">
          <TouchableOpacity
            onPress={handleVoiceToggle}
            disabled={voiceState.isProcessing}
            className="items-center"
          >
            <Animated.View
              style={{
                transform: [{ scale: pulseAnim }],
                backgroundColor: getVoiceButtonColor(),
              }}
              className="w-20 h-20 rounded-full items-center justify-center mb-2"
            >
              <Ionicons
                name={
                  voiceState.isRecording
                    ? "stop"
                    : voiceState.isSpeaking
                      ? "stop-circle"
                      : "mic"
                }
                size={32}
                color="white"
              />
            </Animated.View>

            <Text className="text-white font-medium text-center">
              {getVoiceButtonText()}
            </Text>

            {voiceState.isRecording && (
              <Text className="text-gray-400 text-sm mt-1">
                {Math.floor(voiceState.duration / 1000)}s
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Text Input */}
        <View className="flex-row items-center space-x-2">
          <TextInput
            value={textInput}
            onChangeText={setTextInput}
            placeholder={`Type your question...`}
            placeholderTextColor="#9CA3AF"
            className="flex-1 bg-gray-700 text-white p-3 rounded-xl"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={handleTextSubmit}
            disabled={!textInput.trim() || voiceState.isProcessing}
            className={`p-3 rounded-xl ${
              textInput.trim() ? "bg-green-500" : "bg-gray-600"
            }`}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Example Questions */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3"
        >
          {getExampleQuestions().map((question: string, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => setTextInput(question)}
              className="bg-gray-700 px-3 py-2 rounded-lg mr-2"
            >
              <Text className="text-gray-300 text-sm">{question}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <LanguageModal />
    </View>
  );
};

export default Assistant;
