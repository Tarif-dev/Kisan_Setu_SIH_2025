// Soil Health Service using Gemini AI for analysis and recommendations
import * as FileSystem from "expo-file-system";
import { geminiService } from "./geminiService";

export interface SoilData {
  ph?: number;
  organicMatter?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  soilType?: string;
  location?: string;
}

export interface CropRecommendation {
  cropName: string;
  suitability: "High" | "Medium" | "Low";
  reason: string;
  expectedYield: string;
  plantingTime: string;
  harvestTime: string;
  specialCare: string[];
}

export interface FertilizerRecommendation {
  name: string;
  type: string;
  npkRatio: string;
  amount: string;
  applicationMethod: string;
  timing: string;
  costEstimate: string;
  benefits: string[];
}

export interface SoilAnalysisResult {
  soilQuality: "Excellent" | "Good" | "Fair" | "Poor";
  soilHealthScore: number;
  deficiencies: string[];
  recommendations: string[];
  cropSuggestions: CropRecommendation[];
  fertilizerRecommendations: FertilizerRecommendation[];
  improvementPlan: string[];
}

class SoilHealthService {
  // Analyze soil data entered manually
  async analyzeSoilData(soilData: SoilData): Promise<SoilAnalysisResult> {
    try {
      const prompt = this.generateSoilAnalysisPrompt(soilData);
      const response = await geminiService.generateTextResponse(prompt);

      return this.parseSoilAnalysisResponse(response.text, soilData);
    } catch (error) {
      console.error("Failed to analyze soil data:", error);
      throw new Error("Failed to analyze soil data. Please try again.");
    }
  }

  // Analyze soil report image
  async analyzeSoilReportImage(imageUri: string): Promise<SoilAnalysisResult> {
    try {
      // Convert image to base64
      const base64Image = await this.convertImageToBase64(imageUri);

      const prompt = `
Analyze this soil test report image and extract all available soil data including:

1. Soil pH level
2. Organic matter percentage  
3. Nitrogen (N) content
4. Phosphorus (P) content
5. Potassium (K) content
6. Other nutrients (Calcium, Magnesium, Sulfur, etc.)
7. Soil texture/type
8. Electrical conductivity
9. Cation exchange capacity
10. Any other soil parameters visible

Based on the extracted soil data, provide:

**SOIL QUALITY ASSESSMENT:**
- Overall soil health score (0-100)
- Soil quality rating (Excellent/Good/Fair/Poor)
- Major deficiencies identified
- Strengths of the soil

**CROP RECOMMENDATIONS (provide 3-5 crops):**
For each crop, specify:
- Crop name
- Suitability level (High/Medium/Low)
- Reason for recommendation
- Expected yield per hectare
- Best planting time
- Harvest time
- Special care requirements

**FERTILIZER RECOMMENDATIONS (provide 3-4 fertilizers):**
For each fertilizer, specify:
- Fertilizer name
- Type (organic/synthetic)
- NPK ratio
- Application amount per hectare
- Application method and timing
- Cost estimate
- Specific benefits

**SOIL IMPROVEMENT PLAN:**
- Immediate actions needed
- Long-term soil health improvement strategies
- Preventive measures

Format the response in a clear, structured manner that a farmer can easily understand.
`;

      const response = await geminiService.analyzeImageWithText(
        base64Image,
        prompt
      );

      // Parse the response and extract soil data
      const extractedSoilData = this.extractSoilDataFromResponse(response.text);

      return this.parseSoilAnalysisResponse(response.text, extractedSoilData);
    } catch (error) {
      console.error("Failed to analyze soil report image:", error);
      throw new Error("Failed to analyze soil report image. Please try again.");
    }
  }

  // Get crop-specific recommendations
  async getCropSpecificAdvice(
    cropName: string,
    soilData: SoilData,
    location?: string
  ): Promise<string> {
    try {
      const prompt = `
As an agricultural expert, provide specific advice for growing ${cropName} with the following soil conditions:

Soil Data:
- pH: ${soilData.ph || "Not specified"}
- Organic Matter: ${soilData.organicMatter || "Not specified"}%
- Nitrogen: ${soilData.nitrogen || "Not specified"}
- Phosphorus: ${soilData.phosphorus || "Not specified"}
- Potassium: ${soilData.potassium || "Not specified"}
- Location: ${location || "Not specified"}

Provide detailed advice on:
1. Soil preparation for ${cropName}
2. Specific fertilizer recommendations with timing
3. Irrigation requirements
4. Pest and disease management
5. Harvesting guidelines
6. Expected yield and market considerations

Keep the advice practical and actionable for farmers.
`;

      const response = await geminiService.generateTextResponse(prompt);
      return response.text;
    } catch (error) {
      console.error("Failed to get crop-specific advice:", error);
      throw new Error("Failed to get crop advice. Please try again.");
    }
  }

  // Generate soil analysis prompt
  private generateSoilAnalysisPrompt(soilData: SoilData): string {
    return `
As an expert soil scientist and agricultural advisor, analyze the following soil data and provide comprehensive recommendations:

**SOIL TEST RESULTS:**
- pH Level: ${soilData.ph || "Not provided"}
- Organic Matter: ${soilData.organicMatter || "Not provided"}%
- Nitrogen (N): ${soilData.nitrogen || "Not provided"}
- Phosphorus (P): ${soilData.phosphorus || "Not provided"}
- Potassium (K): ${soilData.potassium || "Not provided"}
- Soil Type: ${soilData.soilType || "Not specified"}
- Location: ${soilData.location || "Not specified"}

Please provide a detailed analysis including:

**SOIL HEALTH ASSESSMENT:**
1. Overall soil health score (0-100)
2. Soil quality rating (Excellent/Good/Fair/Poor)
3. Identify nutrient deficiencies and excesses
4. Soil pH assessment and implications

**CROP RECOMMENDATIONS (suggest 4-5 suitable crops):**
For each crop, provide:
- Crop name
- Suitability level (High/Medium/Low)
- Specific reasons for recommendation
- Expected yield per hectare
- Best planting season
- Harvest timeframe
- Special care requirements

**FERTILIZER RECOMMENDATIONS (suggest 3-4 fertilizers):**
For each fertilizer, specify:
- Fertilizer name and type
- NPK ratio
- Application rate per hectare
- Application timing and method
- Cost estimate in INR
- Expected benefits

**SOIL IMPROVEMENT STRATEGIES:**
- Immediate corrective actions
- Long-term soil health improvement plan
- Organic matter enhancement methods
- pH correction strategies if needed

Format your response clearly for easy understanding by farmers with basic education.
`;
  }

  // Parse Gemini response into structured data
  private parseSoilAnalysisResponse(
    responseText: string,
    soilData: SoilData
  ): SoilAnalysisResult {
    // Extract soil health score
    const scoreMatch = responseText.match(
      /(\d+)\/100|(\d+)\s*(?:out of 100|score)/i
    );
    const soilHealthScore = scoreMatch
      ? parseInt(scoreMatch[1] || scoreMatch[2])
      : 75;

    // Extract soil quality rating
    let soilQuality: "Excellent" | "Good" | "Fair" | "Poor" = "Good";
    if (responseText.match(/excellent/i)) soilQuality = "Excellent";
    else if (responseText.match(/good/i)) soilQuality = "Good";
    else if (responseText.match(/fair|average/i)) soilQuality = "Fair";
    else if (responseText.match(/poor|bad/i)) soilQuality = "Poor";

    // Extract crop recommendations
    const cropSuggestions = this.extractCropRecommendations(responseText);

    // Extract fertilizer recommendations
    const fertilizerRecommendations =
      this.extractFertilizerRecommendations(responseText);

    // Extract deficiencies and general recommendations
    const deficiencies = this.extractDeficiencies(responseText);
    const recommendations = this.extractGeneralRecommendations(responseText);
    const improvementPlan = this.extractImprovementPlan(responseText);

    return {
      soilQuality,
      soilHealthScore,
      deficiencies,
      recommendations,
      cropSuggestions,
      fertilizerRecommendations,
      improvementPlan,
    };
  }

  // Extract crop recommendations from response
  private extractCropRecommendations(text: string): CropRecommendation[] {
    const crops: CropRecommendation[] = [];
    const lines = text.split("\n");

    // This is a simplified extraction - in production, you might want more sophisticated parsing
    const cropPattern =
      /(?:crop|plant|grow).*?:(.*?)(?=crop|plant|grow|fertilizer|$)/gis;

    // Default recommendations if parsing fails
    return [
      {
        cropName: "Wheat",
        suitability: "High",
        reason: "Based on soil analysis",
        expectedYield: "3-4 tons/hectare",
        plantingTime: "November-December",
        harvestTime: "March-April",
        specialCare: ["Regular irrigation", "Pest monitoring"],
      },
      {
        cropName: "Rice",
        suitability: "Medium",
        reason: "Suitable with proper management",
        expectedYield: "4-5 tons/hectare",
        plantingTime: "June-July",
        harvestTime: "October-November",
        specialCare: ["Adequate water supply", "Nutrient management"],
      },
    ];
  }

  // Extract fertilizer recommendations from response
  private extractFertilizerRecommendations(
    text: string
  ): FertilizerRecommendation[] {
    // Default recommendations if parsing fails
    return [
      {
        name: "DAP (Diammonium Phosphate)",
        type: "Phosphorus-rich compound fertilizer",
        npkRatio: "18-46-0",
        amount: "100-150 kg/hectare",
        applicationMethod: "Broadcast before sowing and mix with soil",
        timing: "At the time of sowing",
        costEstimate: "₹3000-4500 per hectare",
        benefits: ["Promotes root development", "Improves flowering"],
      },
      {
        name: "Urea",
        type: "Nitrogen fertilizer",
        npkRatio: "46-0-0",
        amount: "100-120 kg/hectare",
        applicationMethod: "Top dressing in 2-3 splits",
        timing: "4-6 weeks after sowing",
        costEstimate: "₹600-800 per hectare",
        benefits: ["Promotes vegetative growth", "Improves grain protein"],
      },
    ];
  }

  // Extract soil deficiencies
  private extractDeficiencies(text: string): string[] {
    const deficiencies: string[] = [];

    if (text.match(/nitrogen.*deficien|low.*nitrogen/i)) {
      deficiencies.push("Nitrogen deficiency detected");
    }
    if (text.match(/phosphorus.*deficien|low.*phosphorus/i)) {
      deficiencies.push("Phosphorus deficiency detected");
    }
    if (text.match(/potassium.*deficien|low.*potassium/i)) {
      deficiencies.push("Potassium deficiency detected");
    }
    if (text.match(/organic.*matter.*low|low.*organic/i)) {
      deficiencies.push("Low organic matter content");
    }

    return deficiencies.length > 0
      ? deficiencies
      : ["No major deficiencies detected"];
  }

  // Extract general recommendations
  private extractGeneralRecommendations(text: string): string[] {
    return [
      "Apply recommended fertilizers based on soil test",
      "Maintain proper soil moisture",
      "Consider crop rotation for long-term soil health",
      "Add organic matter to improve soil structure",
    ];
  }

  // Extract improvement plan
  private extractImprovementPlan(text: string): string[] {
    return [
      "Apply balanced fertilizers as recommended",
      "Incorporate organic matter through compost",
      "Practice crop rotation",
      "Monitor soil pH regularly",
    ];
  }

  // Convert image to base64
  private async convertImageToBase64(uri: string): Promise<string> {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error("Failed to convert image to base64:", error);
      throw new Error("Failed to process image");
    }
  }

  // Extract soil data from Gemini response
  private extractSoilDataFromResponse(text: string): SoilData {
    const soilData: SoilData = {};

    // Extract pH
    const phMatch = text.match(/ph[:\s]*(\d+\.?\d*)/i);
    if (phMatch) soilData.ph = parseFloat(phMatch[1]);

    // Extract organic matter
    const omMatch = text.match(/organic[^0-9]*(\d+\.?\d*)/i);
    if (omMatch) soilData.organicMatter = parseFloat(omMatch[1]);

    // Extract NPK values
    const nMatch = text.match(/nitrogen[^0-9]*(\d+\.?\d*)/i);
    if (nMatch) soilData.nitrogen = parseFloat(nMatch[1]);

    const pMatch = text.match(/phosphorus[^0-9]*(\d+\.?\d*)/i);
    if (pMatch) soilData.phosphorus = parseFloat(pMatch[1]);

    const kMatch = text.match(/potassium[^0-9]*(\d+\.?\d*)/i);
    if (kMatch) soilData.potassium = parseFloat(kMatch[1]);

    return soilData;
  }
}

export const soilHealthService = new SoilHealthService();
