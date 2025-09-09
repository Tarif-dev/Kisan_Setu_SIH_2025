import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  MapPin, 
  Bell, 
  Globe, 
  ChevronRight, 
  Mic, 
  MessageSquare, 
  Bug,
  User,
  Shield,
  HelpCircle
} from 'lucide-react-native';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [voiceSupportEnabled, setVoiceSupportEnabled] = useState(false);

  const preferencesItems = [
    {
      icon: MapPin,
      title: 'Location',
      subtitle: 'Current location: Farmville',
      hasArrow: true
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'On',
      hasSwitch: true,
      switchValue: notificationsEnabled,
      onSwitchChange: setNotificationsEnabled
    },
    {
      icon: Globe,
      title: 'Language',
      subtitle: 'English',
      hasArrow: true
    }
  ];

  const accessibilityItems = [
    {
      icon: Mic,
      title: 'Voice Support',
      hasSwitch: true,
      switchValue: voiceSupportEnabled,
      onSwitchChange: setVoiceSupportEnabled
    }
  ];

  const feedbackItems = [
    {
      icon: Bug,
      title: 'Report an Issue',
      hasArrow: true
    },
    {
      icon: MessageSquare,
      title: 'Provide Feedback',
      hasArrow: true
    }
  ];

  const accountItems = [
    {
      icon: User,
      title: 'Profile',
      subtitle: 'Manage your account',
      hasArrow: true
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      subtitle: 'Data and privacy settings',
      hasArrow: true
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get help when you need it',
      hasArrow: true
    }
  ];

  const renderSettingItem = (item: any, index: number) => (
    <TouchableOpacity
      key={index}
      className="bg-slate-800/30 rounded-2xl p-4 mb-3 flex-row items-center"
    >
      <View className="w-10 h-10 bg-slate-700 rounded-xl items-center justify-center mr-4">
        <item.icon size={20} color="#94a3b8" />
      </View>
      
      <View className="flex-1">
        <Text className="text-white text-base font-semibold mb-1">
          {item.title}
        </Text>
        {item.subtitle && (
          <Text className="text-slate-400 text-sm">
            {item.subtitle}
          </Text>
        )}
      </View>

      {item.hasSwitch && (
        <Switch
          value={item.switchValue}
          onValueChange={item.onSwitchChange}
          trackColor={{ false: '#374151', true: '#22c55e' }}
          thumbColor={item.switchValue ? '#ffffff' : '#9ca3af'}
        />
      )}

      {item.hasArrow && (
        <ChevronRight size={20} color="#64748b" />
      )}
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b']}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Preferences */}
          <View className="px-6 mb-8">
            <Text className="text-white text-2xl font-bold mb-4">Preferences</Text>
            {preferencesItems.map(renderSettingItem)}
          </View>

          {/* Account */}
          <View className="px-6 mb-8">
            <Text className="text-white text-2xl font-bold mb-4">Account</Text>
            {accountItems.map(renderSettingItem)}
          </View>

          {/* Accessibility */}
          <View className="px-6 mb-8">
            <Text className="text-white text-2xl font-bold mb-4">Accessibility</Text>
            {accessibilityItems.map(renderSettingItem)}
          </View>

          {/* Feedback */}
          <View className="px-6 mb-8">
            <Text className="text-white text-2xl font-bold mb-4">Feedback</Text>
            {feedbackItems.map(renderSettingItem)}
          </View>

          {/* App Info */}
          <View className="px-6 pb-8">
            <View className="bg-slate-800/20 rounded-2xl p-6 items-center">
              <Text className="text-white text-lg font-bold mb-2">AgriAssist</Text>
              <Text className="text-slate-400 text-sm mb-1">Version 1.0.0</Text>
              <Text className="text-slate-400 text-xs text-center">
                Your comprehensive agricultural assistant
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}