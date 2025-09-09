import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Menu, 
  Bell, 
  Search, 
  Sun, 
  Droplets, 
  Leaf, 
  Bug, 
  TrendingUp 
} from 'lucide-react-native';

export default function HomeScreen() {
  const weatherData = {
    temperature: '28°C',
    condition: 'Partly Cloudy',
    alert: 'Heavy rainfall expected tomorrow. Prepare for waterlogging.'
  };

  const quickAccessItems = [
    { 
      icon: Leaf, 
      title: 'Soil Health', 
      color: 'bg-emerald-500',
      description: 'Check soil conditions'
    },
    { 
      icon: Bug, 
      title: 'Pest Detection', 
      color: 'bg-orange-500',
      description: 'Identify pests & diseases'
    },
    { 
      icon: TrendingUp, 
      title: 'Market Prices', 
      color: 'bg-blue-500',
      description: 'Current market rates'
    }
  ];

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b']}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center px-6 py-4">
          <TouchableOpacity>
            <Menu size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">AgriAssist</Text>
          <TouchableOpacity>
            <Bell size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View className="px-6 mb-6">
            <View className="bg-slate-800/50 rounded-2xl px-4 py-3 flex-row items-center">
              <Search size={20} color="#64748b" />
              <TextInput
                placeholder="Search for crops, diseases..."
                placeholderTextColor="#64748b"
                className="flex-1 ml-3 text-white text-base"
              />
            </View>
          </View>

          {/* Today's Advisory */}
          <View className="px-6 mb-6">
            <Text className="text-white text-2xl font-bold mb-4">Today's Advisory</Text>
            <ImageBackground
              source={{ uri: 'https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg' }}
              className="rounded-2xl overflow-hidden"
            >
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                className="p-6 min-h-[200px] justify-end"
              >
                <Text className="text-white text-xl font-bold mb-2">Wheat Advisory</Text>
                <Text className="text-slate-300 text-base mb-3 leading-5">
                  High risk of fungal diseases due to recent rainfall. Apply fungicide within 48 hours.
                </Text>
                <TouchableOpacity className="bg-primary-500 rounded-xl py-2 px-4 self-start">
                  <Text className="text-white font-semibold">Learn More</Text>
                </TouchableOpacity>
              </LinearGradient>
            </ImageBackground>
          </View>

          {/* Weather Section */}
          <View className="px-6 mb-6">
            <Text className="text-white text-2xl font-bold mb-4">Weather</Text>
            
            {/* Current Conditions */}
            <View className="bg-slate-800/30 rounded-2xl p-6 mb-4">
              <Text className="text-slate-400 text-base mb-2">Current Conditions</Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-white text-3xl font-bold">{weatherData.temperature}</Text>
                <Sun size={48} color="#fbbf24" />
              </View>
              <Text className="text-slate-400 text-lg">{weatherData.condition}</Text>
            </View>

            {/* Weather Alert */}
            <View className="bg-blue-900/30 border border-blue-700 rounded-2xl p-6">
              <View className="flex-row items-center mb-2">
                <Droplets size={20} color="#3b82f6" />
                <Text className="text-blue-400 text-base font-semibold ml-2">Weather Alert</Text>
              </View>
              <Text className="text-slate-300 text-base leading-5">
                {weatherData.alert}
              </Text>
            </View>
          </View>

          {/* Quick Access */}
          <View className="px-6 mb-8">
            <Text className="text-white text-2xl font-bold mb-4">Quick Access</Text>
            <View className="flex-row flex-wrap justify-between">
              {quickAccessItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-slate-800/30 rounded-2xl p-6 mb-4 w-[48%] items-center"
                >
                  <View className={`w-16 h-16 rounded-2xl ${item.color} items-center justify-center mb-3`}>
                    <item.icon size={28} color="#ffffff" />
                  </View>
                  <Text className="text-white text-base font-semibold text-center mb-1">
                    {item.title}
                  </Text>
                  <Text className="text-slate-400 text-sm text-center">
                    {item.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}