import * as Location from "expo-location";
import { create } from "zustand";

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
  country?: string;
}

interface LocationStore {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<void>;
  setLocation: (location: LocationData) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  location: null,
  isLoading: false,
  error: null,

  getCurrentLocation: async () => {
    set({ isLoading: true, error: null });

    try {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Location permission denied");
      }

      // Get current position
      const position = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = position.coords;

      // Get address details
      try {
        const addressDetails = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        const address = addressDetails[0];
        const locationData: LocationData = {
          latitude,
          longitude,
          city: address?.city || address?.district || undefined,
          region: address?.region || undefined,
          country: address?.country || undefined,
        };

        set({ location: locationData, isLoading: false });
      } catch (reverseGeocodeError) {
        // If reverse geocoding fails, still set the coordinates
        set({
          location: { latitude, longitude },
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Location error:", error);
      set({
        error: "Failed to get location",
        isLoading: false,
        // Set default location for demo (Delhi, India)
        location: {
          latitude: 28.6139,
          longitude: 77.209,
          city: "Delhi",
          region: "Delhi",
          country: "India",
        },
      });
    }
  },

  setLocation: (location: LocationData) => {
    set({ location, error: null });
  },

  clearLocation: () => {
    set({ location: null, error: null });
  },
}));
