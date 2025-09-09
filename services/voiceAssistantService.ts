// Voice Assistant Service with Gemini AI Integration
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { geminiService } from "./geminiService";

interface VoiceResponse {
  text: string;
  audioUrl?: string;
}

interface VoiceSettings {
  language: string;
  rate: number;
  pitch: number;
  volume: number;
}

interface RecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

class VoiceAssistantService {
  private recording: Audio.Recording | null = null;
  private isRecording = false;
  private isProcessing = false;
  private currentLanguage = "en-US";

  private voiceSettings: VoiceSettings = {
    language: "en-US",
    rate: 0.9,
    pitch: 1.0,
    volume: 1.0,
  };

  constructor() {
    this.initializeAudio();
  }

  private async initializeAudio(): Promise<void> {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });
      console.log("Audio initialized successfully");
    } catch (error) {
      console.error("Failed to initialize audio:", error);
    }
  }

  // Start voice recording
  async startListening(): Promise<void> {
    try {
      if (this.isRecording) {
        console.log("Already recording");
        return;
      }

      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Audio recording permission denied");
      }

      // Configure recording options
      const recordingOptions: Audio.RecordingOptions = {
        android: {
          extension: ".m4a",
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: ".m4a",
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: "audio/webm",
          bitsPerSecond: 128000,
        },
      };

      // Start recording
      this.recording = new Audio.Recording();
      await this.recording.prepareToRecordAsync(recordingOptions);
      await this.recording.startAsync();
      this.isRecording = true;

      console.log("Voice recording started");
    } catch (error) {
      console.error("Failed to start recording:", error);
      throw error;
    }
  }

  // Stop recording and process speech
  async stopListening(): Promise<RecognitionResult> {
    try {
      if (!this.isRecording || !this.recording) {
        throw new Error("No active recording");
      }

      // Stop recording
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.isRecording = false;

      console.log("Recording stopped, URI:", uri);

      if (!uri) {
        throw new Error("No recording URI available");
      }

      // Process the audio file for speech recognition
      const transcript = await this.processAudioForSpeech(uri);

      return {
        transcript,
        confidence: 0.9,
        isFinal: true,
      };
    } catch (error) {
      console.error("Failed to stop recording:", error);
      this.isRecording = false;
      throw error;
    }
  }

  // Process audio file and convert to text using Gemini
  private async processAudioForSpeech(audioUri: string): Promise<string> {
    try {
      // For demo purposes, we'll return a mock transcript
      // In production, you would use Google Speech-to-Text API or similar

      // Read the audio file
      const response = await fetch(audioUri);
      const audioBlob = await response.blob();

      // Convert to base64 for processing
      const base64Audio = await this.blobToBase64(audioBlob);

      // Since Gemini doesn't directly support audio-to-text,
      // we'll simulate speech recognition for now
      const mockTranscripts = [
        "What is the best fertilizer for wheat crops?",
        "How do I control pests in my tomato plants?",
        "When should I water my crops?",
        "What are the signs of nitrogen deficiency?",
        "How to prepare soil for planting?",
        "What is the weather forecast for farming?",
        "Tell me about crop rotation benefits",
        "How to identify plant diseases?",
      ];

      // Return a random mock transcript for demo
      const transcript =
        mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      console.log("Speech recognition result:", transcript);

      return transcript;
    } catch (error) {
      console.error("Speech processing error:", error);
      return "How can I help you with farming today?";
    }
  }

  // Convert blob to base64
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(",")[1]); // Remove data:audio/... prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Get AI response from Gemini
  async getAIResponse(userInput: string): Promise<VoiceResponse> {
    try {
      this.isProcessing = true;

      // Add agricultural context to the prompt
      const agriculturalContext = `
        You are an expert agricultural assistant helping farmers. 
        Provide practical, actionable advice in simple language.
        Keep responses concise (2-3 sentences) and farmer-friendly.
        Focus on: crop management, soil health, pest control, weather considerations, irrigation, fertilizers, and sustainable farming practices.
      `;

      const response = await geminiService.generateTextResponse(
        userInput,
        agriculturalContext
      );

      console.log("Gemini AI response:", response.text);

      return {
        text: response.text,
      };
    } catch (error) {
      console.error("AI response error:", error);

      // Fallback responses for common farming queries
      const fallbackResponses = {
        fertilizer:
          "For balanced nutrition, use NPK fertilizer in 4:2:1 ratio. Apply during active growth periods and water thoroughly after application.",
        pest: "Use integrated pest management: regular scouting, beneficial insects, neem oil sprays, and proper field hygiene to control pests effectively.",
        water:
          "Check soil moisture at 6-inch depth before watering. Water deeply but less frequently to encourage strong root development.",
        soil: "Improve soil health with organic compost, proper drainage, and regular testing. Maintain pH between 6.0-7.0 for most crops.",
        disease:
          "Prevent diseases with good air circulation, avoid overhead watering, remove infected plants, and use disease-resistant varieties.",
        weather:
          "Monitor daily forecasts for farming activities. Adjust irrigation and pest control schedules based on weather conditions.",
      };

      // Find relevant fallback response
      const userLower = userInput.toLowerCase();
      let fallbackText =
        "I'm here to help with your farming questions. Please try asking about crops, soil, pests, or weather.";

      for (const [keyword, response] of Object.entries(fallbackResponses)) {
        if (userLower.includes(keyword)) {
          fallbackText = response;
          break;
        }
      }

      return { text: fallbackText };
    } finally {
      this.isProcessing = false;
    }
  }

  // Speak the response using text-to-speech
  async speakResponse(text: string): Promise<void> {
    try {
      // Stop any ongoing speech
      await Speech.stop();

      // Configure speech options
      const speechOptions = {
        language: this.voiceSettings.language,
        pitch: this.voiceSettings.pitch,
        rate: this.voiceSettings.rate,
        volume: this.voiceSettings.volume,
        voice: undefined, // Use default voice
      };

      console.log("Speaking response:", text);

      // Speak the text
      await Speech.speak(text, speechOptions);
    } catch (error) {
      console.error("Text-to-speech error:", error);
    }
  }

  // Complete voice interaction flow
  async processVoiceInteraction(): Promise<VoiceResponse> {
    try {
      console.log("Starting voice interaction...");

      // Start listening
      await this.startListening();

      // For demo, automatically stop after 3 seconds
      // In production, you'd have a UI button to stop recording
      setTimeout(async () => {
        if (this.isRecording) {
          const recognition = await this.stopListening();
          const aiResponse = await this.getAIResponse(recognition.transcript);
          await this.speakResponse(aiResponse.text);
        }
      }, 3000);

      return { text: "Listening... Please speak your farming question." };
    } catch (error) {
      console.error("Voice interaction error:", error);
      return { text: "Voice interaction failed. Please try again." };
    }
  }

  // Update voice settings
  updateVoiceSettings(settings: Partial<VoiceSettings>): void {
    this.voiceSettings = { ...this.voiceSettings, ...settings };
    console.log("Voice settings updated:", this.voiceSettings);
  }

  // Set language
  setLanguage(language: string): void {
    this.currentLanguage = language;
    this.voiceSettings.language = language;
    console.log("Language set to:", language);
  }

  // Check if voice features are available
  async checkVoiceSupport(): Promise<{ recording: boolean; speech: boolean }> {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      const recordingSupported = status === "granted";
      const speechSupported = (await Speech.isSpeakingAsync()) !== undefined;

      return {
        recording: recordingSupported,
        speech: speechSupported,
      };
    } catch {
      return { recording: false, speech: false };
    }
  }

  // Get current state
  getState() {
    return {
      isRecording: this.isRecording,
      isProcessing: this.isProcessing,
      language: this.currentLanguage,
      settings: this.voiceSettings,
    };
  }

  // Stop all voice operations
  async stopAll(): Promise<void> {
    try {
      if (this.isRecording && this.recording) {
        await this.recording.stopAndUnloadAsync();
        this.isRecording = false;
      }
      await Speech.stop();
      this.isProcessing = false;
      console.log("All voice operations stopped");
    } catch (error) {
      console.error("Error stopping voice operations:", error);
    }
  }
}

// Create and export singleton instance
export const voiceAssistantService = new VoiceAssistantService();
export default voiceAssistantService;
