// Language Detection Service
// Simple language detection for Indian languages and English

interface LanguageDetectionResult {
  language: string;
  confidence: number;
  detectedLanguages: { language: string; confidence: number }[];
}

class LanguageDetectionService {
  // Common words and patterns for different languages
  private languagePatterns: Record<string, RegExp[]> = {
    hi: [
      /[\u0900-\u097F]/g, // Devanagari script
      /\b(है|के|में|से|पर|और|या|नहीं|मैं|आप|यह|वह|क्या|कैसे|कब|कहाँ|किसान|खेत|फसल)\b/gi,
    ],
    pa: [
      /[\u0A00-\u0A7F]/g, // Gurmukhi script
      /\b(ਹੈ|ਦੇ|ਵਿੱਚ|ਤੋਂ|ਤੇ|ਅਤੇ|ਜਾਂ|ਨਹੀਂ|ਮੈਂ|ਤੁਸੀਂ|ਇਹ|ਉਹ|ਕੀ|ਕਿਵੇਂ|ਕਦੋਂ|ਕਿੱਥੇ|ਕਿਸਾਨ|ਖੇਤ|ਫਸਲ)\b/gi,
    ],
    bn: [
      /[\u0980-\u09FF]/g, // Bengali script
      /\b(আছে|এর|মধ্যে|থেকে|উপর|এবং|বা|না|আমি|আপনি|এই|সেই|কি|কিভাবে|কখন|কোথায়|কৃষক|ক্ষেত|ফসল)\b/gi,
    ],
    te: [
      /[\u0C00-\u0C7F]/g, // Telugu script
      /\b(ఉంది|యొక్క|లో|నుండి|మీద|మరియు|లేదా|లేదు|నేను|మీరు|ఇది|అది|ఏమిటి|ఎలా|ఎప్పుడు|ఎక్కడ|రైతు|పొలం|పంట)\b/gi,
    ],
    ta: [
      /[\u0B80-\u0BFF]/g, // Tamil script
      /\b(உள்ளது|இன்|இல்|இருந்து|மீது|மற்றும்|அல்லது|இல்லை|நான்|நீங்கள்|இது|அது|என்ன|எப்படி|எப்போது|எங்கே|விவசாயி|வயல்|பயிர்)\b/gi,
    ],
    mr: [
      /[\u0900-\u097F]/g, // Devanagari script (same as Hindi)
      /\b(आहे|च्या|मध्ये|पासून|वर|आणि|किंवा|नाही|मी|तुम्ही|हे|ते|काय|कसे|केव्हा|कुठे|शेतकरी|शेत|पीक)\b/gi,
    ],
    gu: [
      /[\u0A80-\u0AFF]/g, // Gujarati script
      /\b(છે|ના|માં|થી|પર|અને|અથવા|નથી|હું|તમે|આ|તે|શું|કેવી|ક્યારે|ક્યાં|ખેડૂત|ખેત|પાક)\b/gi,
    ],
    kn: [
      /[\u0C80-\u0CFF]/g, // Kannada script
      /\b(ಇದೆ|ದ|ನಲ್ಲಿ|ಇಂದ|ಮೇಲೆ|ಮತ್ತು|ಅಥವಾ|ಇಲ್ಲ|ನಾನು|ನೀವು|ಇದು|ಅದು|ಏನು|ಹೇಗೆ|ಯಾವಾಗ|ಎಲ್ಲಿ|ರೈತ|ಹೊಲ|ಬೆಳೆ)\b/gi,
    ],
    ml: [
      /[\u0D00-\u0D7F]/g, // Malayalam script
      /\b(ഉണ്ട്|ന്റെ|ൽ|നിന്ന്|മുകളിൽ|ഒപ്പം|അല്ലെങ്കിൽ|ഇല്ല|ഞാൻ|നിങ്ങൾ|ഇത്|അത്|എന്ത്|എങ്ങനെ|എപ്പോൾ|എവിടെ|കർഷകൻ|പാടം|വിള)\b/gi,
    ],
    en: [
      /\b(is|are|the|and|or|not|in|on|at|from|to|with|for|by|of|about|how|what|when|where|farmer|farm|crop|agriculture)\b/gi,
    ],
  };

  // Common English words that indicate English text
  private englishIndicators = [
    "the",
    "and",
    "is",
    "are",
    "was",
    "were",
    "have",
    "has",
    "had",
    "will",
    "would",
    "could",
    "should",
    "can",
    "may",
    "might",
    "must",
    "this",
    "that",
    "these",
    "those",
    "what",
    "where",
    "when",
    "why",
    "how",
    "who",
    "which",
    "farmer",
    "farming",
    "agriculture",
    "crop",
    "field",
    "soil",
    "seed",
    "plant",
  ];

  detectLanguage(text: string): LanguageDetectionResult {
    if (!text || text.trim().length === 0) {
      return {
        language: "en",
        confidence: 0.5,
        detectedLanguages: [{ language: "en", confidence: 0.5 }],
      };
    }

    const cleanText = text.toLowerCase().trim();
    const scores: Record<string, number> = {};

    // Initialize scores
    Object.keys(this.languagePatterns).forEach((lang) => {
      scores[lang] = 0;
    });

    // Check each language pattern
    Object.entries(this.languagePatterns).forEach(([language, patterns]) => {
      patterns.forEach((pattern) => {
        const matches = cleanText.match(pattern);
        if (matches) {
          scores[language] += matches.length;
        }
      });
    });

    // Special handling for English detection
    const englishWords = this.englishIndicators.filter((word) =>
      cleanText.includes(word.toLowerCase())
    );
    scores["en"] += englishWords.length * 2; // Boost English score

    // Normalize scores based on text length
    const textWords = cleanText.split(/\s+/).length;
    Object.keys(scores).forEach((lang) => {
      scores[lang] = textWords > 0 ? scores[lang] / textWords : 0;
    });

    // Find the language with highest score
    const sortedLanguages = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([language, score]) => ({
        language,
        confidence: Math.min(score, 1.0),
      }));

    const topLanguage = sortedLanguages[0];

    // Default to English if no clear detection
    if (topLanguage.confidence < 0.1) {
      return {
        language: "en",
        confidence: 0.6,
        detectedLanguages: [{ language: "en", confidence: 0.6 }],
      };
    }

    return {
      language: topLanguage.language,
      confidence: topLanguage.confidence,
      detectedLanguages: sortedLanguages.slice(0, 3),
    };
  }

  // Quick language detection for common cases
  quickDetect(text: string): string {
    const result = this.detectLanguage(text);
    return result.confidence > 0.3 ? result.language : "en";
  }

  // Check if text contains specific language script
  hasScript(text: string, language: string): boolean {
    const patterns = this.languagePatterns[language];
    if (!patterns) return false;

    return patterns.some((pattern) => pattern.test(text));
  }

  // Get supported languages
  getSupportedLanguages(): string[] {
    return Object.keys(this.languagePatterns);
  }

  // Test language detection with sample text
  testDetection(): void {
    const testCases = [
      "Hello farmer, how is your crop growing?",
      "किसान जी, आपकी फसल कैसी है?",
      "ਕਿਸਾਨ ਜੀ, ਤੁਹਾਡੀ ਫਸਲ ਕਿਵੇਂ ਹੈ?",
      "কৃষক ভাই, আপনার ফসল কেমন আছে?",
      "రైతు గారు, మీ పంట ఎలా ఉంది?",
    ];

    console.log("Language Detection Test Results:");
    testCases.forEach((text) => {
      const result = this.detectLanguage(text);
      console.log(`Text: "${text}"`);
      console.log(
        `Detected: ${result.language} (${(result.confidence * 100).toFixed(1)}%)`
      );
      console.log("---");
    });
  }
}

export const languageDetectionService = new LanguageDetectionService();
export default LanguageDetectionService;
