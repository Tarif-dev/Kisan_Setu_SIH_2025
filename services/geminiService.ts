// Gemini AI Service for voice assistant and image analysis
import config from "../config/environment";

interface GeminiResponse {
  text: string;
  confidence?: number;
}

interface GeminiImageAnalysis {
  detected_pest?: string;
  confidence: number;
  description: string;
  recommendations: string[];
}

class GeminiService {
  private apiKey: string;
  private baseUrl: string = config.GEMINI_API_URL;

  constructor() {
    this.apiKey = config.GEMINI_API_KEY;
  }

  async generateTextResponse(
    prompt: string,
    context?: string
  ): Promise<GeminiResponse> {
    try {
      // For demo purposes, return mock responses
      // In production, replace with actual Gemini API call

      const farmingResponses: { [key: string]: string } = {
        pest: "For effective pest management, I recommend: 1) Regular field monitoring every 2-3 days, 2) Use integrated pest management (IPM) approach, 3) Apply neem-based organic pesticides during early morning or evening, 4) Install yellow sticky traps for early detection, 5) Maintain crop rotation to break pest cycles. Always identify the specific pest before treatment for best results.",

        fertilizer:
          "For optimal fertilizer application: 1) Test your soil pH and nutrient levels first, 2) Apply balanced NPK fertilizer in 4:2:1 ratio for most crops, 3) Use organic compost to improve soil structure, 4) Split fertilizer application - 50% during sowing, 25% during vegetative growth, 25% during flowering, 5) Water thoroughly after application but avoid over-watering.",

        weather:
          "Based on current weather patterns: 1) Monitor daily weather forecasts for planning farm activities, 2) Heavy rain expected - ensure proper drainage and cover young plants, 3) During hot weather, irrigate early morning or late evening, 4) Use mulching to conserve soil moisture, 5) Adjust planting schedules based on seasonal weather patterns.",

        irrigation:
          "For efficient water management: 1) Check soil moisture at 6-inch depth before irrigating, 2) Water deeply but less frequently to encourage deep root growth, 3) Use drip irrigation or soaker hoses when possible, 4) Apply 1-2 inches of water per week including rainfall, 5) Mulch around plants to reduce water evaporation.",

        harvest:
          "Optimal harvesting guidelines: 1) Monitor crop maturity indicators specific to your crop type, 2) Harvest during cool morning hours when possible, 3) Use clean, sharp tools to prevent plant damage, 4) Handle produce gently to avoid bruising, 5) Store harvested crops in proper conditions immediately after harvesting.",

        disease:
          "For disease prevention and management: 1) Ensure good air circulation between plants, 2) Avoid overhead watering which can spread fungal diseases, 3) Remove and destroy infected plant materials, 4) Apply preventive fungicides during humid conditions, 5) Use disease-resistant crop varieties when available.",
      };

      // Determine response based on keywords in prompt
      let response =
        "I understand your farming question. For specific agricultural guidance, I recommend consulting with local agricultural experts or visiting your nearest Krishi Vigyan Kendra. They can provide location-specific advice based on your soil conditions and local climate.";

      const promptLower = prompt.toLowerCase();
      for (const [keyword, keywordResponse] of Object.entries(
        farmingResponses
      )) {
        if (promptLower.includes(keyword)) {
          response = keywordResponse;
          break;
        }
      }

      return {
        text: response,
        confidence: 0.85,
      };
    } catch (error) {
      console.error("Gemini API error:", error);
      return {
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment or consult with local agricultural experts for immediate assistance.",
        confidence: 0.0,
      };
    }
  }

  async analyzeImage(imageBase64: string): Promise<GeminiImageAnalysis> {
    try {
      // For demo purposes, return mock analysis
      // In production, replace with actual Gemini Vision API call

      const mockAnalyses = [
        {
          detected_pest: "Aphid Infestation",
          confidence: 0.89,
          description:
            "Small soft-bodied insects feeding on plant sap, commonly found on young shoots and leaves.",
          recommendations: [
            "Spray with insecticidal soap solution",
            "Release beneficial insects like ladybugs",
            "Use neem oil spray in early morning",
            "Remove heavily infested plant parts",
          ],
        },
        {
          detected_pest: "Leaf Blight",
          confidence: 0.92,
          description:
            "Fungal disease affecting leaf tissues, commonly caused by high humidity and poor air circulation.",
          recommendations: [
            "Apply copper-based fungicide immediately",
            "Remove and destroy infected leaves",
            "Improve air circulation around plants",
            "Avoid overhead watering",
          ],
        },
        {
          detected_pest: "Stem Rust",
          confidence: 0.87,
          description:
            "Serious fungal disease affecting stems that can cause significant yield loss.",
          recommendations: [
            "Apply systemic fungicide within 24 hours",
            "Remove severely infected plants",
            "Monitor spread to neighboring plants",
            "Use resistant crop varieties next season",
          ],
        },
      ];

      // Return random mock analysis for demo
      const randomAnalysis =
        mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)];

      return randomAnalysis;
    } catch (error) {
      console.error("Gemini Vision API error:", error);
      return {
        detected_pest: "Analysis Failed",
        confidence: 0.0,
        description:
          "Unable to analyze the image at this time. Please ensure the image is clear and try again.",
        recommendations: [
          "Take a clearer photo in good lighting",
          "Ensure the affected area is visible",
          "Try again with a different angle",
          "Consult local agricultural experts if problem persists",
        ],
      };
    }
  }

  async generateSoilRecommendations(soilData: {
    ph: number;
    organicMatter: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  }): Promise<any[]> {
    try {
      // Mock soil analysis and recommendations
      const recommendations = [];

      // pH analysis
      if (soilData.ph < 6.0) {
        recommendations.push({
          type: "pH Adjustment",
          product: "Lime",
          amount: "2-3 kg per 100 sq meters",
          reason: "Soil is too acidic. Lime will help neutralize acidity.",
          applicationMethod: "Spread evenly and work into top 6 inches of soil",
        });
      } else if (soilData.ph > 8.0) {
        recommendations.push({
          type: "pH Adjustment",
          product: "Sulfur",
          amount: "1-2 kg per 100 sq meters",
          reason: "Soil is too alkaline. Sulfur will help lower pH.",
          applicationMethod: "Apply before planting and water thoroughly",
        });
      }

      // Nitrogen analysis
      if (soilData.nitrogen < 50) {
        recommendations.push({
          type: "Nitrogen Fertilizer",
          product: "Urea",
          amount: "40-50 kg per hectare",
          reason:
            "Low nitrogen levels detected. Nitrogen is essential for vegetative growth.",
          applicationMethod:
            "Apply in split doses - 50% at sowing, 50% during vegetative growth",
        });
      }

      // Phosphorus analysis
      if (soilData.phosphorus < 30) {
        recommendations.push({
          type: "Phosphorus Fertilizer",
          product: "Superphosphate",
          amount: "25-30 kg per hectare",
          reason:
            "Phosphorus deficiency affects root development and flowering.",
          applicationMethod: "Mix with soil during land preparation",
        });
      }

      // Potassium analysis
      if (soilData.potassium < 25) {
        recommendations.push({
          type: "Potassium Fertilizer",
          product: "Potassium Chloride",
          amount: "20-25 kg per hectare",
          reason: "Low potassium affects fruit quality and disease resistance.",
          applicationMethod: "Apply in split doses during sowing and flowering",
        });
      }

      // Organic matter analysis
      if (soilData.organicMatter < 3.0) {
        recommendations.push({
          type: "Organic Matter",
          product: "Compost",
          amount: "500-1000 kg per hectare",
          reason:
            "Low organic matter affects soil structure and nutrient retention.",
          applicationMethod: "Apply before planting and incorporate into soil",
        });
      }

      return recommendations;
    } catch (error) {
      console.error("Soil analysis error:", error);
      return [];
    }
  }
}

export const geminiService = new GeminiService();
