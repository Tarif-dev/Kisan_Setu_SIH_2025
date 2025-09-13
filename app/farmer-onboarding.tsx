import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ondcMarketplaceService } from "../services/ondcMarketplaceService";

interface FormData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
  };
  location: {
    state: string;
    district: string;
    village: string;
    pincode: string;
  };
  farmDetails: {
    farmSize: string;
    cropTypes: string;
    farmingMethod: "organic" | "traditional" | "mixed";
    soilType: string;
  };
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
  };
}

const FarmerOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
    },
    location: {
      state: "",
      district: "",
      village: "",
      pincode: "",
    },
    farmDetails: {
      farmSize: "",
      cropTypes: "",
      farmingMethod: "traditional",
      soilType: "",
    },
    bankDetails: {
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      accountHolderName: "",
    },
  });

  const updateFormData = (
    section: keyof FormData,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.personalInfo.name && formData.personalInfo.phone
          ? true
          : false;
      case 2:
        return formData.location.state &&
          formData.location.district &&
          formData.location.village &&
          formData.location.pincode
          ? true
          : false;
      case 3:
        return formData.farmDetails.farmSize && formData.farmDetails.cropTypes
          ? true
          : false;
      case 4:
        return formData.bankDetails.accountNumber &&
          formData.bankDetails.ifscCode &&
          formData.bankDetails.bankName
          ? true
          : false;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    } else {
      Alert.alert(
        "Incomplete Information",
        "Please fill all required fields before proceeding."
      );
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const farmerData = {
        name: formData.personalInfo.name,
        email: formData.personalInfo.email,
        phone: formData.personalInfo.phone,
        location: {
          state: formData.location.state,
          district: formData.location.district,
          village: formData.location.village,
          pincode: formData.location.pincode,
          coordinates: {
            latitude: 0,
            longitude: 0,
          },
        },
        farmDetails: {
          farmSize: parseFloat(formData.farmDetails.farmSize) || 0,
          cropTypes: formData.farmDetails.cropTypes
            .split(",")
            .map((crop) => crop.trim()),
          farmingMethod: formData.farmDetails.farmingMethod,
          soilType: formData.farmDetails.soilType,
        },
        bankDetails: formData.bankDetails,
      };

      const result = await ondcMarketplaceService.registerFarmer(farmerData);

      if (result.success) {
        Alert.alert(
          "Registration Successful!",
          "Your farmer profile has been created. You can now start listing your products on the marketplace.",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert(
          "Registration Failed",
          result.error || "Please try again later."
        );
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View className="flex-row justify-center items-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <View key={step} className="flex-row items-center">
          <View
            className={`w-8 h-8 rounded-full items-center justify-center ${
              step <= currentStep ? "bg-green-500" : "bg-gray-600"
            }`}
          >
            <Text
              className={`font-bold ${step <= currentStep ? "text-white" : "text-gray-400"}`}
            >
              {step}
            </Text>
          </View>
          {step < 4 && (
            <View
              className={`w-8 h-1 mx-2 ${
                step < currentStep ? "bg-green-500" : "bg-gray-600"
              }`}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderPersonalInfo = () => (
    <View>
      <Text className="text-white text-xl font-bold mb-6">
        Personal Information
      </Text>

      <View className="mb-4">
        <Text className="text-gray-300 mb-2">Full Name *</Text>
        <TextInput
          value={formData.personalInfo.name}
          onChangeText={(value) =>
            updateFormData("personalInfo", "name", value)
          }
          placeholder="Enter your full name"
          placeholderTextColor="#9CA3AF"
          className="bg-gray-800 text-white p-4 rounded-xl border border-gray-700"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-300 mb-2">Email</Text>
        <TextInput
          value={formData.personalInfo.email}
          onChangeText={(value) =>
            updateFormData("personalInfo", "email", value)
          }
          placeholder="Enter your email"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          className="bg-gray-800 text-white p-4 rounded-xl border border-gray-700"
        />
      </View>

      <View className="mb-6">
        <Text className="text-gray-300 mb-2">Phone Number *</Text>
        <TextInput
          value={formData.personalInfo.phone}
          onChangeText={(value) =>
            updateFormData("personalInfo", "phone", value)
          }
          placeholder="Enter your phone number"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          className="bg-gray-800 text-white p-4 rounded-xl border border-gray-700"
        />
      </View>
    </View>
  );

  const renderLocation = () => (
    <View>
      <Text className="text-white text-xl font-bold mb-6">
        Location Details
      </Text>

      <View className="mb-4">
        <Text className="text-gray-300 mb-2">State *</Text>
        <TextInput
          value={formData.location.state}
          onChangeText={(value) => updateFormData("location", "state", value)}
          placeholder="Enter your state"
          placeholderTextColor="#9CA3AF"
          className="bg-gray-800 text-white p-4 rounded-xl border border-gray-700"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-300 mb-2">District *</Text>
        <TextInput
          value={formData.location.district}
          onChangeText={(value) =>
            updateFormData("location", "district", value)
          }
          placeholder="Enter your district"
          placeholderTextColor="#9CA3AF"
          className="bg-gray-800 text-white p-4 rounded-xl border border-gray-700"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-300 mb-2">Village *</Text>
        <TextInput
          value={formData.location.village}
          onChangeText={(value) => updateFormData("location", "village", value)}
          placeholder="Enter your village"
          placeholderTextColor="#9CA3AF"
          className="bg-gray-800 text-white p-4 rounded-xl border border-gray-700"
        />
      </View>

      <View className="mb-6">
        <Text className="text-gray-300 mb-2">PIN Code *</Text>
        <TextInput
          value={formData.location.pincode}
          onChangeText={(value) => updateFormData("location", "pincode", value)}
          placeholder="Enter PIN code"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          maxLength={6}
          className="bg-gray-800 text-white p-4 rounded-xl border border-gray-700"
        />
      </View>
    </View>
  );

  const renderFarmDetails = () => (
    <View>
      <Text className="text-white text-xl font-bold mb-6">
        Farm Information
      </Text>

      <View className="mb-4">
        <Text className="text-gray-300 mb-2">Farm Size (in acres) *</Text>
        <TextInput
          value={formData.farmDetails.farmSize}
          onChangeText={(value) =>
            updateFormData("farmDetails", "farmSize", value)
          }
          placeholder="Enter farm size in acres"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          className="bg-gray-800 text-white p-4 rounded-xl border border-gray-700"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-300 mb-2">Crop Types *</Text>
        <TextInput
          value={formData.farmDetails.cropTypes}
          onChangeText={(value) =>
            updateFormData("farmDetails", "cropTypes", value)
          }
          placeholder="Enter crops (comma separated): Rice, Wheat, Tomato"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={3}
          className="bg-gray-800 text-white p-4 rounded-xl border border-gray-700"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-300 mb-2">Farming Method</Text>
        <View className="flex-row space-x-3">
          {["organic", "traditional", "mixed"].map((method) => (
            <TouchableOpacity
              key={method}
              onPress={() =>
                updateFormData("farmDetails", "farmingMethod", method)
              }
              className={`flex-1 p-3 rounded-xl border ${
                formData.farmDetails.farmingMethod === method
                  ? "bg-green-500 border-green-500"
                  : "bg-gray-800 border-gray-700"
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  formData.farmDetails.farmingMethod === method
                    ? "text-white"
                    : "text-gray-300"
                }`}
              >
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="mb-6">
        <Text className="text-gray-300 mb-2">Soil Type</Text>
        <TextInput
          value={formData.farmDetails.soilType}
          onChangeText={(value) =>
            updateFormData("farmDetails", "soilType", value)
          }
          placeholder="e.g., Clay, Sandy, Loamy"
          placeholderTextColor="#9CA3AF"
          className="bg-gray-800 text-white p-4 rounded-xl border border-gray-700"
        />
      </View>
    </View>
  );

  const renderBankDetails = () => (
    <View>
      <Text className="text-white text-xl font-bold mb-6">Bank Details</Text>

      <View className="mb-4">
        <Text className="text-gray-300 mb-2">Account Holder Name *</Text>
        <TextInput
          value={formData.bankDetails.accountHolderName}
          onChangeText={(value) =>
            updateFormData("bankDetails", "accountHolderName", value)
          }
          placeholder="Enter account holder name"
          placeholderTextColor="#9CA3AF"
          className="bg-gray-800 text-white p-4 rounded-xl border border-gray-700"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-300 mb-2">Account Number *</Text>
        <TextInput
          value={formData.bankDetails.accountNumber}
          onChangeText={(value) =>
            updateFormData("bankDetails", "accountNumber", value)
          }
          placeholder="Enter account number"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          className="bg-gray-800 text-white p-4 rounded-xl border border-gray-700"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-300 mb-2">IFSC Code *</Text>
        <TextInput
          value={formData.bankDetails.ifscCode}
          onChangeText={(value) =>
            updateFormData("bankDetails", "ifscCode", value.toUpperCase())
          }
          placeholder="Enter IFSC code"
          placeholderTextColor="#9CA3AF"
          className="bg-gray-800 text-white p-4 rounded-xl border border-gray-700"
        />
      </View>

      <View className="mb-6">
        <Text className="text-gray-300 mb-2">Bank Name *</Text>
        <TextInput
          value={formData.bankDetails.bankName}
          onChangeText={(value) =>
            updateFormData("bankDetails", "bankName", value)
          }
          placeholder="Enter bank name"
          placeholderTextColor="#9CA3AF"
          className="bg-gray-800 text-white p-4 rounded-xl border border-gray-700"
        />
      </View>
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderLocation();
      case 3:
        return renderFarmDetails();
      case 4:
        return renderBankDetails();
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="pt-12 pb-6 px-4">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white ml-4">
            Farmer Registration
          </Text>
        </View>

        {renderStepIndicator()}
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {renderStepContent()}

        {/* Navigation Buttons */}
        <View className="flex-row justify-between mt-8 mb-8">
          {currentStep > 1 && (
            <TouchableOpacity
              onPress={() => setCurrentStep(currentStep - 1)}
              className="bg-gray-700 px-6 py-3 rounded-xl flex-1 mr-2"
            >
              <Text className="text-white text-center font-semibold">
                Previous
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleNext}
            disabled={!validateStep(currentStep) || isLoading}
            className={`px-6 py-3 rounded-xl flex-1 ${currentStep > 1 ? "ml-2" : ""} ${
              validateStep(currentStep) && !isLoading
                ? "bg-green-500"
                : "bg-gray-600"
            }`}
          >
            <Text className="text-white text-center font-semibold">
              {isLoading
                ? "Loading..."
                : currentStep === 4
                  ? "Complete Registration"
                  : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default FarmerOnboarding;
