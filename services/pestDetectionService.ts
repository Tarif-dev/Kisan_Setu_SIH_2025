// Pest Detection Service using Gemini AI for image analysis
import * as FileSystem from "expo-file-system";
import { geminiService } from "./geminiService";

export interface PestDetectionResult {
  pestName: {
    english: string;
    hindi: string;
  };
  scientificName: string;
  confidence: number;
  severity: "Low" | "Medium" | "High" | "Critical";
  category: "Pest" | "Disease" | "Nutrient Deficiency" | "Healthy" | "Unknown";
  description: {
    english: string;
    hindi: string;
  };
  symptoms: {
    english: string[];
    hindi: string[];
  };
  causes: {
    english: string[];
    hindi: string[];
  };
  treatments: TreatmentRecommendation[];
  preventiveMeasures: {
    english: string[];
    hindi: string[];
  };
  affectedCrops: string[];
  urgency:
    | "Immediate"
    | "Within 1 week"
    | "Monitor closely"
    | "No action needed";
  economicImpact: {
    english: string;
    hindi: string;
  };
  quickTips: {
    english: string[];
    hindi: string[];
  };
}

export interface TreatmentRecommendation {
  method: string;
  type: "Chemical" | "Organic" | "Biological" | "Cultural";
  products: string[];
  dosage: string;
  applicationMethod: string;
  frequency: string;
  timing: string;
  cost: string;
  effectiveness: number;
  precautions: string[];
}

class PestDetectionService {
  // Analyze plant image for pest/disease detection
  async analyzePlantImage(imageUri: string): Promise<PestDetectionResult> {
    try {
      // Convert image to base64
      const base64Image = await this.convertImageToBase64(imageUri);

      const prompt = `
Analyze this plant image and provide results in the following EXACT JSON format. Fill each field with accurate information:

{
  "englishName": "exact english name here",
  "hindiName": "exact hindi name here", 
  "scientificName": "exact scientific name here",
  "confidence": 85,
  "severity": "Medium",
  "category": "Disease",
  "descriptionEnglish": "clear description in english",
  "descriptionHindi": "clear description in hindi",
  "symptomsEnglish": ["symptom 1", "symptom 2", "symptom 3"],
  "symptomsHindi": ["लक्षण 1", "लक्षण 2", "लक्षण 3"],
  "quickTipsEnglish": ["tip 1", "tip 2", "tip 3"],
  "quickTipsHindi": ["सुझाव 1", "सुझाव 2", "सुझाव 3"],
  "treatments": [
    {
      "method": "treatment name",
      "type": "Organic",
      "effectiveness": 75,
      "applicationMethod": "Spray"
    }
  ],
  "urgency": "Monitor closely",
  "economicImpactEnglish": "impact description",
  "economicImpactHindi": "प्रभाव विवरण"
}

IMPORTANT RULES:
1. Use exact field names as shown above
2. Provide clean, simple names without asterisks, formatting, or extra text
3. Hindi names should be commonly used by Indian farmers
4. Be accurate and concise
5. Confidence should be 0-100
6. Severity: Low/Medium/High/Critical
7. Category: Pest/Disease/Nutrient Deficiency/Healthy/Unknown
8. Urgency: Immediate/Within 1 week/Monitor closely/No action needed

Analyze the plant image and respond ONLY with the filled JSON structure.
`;

      const response = await geminiService.analyzeImageWithText(
        base64Image,
        prompt
      );

      return this.parsePestDetectionResponse(response.text);
    } catch (error) {
      console.error("Failed to analyze plant image:", error);
      throw new Error("Failed to analyze plant image. Please try again.");
    }
  }

  // Get treatment details for a specific pest/disease
  async getTreatmentPlan(
    pestName: string,
    severity: string,
    cropType?: string
  ): Promise<string> {
    try {
      const prompt = `
As an agricultural expert, provide a detailed treatment plan for ${pestName} with ${severity} severity${
        cropType ? ` on ${cropType}` : ""
      }.

Include:
1. Immediate actions to take
2. Step-by-step treatment protocol
3. Timeline for treatment
4. Expected recovery time
5. Signs of improvement to watch for
6. When to seek professional help
7. Cost-effective alternatives

Provide practical advice that a farmer can follow easily.
`;

      const response = await geminiService.generateTextResponse(prompt);
      return response.text;
    } catch (error) {
      console.error("Failed to get treatment plan:", error);
      throw new Error("Failed to get treatment plan. Please try again.");
    }
  }

  // Convert image to base64
  private async convertImageToBase64(imageUri: string): Promise<string> {
    try {
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64Image;
    } catch (error) {
      console.error("Failed to convert image to base64:", error);
      throw new Error("Failed to process image");
    }
  }

  // Parse Gemini JSON response into structured data
  private parsePestDetectionResponse(
    responseText: string
  ): PestDetectionResult {
    // Default response structure
    const result: PestDetectionResult = {
      pestName: {
        english: "Plant Analysis Result",
        hindi: "पौधे की जांच परिणाम",
      },
      scientificName: "Analysis pending",
      confidence: 75,
      severity: "Medium",
      category: "Unknown",
      description: {
        english: "Analysis completed",
        hindi: "विश्लेषण पूर्ण",
      },
      symptoms: {
        english: [],
        hindi: [],
      },
      causes: {
        english: [],
        hindi: [],
      },
      treatments: [],
      preventiveMeasures: {
        english: [],
        hindi: [],
      },
      affectedCrops: [],
      urgency: "Monitor closely",
      economicImpact: {
        english: "Moderate impact if left untreated",
        hindi: "अनुपचारित छोड़ने पर मध्यम प्रभाव",
      },
      quickTips: {
        english: [],
        hindi: [],
      },
    };

    try {
      // Try to extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch[0]);

        // Map JSON fields to our structure
        if (jsonData.englishName) {
          result.pestName.english = jsonData.englishName;
        }
        if (jsonData.hindiName) {
          result.pestName.hindi = jsonData.hindiName;
        }
        if (jsonData.scientificName) {
          result.scientificName = jsonData.scientificName;
        }
        if (jsonData.confidence) {
          result.confidence = parseInt(jsonData.confidence);
        }
        if (jsonData.severity) {
          result.severity = jsonData.severity;
        }
        if (jsonData.category) {
          result.category = jsonData.category;
        }
        if (jsonData.descriptionEnglish) {
          result.description.english = jsonData.descriptionEnglish;
        }
        if (jsonData.descriptionHindi) {
          result.description.hindi = jsonData.descriptionHindi;
        }
        if (jsonData.symptomsEnglish) {
          result.symptoms.english = jsonData.symptomsEnglish;
        }
        if (jsonData.symptomsHindi) {
          result.symptoms.hindi = jsonData.symptomsHindi;
        }
        if (jsonData.quickTipsEnglish) {
          result.quickTips.english = jsonData.quickTipsEnglish;
        }
        if (jsonData.quickTipsHindi) {
          result.quickTips.hindi = jsonData.quickTipsHindi;
        }
        if (jsonData.treatments) {
          result.treatments = jsonData.treatments.map((t: any) => ({
            method: t.method || "Treatment",
            type: t.type || "Organic",
            products: t.products || ["To be specified"],
            dosage: t.dosage || "As per label",
            applicationMethod: t.applicationMethod || "Spray",
            frequency: t.frequency || "As needed",
            timing: t.timing || "Morning/Evening",
            cost: t.cost || "Moderate",
            effectiveness: t.effectiveness || 75,
            precautions: t.precautions || ["Follow safety guidelines"],
          }));
        }
        if (jsonData.urgency) {
          result.urgency = jsonData.urgency;
        }
        if (jsonData.economicImpactEnglish) {
          result.economicImpact.english = jsonData.economicImpactEnglish;
        }
        if (jsonData.economicImpactHindi) {
          result.economicImpact.hindi = jsonData.economicImpactHindi;
        }
      }

      return result;
    } catch (error) {
      console.error("Error parsing JSON pest detection response:", error);
      // Fallback: try basic text parsing
      return this.parseTextResponse(responseText, result);
    }
  }

  // Fallback text parsing method
  private parseTextResponse(
    responseText: string,
    defaultResult: PestDetectionResult
  ): PestDetectionResult {
    const result = { ...defaultResult };

    // Basic parsing for fallback
    const nameMatch = responseText.match(/name[:\s]*([^.\n]+)/i);
    if (nameMatch) {
      result.pestName.english = nameMatch[1].trim().replace(/[*"]/g, "");
    }

    const confidenceMatch = responseText.match(/confidence[:\s]*(\d+)/i);
    if (confidenceMatch) {
      result.confidence = parseInt(confidenceMatch[1]);
    }

    result.description.english = responseText.substring(0, 200) + "...";
    result.description.hindi = "विस्तृत विवरण उपलब्ध नहीं";

    return result;
  }

  // Extract list items from text
  private extractListItems(text: string): string[] {
    const items = text
      .split(/[-•*\n]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .slice(0, 8); // Limit to 8 items

    return items.length > 0
      ? items
      : ["Information will be provided after analysis"];
  }

  // Parse treatment recommendations
  private parseTreatments(treatmentText: string): TreatmentRecommendation[] {
    const treatments: TreatmentRecommendation[] = [];

    // Basic treatment parsing - can be enhanced
    const treatmentBlocks = treatmentText.split(/treatment \d+|method \d+/i);

    treatmentBlocks.forEach((block, index) => {
      if (block.trim().length > 20) {
        const treatment: TreatmentRecommendation = {
          method: `Treatment Option ${index + 1}`,
          type: "Chemical",
          products: ["To be specified based on local availability"],
          dosage: "As per product label",
          applicationMethod: "Spray application",
          frequency: "As needed",
          timing: "Early morning or evening",
          cost: "Moderate",
          effectiveness: 75,
          precautions: ["Follow safety guidelines", "Use protective equipment"],
        };

        // Extract method name
        const methodMatch = block.match(/^([^.\n]+)/);
        if (methodMatch) {
          treatment.method = methodMatch[1].trim();
        }

        // Extract type
        if (/organic|natural|bio/i.test(block)) {
          treatment.type = "Organic";
        } else if (/biological|beneficial/i.test(block)) {
          treatment.type = "Biological";
        } else if (/cultural|practice/i.test(block)) {
          treatment.type = "Cultural";
        }

        treatments.push(treatment);
      }
    });

    // Ensure at least one treatment
    if (treatments.length === 0) {
      treatments.push({
        method: "Integrated Pest Management",
        type: "Cultural",
        products: ["Multiple approaches recommended"],
        dosage: "As appropriate",
        applicationMethod: "Various methods",
        frequency: "Regular monitoring",
        timing: "Preventive and curative",
        cost: "Variable",
        effectiveness: 80,
        precautions: ["Regular monitoring", "Early intervention"],
      });
    }

    return treatments.slice(0, 4); // Limit to 4 treatments
  }
}

export const pestDetectionService = new PestDetectionService();
