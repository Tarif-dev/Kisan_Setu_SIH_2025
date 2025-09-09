import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, MapPin, AlertTriangle } from 'lucide-react-native';

export default function AdvisoryScreen() {
  const advisories = [
    {
      id: 1,
      crop: 'Wheat',
      title: 'Fungal Disease Risk',
      description: 'High risk of fungal diseases due to recent rainfall. Apply fungicide within 48 hours to prevent crop damage.',
      priority: 'high',
      timeAgo: '2 hours ago',
      location: 'Farmville',
      image: 'https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg'
    },
    {
      id: 2,
      crop: 'Rice',
      title: 'Optimal Planting Time',
      description: 'Weather conditions are favorable for rice planting. Consider starting within the next 5 days.',
      priority: 'medium',
      timeAgo: '4 hours ago',
      location: 'Farmville',
      image: 'https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg'
    },
    {
      id: 3,
      crop: 'Corn',
      title: 'Irrigation Schedule',
      description: 'Adjust irrigation schedule based on upcoming weather patterns to optimize water usage.',
      priority: 'low',
      timeAgo: '6 hours ago',
      location: 'Farmville',
      image: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

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
          <Text className="text-white text-xl font-bold">Advisory</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Current Alert */}
          <View className="px-6 mb-6">
            <View className="bg-red-900/30 border border-red-700 rounded-2xl p-6">
              <View className="flex-row items-center mb-3">
                <AlertTriangle size={24} color="#ef4444" />
                <Text className="text-red-400 text-lg font-bold ml-2">Urgent Advisory</Text>
              </View>
              <Text className="text-white text-base font-semibold mb-2">
                Wheat Fungal Disease Alert
              </Text>
              <Text className="text-slate-300 text-base leading-5 mb-3">
                Immediate action required. Apply recommended fungicide treatment within 48 hours.
              </Text>
              <TouchableOpacity className="bg-red-500 rounded-xl py-2 px-4 self-start">
                <Text className="text-white font-semibold">View Details</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* All Advisories */}
          <View className="px-6">
            <Text className="text-white text-2xl font-bold mb-4">All Advisories</Text>
            
            {advisories.map((advisory) => (
              <TouchableOpacity
                key={advisory.id}
                className="bg-slate-800/30 rounded-2xl mb-4 overflow-hidden"
              >
                <ImageBackground
                  source={{ uri: advisory.image }}
                  className="h-32"
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    className="flex-1 justify-end p-4"
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-white text-lg font-bold">
                        {advisory.crop} Advisory
                      </Text>
                      <View className={`px-2 py-1 rounded-full ${getPriorityColor(advisory.priority)}`}>
                        <Text className="text-white text-xs font-semibold uppercase">
                          {advisory.priority}
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </ImageBackground>
                
                <View className="p-4">
                  <Text className="text-white text-base font-semibold mb-2">
                    {advisory.title}
                  </Text>
                  <Text className="text-slate-300 text-sm leading-5 mb-3">
                    {advisory.description}
                  </Text>
                  
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Clock size={14} color="#64748b" />
                      <Text className="text-slate-400 text-xs ml-1">
                        {advisory.timeAgo}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <MapPin size={14} color="#64748b" />
                      <Text className="text-slate-400 text-xs ml-1">
                        {advisory.location}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}