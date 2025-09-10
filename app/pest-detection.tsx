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

const PestDetection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
    // Simulate analysis
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsAnalyzing(false);

    Alert.alert(
      "Analysis Complete",
      "Leaf Blight detected with 87% confidence"
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="pt-12 pb-4 px-4 bg-gray-900">
        <View className="flex-row items-center">
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white ml-4">
            Pest & Disease Detection
          </Text>
        </View>
      </View>

      {/* Upload Section */}
      <View className="mx-4 mb-6">
        <Text className="text-gray-300 text-base mb-4 leading-6">
          Upload an image of the affected crop to identify potential pests or
          diseases and receive recommendations.
        </Text>

        <TouchableOpacity
          onPress={() => pickImage(false)}
          className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-2xl p-8 items-center justify-center"
          style={{ height: 200 }}
        >
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              className="w-full h-full rounded-xl"
            />
          ) : (
            <View className="items-center">
              <View className="w-16 h-16 bg-gray-700 rounded-full items-center justify-center mb-4">
                <Ionicons name="cloud-upload" size={32} color="#9CA3AF" />
              </View>
              <Text className="text-white font-medium text-lg mb-2">
                Tap to upload a photo
              </Text>
              <Text className="text-gray-400 text-sm text-center">
                PNG, JPG, or WEBP
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {selectedImage && (
          <TouchableOpacity
            onPress={analyzeImage}
            disabled={isAnalyzing}
            className="bg-green-500 rounded-xl py-4 px-6 flex-row items-center justify-center mt-4"
          >
            {isAnalyzing ? (
              <>
                <Ionicons name="hourglass" size={20} color="white" />
                <Text className="text-white font-semibold ml-2 text-lg">
                  Analyzing...
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="scan" size={20} color="white" />
                <Text className="text-white font-semibold ml-2 text-lg">
                  Analyze Image
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Recent Scans */}
      <View className="mx-4 mb-8">
        <Text className="text-xl font-bold text-white mb-4">Recent Scans</Text>

        <View className="space-y-3">
          <TouchableOpacity className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-green-500/20 rounded-lg items-center justify-center mr-4">
                <Ionicons name="leaf" size={24} color="#22C55E" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold text-lg">
                  Leaf Blight
                </Text>
                <Text className="text-gray-400 text-sm">
                  Scanned 2 days ago
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-orange-500/20 rounded-lg items-center justify-center mr-4">
                <Ionicons name="warning" size={24} color="#F97316" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold text-lg">
                  Stem Rust
                </Text>
                <Text className="text-gray-400 text-sm">
                  Scanned 1 week ago
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default PestDetection;
