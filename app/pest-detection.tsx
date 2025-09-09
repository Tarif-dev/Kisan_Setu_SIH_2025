import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PestAnalysis {
  id: string;
  name: string;
  confidence: number;
  description: string;
  symptoms: string[];
  treatments: string[];
  prevention: string[];
  severity: "low" | "medium" | "high";
}

interface ScanResult {
  id: string;
  imagePath: string;
  analysis: PestAnalysis;
  timestamp: Date;
}

const PestDetection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<PestAnalysis | null>(
    null
  );
  const [recentScans] = useState<ScanResult[]>([
    {
      id: "1",
      imagePath: "leaf-blight",
      analysis: {
        id: "1",
        name: "Leaf Blight",
        confidence: 87,
        description:
          "Fungal disease affecting leaf tissues, commonly caused by high humidity and poor air circulation.",
        symptoms: [
          "Brown spots on leaves",
          "Yellowing around spots",
          "Premature leaf drop",
        ],
        treatments: [
          "Apply copper-based fungicide",
          "Remove infected leaves",
          "Improve air circulation",
        ],
        prevention: [
          "Avoid overhead watering",
          "Maintain proper spacing",
          "Use resistant varieties",
        ],
        severity: "medium",
      },
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      imagePath: "stem-rust",
      analysis: {
        id: "2",
        name: "Stem Rust",
        confidence: 92,
        description:
          "Serious fungal disease that affects stems and can cause significant crop loss if not treated promptly.",
        symptoms: [
          "Orange pustules on stems",
          "Weakened stems",
          "Reduced grain fill",
        ],
        treatments: [
          "Apply systemic fungicide immediately",
          "Remove severely infected plants",
          "Monitor spread",
        ],
        prevention: [
          "Use resistant varieties",
          "Crop rotation",
          "Early planting",
        ],
        severity: "high",
      },
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ]);

  const pickImage = async (useCamera: boolean) => {
    try {
      const permissionResult = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow camera/gallery access to use this feature."
        );
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to access camera/gallery");
    }
  };

  const analyzeImage = async (imageUri: string) => {
    setIsAnalyzing(true);
    setCurrentAnalysis(null);

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Mock analysis result
    const mockAnalysis: PestAnalysis = {
      id: Date.now().toString(),
      name: "Aphid Infestation",
      confidence: 89,
      description:
        "Small soft-bodied insects that feed on plant sap, commonly found on young shoots and leaves.",
      symptoms: [
        "Small green/black insects on leaves",
        "Sticky honeydew on plant surfaces",
        "Curling or yellowing leaves",
        "Stunted plant growth",
      ],
      treatments: [
        "Spray with insecticidal soap solution",
        "Release beneficial insects (ladybugs)",
        "Use neem oil spray",
        "Remove heavily infested parts",
      ],
      prevention: [
        "Regular monitoring of crops",
        "Maintain plant health",
        "Encourage beneficial insects",
        "Avoid over-fertilization with nitrogen",
      ],
      severity: "medium",
    };

    setCurrentAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "high":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="pt-12 pb-6 px-4 bg-gray-800">
        <Text className="text-2xl font-bold text-white">
          Pest & Disease Detection
        </Text>
        <Text className="text-gray-400 mt-1">
          Upload crop images to identify pests and diseases
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Image Upload Section */}
        <View className="bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-700">
          {selectedImage ? (
            <View className="items-center">
              <Image
                source={{ uri: selectedImage }}
                className="w-48 h-48 rounded-xl mb-4"
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => {
                  setSelectedImage(null);
                  setCurrentAnalysis(null);
                }}
                className="bg-gray-600 rounded-lg px-4 py-2"
              >
                <Text className="text-white font-medium">Upload New Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="items-center">
              <View className="w-32 h-32 bg-gray-700 rounded-2xl items-center justify-center mb-6">
                <Ionicons name="cloud-upload" size={48} color="#22C55E" />
              </View>

              <Text className="text-white font-semibold text-lg mb-2">
                Tap to upload a photo
              </Text>
              <Text className="text-gray-400 text-center mb-6">
                PNG, JPG, or WEBP formats supported
              </Text>

              <View className="flex-row space-x-4">
                <TouchableOpacity
                  onPress={() => pickImage(true)}
                  className="bg-green-500 rounded-xl px-6 py-3 flex-row items-center"
                >
                  <Ionicons name="camera" size={20} color="white" />
                  <Text className="text-white font-medium ml-2">Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => pickImage(false)}
                  className="bg-blue-500 rounded-xl px-6 py-3 flex-row items-center"
                >
                  <Ionicons name="images" size={20} color="white" />
                  <Text className="text-white font-medium ml-2">Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Analysis Loading */}
        {isAnalyzing && (
          <View className="bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-700">
            <View className="items-center">
              <View className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
              <Text className="text-white font-semibold text-lg mb-2">
                Analyzing Image...
              </Text>
              <Text className="text-gray-400 text-center">
                Our AI is examining your crop image for pests and diseases
              </Text>
            </View>
          </View>
        )}

        {/* Analysis Results */}
        {currentAnalysis && !isAnalyzing && (
          <View className="bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-700">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white font-semibold text-lg">
                Analysis Results
              </Text>
              <View className="flex-row items-center">
                <Text className="text-gray-400 text-sm mr-2">Confidence:</Text>
                <Text className="text-green-400 font-medium">
                  {currentAnalysis.confidence}%
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mb-4">
              <Text className="text-white font-bold text-xl">
                {currentAnalysis.name}
              </Text>
              <View className="ml-3 px-2 py-1 bg-gray-700 rounded-full">
                <Text
                  className={`text-xs font-medium ${getSeverityColor(currentAnalysis.severity)}`}
                >
                  {currentAnalysis.severity.toUpperCase()}
                </Text>
              </View>
            </View>

            <Text className="text-gray-300 text-sm leading-5 mb-6">
              {currentAnalysis.description}
            </Text>

            {/* Symptoms */}
            <View className="mb-6">
              <Text className="text-white font-semibold mb-3">Symptoms:</Text>
              {currentAnalysis.symptoms.map((symptom, index) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Ionicons name="alert-circle" size={16} color="#EF4444" />
                  <Text className="text-gray-300 text-sm ml-2 flex-1">
                    {symptom}
                  </Text>
                </View>
              ))}
            </View>

            {/* Treatments */}
            <View className="mb-6">
              <Text className="text-white font-semibold mb-3">
                Recommended Treatments:
              </Text>
              {currentAnalysis.treatments.map((treatment, index) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Ionicons name="medical" size={16} color="#22C55E" />
                  <Text className="text-gray-300 text-sm ml-2 flex-1">
                    {treatment}
                  </Text>
                </View>
              ))}
            </View>

            {/* Prevention */}
            <View>
              <Text className="text-white font-semibold mb-3">
                Prevention Tips:
              </Text>
              {currentAnalysis.prevention.map((tip, index) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Ionicons name="shield-checkmark" size={16} color="#3B82F6" />
                  <Text className="text-gray-300 text-sm ml-2 flex-1">
                    {tip}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Recent Scans */}
        <View className="mb-8">
          <Text className="text-white font-semibold text-lg mb-4">
            Recent Scans
          </Text>

          {recentScans.map((scan) => (
            <TouchableOpacity
              key={scan.id}
              className="bg-gray-800 rounded-2xl p-4 mb-4 border border-gray-700"
            >
              <View className="flex-row items-start">
                <View className="w-16 h-16 bg-gray-600 rounded-xl mr-4 items-center justify-center">
                  <Ionicons name="leaf" size={24} color="#22C55E" />
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-white font-semibold">
                      {scan.analysis.name}
                    </Text>
                    <Text
                      className={`text-xs font-medium ${getSeverityColor(scan.analysis.severity)}`}
                    >
                      {scan.analysis.severity.toUpperCase()}
                    </Text>
                  </View>

                  <Text className="text-gray-400 text-sm mb-2">
                    Scanned {scan.timestamp.toLocaleDateString()}
                  </Text>

                  <Text className="text-gray-300 text-sm">
                    Confidence: {scan.analysis.confidence}%
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={16} color="#6B7280" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default PestDetection;
