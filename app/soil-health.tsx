import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
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
  const [recommendations, setRecommendations] = useState<
    FertilizerRecommendation[]
  >([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeSoil = async () => {
    if (
      !soilData.ph ||
      !soilData.organicMatter ||
      !soilData.nitrogen ||
      !soilData.phosphorus ||
      !soilData.potassium
    ) {
      Alert.alert("Missing Data", "Please fill in all soil parameters");
      return;
    }

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
    <View className="mb-4">
      <Text className="text-white font-medium mb-2">{label}</Text>
      <View className="flex-row items-center bg-gray-700 rounded-xl px-4 py-3">
        <TextInput
          className="flex-1 text-white text-lg"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
        />
        {unit && <Text className="text-gray-400 ml-2">{unit}</Text>}
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="pt-12 pb-6 px-4 bg-gray-800">
        <Text className="text-2xl font-bold text-white">Soil Health</Text>
        <Text className="text-gray-400 mt-1">
          Enter your soil data for personalized fertilizer recommendations
        </Text>
      </View>

      {/* Soil Data Input */}
      <View className="mx-4 my-6">
        <View className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <View className="flex-row items-center mb-6">
            <Ionicons name="analytics" size={20} color="#22C55E" />
            <Text className="text-lg font-semibold text-white ml-2">
              Soil Data Input
            </Text>
          </View>

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
            label="Nitrogen (N)"
            value={soilData.nitrogen?.toString() || ""}
            onChangeText={(text) =>
              setSoilData((prev) => ({
                ...prev,
                nitrogen: parseFloat(text) || 0,
              }))
            }
            placeholder="Enter nitrogen level"
            unit="kg/ha"
          />

          <InputField
            label="Phosphorus (P)"
            value={soilData.phosphorus?.toString() || ""}
            onChangeText={(text) =>
              setSoilData((prev) => ({
                ...prev,
                phosphorus: parseFloat(text) || 0,
              }))
            }
            placeholder="Enter phosphorus level"
            unit="kg/ha"
          />

          <InputField
            label="Potassium (K)"
            value={soilData.potassium?.toString() || ""}
            onChangeText={(text) =>
              setSoilData((prev) => ({
                ...prev,
                potassium: parseFloat(text) || 0,
              }))
            }
            placeholder="Enter potassium level"
            unit="kg/ha"
          />

          <TouchableOpacity
            onPress={analyzeSoil}
            disabled={isAnalyzing}
            className={`rounded-xl py-4 px-6 flex-row items-center justify-center ${
              isAnalyzing ? "bg-gray-600" : "bg-green-500"
            }`}
          >
            <Ionicons
              name={isAnalyzing ? "hourglass" : "flask"}
              size={20}
              color="white"
            />
            <Text className="text-white font-semibold text-lg ml-2">
              {isAnalyzing ? "Analyzing Soil..." : "Analyze Soil"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Fertilizer Recommendations */}
      {recommendations.length > 0 && (
        <View className="mx-4 mb-8">
          <View className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <View className="flex-row items-center mb-6">
              <Ionicons name="leaf" size={20} color="#22C55E" />
              <Text className="text-lg font-semibold text-white ml-2">
                Fertilizer Guidance
              </Text>
            </View>

            <Text className="text-gray-400 mb-4">
              Based on your soil analysis, we recommend the following:
            </Text>

            {recommendations.map((rec, index) => (
              <View key={index} className="bg-gray-700 rounded-xl p-4 mb-4">
                <View className="flex-row items-start">
                  <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-4">
                    <Ionicons
                      name={rec.icon as any}
                      size={20}
                      color="#22C55E"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-semibold text-lg">
                      {rec.name}
                    </Text>
                    <Text className="text-gray-400 text-sm mb-2">
                      {rec.type}
                    </Text>
                    <Text className="text-green-400 font-medium mb-2">
                      Amount: {rec.amount}
                    </Text>
                    <Text className="text-gray-300 text-sm leading-5">
                      {rec.applicationMethod}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            <View className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4">
              <View className="flex-row items-start">
                <Ionicons name="information-circle" size={16} color="#3B82F6" />
                <Text className="text-blue-400 text-sm ml-2 flex-1">
                  <Text className="font-semibold">Application Method:</Text>
                  {"\n"}
                  Apply fertilizers evenly across the field before planting.
                  Ensure soil coverage for optimal nutrient uptake.
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default SoilHealth;
