import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface LoadingProps {
  message?: string;
  size?: "small" | "large";
  color?: string;
}

export const LoadingComponent: React.FC<LoadingProps> = ({
  message = "Loading...",
  size = "large",
  color = "#22C55E",
}) => {
  return (
    <View className="flex-1 items-center justify-center bg-gray-900 p-4">
      <ActivityIndicator size={size} color={color} />
      <Text className="text-gray-400 mt-4 text-center text-base">
        {message}
      </Text>
    </View>
  );
};

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
}) => {
  return (
    <View className="flex-1 items-center justify-center bg-gray-900 p-4">
      <Text className="text-red-400 text-center text-lg mb-4">{message}</Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="bg-green-500 rounded-xl px-6 py-3"
        >
          <Text className="text-white font-medium">Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Default export for backward compatibility
function Loading({ text = "Loading..." }: { text?: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-gray-900 p-4">
      <ActivityIndicator size="large" color="#22C55E" />
      <Text className="text-gray-400 mt-4 text-center text-base">{text}</Text>
    </View>
  );
}

export default Loading;
