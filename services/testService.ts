import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { geminiService } from './geminiService';

export interface TextToSpeechOptions {
  text: string;
  language: 'en' | 'hi' | 'pa'; // English, Hindi, Punjabi
}

export interface LanguageOption {
  code: 'en' | 'hi' | 'pa';
  label: string;
  voiceCode: string;
}

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  language: string;
}

export class TestService {
  private geminiService = geminiService;
  private recording: Audio.Recording | null = null;
  private isRecording = false;
  private isProcessing = false;

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

  // Available language options
  getLanguageOptions(): LanguageOption[] {
    return [
      { code: 'en', label: 'English', voiceCode: 'en-US' },
      { code: 'hi', label: 'Hindi', voiceCode: 'hi-IN' },
      { code: 'pa', label: 'Punjabi', voiceCode: 'pa-IN' },
    ];
  }

  // Start voice recording
  async startListening(): Promise<void> {
    try {
      if (this.isRecording) {
        throw new Error("Already recording");
      }

      // Use the simpler createAsync approach with preset options
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
      this.isRecording = true;
      console.log("Recording started");
    } catch (error) {
      console.error("Failed to start recording:", error);
      throw error;
    }
  }

  // Stop voice recording and return mock transcript
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

      // For demo purposes, return a mock transcript
      // In a real implementation, you would send the audio to a speech-to-text service
      const mockTranscripts = [
        "How to control pests in tomatoes?",
        "What is the best fertilizer for wheat?",
        "When should I plant rice?",
        "How to improve soil quality?",
        "What are signs of plant diseases?"
      ];

      const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      console.log("Mock transcript:", randomTranscript);

      return randomTranscript;
    } catch (error) {
      console.error("Failed to stop recording:", error);
      throw error;
    }
  }

  // Check if currently recording
  getIsRecording(): boolean {
    return this.isRecording;
  }

  // Check if currently processing
  getIsProcessing(): boolean {
    return this.isProcessing;
  }

  // Process text input through Gemini and convert to speech
  async processTextToSpeech(userInput: string, language: 'en' | 'hi' | 'pa'): Promise<string> {
    try {
      // Create specialized agricultural prompts similar to voice assistant
      const agriculturalPrompts = {
        en: `You are an expert agricultural advisor speaking to a farmer. 
Respond in simple English that a farmer with basic education can understand. Use short sentences and explain technical terms.

Guidelines:
- Give practical, actionable advice
- Use simple language that low-literacy farmers can understand
- Focus on cost-effective solutions
- Consider local farming conditions
- Explain 'why' behind recommendations
- Keep responses concise but complete (2-3 sentences max)
- If technical terms are needed, explain them simply

Farmer's question: ${userInput}

Please provide helpful agricultural advice:`,

        hi: `आप एक कृषि विशेषज्ञ हैं जो किसान से बात कर रहे हैं।
किसान की सरल हिंदी में जवाब दें। छोटे वाक्य इस्तेमाल करें और तकनीकी शब्दों को समझाएं।

दिशानिर्देश:
- व्यावहारिक, कार्यशील सलाह दें
- सरल भाषा का प्रयोग करें जिसे कम पढ़े-लिखे किसान समझ सकें
- किफायती समाधान पर ध्यान दें
- स्थानीय कृषि परिस्थितियों को ध्यान में रखें
- सुझावों के पीछे का 'क्यों' समझाएं
- संक्षिप्त लेकिन पूर्ण उत्तर दें (अधिकतम 2-3 वाक्य)

किसान का प्रश्न: ${userInput}

कृपया उपयोगी कृषि सलाह दें:`,

        pa: `ਤੁਸੀਂ ਇੱਕ ਖੇਤੀ ਮਾਹਿਰ ਹੋ ਜੋ ਕਿਸਾਨ ਨਾਲ ਗੱਲ ਕਰ ਰਿਹਾ ਹੈ।
ਕਿਸਾਨ ਦੀ ਸਰਲ ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ। ਛੋਟੇ ਵਾਕ ਵਰਤੋ ਅਤੇ ਤਕਨੀਕੀ ਸ਼ਬਦਾਂ ਨੂੰ ਸਮਝਾਓ।

ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼:
- ਵਿਹਾਰਕ, ਅਮਲੀ ਸਲਾਹ ਦਿਓ
- ਸਰਲ ਭਾਸ਼ਾ ਵਰਤੋ ਜਿਸ ਨੂੰ ਘੱਟ ਪੜ੍ਹੇ-ਲਿਖੇ ਕਿਸਾਨ ਸਮਝ ਸਕਣ
- ਸਸਤੇ ਹੱਲਾਂ 'ਤੇ ਧਿਆਨ ਦਿਓ
- ਸਥਾਨਕ ਖੇਤੀ ਹਾਲਾਤਾਂ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖੋ
- ਸੁਝਾਵਾਂ ਦੇ ਪਿੱਛੇ ਦਾ 'ਕਿਉਂ' ਸਮਝਾਓ
- ਸੰਖੇਪ ਪਰ ਪੂਰਾ ਜਵਾਬ ਦਿਓ (ਵੱਧ ਤੋਂ ਵੱਧ 2-3 ਵਾਕ)

ਕਿਸਾਨ ਦਾ ਸਵਾਲ: ${userInput}

ਕਿਰਪਾ ਕਰਕੇ ਲਾਭਦਾਇਕ ਖੇਤੀ ਸਲਾਹ ਦਿਓ:`
      };

      // Get response from Gemini with retry logic (like voice assistant)
      const prompt = agriculturalPrompts[language];
      let geminiResponse;
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          geminiResponse = await this.geminiService.generateTextResponse(prompt);
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
      
      if (!geminiResponse || !geminiResponse.text) {
        throw new Error('No response received from Gemini service after retries');
      }

      // Convert to speech
      await this.convertToSpeech(geminiResponse.text, language);
      
      return geminiResponse.text;
    } catch (error) {
      console.error('Error in processTextToSpeech:', error);
      throw new Error(`Failed to process text to speech: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      this.isProcessing = false;
    }
  }

  // Process voice input (record -> transcribe -> get AI response -> speak)
  async processVoiceInput(language: 'en' | 'hi' | 'pa'): Promise<{ transcript: string; response: string }> {
    try {
      this.isProcessing = true;

      // Get transcript from recording (mock implementation)
      const transcript = await this.stopListening();
      
      if (!transcript || !transcript.trim()) {
        throw new Error('No speech detected');
      }

      // Get AI response
      const response = await this.processTextToSpeech(transcript, language);

      return { transcript, response };
    } catch (error) {
      console.error('Error in processVoiceInput:', error);
      throw new Error(`Failed to process voice input: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Convert text to speech
  async convertToSpeech(text: string, language: 'en' | 'hi' | 'pa'): Promise<void> {
    try {
      const languageMap = {
        en: 'en-US',
        hi: 'hi-IN',
        pa: 'pa-IN'
      };

      // Truncate text if it exceeds the 4000 character limit
      const maxLength = 3900; // Keeping some buffer
      let speechText = text;
      
      if (text.length > maxLength) {
        speechText = text.substring(0, maxLength) + '...';
        console.warn(`Text truncated to ${maxLength} characters for speech synthesis`);
      }

      const options: Speech.SpeechOptions = {
        language: languageMap[language],
        pitch: 1.0,
        rate: 0.8,
        voice: undefined, // Let the system choose the best voice
      };

      // Check if speech is available
      const isAvailable = await Speech.isSpeakingAsync();
      
      if (isAvailable) {
        await Speech.stop();
      }

      await Speech.speak(speechText, options);
    } catch (error) {
      console.error('Error in convertToSpeech:', error);
      throw new Error(`Failed to convert text to speech: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Stop current speech
  async stopSpeech(): Promise<void> {
    try {
      await Speech.stop();
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  }

  // Check if currently speaking
  async isSpeaking(): Promise<boolean> {
    try {
      return await Speech.isSpeakingAsync();
    } catch (error) {
      console.error('Error checking speech status:', error);
      return false;
    }
  }

  // Get available voices for a language
  async getAvailableVoices(): Promise<Speech.Voice[]> {
    try {
      return await Speech.getAvailableVoicesAsync();
    } catch (error) {
      console.error('Error getting available voices:', error);
      return [];
    }
  }

  // Stop all operations
  async stopAll(): Promise<void> {
    try {
      // Stop recording if active
      if (this.isRecording && this.recording) {
        await this.recording.stopAndUnloadAsync();
        this.isRecording = false;
      }
      
      // Stop speech
      await this.stopSpeech();
      
      this.isProcessing = false;
    } catch (error) {
      console.error('Error stopping all operations:', error);
    }
  }
}

export const testService = new TestService();
