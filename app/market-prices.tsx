import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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

const MarketPrices = () => {
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
      price: 7.26,
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
      icon: "restaurant",
    },
    {
      id: "4",
      name: "Soybeans",
      price: 13.89,
      change: -0.15,
      changePercent: -1.1,
      unit: "per bushel",
      icon: "flower",
    },
    {
      id: "5",
      name: "Cotton",
      price: 0.68,
      change: 0.03,
      changePercent: 4.6,
      unit: "per pound",
      icon: "flower-outline",
    },
    {
      id: "6",
      name: "Tomatoes",
      price: 25.5,
      change: 1.2,
      changePercent: 4.9,
      unit: "per kg",
      icon: "leaf-outline",
    },
    {
      id: "7",
      name: "Potatoes",
      price: 18.75,
      change: -0.85,
      changePercent: -4.3,
      unit: "per kg",
      icon: "nutrition-outline",
    },
    {
      id: "8",
      name: "Onions",
      price: 22.3,
      change: 0.45,
      changePercent: 2.1,
      unit: "per kg",
      icon: "ellipse",
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);

    // Simulate API call
    setTimeout(() => {
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
    }, 1000);
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
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-1 ml-4">
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

      {/* Market Summary */}
      <View className="mx-4 mb-4">
        <View className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
          <Text className="text-white font-semibold text-lg mb-3">
            Market Summary
          </Text>
          <View className="flex-row justify-between">
            <View className="flex-1">
              <Text className="text-gray-400 text-sm">Gainers</Text>
              <Text className="text-green-400 font-bold text-xl">
                {filteredCrops.filter((crop) => crop.change > 0).length}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-400 text-sm">Losers</Text>
              <Text className="text-red-400 font-bold text-xl">
                {filteredCrops.filter((crop) => crop.change < 0).length}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-400 text-sm">Unchanged</Text>
              <Text className="text-gray-400 font-bold text-xl">
                {filteredCrops.filter((crop) => crop.change === 0).length}
              </Text>
            </View>
          </View>
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#22C55E"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredCrops.map((crop) => (
          <PriceCard key={crop.id} crop={crop} />
        ))}

        {filteredCrops.length === 0 && (
          <View className="items-center justify-center py-8">
            <Ionicons name="search" size={48} color="#6B7280" />
            <Text className="text-gray-400 text-lg mt-4">No crops found</Text>
            <Text className="text-gray-500 text-sm mt-2">
              Try adjusting your search term
            </Text>
          </View>
        )}

        <View className="h-20" />
      </ScrollView>
    </View>
  );
};

export default MarketPrices;
