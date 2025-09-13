import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  PestDetectionResult,
  pestDetectionService,
} from "../services/pestDetectionService";

const PestDetection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<PestDetectionResult | null>(null);
  const [language, setLanguage] = useState<"english" | "hindi">("english");

  const pickImage = async (useCamera: boolean) => {
    try {
      const permissionResult = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          `Camera/Gallery access is required to ${useCamera ? "take photos" : "select images"}.`
        );
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: true,
            aspect: [1, 1],
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: true,
            aspect: [1, 1],
          });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const result =
        await pestDetectionService.analyzePlantImage(selectedImage);
      setAnalysisResult(result);
    } catch (error) {
      Alert.alert(
        "Analysis Failed",
        "Failed to analyze the image. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "text-green-400";
      case "Medium":
        return "text-yellow-400";
      case "High":
        return "text-orange-400";
      case "Critical":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getSeverityBgColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "bg-green-500/20";
      case "Medium":
        return "bg-yellow-500/20";
      case "High":
        return "bg-orange-500/20";
      case "Critical":
        return "bg-red-500/20";
      default:
        return "bg-gray-500/20";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Pest":
        return "bug";
      case "Disease":
        return "medical";
      case "Nutrient Deficiency":
        return "nutrition";
      case "Healthy":
        return "checkmark-circle";
      default:
        return "help-circle";
    }
  };

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
              Pest & Disease Detection
            </Text>
          </View>

          {/* Language Toggle */}
          <View className="flex-row bg-gray-800 rounded-lg overflow-hidden">
            <TouchableOpacity
              onPress={() => setLanguage("english")}
              className={`px-3 py-2 ${language === "english" ? "bg-blue-500" : "bg-transparent"}`}
            >
              <Text
                className={`text-sm font-medium ${language === "english" ? "text-white" : "text-gray-400"}`}
              >
                EN
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setLanguage("hindi")}
              className={`px-3 py-2 ${language === "hindi" ? "bg-blue-500" : "bg-transparent"}`}
            >
              <Text
                className={`text-sm font-medium ${language === "hindi" ? "text-white" : "text-gray-400"}`}
              >
                हिं
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Upload Section */}
      <View className="mx-4 mb-6">
        <Text className="text-gray-300 text-base mb-4 leading-6">
          Upload an image of the affected crop to identify potential pests or
          diseases and receive expert recommendations.
        </Text>

        <View className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <TouchableOpacity
            onPress={() => pickImage(false)}
            className="border-2 border-dashed border-gray-600 rounded-xl p-6 items-center justify-center mb-4"
            style={{ height: 180 }}
          >
            {selectedImage ? (
              <Image
                source={{ uri: selectedImage }}
                className="w-full h-full rounded-lg"
                resizeMode="cover"
              />
            ) : (
              <View className="items-center">
                <View className="w-16 h-16 bg-gray-700 rounded-full items-center justify-center mb-3">
                  <Ionicons name="camera" size={28} color="#9CA3AF" />
                </View>
                <Text className="text-white font-medium text-lg mb-2">
                  Select Plant Image
                </Text>
                <Text className="text-gray-400 text-sm text-center">
                  Take a clear photo of the affected plant
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Camera and Gallery Buttons */}
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={() => pickImage(true)}
              className="flex-1 bg-blue-500 rounded-xl py-3 px-4 flex-row items-center justify-center"
            >
              <Ionicons name="camera" size={18} color="white" />
              <Text className="text-white font-medium ml-2">Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => pickImage(false)}
              className="flex-1 bg-gray-700 rounded-xl py-3 px-4 flex-row items-center justify-center"
            >
              <Ionicons name="images" size={18} color="white" />
              <Text className="text-white font-medium ml-2">Gallery</Text>
            </TouchableOpacity>
          </View>

          {selectedImage && (
            <TouchableOpacity
              onPress={analyzeImage}
              disabled={isAnalyzing}
              className={`rounded-xl py-4 px-6 flex-row items-center justify-center mt-4 ${
                isAnalyzing ? "bg-gray-600" : "bg-green-500"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-semibold ml-2 text-lg">
                    Analyzing with AI...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="scan" size={20} color="white" />
                  <Text className="text-white font-semibold ml-2 text-lg">
                    Analyze with Gemini AI
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Analysis Results */}
      {analysisResult && (
        <View className="mx-4 mb-6">
          <View className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            {/* Result Header */}
            <View className="p-4 border-b border-gray-700">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View
                    className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${getSeverityBgColor(analysisResult.severity)}`}
                  >
                    <Ionicons
                      name={getCategoryIcon(analysisResult.category) as any}
                      size={24}
                      color="white"
                    />
                  </View>
                  <View className="flex-1">
                    {/* Main Name Based on Language */}
                    <Text className="text-white font-bold text-xl mb-1">
                      {language === "hindi"
                        ? analysisResult.pestName.hindi
                        : analysisResult.pestName.english}
                    </Text>
                    {/* Scientific Name */}
                    <Text className="text-gray-400 text-sm italic mb-2">
                      {analysisResult.scientificName}
                    </Text>
                    {/* Category and Confidence */}
                    <View className="flex-row items-center">
                      <View
                        className={`px-2 py-1 rounded-full mr-2 ${
                          analysisResult.category === "Disease"
                            ? "bg-red-500/20"
                            : analysisResult.category === "Pest"
                              ? "bg-orange-500/20"
                              : analysisResult.category === "Healthy"
                                ? "bg-green-500/20"
                                : "bg-gray-500/20"
                        }`}
                      >
                        <Text
                          className={`text-xs font-medium ${
                            analysisResult.category === "Disease"
                              ? "text-red-400"
                              : analysisResult.category === "Pest"
                                ? "text-orange-400"
                                : analysisResult.category === "Healthy"
                                  ? "text-green-400"
                                  : "text-gray-400"
                          }`}
                        >
                          {analysisResult.category}
                        </Text>
                      </View>
                      <Text className="text-gray-400 text-sm">
                        {analysisResult.confidence}%{" "}
                        {language === "hindi" ? "निश्चितता" : "confidence"}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity onPress={resetAnalysis} className="ml-2">
                  <Ionicons name="close" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Severity and Urgency */}
            <View className="p-4 border-b border-gray-700">
              <View className="flex-row justify-between mb-3">
                <View className="flex-1 mr-2">
                  <Text className="text-gray-400 text-sm mb-1">
                    गंभीरता (Severity)
                  </Text>
                  <Text
                    className={`font-semibold text-base ${getSeverityColor(analysisResult.severity)}`}
                  >
                    {analysisResult.severity === "Low"
                      ? "कम (Low)"
                      : analysisResult.severity === "Medium"
                        ? "मध्यम (Medium)"
                        : analysisResult.severity === "High"
                          ? "उच्च (High)"
                          : analysisResult.severity === "Critical"
                            ? "गंभीर (Critical)"
                            : analysisResult.severity}
                  </Text>
                </View>
                <View className="flex-1 ml-2">
                  <Text className="text-gray-400 text-sm mb-1">
                    आवश्यक कार्रवाई (Action Needed)
                  </Text>
                  <Text className="text-white font-semibold text-base">
                    {analysisResult.urgency === "Immediate"
                      ? "तुरंत (Immediate)"
                      : analysisResult.urgency === "Within 1 week"
                        ? "1 सप्ताह में (Within 1 week)"
                        : analysisResult.urgency === "Monitor closely"
                          ? "निगरानी रखें (Monitor closely)"
                          : analysisResult.urgency === "No action needed"
                            ? "कोई कार्रवाई आवश्यक नहीं (No action needed)"
                            : analysisResult.urgency}
                  </Text>
                </View>
              </View>

              <Text className="text-gray-300 text-sm leading-5">
                {language === "hindi"
                  ? analysisResult.description.hindi
                  : analysisResult.description.english}
              </Text>
            </View>

            {/* Quick Tips Section */}
            {analysisResult.quickTips[language] &&
              analysisResult.quickTips[language].length > 0 && (
                <View className="p-4 border-b border-gray-700">
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="flash" size={18} color="#F59E0B" />
                    <Text className="text-white font-semibold ml-2 text-base">
                      {language === "hindi"
                        ? "त्वरित सुझाव (Quick Tips)"
                        : "Quick Tips"}
                    </Text>
                  </View>
                  {analysisResult.quickTips[language]
                    .slice(0, 4)
                    .map((tip: string, index: number) => (
                      <View
                        key={index}
                        className="bg-amber-500/10 rounded-lg p-3 mb-2"
                      >
                        <View className="flex-row items-start">
                          <Text className="text-amber-400 mr-2 font-bold">
                            {index + 1}.
                          </Text>
                          <Text className="text-gray-200 text-sm flex-1 leading-5">
                            {tip}
                          </Text>
                        </View>
                      </View>
                    ))}
                </View>
              )}

            {/* Symptoms */}
            {analysisResult.symptoms[language] &&
              analysisResult.symptoms[language].length > 0 && (
                <View className="p-4 border-b border-gray-700">
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="eye" size={18} color="#EF4444" />
                    <Text className="text-white font-semibold ml-2 text-base">
                      {language === "hindi"
                        ? "दिखाई देने वाले लक्षण (Visible Symptoms)"
                        : "Visible Symptoms"}
                    </Text>
                  </View>
                  {analysisResult.symptoms[language]
                    .slice(0, 5)
                    .map((symptom: string, index: number) => (
                      <View key={index} className="flex-row items-start mb-2">
                        <View className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3" />
                        <Text className="text-gray-300 text-sm flex-1 leading-5">
                          {symptom}
                        </Text>
                      </View>
                    ))}
                </View>
              )}

            {/* Treatment Recommendations */}
            {analysisResult.treatments.length > 0 && (
              <View className="p-4">
                <View className="flex-row items-center mb-4">
                  <Ionicons name="medical" size={18} color="#10B981" />
                  <Text className="text-white font-semibold ml-2 text-base">
                    उपचार के विकल्प (Treatment Options)
                  </Text>
                </View>
                {analysisResult.treatments
                  .slice(0, 3)
                  .map((treatment, index) => (
                    <View
                      key={index}
                      className="bg-gray-700 rounded-xl p-4 mb-3 border border-gray-600"
                    >
                      <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-white font-medium flex-1 text-base">
                          {treatment.method}
                        </Text>
                        <View
                          className={`px-3 py-1 rounded-full ${
                            treatment.type === "Organic"
                              ? "bg-green-500/20"
                              : treatment.type === "Chemical"
                                ? "bg-blue-500/20"
                                : treatment.type === "Biological"
                                  ? "bg-purple-500/20"
                                  : "bg-gray-500/20"
                          }`}
                        >
                          <Text
                            className={`text-xs font-medium ${
                              treatment.type === "Organic"
                                ? "text-green-400"
                                : treatment.type === "Chemical"
                                  ? "text-blue-400"
                                  : treatment.type === "Biological"
                                    ? "text-purple-400"
                                    : "text-gray-400"
                            }`}
                          >
                            {treatment.type === "Organic"
                              ? "जैविक (Organic)"
                              : treatment.type === "Chemical"
                                ? "रासायनिक (Chemical)"
                                : treatment.type === "Biological"
                                  ? "जैविक नियंत्रण (Biological)"
                                  : treatment.type}
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row justify-between">
                        <View className="flex-1 mr-3">
                          <Text className="text-gray-400 text-xs mb-1">
                            प्रभावशीलता (Effectiveness)
                          </Text>
                          <View className="flex-row items-center">
                            <View className="flex-1 bg-gray-600 rounded-full h-2 mr-2">
                              <View
                                className="bg-green-400 h-2 rounded-full"
                                style={{ width: `${treatment.effectiveness}%` }}
                              />
                            </View>
                            <Text className="text-white text-sm font-medium">
                              {treatment.effectiveness}%
                            </Text>
                          </View>
                        </View>
                        <View className="flex-1 ml-3">
                          <Text className="text-gray-400 text-xs mb-1">
                            उपयोग विधि (Application)
                          </Text>
                          <Text className="text-white text-sm">
                            {treatment.applicationMethod}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
              </View>
            )}
          </View>
        </View>
      )}

      {/* Recent Scans - Only show if no analysis result */}
      {!analysisResult && (
        <View className="mx-4 mb-8">
          <Text className="text-xl font-bold text-white mb-4">
            Quick Detection Tips
          </Text>

          <View className="space-y-3">
            <View className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-blue-500/20 rounded-lg items-center justify-center mr-4">
                  <Ionicons name="camera" size={24} color="#3B82F6" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-semibold text-base">
                    Take Clear Photos
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    Ensure good lighting and focus on affected areas
                  </Text>
                </View>
              </View>
            </View>

            <View className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-green-500/20 rounded-lg items-center justify-center mr-4">
                  <Ionicons name="leaf" size={24} color="#22C55E" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-semibold text-base">
                    Multiple Angles
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    Capture different parts of the plant for better analysis
                  </Text>
                </View>
              </View>
            </View>

            <View className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-purple-500/20 rounded-lg items-center justify-center mr-4">
                  <Ionicons name="time" size={24} color="#8B5CF6" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-semibold text-base">
                    Early Detection
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    Regular monitoring helps catch issues early
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default PestDetection;
