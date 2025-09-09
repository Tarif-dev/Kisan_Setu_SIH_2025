import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, TrendingUp, TrendingDown } from 'lucide-react-native';

export default function MarketScreen() {
  const [selectedCrop, setSelectedCrop] = useState('rice');

  const trendingCrops = ['Rice', 'Wheat', 'Corn', 'Soybeans'];
  
  const marketData = [
    {
      name: 'Rice',
      price: '$15.50',
      unit: 'per bushel',
      change: '+1.2%',
      trend: 'up',
      image: 'https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg'
    },
    {
      name: 'Wheat',
      price: '$7.25',
      unit: 'per bushel',
      change: '-0.8%',
      trend: 'down',
      image: 'https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg'
    },
    {
      name: 'Corn',
      price: '$4.75',
      unit: 'per bushel',
      change: '+2.1%',
      trend: 'up',
      image: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg'
    },
    {
      name: 'Soybeans',
      price: '$12.00',
      unit: 'per bushel',
      change: '0.0%',
      trend: 'neutral',
      image: 'https://images.pexels.com/photos/1459324/pexels-photo-1459324.jpeg'
    },
    {
      name: 'Cotton',
      price: '$0.75',
      unit: 'per lb',
      change: '-0.5%',
      trend: 'down',
      image: 'https://images.pexels.com/photos/1459363/pexels-photo-1459363.jpeg'
    }
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp size={16} color="#22c55e" />;
    if (trend === 'down') return <TrendingDown size={16} color="#ef4444" />;
    return <View style={{ width: 16, height: 16 }} />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-slate-400';
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
          <Text className="text-white text-xl font-bold">Market Prices</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View className="px-6 mb-6">
            <View className="bg-slate-800/50 rounded-2xl px-4 py-3 flex-row items-center">
              <Search size={20} color="#64748b" />
              <TextInput
                placeholder="Search for crops"
                placeholderTextColor="#64748b"
                className="flex-1 ml-3 text-white text-base"
              />
            </View>
          </View>

          {/* Trending Crops */}
          <View className="px-6 mb-6">
            <Text className="text-white text-lg font-semibold mb-4">Trending Crops</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {trendingCrops.map((crop, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedCrop(crop.toLowerCase())}
                  className={`mr-3 px-6 py-3 rounded-full ${
                    selectedCrop === crop.toLowerCase() 
                      ? 'bg-primary-500' 
                      : 'bg-slate-800/50'
                  }`}
                >
                  <Text className={`font-semibold ${
                    selectedCrop === crop.toLowerCase() 
                      ? 'text-white' 
                      : 'text-slate-300'
                  }`}>
                    {crop}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Market Data */}
          <View className="px-6">
            {marketData.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="bg-slate-800/30 rounded-2xl p-4 mb-4 flex-row items-center"
              >
                <Image
                  source={{ uri: item.image }}
                  className="w-16 h-16 rounded-xl mr-4"
                />
                
                <View className="flex-1">
                  <Text className="text-white text-lg font-semibold mb-1">
                    {item.name}
                  </Text>
                  <Text className="text-slate-400 text-sm">
                    {item.unit}
                  </Text>
                </View>

                <View className="items-end">
                  <Text className="text-white text-xl font-bold mb-1">
                    {item.price}
                  </Text>
                  <View className="flex-row items-center">
                    {getTrendIcon(item.trend)}
                    <Text className={`text-sm font-semibold ml-1 ${getTrendColor(item.trend)}`}>
                      {item.change}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Market Summary */}
          <View className="px-6 pb-8">
            <View className="bg-slate-800/30 rounded-2xl p-6">
              <Text className="text-white text-lg font-semibold mb-4">Market Summary</Text>
              <View className="flex-row justify-between mb-3">
                <Text className="text-slate-400">Top Performer</Text>
                <Text className="text-green-500 font-semibold">Corn (+2.1%)</Text>
              </View>
              <View className="flex-row justify-between mb-3">
                <Text className="text-slate-400">Biggest Decline</Text>
                <Text className="text-red-500 font-semibold">Wheat (-0.8%)</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-slate-400">Average Change</Text>
                <Text className="text-slate-300 font-semibold">+0.4%</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}