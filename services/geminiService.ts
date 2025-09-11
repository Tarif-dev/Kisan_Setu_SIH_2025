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
  private baseUrl: string =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  constructor() {
    this.apiKey = config.GEMINI_API_KEY;
  }

  async generateTextResponse(
    prompt: string,
    context?: string
  ): Promise<GeminiResponse> {
    try {
      if (!this.apiKey) {
        throw new Error("Gemini API key not configured");
      }

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: context ? `${context}\n\n${prompt}` : prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      };

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Gemini API Error:", errorData);

        // Parse error for better error messages
        try {
          const errorJson = JSON.parse(errorData);
          if (errorJson.error) {
            const { code, message, status } = errorJson.error;
            if (code === 503 || status === "UNAVAILABLE") {
              throw new Error(
                "Gemini service is temporarily overloaded. Please try again in a few moments."
              );
            } else if (code === 429) {
              throw new Error(
                "Too many requests. Please wait a moment before trying again."
              );
            } else if (code === 400) {
              throw new Error(
                "Invalid request. Please check your input and try again."
              );
            } else {
              throw new Error(
                `Gemini API error: ${message || "Unknown error"}`
              );
            }
          }
        } catch (parseError) {
          // If we can't parse the error, use the original response status
        }

        throw new Error(`Gemini API request failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        if (
          candidate.content &&
          candidate.content.parts &&
          candidate.content.parts.length > 0
        ) {
          return {
            text: candidate.content.parts[0].text,
            confidence: candidate.finishReason === "STOP" ? 0.9 : 0.7,
          };
        }
      }

      throw new Error("No valid response from Gemini API");
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error(
        `Failed to get response from Gemini: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async analyzeImageWithText(
    imageBase64: string,
    prompt: string
  ): Promise<GeminiResponse> {
    try {
      if (!this.apiKey) {
        throw new Error("Gemini API key not configured");
      }

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: imageBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096,
        },
      };

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Gemini Vision API Error:", errorData);
        throw new Error(`Gemini Vision API request failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        if (
          candidate.content &&
          candidate.content.parts &&
          candidate.content.parts.length > 0
        ) {
          return {
            text: candidate.content.parts[0].text,
            confidence: candidate.finishReason === "STOP" ? 0.9 : 0.7,
          };
        }
      }

      throw new Error("No valid response from Gemini Vision API");
    } catch (error) {
      console.error("Gemini Vision API Error:", error);
      throw new Error(
        `Failed to analyze image: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async analyzePestImage(imageBase64: string): Promise<GeminiImageAnalysis> {
    try {
      const prompt = `
Analyze this agricultural image for pest or disease identification:

Please provide:
1. Identify any pests, diseases, or plant health issues visible in the image
2. Assess the severity level (low, medium, high)
3. Provide specific treatment recommendations
4. Suggest prevention measures
5. Mention timing for treatment application

Format your response as a structured analysis that a farmer can easily understand and act upon.
`;

      const response = await this.analyzeImageWithText(imageBase64, prompt);

      // Parse the response to extract structured data
      const text = response.text;

      return {
        detected_pest: this.extractPestName(text),
        confidence: response.confidence || 0.8,
        description: text,
        recommendations: this.extractRecommendations(text),
      };
    } catch (error) {
      console.error("Pest analysis error:", error);
      throw error;
    }
  }

  private extractPestName(text: string): string {
    // Simple extraction logic - could be improved with regex or NLP
    const lines = text.toLowerCase().split("\n");
    for (const line of lines) {
      if (
        line.includes("pest") ||
        line.includes("disease") ||
        line.includes("identified")
      ) {
        return line.trim();
      }
    }
    return "Analysis completed";
  }

  private extractRecommendations(text: string): string[] {
    // Extract bullet points or numbered recommendations
    const recommendations: string[] = [];
    const lines = text.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (
        trimmed.match(/^[\d\-\*\+]/) ||
        trimmed.toLowerCase().includes("recommend")
      ) {
        recommendations.push(trimmed);
      }
    }

    return recommendations.length > 0 ? recommendations : [text];
  }

  // Get agricultural advice based on location and crop
  async getAgriculturalAdvice(
    cropType: string,
    location: string,
    issue: string
  ): Promise<GeminiResponse> {
    const prompt = `
As an agricultural expert, provide advice for a farmer with the following details:

Crop: ${cropType}
Location: ${location}
Issue/Question: ${issue}

Please provide:
1. Specific advice for this crop and location
2. Actionable steps the farmer can take
3. Cost-effective solutions
4. Timing recommendations
5. Warning signs to watch for

Keep the advice practical and easy to understand for farmers with basic education.
`;

    return await this.generateTextResponse(prompt);
  }

  // Get weather-based farming advice
  async getWeatherBasedAdvice(
    weatherCondition: string,
    cropStage: string,
    location: string
  ): Promise<GeminiResponse> {
    const prompt = `
Provide weather-based agricultural advice:

Current Weather: ${weatherCondition}
Crop Growth Stage: ${cropStage}
Location: ${location}

Please advise on:
1. Immediate actions needed due to current weather
2. Crop protection measures
3. Irrigation adjustments
4. Harvesting considerations if applicable
5. Preparation for upcoming weather changes

Focus on practical, immediate actions the farmer should take.
`;

    return await this.generateTextResponse(prompt);
  }
}

export const geminiService = new GeminiService();
