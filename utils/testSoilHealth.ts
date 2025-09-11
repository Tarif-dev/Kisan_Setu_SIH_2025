// Test file for soil health service - you can run this to test the functionality
import { soilHealthService } from "../services/soilHealthService";

// Test function to verify soil analysis
export const testSoilAnalysis = async () => {
  try {
    console.log("Testing soil health service...");

    // Test soil data
    const testData = {
      ph: 6.5,
      organicMatter: 2.5,
      nitrogen: 250,
      phosphorus: 45,
      potassium: 180,
      location: "Punjab, India",
    };

    console.log("Input soil data:", testData);

    // Analyze soil data
    const result = await soilHealthService.analyzeSoilData(testData);

    console.log("Analysis result:");
    console.log("- Soil Quality:", result.soilQuality);
    console.log("- Health Score:", result.soilHealthScore);
    console.log("- Crop Suggestions:", result.cropSuggestions.length);
    console.log(
      "- Fertilizer Recommendations:",
      result.fertilizerRecommendations.length
    );

    return result;
  } catch (error) {
    console.error("Test failed:", error);
    throw error;
  }
};

// You can uncomment and run this in the component to test
// testSoilAnalysis().then(result => console.log('Test completed', result));
