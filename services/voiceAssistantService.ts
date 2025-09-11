// Voice Assistant Service with Real Gemini AI Integration and Multilingual Support
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { geminiService } from "./geminiService";

interface VoiceResponse {
  text: string;
  language: string;
}

interface VoiceSettings {
  language: string;
  rate: number;
  pitch: number;
  volume: number;
}

interface SupportedLanguage {
  code: string;
  name: string;
  speechCode: string;
  geminiPrompt: string;
}

class VoiceAssistantService {
  private recording: Audio.Recording | null = null;
  private isRecording = false;
  private isProcessing = false;
  private currentLanguage = "en-US";

  private supportedLanguages: SupportedLanguage[] = [
    {
      code: "en-US",
      name: "English",
      speechCode: "en",
      geminiPrompt:
        "Respond in simple English that a farmer with basic education can understand. Use short sentences and explain technical terms.",
    },
    {
      code: "hi-IN",
      name: "Hindi",
      speechCode: "hi",
      geminiPrompt:
        "किसान की सरल हिंदी में जवाब दें। छोटे वाक्य इस्तेमाल करें और तकनीकी शब्दों को समझाएं। जवाब केवल हिंदी में दें।",
    },
    {
      code: "pa-IN",
      name: "Punjabi",
      speechCode: "pa",
      geminiPrompt:
        "ਕਿਸਾਨ ਦੀ ਸਰਲ ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ। ਛੋਟੇ ਵਾਕ ਵਰਤੋ ਅਤੇ ਤਕਨੀਕੀ ਸ਼ਬਦਾਂ ਨੂੰ ਸਮਝਾਓ। ਜਵਾਬ ਸਿਰਫ਼ ਪੰਜਾਬੀ ਵਿੱਚ ਦਿਓ।",
    },
    {
      code: "bn-IN",
      name: "Bengali",
      speechCode: "bn",
      geminiPrompt:
        "কৃষকের সহজ বাংলায় উত্তর দিন। ছোট বাক্য ব্যবহার করুন এবং প্রযুক্তিগত শব্দগুলি ব্যাখ্যা করুন। শুধুমাত্র বাংলায় উত্তর দিন।",
    },
  ];

  private voiceSettings: VoiceSettings = {
    language: "en-US",
    rate: 0.8,
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

  // Convert audio to text using speech recognition
  private async convertSpeechToText(audioUri: string): Promise<string> {
    try {
      // Note: This is a placeholder implementation as React Native doesn't have built-in speech-to-text
      // In a production app, you would use one of these services:
      // 1. Google Speech-to-Text API
      // 2. Azure Speech Services
      // 3. AWS Transcribe
      // 4. expo-speech-recognition (if available)

      console.log("Converting audio to text from:", audioUri);

      // For now, we'll return a placeholder that indicates the service needs to be implemented
      // The actual implementation would send the audio file to a cloud service
      throw new Error(
        "Speech-to-text service not implemented. Please implement with Google Speech-to-Text API or similar service."
      );
    } catch (error) {
      console.error("Speech-to-text conversion failed:", error);
      throw new Error(
        "Failed to convert speech to text. Please try again or type your question instead."
      );
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
      const recordingOptions = {
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
      console.log("Recording started");
    } catch (error) {
      console.error("Failed to start recording:", error);
      throw error;
    }
  }

  // Stop voice recording and get transcript
  async stopListening(): Promise<string> {
    try {
      if (!this.isRecording || !this.recording) {
        throw new Error("No recording in progress");
      }

      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.isRecording = false;

      if (!uri) {
        throw new Error("Failed to get recording URI");
      }

      console.log("Recording saved to:", uri);

      // Convert audio to text using speech-to-text service
      const transcript = await this.convertSpeechToText(uri);
      console.log("Speech-to-text result:", transcript);

      return transcript;
    } catch (error) {
      console.error("Failed to stop recording:", error);
      throw error;
    }
  }

  // Get AI response using real Gemini API with retry logic
  async getAIResponse(userInput: string): Promise<VoiceResponse> {
    try {
      this.isProcessing = true;

      const currentLang =
        this.supportedLanguages.find(
          (lang) => lang.code === this.currentLanguage
        ) || this.supportedLanguages[0];

      // Create specialized agricultural prompt for Gemini
      const agriculturalPrompt = `
You are an expert agricultural advisor speaking to a farmer. 
${currentLang.geminiPrompt}

Guidelines:
- Give practical, actionable advice
- Use simple language that low-literacy farmers can understand
- Focus on cost-effective solutions
- Consider local farming conditions
- Explain 'why' behind recommendations
- Keep responses concise but complete
- If technical terms are needed, explain them simply

Farmer's question: ${userInput}

Please provide helpful agricultural advice:`;

      // Try Gemini API with retry logic
      let response;
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          response =
            await geminiService.generateTextResponse(agriculturalPrompt);
          break; // Success, exit retry loop
        } catch (apiError) {
          retryCount++;
          console.log(`Gemini API attempt ${retryCount} failed:`, apiError);

          if (retryCount >= maxRetries) {
            throw apiError; // Max retries reached, throw the error
          }

          // Wait before retrying (exponential backoff)
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, retryCount) * 1000)
          );
        }
      }

      if (!response) {
        throw new Error("Failed to get response after all retries");
      }

      return {
        text: response.text,
        language: this.currentLanguage,
      };
    } catch (error) {
      console.error("Failed to get AI response:", error);

      // Enhanced fallback responses with actual agricultural advice
      const agriculturalFallbacks = {
        "en-US": this.getOfflineAdvice(userInput, "en-US"),
        "hi-IN": this.getOfflineAdvice(userInput, "hi-IN"),
        "pa-IN": this.getOfflineAdvice(userInput, "pa-IN"),
        "bn-IN": this.getOfflineAdvice(userInput, "bn-IN"),
      };

      return {
        text:
          agriculturalFallbacks[
            this.currentLanguage as keyof typeof agriculturalFallbacks
          ] || agriculturalFallbacks["en-US"],
        language: this.currentLanguage,
      };
    } finally {
      this.isProcessing = false;
    }
  }

  // Get offline agricultural advice as fallback
  private getOfflineAdvice(userInput: string, language: string): string {
    const input = userInput.toLowerCase();

    const englishAdvice = {
      fertilizer:
        "For healthy crops, use balanced NPK fertilizer (10:10:10 ratio). Apply 2-3 bags per acre during sowing and flowering stages. Always test soil pH first.",
      pest: "For pest control: 1) Inspect crops daily, 2) Use neem oil spray in evening, 3) Install yellow sticky traps, 4) Practice crop rotation. Avoid chemical pesticides during flowering.",
      water:
        "Water deeply but less frequently. Check soil moisture 6 inches deep. Water early morning or evening. Use drip irrigation if possible to save water.",
      disease:
        "Prevent disease by ensuring good air circulation, avoiding overhead watering, and removing infected plants immediately. Use copper fungicide if needed.",
      harvest:
        "Harvest in early morning when it's cool. Use clean tools, handle gently, and store in cool, dry place immediately after harvesting.",
      default:
        "I'm currently offline, but here's general farming advice: Monitor your crops daily, maintain proper irrigation, use organic fertilizers when possible, and consult local agricultural experts for specific issues.",
    };

    const hindiAdvice = {
      fertilizer:
        "स्वस्थ फसल के लिए संतुलित NPK खाद (10:10:10) का उपयोग करें। प्रति एकड़ 2-3 बोरी बुआई और फूल आने के समय डालें। पहले मिट्टी की जांच कराएं।",
      pest: "कीट नियंत्रण के लिए: 1) रोज फसल की जांच करें, 2) शाम को नीम का तेल छिड़कें, 3) पीले चिपचिपे जाल लगाएं, 4) फसल बदल-बदल कर उगाएं।",
      water:
        "गहरा लेकिन कम पानी दें। 6 इंच तक मिट्टी की नमी जांचें। सुबह या शाम पानी दें। ड्रिप सिंचाई का उपयोग करें।",
      disease:
        "बीमारी से बचने के लिए हवा का अच्छा प्रवाह रखें, ऊपर से पानी न दें, संक्रमित पौधे तुरंत हटाएं। जरूरत हो तो तांबे का फंगीसाइड उपयोग करें।",
      harvest:
        "सुबह जल्दी ठंडे समय में कटाई करें। साफ औजार का उपयोग करें, सावधानी से तोड़ें, तुरंत ठंडी सूखी जगह रखें।",
      default:
        "मैं अभी ऑफलाइन हूं, लेकिन सामान्य सलाह: रोज फसल की जांच करें, सही सिंचाई करें, जैविक खाद का उपयोग करें, स्थानीय कृषि विशेषज्ञों से सलाह लें।",
    };

    const advice = language === "hi-IN" ? hindiAdvice : englishAdvice;

    // Simple keyword matching
    if (input.includes("fertilizer") || input.includes("खाद"))
      return advice.fertilizer;
    if (input.includes("pest") || input.includes("कीट")) return advice.pest;
    if (input.includes("water") || input.includes("पानी")) return advice.water;
    if (input.includes("disease") || input.includes("बीमारी"))
      return advice.disease;
    if (input.includes("harvest") || input.includes("कटाई"))
      return advice.harvest;

    return advice.default;
  }

  // Speak response in user's language
  async speakResponse(text: string): Promise<void> {
    try {
      const currentLang =
        this.supportedLanguages.find(
          (lang) => lang.code === this.currentLanguage
        ) || this.supportedLanguages[0];

      await Speech.speak(text, {
        language: currentLang.speechCode,
        pitch: this.voiceSettings.pitch,
        rate: this.voiceSettings.rate,
        volume: this.voiceSettings.volume,
      });
    } catch (error) {
      console.error("Failed to speak response:", error);
    }
  }

  // Set language
  setLanguage(languageCode: string): void {
    if (this.supportedLanguages.some((lang) => lang.code === languageCode)) {
      this.currentLanguage = languageCode;
      this.voiceSettings.language = languageCode;
    }
  }

  // Get supported languages
  getSupportedLanguages(): SupportedLanguage[] {
    return this.supportedLanguages;
  }

  // Get current language
  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  // Stop all operations
  async stopAll(): Promise<void> {
    try {
      if (this.isRecording && this.recording) {
        await this.recording.stopAndUnloadAsync();
        this.isRecording = false;
      }
      await Speech.stop();
    } catch (error) {
      console.error("Failed to stop all operations:", error);
    }
  }

  // Check if currently recording
  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  // Check if currently processing
  isCurrentlyProcessing(): boolean {
    return this.isProcessing;
  }

  // Process text input (for testing without voice)
  async processTextInput(text: string): Promise<VoiceResponse> {
    return await this.getAIResponse(text);
  }
}

export const voiceAssistantService = new VoiceAssistantService();
