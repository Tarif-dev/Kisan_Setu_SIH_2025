import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next, { changeLanguage } from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../../translations/en.json';
import hi from '../../translations/hi.json';

const LANGUAGE_KEY = '@language_key';

export const getStoredLanguage = async () => {
  try {
    return await AsyncStorage.getItem(LANGUAGE_KEY) || 'en';
  } catch (error) {
    console.error('Error reading language preference:', error);
    return 'en';
  }
};

export const setStoredLanguage = async (language: string) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error('Error saving language preference:', error);
  }
};

i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export const setAppLanguage = async (language: string) => {
  await changeLanguage(language);
  await setStoredLanguage(language);
};

export default i18next;