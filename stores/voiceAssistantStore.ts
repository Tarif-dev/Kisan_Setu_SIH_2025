import { create } from "zustand";
import { voiceAssistantService } from "../services/voiceAssistantService";

interface VoiceAssistantState {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  transcript: string;
  response: string;
  error: string | null;
  language: string;
  isSupported: { recording: boolean; speech: boolean };
  supportedLanguages: Array<{
    code: string;
    name: string;
    speechCode: string;
    geminiPrompt: string;
  }>;
}

interface VoiceAssistantActions {
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  processTextQuery: (text: string) => Promise<void>;
  setLanguage: (language: string) => void;
  clearError: () => void;
  reset: () => void;
  checkSupport: () => Promise<void>;
  stopAll: () => Promise<void>;
}

type VoiceAssistantStore = VoiceAssistantState & VoiceAssistantActions;

export const useVoiceAssistantStore = create<VoiceAssistantStore>(
  (set, get) => ({
    // Initial state
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    transcript: "",
    response: "",
    error: null,
    language: "en-US",
    isSupported: { recording: false, speech: false },
    supportedLanguages: voiceAssistantService.getSupportedLanguages(),

    // Actions
    startListening: async () => {
      try {
        set({ isListening: true, error: null, transcript: "" });
        await voiceAssistantService.startListening();

        // Auto-stop listening after 10 seconds to prevent infinite recording
        setTimeout(async () => {
          const { isListening } = get();
          if (isListening) {
            await get().stopListening();
          }
        }, 10000);
      } catch (error) {
        console.error("Failed to start listening:", error);
        set({
          isListening: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to start voice recording",
        });
      }
    },

    stopListening: async () => {
      try {
        set({ isListening: false, isProcessing: true });

        // Get transcript from recording
        const transcript = await voiceAssistantService.stopListening();

        if (transcript && transcript.trim()) {
          set({ transcript });

          // Process the transcript
          await get().processTextQuery(transcript);
        } else {
          set({ isProcessing: false, error: "No speech detected" });
        }
      } catch (error) {
        console.error("Failed to stop listening:", error);
        set({
          isListening: false,
          isProcessing: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to process voice input",
        });
      }
    },

    processTextQuery: async (text: string) => {
      try {
        set({ isProcessing: true, error: null });

        // Get AI response
        const response = await voiceAssistantService.getAIResponse(text);

        set({
          response: response.text,
          isProcessing: false,
          isSpeaking: true,
        });

        // Speak the response
        await voiceAssistantService.speakResponse(response.text);

        set({ isSpeaking: false });
      } catch (error) {
        console.error("Failed to process query:", error);
        set({
          isProcessing: false,
          isSpeaking: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to process your question",
        });
      }
    },

    setLanguage: (language: string) => {
      voiceAssistantService.setLanguage(language);
      set({ language });
    },

    clearError: () => {
      set({ error: null });
    },

    reset: () => {
      set({
        isListening: false,
        isProcessing: false,
        isSpeaking: false,
        transcript: "",
        response: "",
        error: null,
      });
    },

    checkSupport: async () => {
      try {
        // Check if device supports recording and speech
        set({
          isSupported: {
            recording: true, // Assume supported, will be checked during actual usage
            speech: true,
          },
        });
      } catch (error) {
        console.error("Failed to check support:", error);
        set({
          isSupported: { recording: false, speech: false },
          error: "Voice features not supported on this device",
        });
      }
    },

    stopAll: async () => {
      try {
        await voiceAssistantService.stopAll();
        set({
          isListening: false,
          isProcessing: false,
          isSpeaking: false,
        });
      } catch (error) {
        console.error("Failed to stop all operations:", error);
      }
    },
  })
);
