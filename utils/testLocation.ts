// Test file for location service - you can use this to test location functionality
import { locationService } from "../services/locationService";

export const testLocationService = async () => {
  try {
    console.log("Testing location service...");

    // Check if location permission is available
    const hasPermission = await locationService.hasLocationPermission();
    console.log("Has location permission:", hasPermission);

    // Check if location services are available
    const isAvailable = await locationService.isLocationAvailable();
    console.log("Location services available:", isAvailable);

    if (isAvailable) {
      // Get current location
      const locationData = await locationService.getCurrentLocation();
      console.log("Current location data:", {
        coordinates: `${locationData.latitude}, ${locationData.longitude}`,
        address: locationData.address,
        city: locationData.city,
        state: locationData.state,
        country: locationData.country,
      });

      // Get farming-specific location info
      const farmingLocation = await locationService.getFarmingLocationInfo();
      console.log("Farming location:", farmingLocation);

      return { success: true, location: farmingLocation };
    } else {
      console.log("Location services not available");
      return { success: false, error: "Location services not available" };
    }
  } catch (error) {
    console.error("Location service test failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Usage example:
// testLocationService().then(result => {
//   if (result.success) {
//     console.log('Location test passed:', result.location);
//   } else {
//     console.error('Location test failed:', result.error);
//   }
// });
