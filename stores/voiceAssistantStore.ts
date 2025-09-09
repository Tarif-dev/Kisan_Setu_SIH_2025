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
}

interface VoiceAssistantActions {
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  processVoiceQuery: (transcript: string) => Promise<void>;
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

    // Actions
    startListening: async () => {
      try {
        set({ isListening: true, error: null, transcript: "" });
        await voiceAssistantService.startListening();

        // Auto-stop listening after 5 seconds for demo
        setTimeout(async () => {
          const { isListening } = get();
          if (isListening) {
            await get().stopListening();
          }
        }, 5000);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to start listening";
        set({
          isListening: false,
          error: errorMessage,
        });
      }
    },

    stopListening: async () => {
      try {
        set({ isProcessing: true });
        const result = await voiceAssistantService.stopListening();

        set({
          isListening: false,
          transcript: result.transcript,
          isProcessing: false,
        });

        // Process the transcript
        await get().processVoiceQuery(result.transcript);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to stop listening";
        set({
          isListening: false,
          isProcessing: false,
          error: errorMessage,
        });
      }
    },

    processVoiceQuery: async (transcript: string) => {
      try {
        set({ isProcessing: true, error: null });

        // Get AI response from Gemini
        const aiResponse =
          await voiceAssistantService.getAIResponse(transcript);

        set({
          response: aiResponse.text,
          isProcessing: false,
          isSpeaking: true,
        });

        // Speak the response
        await voiceAssistantService.speakResponse(aiResponse.text);

        set({ isSpeaking: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to process query";
        set({
          isProcessing: false,
          isSpeaking: false,
          error: errorMessage,
        });
      }
    },

    setLanguage: (language: string) => {
      set({ language });
      voiceAssistantService.setLanguage(language);
    },

    clearError: () => {
      set({ error: null });
    },

    reset: () => {
      set({
        transcript: "",
        response: "",
        error: null,
        isListening: false,
        isProcessing: false,
        isSpeaking: false,
      });
    },

    checkSupport: async () => {
      try {
        const support = await voiceAssistantService.checkVoiceSupport();
        set({ isSupported: support });
      } catch (error) {
        set({ isSupported: { recording: false, speech: false } });
      }
    },

    stopAll: async () => {
      try {
        await voiceAssistantService.stopAll();
        set({
          isListening: false,
          isProcessing: false,
          isSpeaking: false,
          error: null,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to stop voice operations";
        set({ error: errorMessage });
      }
    },
  })
);
