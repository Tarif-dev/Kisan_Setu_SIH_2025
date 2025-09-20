import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { locationService } from "../services/locationService";
import {
    CropRecommendation,
    FertilizerRecommendation,
    SoilAnalysisResult,
    SoilData,
    soilHealthService,
} from "../services/soilHealthService";

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  unit?: string;
}

// Memoized InputField component to prevent keyboard closing
const InputField: React.FC<InputFieldProps> = memo(({ label, value, onChangeText, placeholder, unit }) => (
    <View className="mb-4">
      <Text className="text-gray-300 text-sm mb-2">{label}</Text>
      <View className="bg-gray-800 rounded-xl border border-gray-700">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          className="p-4 text-white text-base"
          keyboardType="numeric"
          autoCorrect={false}
          autoComplete="off"
          selectTextOnFocus={false}
          blurOnSubmit={false}
        />
        {unit && (
          <Text className="absolute right-4 top-4 text-gray-500 text-sm">
            {unit}
          </Text>
        )}
      </View>
    </View>
));

InputField.displayName = 'InputField';

const SoilHealth = () => {
  const { t } = useTranslation();
  // Store raw text values for inputs to prevent keyboard closing
  const [inputValues, setInputValues] = useState({
    ph: "",
    organicMatter: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
  });
  const [soilReportImage, setSoilReportImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] =
    useState<SoilAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<"input" | "upload">("input");
  const [location, setLocation] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  const fetchCurrentLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    try {
      const farmingLocation = await locationService.getFarmingLocationInfo();
      setLocation(farmingLocation);
    } catch (error) {
      console.error("Failed to fetch current location:", error);
      // Don't show error to user for auto-fetch, they can manually request if needed
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  const checkLocationPermissionAndFetch = useCallback(async () => {
    try {
      const hasPermission = await locationService.hasLocationPermission();
      setHasLocationPermission(hasPermission);

      if (hasPermission) {
        await fetchCurrentLocation();
      }
    } catch (error) {
      console.error("Failed to check location permission:", error);
    }
  }, [fetchCurrentLocation]);

  // Check location permission and auto-fetch location on component mount
  useEffect(() => {
    checkLocationPermissionAndFetch();
  }, [checkLocationPermissionAndFetch]);

  // Memoized input handlers to prevent keyboard closing
  const handlePhChange = useCallback((text: string) => {
    if (text === "" || /^\d*\.?\d*$/.test(text)) {
      setInputValues((prev) => ({ ...prev, ph: text }));
    }
  }, []);

  const handleOrganicMatterChange = useCallback((text: string) => {
    if (text === "" || /^\d*\.?\d*$/.test(text)) {
      setInputValues((prev) => ({ ...prev, organicMatter: text }));
    }
  }, []);

  const handleNitrogenChange = useCallback((text: string) => {
    if (text === "" || /^\d*\.?\d*$/.test(text)) {
      setInputValues((prev) => ({ ...prev, nitrogen: text }));
    }
  }, []);

  const handlePhosphorusChange = useCallback((text: string) => {
    if (text === "" || /^\d*\.?\d*$/.test(text)) {
      setInputValues((prev) => ({ ...prev, phosphorus: text }));
    }
  }, []);

  const handlePotassiumChange = useCallback((text: string) => {
    if (text === "" || /^\d*\.?\d*$/.test(text)) {
      setInputValues((prev) => ({ ...prev, potassium: text }));
    }
  }, []);

  const handleUseCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const farmingLocation = await locationService.getFarmingLocationInfo();
      setLocation(farmingLocation);
      setHasLocationPermission(true);

      Alert.alert(
        "Location Updated",
        `Your location has been set to: ${farmingLocation}`,
        [{ text: "OK" }]
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to get current location";
      Alert.alert("Location Error", errorMessage, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Settings",
          onPress: () => {
            Alert.alert(
              "Enable Location",
              "Please enable location services in your device settings and grant permission to this app."
            );
          },
        },
      ]);
    } finally {
      setIsLoadingLocation(false);
    }
  };

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
      quality: 0.8,
    });

    if (!result.canceled) {
      setSoilReportImage(result.assets[0].uri);
      setActiveTab("upload");
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
      quality: 0.8,
    });

    if (!result.canceled) {
      setSoilReportImage(result.assets[0].uri);
      setActiveTab("upload");
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      t('soilHealth.uploadReport.options.title'),
      t('soilHealth.uploadReport.options.message'),
      [
        {
          text: t('soilHealth.uploadReport.options.camera'),
          onPress: takePhotoWithCamera,
        },
        {
          text: t('soilHealth.uploadReport.options.gallery'),
          onPress: pickImageFromGallery,
        },
        {
          text: t('soilHealth.uploadReport.options.cancel'),
          style: "cancel",
        },
      ]
    );
  };

  // Helper function to convert input values to SoilData
  const getValidSoilData = (): SoilData => {
    return {
      ph: inputValues.ph ? parseFloat(inputValues.ph) || undefined : undefined,
      organicMatter: inputValues.organicMatter
        ? parseFloat(inputValues.organicMatter) || undefined
        : undefined,
      nitrogen: inputValues.nitrogen
        ? parseFloat(inputValues.nitrogen) || undefined
        : undefined,
      phosphorus: inputValues.phosphorus
        ? parseFloat(inputValues.phosphorus) || undefined
        : undefined,
      potassium: inputValues.potassium
        ? parseFloat(inputValues.potassium) || undefined
        : undefined,
      location,
    };
  };

  const analyzeSoilFromInput = async () => {
    const currentSoilData = getValidSoilData();

    if (
      !currentSoilData.ph &&
      !currentSoilData.organicMatter &&
      !currentSoilData.nitrogen &&
      !currentSoilData.phosphorus &&
      !currentSoilData.potassium
    ) {
      Alert.alert(
        "Input Required",
        "Please enter at least some soil data to analyze."
      );
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await soilHealthService.analyzeSoilData(currentSoilData);
      setAnalysisResult(result);
    } catch (error) {
      Alert.alert(
        "Analysis Failed",
        error instanceof Error ? error.message : "Failed to analyze soil data"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeSoilFromImage = async () => {
    if (!soilReportImage) {
      Alert.alert(
        "Image Required",
        "Please upload a soil test report image first."
      );
      return;
    }

    setIsAnalyzing(true);
    try {
      const result =
        await soilHealthService.analyzeSoilReportImage(soilReportImage);
      setAnalysisResult(result);
    } catch (error) {
      Alert.alert(
        "Analysis Failed",
        error instanceof Error ? error.message : "Failed to analyze soil report"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getAnalysisForCurrentTab = () => {
    if (activeTab === "input") {
      analyzeSoilFromInput();
    } else {
      analyzeSoilFromImage();
    }
  };

  const CropCard = ({ crop }: { crop: CropRecommendation }) => (
    <View className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-3">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-white font-semibold text-lg">
          {crop.cropName}
        </Text>
        <View
          className={`px-3 py-1 rounded-full ${
            crop.suitability === "High"
              ? "bg-green-500/20"
              : crop.suitability === "Medium"
                ? "bg-yellow-500/20"
                : "bg-red-500/20"
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              crop.suitability === "High"
                ? "text-green-400"
                : crop.suitability === "Medium"
                  ? "text-yellow-400"
                  : "text-red-400"
            }`}
          >
            {crop.suitability} Suitability
          </Text>
        </View>
      </View>
      <Text className="text-gray-300 text-sm mb-2">{crop.reason}</Text>
      <View className="flex-row justify-between text-xs">
        <Text className="text-gray-400">Yield: {crop.expectedYield}</Text>
        <Text className="text-gray-400">Plant: {crop.plantingTime}</Text>
      </View>
    </View>
  );

  const FertilizerCard = ({
    fertilizer,
  }: {
    fertilizer: FertilizerRecommendation;
  }) => (
    <View className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-3">
      <View className="flex-row items-center mb-2">
        <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-3">
          <Ionicons name="leaf" size={20} color="#22C55E" />
        </View>
        <View className="flex-1">
          <Text className="text-white font-semibold">{fertilizer.name}</Text>
          <Text className="text-gray-400 text-sm">{fertilizer.type}</Text>
        </View>
        <Text className="text-green-400 font-medium">
          {fertilizer.npkRatio}
        </Text>
      </View>
      <Text className="text-gray-300 text-sm mb-2">{fertilizer.amount}</Text>
      <Text className="text-gray-400 text-xs mb-2">
        {fertilizer.applicationMethod}
      </Text>
      <View className="flex-row justify-between">
        <Text className="text-gray-400 text-xs">
          Timing: {fertilizer.timing}
        </Text>
        <Text className="text-green-400 text-xs font-medium">
          {fertilizer.costEstimate}
        </Text>
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
            <View className="ml-4">
              <Text className="text-xl font-bold text-white">
                {t('soilHealth.title')}
              </Text>
              {location && hasLocationPermission && (
                <View className="flex-row items-center mt-1">
                  <Ionicons name="location-sharp" size={12} color="#3B82F6" />
                  <Text
                    className="text-blue-400 text-xs ml-1"
                    numberOfLines={1}
                  >
                    {location.length > 30
                      ? `${location.substring(0, 30)}...`
                      : location}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity onPress={() => setAnalysisResult(null)}>
            <Ionicons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Selection */}
      <View className="mx-4 mb-6">
        <View className="flex-row bg-gray-800 rounded-xl p-1">
          <TouchableOpacity
            onPress={() => setActiveTab("input")}
            className={`flex-1 py-3 rounded-lg ${
              activeTab === "input" ? "bg-green-500" : ""
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === "input" ? "text-white" : "text-gray-400"
              }`}
            >
              {t('soilHealth.tabs.manualInput')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("upload")}
            className={`flex-1 py-3 rounded-lg ${
              activeTab === "upload" ? "bg-green-500" : ""
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === "upload" ? "text-white" : "text-gray-400"
              }`}
            >
              {t('soilHealth.tabs.uploadReport')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Location Input */}
      <View className="mx-4 mb-6">
        <Text className="text-gray-300 text-sm mb-2">{t('soilHealth.location.label')}</Text>
        <View className="bg-gray-800 rounded-xl border border-gray-700">
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder={t('soilHealth.location.placeholder')}
            placeholderTextColor="#9CA3AF"
            className="p-4 text-white text-base"
          />
        </View>

        {/* Use Current Location Button */}
        <TouchableOpacity
          onPress={handleUseCurrentLocation}
          disabled={isLoadingLocation}
          className="bg-blue-500/20 rounded-xl py-3 px-4 flex-row items-center justify-center mt-3 border border-blue-500/30"
        >
          {isLoadingLocation ? (
            <ActivityIndicator size="small" color="#3B82F6" />
          ) : (
            <Ionicons name="location" size={18} color="#3B82F6" />
          )}
          <Text className="text-blue-400 font-medium ml-2">
            {isLoadingLocation ? t('soilHealth.location.gettingLocation') : t('soilHealth.location.useCurrentLocation')}
          </Text>
        </TouchableOpacity>

        {location && (
          <View className="mt-2 flex-row items-center">
            <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
            <Text className="text-green-400 text-sm ml-1">
              {t('soilHealth.location.locationSet')}: {location}
            </Text>
          </View>
        )}

        {!location && !isLoadingLocation && hasLocationPermission && (
          <View className="mt-2 flex-row items-center">
            <Ionicons name="information-circle" size={16} color="#3B82F6" />
            <Text className="text-blue-400 text-sm ml-1">
              {t('soilHealth.location.tapToUse')}
            </Text>
          </View>
        )}
      </View>

      {activeTab === "input" ? (
        /* Manual Input Tab */
        <View className="mx-4 mb-6">
          <Text className="text-xl font-bold text-white mb-4">
            {t('soilHealth.manualInput.title')}
          </Text>

          <InputField
            label={t('soilHealth.manualInput.fields.ph.label')}
            value={inputValues.ph}
            onChangeText={handlePhChange}
            placeholder={t('soilHealth.manualInput.fields.ph.placeholder')}
            unit={t('soilHealth.manualInput.fields.ph.unit')}
          />

          <InputField
            label={t('soilHealth.manualInput.fields.organicMatter.label')}
            value={inputValues.organicMatter}
            onChangeText={handleOrganicMatterChange}
            placeholder={t('soilHealth.manualInput.fields.organicMatter.placeholder')}
            unit={t('soilHealth.manualInput.fields.organicMatter.unit')}
          />

          <InputField
            label={t('soilHealth.manualInput.fields.nitrogen.label')}
            value={inputValues.nitrogen}
            onChangeText={handleNitrogenChange}
            placeholder={t('soilHealth.manualInput.fields.nitrogen.placeholder')}
            unit={t('soilHealth.manualInput.fields.nitrogen.unit')}
          />

          <InputField
            label={t('soilHealth.manualInput.fields.phosphorus.label')}
            value={inputValues.phosphorus}
            onChangeText={handlePhosphorusChange}
            placeholder={t('soilHealth.manualInput.fields.phosphorus.placeholder')}
            unit={t('soilHealth.manualInput.fields.phosphorus.unit')}
          />

          <InputField
            label={t('soilHealth.manualInput.fields.potassium.label')}
            value={inputValues.potassium}
            onChangeText={handlePotassiumChange}
            placeholder={t('soilHealth.manualInput.fields.potassium.placeholder')}
            unit={t('soilHealth.manualInput.fields.potassium.unit')}
          />
        </View>
      ) : (
        /* Upload Report Tab */
        <View className="mx-4 mb-6">
          <Text className="text-xl font-bold text-white mb-4">
            {t('soilHealth.uploadReport.title')}
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
                <Text className="text-white font-medium ml-2">
                  {t('soilHealth.uploadReport.changeImage')}
                </Text>
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
                {t('soilHealth.uploadReport.uploadButton')}
              </Text>
              <Text className="text-gray-400 text-sm text-center">
                {t('soilHealth.uploadReport.description')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Analyze Button */}
      <View className="mx-4 mb-6">
        <TouchableOpacity
          onPress={getAnalysisForCurrentTab}
          disabled={isAnalyzing}
          className="bg-green-500 rounded-xl py-4 px-6 flex-row items-center justify-center"
        >
          {isAnalyzing ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="analytics" size={20} color="white" />
          )}
          <Text className="text-white font-semibold ml-2 text-lg">
            {isAnalyzing ? t('soilHealth.analysis.analyzing') : t('soilHealth.analysis.analyzeButton')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Analysis Results */}
      {analysisResult && (
        <View className="mx-4 mb-8">
          {/* Soil Health Score */}
          <View className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
            <Text className="text-xl font-bold text-white mb-4">
              {t('soilHealth.results.soilHealth.title')}
            </Text>
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-gray-300">{t('soilHealth.results.soilHealth.score')}</Text>
                <Text className="text-3xl font-bold text-green-400">
                  {analysisResult.soilHealthScore}/100
                </Text>
              </View>
              <View
                className={`px-4 py-2 rounded-full ${
                  analysisResult.soilQuality === "Excellent"
                    ? "bg-green-500/20"
                    : analysisResult.soilQuality === "Good"
                      ? "bg-blue-500/20"
                      : analysisResult.soilQuality === "Fair"
                        ? "bg-yellow-500/20"
                        : "bg-red-500/20"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    analysisResult.soilQuality === "Excellent"
                      ? "text-green-400"
                      : analysisResult.soilQuality === "Good"
                        ? "text-blue-400"
                        : analysisResult.soilQuality === "Fair"
                          ? "text-yellow-400"
                          : "text-red-400"
                  }`}
                >
                  {analysisResult.soilQuality}
                </Text>
              </View>
            </View>

            {analysisResult.deficiencies.length > 0 && (
              <View className="mt-4">
                <Text className="text-gray-300 font-medium mb-2">
                  {t('soilHealth.results.soilHealth.deficiencies')}
                </Text>
                {analysisResult.deficiencies.map((deficiency, index) => (
                  <Text key={index} className="text-red-400 text-sm mb-1">
                    • {deficiency}
                  </Text>
                ))}
              </View>
            )}
          </View>

          {/* Crop Recommendations */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-white mb-4">
              {t('soilHealth.results.cropRecommendations.title')}
            </Text>
            {analysisResult.cropSuggestions.map((crop, index) => (
              <CropCard key={index} crop={crop} />
            ))}
          </View>

          {/* Fertilizer Recommendations */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-white mb-4">
              {t('soilHealth.results.fertilizerRecommendations.title')}
            </Text>
            {analysisResult.fertilizerRecommendations.map(
              (fertilizer, index) => (
                <FertilizerCard key={index} fertilizer={fertilizer} />
              )
            )}
          </View>

          {/* Improvement Plan */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-white mb-4">
              {t('soilHealth.results.improvementPlan.title')}
            </Text>
            <View className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              {analysisResult.improvementPlan.map((step, index) => (
                <View key={index} className="flex-row items-start mb-3">
                  <View className="w-6 h-6 bg-green-500/20 rounded-full items-center justify-center mr-3 mt-0.5">
                    <Text className="text-green-400 text-xs font-bold">
                      {index + 1}
                    </Text>
                  </View>
                  <Text className="text-gray-300 text-sm flex-1">{step}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default SoilHealth;
