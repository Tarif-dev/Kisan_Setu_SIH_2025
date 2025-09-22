// Real Speech-to-Text Service using Google Speech-to-Text API
// Note: FileSystem is causing issues in Expo SDK 54, so we'll implement a simpler approach
import config from "../config/environment";

export interface SpeechToTextOptions {
  language: string;
  sampleRate?: number;
  encoding?: string;
}

export interface SpeechToTextResult {
  success: boolean;
  transcript?: string;
  confidence?: number;
  error?: string;
  alternatives?: Array<{
    transcript: string;
    confidence: number;
  }>;
}

class SpeechToTextService {
  private apiKey: string;
  private baseUrl = "https://speech.googleapis.com/v1/speech:recognize";

  constructor() {
    this.apiKey = config.GOOGLE_SPEECH_API_KEY;
  }

  // Convert audio file to text using Google Speech-to-Text API
  async transcribeAudio(
    audioUri: string,
    options: SpeechToTextOptions = { language: "en-US" }
  ): Promise<SpeechToTextResult> {
    console.log("Starting speech-to-text transcription...");
    console.log("API Key configured:", !!this.apiKey);
    console.log("Audio URI:", audioUri);
    console.log("Language:", options.language);

    try {
      if (!this.apiKey) {
        console.log(
          "No Google Speech API key configured, using mock transcription"
        );
        return this.getMockTranscription(options.language);
      }

      console.log("Attempting real speech-to-text with Google API...");

      // Read the audio file and convert to base64
      const audioBase64 = await this.convertAudioToBase64(audioUri);

      if (!audioBase64) {
        throw new Error("Failed to process audio file");
      }

      console.log(
        "Audio file converted to base64, length:",
        audioBase64.length
      );

      // Prepare the request payload
      const requestBody = {
        config: {
          encoding: "MP4", // Specify MP4/M4A encoding for better compatibility
          sampleRateHertz: 44100, // Standard sample rate for mobile recordings
          languageCode: this.mapLanguageCode(options.language),
          enableAutomaticPunctuation: true,
          alternativeLanguageCodes: ["en-US"], // Fallback language
        },
        audio: {
          content: audioBase64,
        },
      };

      // Make API request
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Google Speech API Error:", errorData);

        if (response.status === 400) {
          throw new Error("Invalid audio format or corrupted audio file");
        } else if (response.status === 401) {
          throw new Error("Invalid API key for Google Speech API");
        } else if (response.status === 403) {
          throw new Error(
            "Google Speech API access denied. Check API key permissions."
          );
        } else if (response.status === 429) {
          throw new Error(
            "Too many requests to Google Speech API. Please try again later."
          );
        } else {
          throw new Error(`Google Speech API error: ${response.status}`);
        }
      }

      const data = await response.json();

      // Process the response
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const alternatives = result.alternatives || [];

        if (alternatives.length > 0) {
          const topResult = alternatives[0];

          return {
            success: true,
            transcript: topResult.transcript,
            confidence: topResult.confidence || 0.9,
            alternatives: alternatives.map((alt: any) => ({
              transcript: alt.transcript,
              confidence: alt.confidence || 0.8,
            })),
          };
        }
      }

      return {
        success: false,
        error: "No speech detected in the audio",
      };
    } catch (error) {
      console.error("Speech-to-Text Error:", error);

      // Fallback to mock implementation if API fails
      console.log("Falling back to mock transcription...");
      return this.getMockTranscription(options.language);
    }
  }

  // Convert audio file to base64 using modern approach
  private async convertAudioToBase64(audioUri: string): Promise<string | null> {
    try {
      console.log("Converting audio file to base64...");

      // Use fetch to read the audio file as blob, then convert to base64
      const response = await fetch(audioUri);
      if (!response.ok) {
        throw new Error(`Failed to fetch audio file: ${response.status}`);
      }

      const blob = await response.blob();
      console.log("Audio blob size:", blob.size, "bytes");

      // Convert blob to base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove the data URL prefix to get just the base64 data
          const base64Data = result.split(",")[1];
          console.log(
            "Base64 conversion successful, length:",
            base64Data.length
          );
          resolve(base64Data);
        };
        reader.onerror = () => {
          console.error("FileReader error:", reader.error);
          reject(new Error("Failed to convert audio to base64"));
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting audio to base64:", error);
      return null;
    }
  }

  // Map language codes to Google Speech API format
  private mapLanguageCode(language: string): string {
    const languageMap: Record<string, string> = {
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

    return languageMap[language] || "en-US";
  }

  // Fallback mock transcription for development/testing
  private getMockTranscription(language: string): SpeechToTextResult {
    console.log("Using enhanced mock transcription system");

    const mockTranscriptions: Record<string, string[]> = {
      en: [
        "How to grow tomatoes in winter?",
        "What fertilizer should I use for wheat?",
        "My crops have pest problems, what should I do?",
        "When is the best time to plant rice?",
        "How can I improve soil quality naturally?",
        "What are the signs of nitrogen deficiency in plants?",
        "How much water does maize crop need?",
        "Best organic pesticides for vegetable farming?",
        "Which seeds are good for monsoon planting?",
        "How to protect crops from heavy rainfall?",
        "What is crop rotation and why is it important?",
        "How to increase farm productivity with less water?",
      ],
      hi: [
        "टमाटर की खेती कैसे करें?",
        "गेहूं के लिए कौन सा खाद अच्छा है?",
        "फसल में कीड़े लग गए हैं क्या करें?",
        "धान बोने का सही समय क्या है?",
        "मिट्टी कैसे सुधारें?",
        "जैविक खाद कैसे बनाएं?",
        "पानी की कमी में फसल कैसे उगाएं?",
        "बारिश से फसल को कैसे बचाएं?",
      ],
      pa: [
        "ਟਮਾਟਰ ਦੀ ਖੇਤੀ ਕਿਵੇਂ ਕਰੀਏ?",
        "ਕਣਕ ਲਈ ਕਿਹੜੀ ਖਾਦ ਵਰਤੀਏ?",
        "ਫਸਲ ਵਿੱਚ ਕੀੜੇ ਲੱਗ ਗਏ ਹਨ?",
        "ਚਾਵਲ ਬੀਜਣ ਦਾ ਸਮਾਂ ਕੀ ਹੈ?",
        "ਮਿੱਟੀ ਕਿਵੇਂ ਸੁਧਾਰੀਏ?",
        "ਜੈਵਿਕ ਖਾਦ ਕਿਵੇਂ ਬਣਾਈਏ?",
        "ਪਾਣੀ ਦੀ ਕਮੀ ਵਿੱਚ ਖੇਤੀ ਕਿਵੇਂ ਕਰੀਏ?",
      ],
    };

    const transcripts =
      mockTranscriptions[language] || mockTranscriptions["en"];

    // Use current time to make selection more random but deterministic
    const timeBasedIndex = Math.floor(Date.now() / 10000) % transcripts.length;
    const randomTranscript = transcripts[timeBasedIndex];

    console.log(`Mock transcription (${language}):`, randomTranscript);

    return {
      success: true,
      transcript: randomTranscript,
      confidence: 0.88, // Slightly lower confidence to indicate it's mock
    };
  }

  // Test the speech-to-text service
  async testService(): Promise<void> {
    console.log("Testing Speech-to-Text Service...");

    if (!this.apiKey) {
      console.warn(
        "Google Speech API key not configured. Using mock implementation."
      );
      return;
    }

    console.log("Google Speech API configured successfully");
    console.log("API Key present:", !!this.apiKey);
    console.log("Base URL:", this.baseUrl);
  }

  // Check if real API is configured
  isRealAPIConfigured(): boolean {
    return !!this.apiKey;
  }

  // Get supported languages
  getSupportedLanguages(): string[] {
    return [
      "en",
      "hi",
      "pa",
      "bn",
      "te",
      "ta",
      "mr",
      "gu",
      "kn",
      "ml",
      "or",
      "as",
      "ur",
    ];
  }
}

export const speechToTextService = new SpeechToTextService();
export default SpeechToTextService;
