import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SoilAnalysis {
  ph: number;
  organicMatter: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

interface FertilizerRecommendation {
  name: string;
  type: string;
  amount: string;
  applicationMethod: string;
  icon: string;
}

const SoilHealth = () => {
  const [soilData, setSoilData] = useState<Partial<SoilAnalysis>>({});
  const [nutrientLevels, setNutrientLevels] = useState("");
  const [soilReportImage, setSoilReportImage] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<
    FertilizerRecommendation[]
  >([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant camera roll permissions to upload images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSoilReportImage(result.assets[0].uri);
    }
  };

  const takePhotoWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant camera permissions to take photos."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSoilReportImage(result.assets[0].uri);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      "Upload Soil Report",
      "Choose an option to upload your soil test report",
      [
        {
          text: "Camera",
          onPress: takePhotoWithCamera,
        },
        {
          text: "Gallery",
          onPress: pickImageFromGallery,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const analyzeSoil = async () => {
    setIsAnalyzing(true);

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock recommendations based on soil data
    const mockRecommendations: FertilizerRecommendation[] = [
      {
        name: "Urea",
        type: "Nitrogen-rich fertilizer",
        amount: "50 kg per hectare",
        applicationMethod:
          "Apply evenly across the field before planting. Ensure soil coverage for optimal nutrient uptake.",
        icon: "leaf",
      },
      {
        name: "Superphosphate",
        type: "Phosphorus-rich fertilizer",
        amount: "30 kg per hectare",
        applicationMethod:
          "Mix with soil during land preparation. Water thoroughly after application.",
        icon: "nutrition",
      },
      {
        name: "Potassium Chloride",
        type: "Potassium-rich fertilizer",
        amount: "25 kg per hectare",
        applicationMethod:
          "Apply in split doses. First during sowing, second during flowering stage.",
        icon: "flower",
      },
    ];

    setRecommendations(mockRecommendations);
    setIsAnalyzing(false);
  };

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    unit,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    unit?: string;
  }) => (
    <View className="mb-3">
      <Text className="text-gray-300 text-sm mb-2">{label}</Text>
      <View className="bg-gray-800 rounded-xl border border-gray-700">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          className="p-4 text-white text-base"
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="pt-12 pb-4 px-4 bg-gray-900">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white ml-4">
              Soil Health
            </Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Soil Report Upload */}
      <View className="mx-4 mb-6">
        <Text className="text-xl font-bold text-white mb-4">
          Upload Soil Test Report
        </Text>

        {soilReportImage ? (
          <View className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <View className="relative">
              <Image
                source={{ uri: soilReportImage }}
                className="w-full h-48 rounded-lg"
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => setSoilReportImage(null)}
                className="absolute top-2 right-2 bg-red-500 rounded-full p-2"
              >
                <Ionicons name="trash" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={showImagePickerOptions}
              className="bg-gray-700 rounded-xl py-3 px-4 flex-row items-center justify-center mt-3"
            >
              <Ionicons name="refresh" size={16} color="white" />
              <Text className="text-white font-medium ml-2">Change Image</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={showImagePickerOptions}
            className="bg-gray-800 rounded-xl p-6 border-2 border-dashed border-gray-600 items-center justify-center"
          >
            <View className="w-16 h-16 bg-green-500/20 rounded-full items-center justify-center mb-3">
              <Ionicons name="camera" size={24} color="#22C55E" />
            </View>
            <Text className="text-white font-medium text-base mb-1">
              Upload Soil Report
            </Text>
            <Text className="text-gray-400 text-sm text-center">
              Take a photo or select from gallery
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Soil Data Input */}
      <View className="mx-4 mb-6">
        <Text className="text-xl font-bold text-white mb-4">
          Soil Data Input
        </Text>

        <View>
          <InputField
            label="Soil pH Level"
            value={soilData.ph?.toString() || ""}
            onChangeText={(text) =>
              setSoilData((prev) => ({ ...prev, ph: parseFloat(text) || 0 }))
            }
            placeholder="Enter pH level (6.0-8.0)"
            unit="pH"
          />

          <InputField
            label="Organic Matter (%)"
            value={soilData.organicMatter?.toString() || ""}
            onChangeText={(text) =>
              setSoilData((prev) => ({
                ...prev,
                organicMatter: parseFloat(text) || 0,
              }))
            }
            placeholder="Enter organic matter percentage"
            unit="%"
          />

          <InputField
            label="Nutrient Levels (N, P, K)"
            value={nutrientLevels}
            onChangeText={setNutrientLevels}
            placeholder="Enter nutrient levels"
            unit="kg/ha"
          />
        </View>

        <TouchableOpacity
          onPress={analyzeSoil}
          disabled={isAnalyzing}
          className="bg-green-500 rounded-xl py-4 px-6 flex-row items-center justify-center mt-6"
        >
          <Ionicons name="flask" size={20} color="white" />
          <Text className="text-white font-semibold ml-2 text-lg">
            {isAnalyzing ? "Analyzing..." : "Analyze Soil"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Fertilizer Guidance */}
      <View className="mx-4 mb-6">
        <Text className="text-xl font-bold text-white mb-2">
          Fertilizer Guidance
        </Text>
        <Text className="text-gray-400 text-sm mb-4">
          Based on your soil analysis, we recommend the following:
        </Text>

        <View>
          <View className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-3">
            <View className="flex-row items-center mb-2">
              <View className="w-8 h-8 bg-green-500/20 rounded-full items-center justify-center mr-3">
                <Ionicons name="leaf" size={16} color="#22C55E" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold">Urea</Text>
                <Text className="text-gray-400 text-sm">
                  Nitrogen-rich fertilizer
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-3">
            <View className="flex-row items-center mb-2">
              <View className="w-8 h-8 bg-green-500/20 rounded-full items-center justify-center mr-3">
                <Ionicons name="leaf" size={16} color="#22C55E" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold">Superphosphate</Text>
                <Text className="text-gray-400 text-sm">
                  Phosphorus-rich fertilizer
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-3">
            <View className="flex-row items-center mb-2">
              <View className="w-8 h-8 bg-green-500/20 rounded-full items-center justify-center mr-3">
                <Ionicons name="leaf" size={16} color="#22C55E" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold">
                  Potassium Chloride
                </Text>
                <Text className="text-gray-400 text-sm">
                  Potassium-rich fertilizer
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Application Method */}
      <View className="mx-4 mb-8">
        <Text className="text-xl font-bold text-white mb-4">
          Application Method
        </Text>
        <View className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <Text className="text-gray-300 text-base leading-6">
            Apply fertilizers evenly across the field before planting. Ensure
            soil coverage for optimal nutrient uptake.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SoilHealth;
