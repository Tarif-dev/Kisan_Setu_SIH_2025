// Location Service for fetching user location and address
import * as Location from "expo-location";

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
  district?: string;
  postalCode?: string;
}

class LocationService {
  // Request location permissions
  async requestLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Failed to request location permission:", error);
      return false;
    }
  }

  // Get current location with address
  async getCurrentLocation(): Promise<LocationData> {
    try {
      // Check if location services are enabled
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        throw new Error(
          "Location services are disabled. Please enable location services in your device settings."
        );
      }

      // Request permission
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        throw new Error(
          "Location permission denied. Please grant location access to use this feature."
        );
      }

      // Get current position with high accuracy and timeout
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 1,
      });

      // Reverse geocode to get address with error handling
      let address;
      try {
        address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (geocodeError) {
        // If reverse geocoding fails, create a basic location with coordinates
        console.warn(
          "Reverse geocoding failed, using coordinates only:",
          geocodeError
        );
        return {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`,
          city: "",
          state: "",
          country: "",
          district: "",
          postalCode: "",
        };
      }

      if (address.length === 0) {
        // Fallback to coordinates if no address found
        return {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`,
          city: "",
          state: "",
          country: "",
          district: "",
          postalCode: "",
        };
      }

      const addressInfo = address[0];

      // Format address components
      const formattedAddress = this.formatAddress(addressInfo);

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: formattedAddress.full,
        city: formattedAddress.city,
        state: formattedAddress.state,
        country: formattedAddress.country,
        district: formattedAddress.district,
        postalCode: formattedAddress.postalCode,
      };
    } catch (error) {
      console.error("Failed to get current location:", error);

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("Location services")) {
          throw new Error(
            "Location services are disabled. Please enable GPS in your device settings."
          );
        } else if (error.message.includes("permission")) {
          throw new Error(
            "Location permission is required. Please allow location access in app settings."
          );
        } else if (
          error.message.includes("timeout") ||
          error.message.includes("TIMEOUT")
        ) {
          throw new Error(
            "Location request timed out. Please try again or check your GPS signal."
          );
        } else {
          throw error;
        }
      }

      throw new Error(
        "Unable to get current location. Please check your GPS settings and try again."
      );
    }
  }

  // Format address from reverse geocoding result
  private formatAddress(addressInfo: Location.LocationGeocodedAddress) {
    const components = {
      street: addressInfo.streetNumber
        ? `${addressInfo.streetNumber} ${addressInfo.street}`
        : addressInfo.street,
      subLocality: addressInfo.subregion,
      city: addressInfo.city || addressInfo.district,
      district: addressInfo.district,
      state: addressInfo.region,
      country: addressInfo.country,
      postalCode: addressInfo.postalCode,
    };

    // Build full address
    const addressParts = [
      components.street,
      components.subLocality,
      components.city,
      components.district,
      components.state,
      components.country,
    ].filter(Boolean);

    const fullAddress = addressParts.join(", ");

    // Build simplified address for farming context
    const farmingAddress = [
      components.city || components.district,
      components.state,
      components.country,
    ]
      .filter(Boolean)
      .join(", ");

    return {
      full: fullAddress,
      farming: farmingAddress, // Simplified for agricultural recommendations
      city: components.city || "",
      state: components.state || "",
      country: components.country || "",
      district: components.district || "",
      postalCode: components.postalCode || "",
    };
  }

  // Get location address only (without coordinates) - for display purposes
  async getLocationAddress(): Promise<string> {
    try {
      const locationData = await this.getCurrentLocation();
      return locationData.address;
    } catch (error) {
      console.error("Failed to get location address:", error);
      throw error;
    }
  }

  // Get farming-relevant location info
  async getFarmingLocationInfo(): Promise<string> {
    try {
      const locationData = await this.getCurrentLocation();

      // Return farming-relevant location format
      const farmingLocation = [
        locationData.city,
        locationData.district,
        locationData.state,
      ]
        .filter(Boolean)
        .join(", ");

      // Fallback to state and country if city/district not available
      if (!farmingLocation) {
        const fallbackLocation = [locationData.state, locationData.country]
          .filter(Boolean)
          .join(", ");

        return fallbackLocation || locationData.address;
      }

      return farmingLocation;
    } catch (error) {
      console.error("Failed to get farming location info:", error);
      throw error;
    }
  }

  // Check if location permission is already granted
  async hasLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Failed to check location permission:", error);
      return false;
    }
  }

  // Check if location services are available
  async isLocationAvailable(): Promise<boolean> {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      const hasPermission = await this.hasLocationPermission();
      return enabled && hasPermission;
    } catch (error) {
      console.error("Failed to check location availability:", error);
      return false;
    }
  }
}

export const locationService = new LocationService();
