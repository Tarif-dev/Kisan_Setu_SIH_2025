import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Check, ChevronDown } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ar', name: 'Arabic' },
];

export default function WelcomeScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showLanguages, setShowLanguages] = useState(false);
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  const selectedLang = languages.find(lang => lang.code === selectedLanguage);

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b', '#334155']}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        <Animated.View 
          style={{
            flex: 1,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="flex-1 justify-center items-center px-8"
        >
          {/* Logo/Icon */}
          <View className="w-24 h-24 bg-primary-500 rounded-full items-center justify-center mb-8">
            <Check size={32} color="#ffffff" strokeWidth={3} />
          </View>

          {/* Welcome Text */}
          <Text className="text-white text-4xl font-bold text-center mb-2">
            Welcome to{'\n'}AgriAssist
          </Text>
          
          <Text className="text-slate-400 text-lg text-center mb-12 leading-6">
            Select your preferred language to get{'\n'}started.
          </Text>

          {/* Language Selector */}
          <View className="w-full mb-12">
            <TouchableOpacity
              onPress={() => setShowLanguages(!showLanguages)}
              className="bg-slate-800/50 border border-slate-600 rounded-2xl px-6 py-4 flex-row justify-between items-center"
            >
              <Text className="text-white text-lg">{selectedLang?.name}</Text>
              <ChevronDown 
                size={24} 
                color="#94a3b8" 
                style={{ 
                  transform: [{ rotate: showLanguages ? '180deg' : '0deg' }]
                }}
              />
            </TouchableOpacity>
            
            {showLanguages && (
              <View className="bg-slate-800/90 border border-slate-600 rounded-2xl mt-2 overflow-hidden">
                {languages.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    onPress={() => {
                      setSelectedLanguage(lang.code);
                      setShowLanguages(false);
                    }}
                    className="px-6 py-4 border-b border-slate-600 last:border-b-0"
                  >
                    <Text className={`text-lg ${selectedLanguage === lang.code ? 'text-primary-400' : 'text-white'}`}>
                      {lang.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleContinue}
            className="w-full bg-primary-500 rounded-2xl py-4 shadow-lg"
          >
            <Text className="text-white text-xl font-semibold text-center">
              Continue
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}