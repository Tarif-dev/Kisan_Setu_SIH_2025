// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
   <Stack screenOptions={{ headerShown: false }}>
  <Stack.Screen name="welcome" />
  <Stack.Screen name="soilTest" />
  <Stack.Screen name="marketplace" />
  <Stack.Screen name="pestdetection" />
  <Stack.Screen name="preferences" />
  <Stack.Screen name="advisory" />
  <Stack.Screen name="voiceassistant" />
</Stack>

  );
}








