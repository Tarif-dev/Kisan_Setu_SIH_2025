import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    Modal,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { getStoredLanguage, setAppLanguage } from "../../config/i18n";

const Settings = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    notifications: true,
    voiceSupport: false,
    locationSharing: true,
  });
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  useEffect(() => {
    const loadLanguage = async () => {
      const storedLanguage = await getStoredLanguage();
      setCurrentLanguage(storedLanguage);
    };
    loadLanguage();
  }, []);

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleLanguageChange = async (language: string) => {
    await setAppLanguage(language);
    setCurrentLanguage(language);
  };

  return (
    <ScrollView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="pt-12 pb-4 px-4 bg-gray-900">
        <View className="flex-row items-center">
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white ml-4">{t('tabs.settings')}</Text>
        </View>
      </View>

      {/* Preferences Section */}
      <View className="mx-4 mb-6">
        <Text className="text-xl font-bold text-white mb-4">{t('common.preferences')}</Text>

        <View className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
          <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-700">
            <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-4">
              <Ionicons name="location" size={20} color="#22C55E" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-medium text-base">{t('settings.options.location')}</Text>
              <Text className="text-gray-400 text-sm">
                {t('common.currentLocation')}: {t('settings.options.location')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <View className="flex-row items-center p-4 border-b border-gray-700">
            <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-4">
              <Ionicons name="notifications" size={20} color="#22C55E" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-medium text-base">
                {t('settings.options.notifications')}
              </Text>
              <Text className="text-gray-400 text-sm">{settings.notifications ? t('common.on') : t('common.off')}</Text>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={(value) => updateSetting("notifications", value)}
              trackColor={{ false: "#374151", true: "#22C55E" }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity 
            className="flex-row items-center p-4"
            onPress={() => setShowLanguageModal(true)}
          >
            <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-4">
              <Ionicons name="language" size={20} color="#22C55E" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-medium text-base">{t('settings.language')}</Text>
              <Text className="text-gray-400 text-sm">
                {currentLanguage === 'en' ? t('settings.english') : t('settings.hindi')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Voice Support Section */}
      <View className="mx-4 mb-6">
        <Text className="text-xl font-bold text-white mb-4">{t('common.voiceSupport')}</Text>

        <View className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-4">
                <Ionicons name="mic" size={20} color="#22C55E" />
              </View>
              <Text className="text-white font-medium text-base">
                {t('settings.options.voice')}
              </Text>
            </View>
            <Switch
              value={settings.voiceSupport}
              onValueChange={(value) => updateSetting("voiceSupport", value)}
              trackColor={{ false: "#374151", true: "#22C55E" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </View>

      {/* Feedback Section */}
      <View className="mx-4 mb-8">
        <Text className="text-xl font-bold text-white mb-4">{t('common.feedback')}</Text>

        <View className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
          <TouchableOpacity
            className="flex-row items-center p-4 border-b border-gray-700"
            onPress={() => Alert.alert(t('common.reportIssue'), t('common.contactSupport'))}
          >
            <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-4">
              <Ionicons name="bug" size={20} color="#22C55E" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-medium text-base">
                {t('common.reportIssue')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center p-4"
            onPress={() => Alert.alert(t('common.feedback'), t('common.sendFeedback'))}
          >
            <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-4">
              <Ionicons name="chatbubble" size={20} color="#22C55E" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-medium text-base">
                {t('common.provideFeedback')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Language Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLanguageModal}
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-gray-800 rounded-t-3xl p-6">
            <Text className="text-xl font-bold text-white mb-4">
              {t('settings.selectLanguage')}
            </Text>
            <TouchableOpacity
              className={`p-4 rounded-xl mb-2 ${
                currentLanguage === 'en' ? 'bg-green-500' : 'bg-gray-700'
              }`}
              onPress={() => {
                handleLanguageChange('en');
                setShowLanguageModal(false);
              }}
            >
              <Text className="text-white font-medium text-center">
                {t('settings.english')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`p-4 rounded-xl mb-4 ${
                currentLanguage === 'hi' ? 'bg-green-500' : 'bg-gray-700'
              }`}
              onPress={() => {
                handleLanguageChange('hi');
                setShowLanguageModal(false);
              }}
            >
              <Text className="text-white font-medium text-center">
                {t('settings.hindi')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-4 rounded-xl bg-gray-700"
              onPress={() => setShowLanguageModal(false)}
            >
              <Text className="text-white font-medium text-center">
                {t('common.cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Settings;
