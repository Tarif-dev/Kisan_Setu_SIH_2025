// Language Context Provider for managing app-wide language state
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import localizationService, {
  SUPPORTED_LANGUAGES,
} from "../services/localizationService";

interface LanguageContextType {
  currentLanguage: string;
  languageDetails: (typeof SUPPORTED_LANGUAGES)[keyof typeof SUPPORTED_LANGUAGES];
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
  setLanguage: (language: string) => Promise<void>;
  t: (key: string, params?: Record<string, string>) => string;
  isRTL: boolean;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>("en");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initialize language service and set up listener
    const initializeLanguage = async () => {
      try {
        // Get current language from service
        const language = localizationService.getCurrentLanguage();
        setCurrentLanguage(language);

        // Add listener for language changes
        const unsubscribe = localizationService.addLanguageChangeListener(
          (newLanguage) => {
            setCurrentLanguage(newLanguage);
          }
        );

        setIsLoading(false);

        // Return cleanup function
        return unsubscribe;
      } catch (error) {
        console.error("Failed to initialize language service:", error);
        setIsLoading(false);
        return () => {}; // Return empty cleanup function on error
      }
    };

    let cleanup: (() => void) | undefined;

    initializeLanguage().then((unsubscribe) => {
      cleanup = unsubscribe;
    });

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  const handleSetLanguage = async (language: string): Promise<void> => {
    try {
      await localizationService.setLanguage(language);
      // State will be updated via the listener
    } catch (error) {
      console.error("Failed to set language:", error);
      throw error;
    }
  };

  const translate = (key: string, params?: Record<string, string>): string => {
    return localizationService.t(key, params);
  };

  const contextValue: LanguageContextType = {
    currentLanguage,
    languageDetails: localizationService.getCurrentLanguageDetails(),
    supportedLanguages: SUPPORTED_LANGUAGES,
    setLanguage: handleSetLanguage,
    t: translate,
    isRTL: localizationService.isRTL(),
    isLoading,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// HOC for class components
export const withLanguage = <P extends object>(
  Component: React.ComponentType<P & { language: LanguageContextType }>
) => {
  return (props: P) => {
    const language = useLanguage();
    return <Component {...props} language={language} />;
  };
};

export default LanguageContext;
