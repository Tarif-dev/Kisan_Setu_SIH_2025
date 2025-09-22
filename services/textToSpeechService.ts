// Enhanced Text-to-Speech Service with multiple language support
import * as Speech from "expo-speech";

interface TTSOptions {
  language: string;
  rate?: number;
  pitch?: number;
  voice?: string;
}

interface SpeechResult {
  success: boolean;
  error?: string;
}

class TextToSpeechService {
  private isSpeaking: boolean = false;
  private currentUtterance: any = null;

  // Language mappings for TTS
  private languageMap: Record<string, string> = {
    en: "en-US",
    hi: "hi-IN",
    pa: "pa-IN",
    bn: "bn-IN",
    te: "te-IN",
    ta: "ta-IN",
    mr: "mr-IN",
    gu: "gu-IN",
    kn: "kn-IN",
    ml: "ml-IN",
    or: "or-IN",
    as: "as-IN",
    ur: "ur-PK",
  };

  // Default voice settings for different languages
  private voiceSettings: Record<string, TTSOptions> = {
    en: { language: "en-US", rate: 0.8, pitch: 1.0 },
    hi: { language: "hi-IN", rate: 0.7, pitch: 1.0 },
    pa: { language: "pa-IN", rate: 0.7, pitch: 1.0 },
    bn: { language: "bn-IN", rate: 0.7, pitch: 1.0 },
    te: { language: "te-IN", rate: 0.7, pitch: 1.0 },
    ta: { language: "ta-IN", rate: 0.7, pitch: 1.0 },
    mr: { language: "mr-IN", rate: 0.7, pitch: 1.0 },
    gu: { language: "gu-IN", rate: 0.7, pitch: 1.0 },
    kn: { language: "kn-IN", rate: 0.7, pitch: 1.0 },
    ml: { language: "ml-IN", rate: 0.7, pitch: 1.0 },
    or: { language: "or-IN", rate: 0.7, pitch: 1.0 },
    as: { language: "as-IN", rate: 0.7, pitch: 1.0 },
    ur: { language: "ur-PK", rate: 0.7, pitch: 1.0 },
  };

  async speak(text: string, language: string = "en"): Promise<SpeechResult> {
    try {
      // Stop any current speech
      await this.stop();

      if (!text || text.trim() === "") {
        return { success: false, error: "No text provided" };
      }

      const settings = this.voiceSettings[language] || this.voiceSettings["en"];

      // Check if speech is available
      const isAvailable = await Speech.isSpeakingAsync();

      this.isSpeaking = true;

      const options: Speech.SpeechOptions = {
        language: settings.language,
        pitch: settings.pitch,
        rate: settings.rate,
        onStart: () => {
          console.log("TTS: Speech started");
          this.isSpeaking = true;
        },
        onDone: () => {
          console.log("TTS: Speech completed");
          this.isSpeaking = false;
          this.currentUtterance = null;
        },
        onStopped: () => {
          console.log("TTS: Speech stopped");
          this.isSpeaking = false;
          this.currentUtterance = null;
        },
        onError: (error) => {
          console.error("TTS: Speech error:", error);
          this.isSpeaking = false;
          this.currentUtterance = null;
        },
      };

      await Speech.speak(text, options);

      return { success: true };
    } catch (error) {
      console.error("TTS Error:", error);
      this.isSpeaking = false;
      this.currentUtterance = null;

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown TTS error",
      };
    }
  }

  async stop(): Promise<void> {
    try {
      if (this.isSpeaking) {
        await Speech.stop();
        this.isSpeaking = false;
        this.currentUtterance = null;
      }
    } catch (error) {
      console.error("TTS Stop Error:", error);
    }
  }

  async pause(): Promise<void> {
    try {
      if (this.isSpeaking) {
        await Speech.stop(); // Expo Speech doesn't have pause, so we stop
        this.isSpeaking = false;
      }
    } catch (error) {
      console.error("TTS Pause Error:", error);
    }
  }

  isSpeechActive(): boolean {
    return this.isSpeaking;
  }

  // Get available voices for a language (mock implementation)
  async getAvailableVoices(language: string = "en"): Promise<string[]> {
    // This is a mock implementation as Expo Speech doesn't provide voice listing
    const voiceMap: Record<string, string[]> = {
      en: ["en-US-default", "en-GB-default"],
      hi: ["hi-IN-default"],
      pa: ["pa-IN-default"],
      bn: ["bn-IN-default"],
      te: ["te-IN-default"],
      ta: ["ta-IN-default"],
      mr: ["mr-IN-default"],
      gu: ["gu-IN-default"],
      kn: ["kn-IN-default"],
      ml: ["ml-IN-default"],
      or: ["or-IN-default"],
      as: ["as-IN-default"],
      ur: ["ur-PK-default"],
    };

    return voiceMap[language] || voiceMap["en"];
  }

  // Test speech functionality
  async testSpeech(language: string = "en"): Promise<SpeechResult> {
    const testMessages: Record<string, string> = {
      en: "Hello farmer! This is your agricultural assistant speaking.",
      hi: "नमस्ते किसान जी! यह आपका कृषि सहायक बोल रहा है।",
      pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਜੀ! ਇਹ ਤੁਹਾਡਾ ਖੇਤੀ ਸਹਾਇਕ ਬੋਲ ਰਿਹਾ ਹੈ।",
      bn: "নমস্কার কৃষক! এটি আপনার কৃষি সহায়ক কথা বলছে।",
      te: "నమస్కారం రైతు గారు! ఇది మీ వ్యవసాయ సహాయకుడు మాట్లాడుతున్నాడు।",
      ta: "வணக்கம் விவசாயி! இது உங்கள் விவசாய உதவியாளர் பேசுகிறது।",
    };

    const message = testMessages[language] || testMessages["en"];
    return await this.speak(message, language);
  }

  // Get supported languages
  getSupportedLanguages(): string[] {
    return Object.keys(this.voiceSettings);
  }

  // Get language display names
  getLanguageDisplayName(langCode: string): string {
    const displayNames: Record<string, string> = {
      en: "English",
      hi: "हिंदी (Hindi)",
      pa: "ਪੰਜਾਬੀ (Punjabi)",
      bn: "বাংলা (Bengali)",
      te: "తెలుగు (Telugu)",
      ta: "தமிழ் (Tamil)",
      mr: "मराठी (Marathi)",
      gu: "ગુજરાતી (Gujarati)",
      kn: "ಕನ್ನಡ (Kannada)",
      ml: "മലയാളം (Malayalam)",
      or: "ଓଡ଼ିଆ (Odia)",
      as: "অসমীয়া (Assamese)",
      ur: "اردو (Urdu)",
    };

    return displayNames[langCode] || langCode;
  }

  // Check if language is supported
  isLanguageSupported(language: string): boolean {
    return language in this.voiceSettings;
  }
}

export const textToSpeechService = new TextToSpeechService();
export default TextToSpeechService;
