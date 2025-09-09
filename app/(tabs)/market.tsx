import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface CropPrice {
  id: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  unit: string;
  icon: string;
}

const Market = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [crops, setCrops] = useState<CropPrice[]>([
    {
      id: "1",
      name: "Rice",
      price: 15.5,
      change: 0.12,
      changePercent: 1.2,
      unit: "per bushel",
      icon: "leaf",
    },
    {
      id: "2",
      name: "Wheat",
      price: 7.25,
      change: -0.08,
      changePercent: -0.8,
      unit: "per bushel",
      icon: "nutrition",
    },
    {
      id: "3",
      name: "Corn",
      price: 4.75,
      change: 0.21,
      changePercent: 2.1,
      unit: "per bushel",
      icon: "flower",
    },
    {
      id: "4",
      name: "Soybeans",
      price: 12.0,
      change: 0.0,
      changePercent: 0.0,
      unit: "per bushel",
      icon: "leaf",
    },
    {
      id: "5",
      name: "Cotton",
      price: 0.75,
      change: -0.05,
      changePercent: -0.6,
      unit: "per lb",
      icon: "cloud",
    },
    {
      id: "6",
      name: "Sugarcane",
      price: 28.5,
      change: 0.45,
      changePercent: 1.8,
      unit: "per ton",
      icon: "leaf",
    },
    {
      id: "7",
      name: "Barley",
      price: 6.8,
      change: -0.15,
      changePercent: -1.2,
      unit: "per bushel",
      icon: "nutrition",
    },
    {
      id: "8",
      name: "Oats",
      price: 3.9,
      change: 0.08,
      changePercent: 0.9,
      unit: "per bushel",
      icon: "flower",
    },
  ]);

  const trendingCrops = ["Rice", "Wheat", "Corn", "Soybeans"];

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update prices with random changes
    setCrops((prevCrops) =>
      prevCrops.map((crop) => ({
        ...crop,
        price: crop.price + (Math.random() - 0.5) * 0.5,
        change: (Math.random() - 0.5) * 0.3,
        changePercent: (Math.random() - 0.5) * 3,
      }))
    );

    setRefreshing(false);
  };

  const filteredCrops = crops.filter((crop) =>
    crop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const PriceCard = ({ crop }: { crop: CropPrice }) => (
    <TouchableOpacity className="bg-gray-800 rounded-2xl p-4 mb-4 border border-gray-700">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 bg-green-500/20 rounded-full items-center justify-center mr-4">
            <Ionicons name={crop.icon as any} size={24} color="#22C55E" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-semibold text-lg">
              {crop.name}
            </Text>
            <Text className="text-gray-400 text-sm">{crop.unit}</Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-white font-bold text-xl">
            ${crop.price.toFixed(2)}
          </Text>
          <View className="flex-row items-center mt-1">
            <Ionicons
              name={crop.change >= 0 ? "trending-up" : "trending-down"}
              size={16}
              color={crop.change >= 0 ? "#22C55E" : "#EF4444"}
            />
            <Text
              className={`ml-1 font-medium ${
                crop.change >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {crop.changePercent >= 0 ? "+" : ""}
              {crop.changePercent.toFixed(1)}%
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="pt-12 pb-6 px-4 bg-gray-800">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-white">Market Prices</Text>
            <Text className="text-gray-400 mt-1">
              Real-time crop market prices
            </Text>
          </View>
          <TouchableOpacity onPress={onRefresh}>
            <Ionicons name="refresh" size={24} color="#22C55E" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View className="px-4 py-4">
        <View className="flex-row items-center bg-gray-800 rounded-xl px-4 py-3 border border-gray-700">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 text-white text-lg ml-3"
            placeholder="Search for crops"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Trending Crops */}
        <View className="mb-6">
          <Text className="text-white font-semibold text-lg mb-4">
            Trending Crops
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {trendingCrops.map((cropName, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSearchQuery(cropName)}
                className="bg-green-500 rounded-full px-4 py-2 mr-3"
              >
                <Text className="text-white font-medium">{cropName}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Market Prices List */}
        <View className="mb-8">
          {filteredCrops.map((crop) => (
            <PriceCard key={crop.id} crop={crop} />
          ))}

          {filteredCrops.length === 0 && (
            <View className="items-center py-8">
              <Ionicons name="search" size={48} color="#6B7280" />
              <Text className="text-gray-400 text-lg mt-4">
                No crops found for "{searchQuery}"
              </Text>
            </View>
          )}
        </View>

        {/* Market Analysis */}
        <View className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700">
          <View className="flex-row items-center mb-4">
            <Ionicons name="analytics" size={20} color="#22C55E" />
            <Text className="text-lg font-semibold text-white ml-2">
              Market Analysis
            </Text>
          </View>

          <View className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
            <Text className="text-blue-400 font-medium mb-2">
              Today's Market Trends
            </Text>
            <Text className="text-gray-300 text-sm">
              • Rice and Corn showing positive growth due to increased demand
              {"\n"}• Wheat prices slightly down due to seasonal harvest{"\n"}•
              Cotton facing pressure from international markets{"\n"}• Soybeans
              remain stable with steady demand
            </Text>
          </View>

          <View className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <Text className="text-yellow-400 font-medium mb-2">
              Price Alert
            </Text>
            <Text className="text-gray-300 text-sm">
              Corn prices have increased by 2.1% today. Consider selling if you
              have inventory ready.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Market;
