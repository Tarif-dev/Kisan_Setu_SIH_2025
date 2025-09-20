import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { getStoredLanguage, setAppLanguage } from '../config/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  useEffect(() => {
    const initLanguage = async () => {
      const storedLanguage = await getStoredLanguage();
      await setAppLanguage(storedLanguage);
    };
    initLanguage();
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default I18nProvider;