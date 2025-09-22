// Multilingual localization service for Kisan Setu
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Translation {
  [key: string]: string | Translation | string[] | Translation[];
}

export interface Translations {
  [languageCode: string]: Translation;
}

// Language configuration
export const SUPPORTED_LANGUAGES = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    rtl: false,
  },
  hi: {
    code: "hi",
    name: "Hindi",
    nativeName: "हिंदी",
    rtl: false,
  },
  pa: {
    code: "pa",
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    rtl: false,
  },
};

// All translations for the app
const translations: Translations = {
  en: {
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      retry: "Retry",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      add: "Add",
      search: "Search",
      back: "Back",
      next: "Next",
      previous: "Previous",
      submit: "Submit",
      confirm: "Confirm",
      close: "Close",
      yes: "Yes",
      no: "No",
    },
    navigation: {
      home: "Home",
      advisory: "Advisory",
      assistant: "Assistant",
      marketplace: "Marketplace",
      settings: "Settings",
    },
    welcome: {
      title: "Welcome to Kisan Setu",
      subtitle: "Your Agricultural Companion",
      getStarted: "Get Started",
      description:
        "Get expert farming advice, weather updates, and market prices all in one place.",
    },
    onboarding: {
      title: "Farmer Registration",
      name: "Full Name",
      location: "Location",
      farmSize: "Farm Size (in acres)",
      cropType: "Primary Crop Type",
      experience: "Farming Experience (years)",
      language: "Preferred Language",
      submit: "Complete Registration",
      namePlaceholder: "Enter your full name",
      locationPlaceholder: "Enter your location",
      farmSizePlaceholder: "Enter farm size in acres",
      cropTypePlaceholder: "e.g., Wheat, Rice, Cotton",
      experiencePlaceholder: "Years of farming experience",
    },
    home: {
      title: "Dashboard",
      greeting: "Hello, Farmer!",
      todaysWeather: "Today's Weather",
      quickActions: "Quick Actions",
      recentActivity: "Recent Activity",
      cropHealth: "Crop Health",
      soilAnalysis: "Soil Analysis",
      pestDetection: "Pest Detection",
      marketPrices: "Market Prices",
      weatherAlert: "Weather Alert",
    },
    advisory: {
      title: "Agricultural Advisory",
      subtitle: "Personalized farming recommendations",
      searchPlaceholder: "Search for farming advice...",
      currentConditions: "Current Conditions",
      location: "Location",
      currentLocation: "Current Location",
      temperature: "Temperature",
      humidity: "Humidity",
      highPriority: "High Priority",
      mediumPriority: "Medium Priority",
      lowPriority: "Low Priority",
      todaysRecommendations: "Today's Recommendations",
      actionItems: "Action Items",
      weatherAlert: "Weather Alert",
      weatherAlertDescription:
        "Heavy rainfall expected tomorrow. Prepare for potential waterlogging in low-lying areas. Postpone any planned fertilizer application until after the rain.",
      farmingTip: "Farming Tip",
      farmingTipDescription:
        "Regularly monitor your crops for early signs of pest and disease problems. Early detection and treatment can prevent major crop losses and reduce treatment costs.",
      advisoryCards: {
        wheatDisease: {
          title: "Wheat Disease Warning",
          description:
            "High risk of fungal diseases due to recent rainfall and humid conditions.",
          actionItems: [
            "Apply fungicide within 48 hours",
            "Inspect crops daily for early symptoms",
            "Ensure proper field drainage",
            "Remove infected plant debris",
          ],
        },
        irrigation: {
          title: "Optimal Irrigation Time",
          description:
            "Current soil moisture levels suggest irrigation is needed for better crop yield.",
          actionItems: [
            "Irrigate during early morning hours",
            "Check soil moisture at 6-inch depth",
            "Apply 2-3 inches of water per session",
            "Monitor weather forecast before irrigation",
          ],
        },
        harvest: {
          title: "Harvest Recommendation",
          description:
            "Rice crops in your area are ready for harvest based on maturity indicators.",
          actionItems: [
            "Begin harvest within next 5-7 days",
            "Check grain moisture content",
            "Prepare storage facilities",
            "Arrange transportation for harvested crops",
          ],
        },
        fertilizer: {
          title: "Fertilizer Application",
          description:
            "Second dose of fertilizer application is due for corn crops.",
          actionItems: [
            "Apply NPK fertilizer in 4:2:1 ratio",
            "Water thoroughly after application",
            "Apply during cooler parts of the day",
            "Monitor crop response after 7 days",
          ],
        },
      },
      categories: {
        irrigation: "Irrigation",
        fertilizers: "Fertilizers",
        pestControl: "Pest Control",
        soilHealth: "Soil Health",
        cropManagement: "Crop Management",
        harvesting: "Harvesting",
      },
      noResults: "No advisory found",
      trySearching: "Try searching for specific topics",
    },
    assistant: {
      title: "Voice Assistant",
      tapToSpeak: "Tap to speak",
      listening: "Listening...",
      processing: "Processing...",
      speakNow: "Speak now",
      stopListening: "Stop listening",
      noMicrophone: "Microphone not available",
      permissionDenied: "Microphone permission denied",
      askAnything: "Ask me anything about farming!",
      examples: {
        title: "Try asking:",
        questions: [
          "How to grow tomatoes?",
          "Best fertilizer for wheat?",
          "Weather forecast for today?",
          "Market price of rice?",
        ],
      },
    },
    marketplace: {
      title: "ONDC Marketplace",
      searchProducts: "Search products...",
      categories: "Categories",
      featured: "Featured Products",
      nearbyStores: "Nearby Stores",
      addToCart: "Add to Cart",
      buyNow: "Buy Now",
      price: "Price",
      quantity: "Quantity",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      all: "All",
      vegetables: "Vegetables",
      fruits: "Fruits",
      grains: "Grains",
      dairy: "Dairy",
      organic: "Organic",
      freshness: "Freshness",
      harvestedToday: "Harvested Today",
      certification: "Certification",
      farmer: "Farmer",
      location: "Location",
      rating: "Rating",
      description: "Description",
      viewDetails: "View Details",
      addedToCart: "Added to Cart",
      viewCart: "View Cart",
      checkout: "Checkout",
      totalItems: "Total Items",
      subtotal: "Subtotal",
      ondcBadge: {
        poweredBy: "Powered by ONDC",
        directFrom: "Direct from farmers to your doorstep",
      },
      farmerCta: {
        question: "Are you a farmer?",
        description: "Join our marketplace and sell directly to customers",
        joinButton: "Join Now",
      },
      alerts: {
        addedToCart: "Added to Cart",
        productAdded: "Product added to your cart successfully!",
        ondcOrder: "ONDC Order",
        proceedToBuy: "Proceed to buy",
        from: "from",
        price: "Price",
        cancel: "Cancel",
        proceed: "Proceed",
        orderPlaced: "Order Placed",
        orderSuccess:
          "Your order has been placed through ONDC network. You will receive updates shortly.",
        contactFarmer: "Contact Farmer",
        connectWith: "Connect with",
        call: "Call",
        calling: "Calling",
        message: "Message",
        openingChat: "Opening chat with",
      },
      products: {
        freshTomatoes: {
          name: "Fresh Tomatoes",
          description:
            "Fresh, organically grown tomatoes harvested this morning. Rich in vitamins and perfect for cooking.",
        },
        basmatiRice: {
          name: "Basmati Rice",
          description:
            "Premium quality Basmati rice with authentic aroma and long grains. Grown using traditional methods.",
        },
        freshMangoes: {
          name: "Fresh Mangoes",
          description:
            "Sweet and juicy Alphonso mangoes, the king of fruits. Perfectly ripened and ready to eat.",
        },
        farmFreshMilk: {
          name: "Farm Fresh Milk",
          description:
            "Pure cow milk from grass-fed cows. Rich in nutrients and delivered fresh daily.",
        },
        organicSpinach: {
          name: "Organic Spinach",
          description:
            "Fresh organic spinach leaves, pesticide-free and rich in iron. Perfect for healthy meals.",
        },
        wheatFlour: {
          name: "Wheat Flour",
          description:
            "Stone-ground whole wheat flour from organically grown wheat. No preservatives added.",
        },
      },
      farmers: {
        rajeshKumar: "Rajesh Kumar",
        priyaSingh: "Priya Singh",
        sureshPatel: "Suresh Patel",
        mohitSharma: "Mohit Sharma",
        anitaDevi: "Anita Devi",
        vikramSingh: "Vikram Singh",
      },
      locations: {
        haryana: "Haryana, India",
        punjab: "Punjab, India",
        gujarat: "Gujarat, India",
        rajasthan: "Rajasthan, India",
        uttarPradesh: "Uttar Pradesh, India",
        madhyaPradesh: "Madhya Pradesh, India",
      },
      certifications: {
        organic: "Organic",
        fssai: "FSSAI",
        premiumGrade: "Premium Grade",
        exportQuality: "Export Quality",
        premium: "Premium",
        pasteurized: "Pasteurized",
        pesticideFree: "Pesticide-Free",
        stoneGround: "Stone Ground",
      },
      freshnessTypes: {
        harvestedToday: "Harvested Today",
        freshStock: "Fresh Stock",
        treeFresh: "Tree Fresh",
        dailyFresh: "Daily Fresh",
        morningFresh: "Morning Fresh",
        freshGround: "Fresh Ground",
      },
      units: {
        kg: "kg",
        liter: "liter",
        bunch: "bunch",
      },
    },
    settings: {
      title: "Settings",
      profile: "Profile",
      language: "Language",
      notifications: "Notifications",
      privacy: "Privacy",
      about: "About",
      logout: "Logout",
      accessibility: "Accessibility",
      voiceSupport: "Voice Support",
      feedback: "Feedback",
      reportIssue: "Report an Issue",
      provideFeedback: "Provide Feedback",
      currentLocation: "Current location: Farmville",
      languageSelection: {
        title: "Select Language",
        subtitle: "Choose your preferred language",
        current: "Current: ",
      },
      notification: {
        title: "Notification Settings",
        weatherAlerts: "Weather Alerts",
        marketUpdates: "Market Updates",
        cropReminders: "Crop Reminders",
        systemUpdates: "System Updates",
      },
    },
    weather: {
      title: "Weather Forecast",
      temperature: "Temperature",
      humidity: "Humidity",
      windSpeed: "Wind Speed",
      wind: "Wind",
      visibility: "Visibility",
      pressure: "Pressure",
      precipitation: "Precipitation",
      uvIndex: "UV Index",
      sunrise: "Sunrise",
      sunset: "Sunset",
      today: "Today",
      tomorrow: "Tomorrow",
      weekly: "Weekly Forecast",
      feelsLike: "Feels like",
      weatherAlert: "Weather Alert",
      weatherAlertText:
        "Heavy rainfall expected tomorrow. Prepare for waterlogging.",
      sevenDayForecast: "7-Day Forecast",
      partlyCloudy: "Partly Cloudy",
      heavyRain: "Heavy Rain",
      cloudy: "Cloudy",
      sunny: "Sunny",
      lightRain: "Light Rain",
    },
    soilHealth: {
      title: "Soil Health Analysis",
      testSoil: "Test Soil",
      takePhoto: "Take Photo",
      selectFromGallery: "Select from Gallery",
      analyzing: "Analyzing soil...",
      results: "Analysis Results",
      ph: "pH Level",
      nitrogen: "Nitrogen",
      phosphorus: "Phosphorus",
      potassium: "Potassium",
      recommendations: "Recommendations",
    },
    pestDetection: {
      title: "Pest Detection",
      detectPest: "Detect Pest",
      takePhoto: "Take Photo",
      selectFromGallery: "Select from Gallery",
      scanning: "Scanning for pests...",
      noPestFound: "No pest detected",
      pestFound: "Pest detected",
      confidence: "Confidence",
      treatment: "Treatment",
      prevention: "Prevention",
    },
    marketPrices: {
      title: "Market Prices",
      searchCrop: "Search crop...",
      todaysPrices: "Today's Prices",
      pricePerQuintal: "per quintal",
      location: "Location",
      lastUpdated: "Last updated",
      priceChange: "Price change",
      increased: "Increased",
      decreased: "Decreased",
      stable: "Stable",
    },
  },

  hi: {
    common: {
      loading: "लोड हो रहा है...",
      error: "त्रुटि",
      success: "सफल",
      retry: "पुनः प्रयास",
      cancel: "रद्द करें",
      save: "सहेजें",
      delete: "हटाएं",
      edit: "संपादित करें",
      add: "जोड़ें",
      search: "खोजें",
      back: "वापस",
      next: "आगे",
      previous: "पिछला",
      submit: "भेजें",
      confirm: "पुष्टि करें",
      close: "बंद करें",
      yes: "हां",
      no: "नहीं",
    },
    navigation: {
      home: "होम",
      advisory: "सलाह",
      assistant: "सहायक",
      marketplace: "बाजार",
      settings: "सेटिंग्स",
    },
    welcome: {
      title: "किसान सेतु में आपका स्वागत है",
      subtitle: "आपका कृषि साथी",
      getStarted: "शुरू करें",
      description:
        "एक ही स्थान पर विशेषज्ञ कृषि सलाह, मौसम अपडेट और बाजार की कीमतें प्राप्त करें।",
    },
    onboarding: {
      title: "किसान पंजीकरण",
      name: "पूरा नाम",
      location: "स्थान",
      farmSize: "खेत का आकार (एकड़ में)",
      cropType: "मुख्य फसल प्रकार",
      experience: "कृषि अनुभव (वर्ष)",
      language: "पसंदीदा भाषा",
      submit: "पंजीकरण पूरा करें",
      namePlaceholder: "अपना पूरा नाम दर्ज करें",
      locationPlaceholder: "अपना स्थान दर्ज करें",
      farmSizePlaceholder: "एकड़ में खेत का आकार दर्ज करें",
      cropTypePlaceholder: "जैसे गेहूं, चावल, कपास",
      experiencePlaceholder: "कृषि अनुभव के वर्ष",
    },
    home: {
      title: "डैशबोर्ड",
      greeting: "नमस्ते, किसान जी!",
      todaysWeather: "आज का मौसम",
      quickActions: "त्वरित कार्य",
      recentActivity: "हाल की गतिविधि",
      cropHealth: "फसल स्वास्थ्य",
      soilAnalysis: "मिट्टी विश्लेषण",
      pestDetection: "कीट पहचान",
      marketPrices: "बाजार मूल्य",
      weatherAlert: "मौसम चेतावनी",
    },
    advisory: {
      title: "कृषि सलाह",
      subtitle: "व्यक्तिगत कृषि सिफारिशें",
      searchPlaceholder: "कृषि सलाह खोजें...",
      currentConditions: "वर्तमान स्थितियां",
      location: "स्थान",
      currentLocation: "वर्तमान स्थान",
      temperature: "तापमान",
      humidity: "आर्द्रता",
      highPriority: "उच्च प्राथमिकता",
      mediumPriority: "मध्यम प्राथमिकता",
      lowPriority: "कम प्राथमिकता",
      todaysRecommendations: "आज की सिफारिशें",
      actionItems: "कार्य आइटम",
      weatherAlert: "मौसम चेतावनी",
      weatherAlertDescription:
        "कल भारी बारिश की उम्मीद है। निचले इलाकों में संभावित जलभराव के लिए तैयार रहें। बारिश के बाद तक किसी भी नियोजित उर्वरक आवेदन को स्थगित करें।",
      farmingTip: "कृषि सुझाव",
      farmingTipDescription:
        "कीट और रोग की समस्याओं के शुरुआती संकेतों के लिए नियमित रूप से अपनी फसलों की निगरानी करें। जल्दी पहचान और उपचार से बड़े फसल नुकसान को रोका जा सकता है और उपचार लागत कम हो सकती है।",
      advisoryCards: {
        wheatDisease: {
          title: "गेहूं रोग चेतावनी",
          description:
            "हाल की बारिश और नम स्थितियों के कारण फंगल रोगों का उच्च जोखिम।",
          actionItems: [
            "48 घंटों के भीतर फंगीसाइड लगाएं",
            "शुरुआती लक्षणों के लिए दैनिक फसल निरीक्षण करें",
            "उचित क्षेत्र जल निकासी सुनिश्चित करें",
            "संक्रमित पौधों का मलबा हटाएं",
          ],
        },
        irrigation: {
          title: "इष्टतम सिंचाई समय",
          description:
            "वर्तमान मिट्टी की नमी का स्तर बेहतर फसल उपज के लिए सिंचाई की आवश्यकता का संकेत देता है।",
          actionItems: [
            "सुबह जल्दी सिंचाई करें",
            "6 इंच गहराई पर मिट्टी की नमी जांचें",
            "प्रति सत्र 2-3 इंच पानी लगाएं",
            "सिंचाई से पहले मौसम पूर्वानुमान की निगरानी करें",
          ],
        },
        harvest: {
          title: "कटाई की सिफारिश",
          description:
            "परिपक्वता संकेतकों के आधार पर आपके क्षेत्र में धान की फसल कटाई के लिए तैयार है।",
          actionItems: [
            "अगले 5-7 दिनों के भीतर कटाई शुरू करें",
            "अनाज की नमी सामग्री जांचें",
            "भंडारण सुविधाएं तैयार करें",
            "कटी फसल के लिए परिवहन की व्यवस्था करें",
          ],
        },
        fertilizer: {
          title: "उर्वरक आवेदन",
          description: "मक्का की फसल के लिए उर्वरक की दूसरी खुराक का समय है।",
          actionItems: [
            "4:2:1 अनुपात में NPK उर्वरक लगाएं",
            "आवेदन के बाद अच्छी तरह पानी दें",
            "दिन के ठंडे हिस्सों में लगाएं",
            "7 दिन बाद फसल प्रतिक्रिया की निगरानी करें",
          ],
        },
      },
      categories: {
        irrigation: "सिंचाई",
        fertilizers: "उर्वरक",
        pestControl: "कीट नियंत्रण",
        soilHealth: "मिट्टी स्वास्थ्य",
        cropManagement: "फसल प्रबंधन",
        harvesting: "कटाई",
      },
      noResults: "कोई सलाह नहीं मिली",
      trySearching: "विशिष्ट विषयों की खोज करें",
    },
    assistant: {
      title: "आवाज सहायक",
      tapToSpeak: "बोलने के लिए टैप करें",
      listening: "सुन रहा है...",
      processing: "प्रसंस्करण...",
      speakNow: "अब बोलें",
      stopListening: "सुनना बंद करें",
      noMicrophone: "माइक्रोफोन उपलब्ध नहीं",
      permissionDenied: "माइक्रोफोन अनुमति अस्वीकृत",
      askAnything: "खेती के बारे में कुछ भी पूछें!",
      examples: {
        title: "पूछने की कोशिश करें:",
        questions: [
          "टमाटर कैसे उगाएं?",
          "गेहूं के लिए सबसे अच्छा उर्वरक?",
          "आज का मौसम पूर्वानुमान?",
          "चावल का बाजार मूल्य?",
        ],
      },
    },
    marketplace: {
      title: "ONDC बाजार",
      searchProducts: "उत्पाद खोजें...",
      categories: "श्रेणियां",
      featured: "विशेष उत्पाद",
      nearbyStores: "नजदीकी दुकानें",
      addToCart: "कार्ट में जोड़ें",
      buyNow: "अभी खरीदें",
      price: "मूल्य",
      quantity: "मात्रा",
      inStock: "स्टॉक में",
      outOfStock: "स्टॉक में नहीं",
      all: "सभी",
      vegetables: "सब्जियां",
      fruits: "फल",
      grains: "अनाज",
      dairy: "डेयरी",
      organic: "जैविक",
      freshness: "ताजगी",
      harvestedToday: "आज काटा गया",
      certification: "प्रमाणन",
      farmer: "किसान",
      location: "स्थान",
      rating: "रेटिंग",
      description: "विवरण",
      viewDetails: "विवरण देखें",
      addedToCart: "कार्ट में जोड़ा गया",
      viewCart: "कार्ट देखें",
      checkout: "चेकआउट",
      totalItems: "कुल आइटम",
      subtotal: "उप-योग",
      ondcBadge: {
        poweredBy: "ONDC द्वारा संचालित",
        directFrom: "किसानों से सीधे आपके दरवाजे तक",
      },
      farmerCta: {
        question: "क्या आप एक किसान हैं?",
        description: "हमारे बाजार में शामिल हों और ग्राहकों को सीधे बेचें",
        joinButton: "अभी शामिल हों",
      },
      alerts: {
        addedToCart: "कार्ट में जोड़ा गया",
        productAdded: "उत्पाद सफलतापूर्वक आपके कार्ट में जोड़ा गया!",
        ondcOrder: "ONDC ऑर्डर",
        proceedToBuy: "खरीदने के लिए आगे बढ़ें",
        from: "से",
        price: "कीमत",
        cancel: "रद्द करें",
        proceed: "आगे बढ़ें",
        orderPlaced: "ऑर्डर दिया गया",
        orderSuccess:
          "आपका ऑर्डर ONDC नेटवर्क के माध्यम से दिया गया है। आपको जल्द ही अपडेट मिलेंगे।",
        contactFarmer: "किसान से संपर्क करें",
        connectWith: "के साथ संपर्क करें",
        call: "कॉल करें",
        calling: "कॉल कर रहे हैं",
        message: "संदेश",
        openingChat: "के साथ चैट खोल रहे हैं",
      },
      products: {
        freshTomatoes: {
          name: "ताजे टमाटर",
          description:
            "आज सुबह काटे गए ताजे, जैविक रूप से उगाए गए टमाटर। विटामिन से भरपूर और खाना पकाने के लिए एकदम सही।",
        },
        basmatiRice: {
          name: "बासमती चावल",
          description:
            "प्रामाणिक सुगंध और लंबे दाने वाला प्रीमियम गुणवत्ता का बासमती चावल। पारंपरिक तरीकों से उगाया गया।",
        },
        freshMangoes: {
          name: "ताजे आम",
          description:
            "मीठे और रसीले अल्फांसो आम, फलों के राजा। पूरी तरह पके हुए और खाने के लिए तैयार।",
        },
        farmFreshMilk: {
          name: "फार्म फ्रेश दूध",
          description:
            "घास खाने वाली गायों का शुद्ध दूध। पोषक तत्वों से भरपूर और प्रतिदिन ताजा पहुंचाया जाता है।",
        },
        organicSpinach: {
          name: "जैविक पालक",
          description:
            "ताजे जैविक पालक के पत्ते, कीटनाशक मुक्त और आयरन से भरपूर। स्वस्थ भोजन के लिए एकदम सही।",
        },
        wheatFlour: {
          name: "गेहूं का आटा",
          description:
            "जैविक रूप से उगाए गए गेहूं से पत्थर पर पिसा हुआ साबुत गेहूं का आटा। कोई परिरक्षक नहीं मिलाया गया।",
        },
      },
      farmers: {
        rajeshKumar: "राजेश कुमार",
        priyaSingh: "प्रिया सिंह",
        sureshPatel: "सुरेश पटेल",
        mohitSharma: "मोहित शर्मा",
        anitaDevi: "अनीता देवी",
        vikramSingh: "विक्रम सिंह",
      },
      locations: {
        haryana: "हरियाणा, भारत",
        punjab: "पंजाब, भारत",
        gujarat: "गुजरात, भारत",
        rajasthan: "राजस्थान, भारत",
        uttarPradesh: "उत्तर प्रदेश, भारत",
        madhyaPradesh: "मध्य प्रदेश, भारत",
      },
      certifications: {
        organic: "जैविक",
        fssai: "FSSAI",
        premiumGrade: "प्रीमियम ग्रेड",
        exportQuality: "निर्यात गुणवत्ता",
        premium: "प्रीमियम",
        pasteurized: "पाश्चुरीकृत",
        pesticideFree: "कीटनाशक मुक्त",
        stoneGround: "पत्थर पर पिसा",
      },
      freshnessTypes: {
        harvestedToday: "आज काटा गया",
        freshStock: "ताजा स्टॉक",
        treeFresh: "पेड़ से ताजा",
        dailyFresh: "दैनिक ताजा",
        morningFresh: "सुबह का ताजा",
        freshGround: "ताजा पिसा हुआ",
      },
      units: {
        kg: "किलो",
        liter: "लीटर",
        bunch: "गुच्छा",
      },
    },
    settings: {
      title: "सेटिंग्स",
      profile: "प्रोफाइल",
      language: "भाषा",
      notifications: "सूचनाएं",
      privacy: "गोपनीयता",
      about: "के बारे में",
      logout: "लॉग आउट",
      accessibility: "सुलभता",
      voiceSupport: "आवाज सहायता",
      feedback: "प्रतिक्रिया",
      reportIssue: "समस्या की रिपोर्ट करें",
      provideFeedback: "प्रतिक्रिया प्रदान करें",
      currentLocation: "वर्तमान स्थान: फार्मविले",
      languageSelection: {
        title: "भाषा चुनें",
        subtitle: "अपनी पसंदीदा भाषा चुनें",
        current: "वर्तमान: ",
      },
      notification: {
        title: "सूचना सेटिंग्स",
        weatherAlerts: "मौसम चेतावनी",
        marketUpdates: "बाजार अपडेट",
        cropReminders: "फसल रिमाइंडर",
        systemUpdates: "सिस्टम अपडेट",
      },
    },
    weather: {
      title: "मौसम पूर्वानुमान",
      temperature: "तापमान",
      humidity: "आर्द्रता",
      windSpeed: "हवा की गति",
      wind: "हवा",
      visibility: "दृश्यता",
      pressure: "दबाव",
      precipitation: "वर्षा",
      uvIndex: "UV सूचकांक",
      sunrise: "सूर्योदय",
      sunset: "सूर्यास्त",
      today: "आज",
      tomorrow: "कल",
      weekly: "साप्ताहिक पूर्वानुमान",
      feelsLike: "महसूस होता है",
      weatherAlert: "मौसम चेतावनी",
      weatherAlertText: "कल भारी बारिश की उम्मीद है। जलभराव के लिए तैयार रहें।",
      sevenDayForecast: "7-दिन का पूर्वानुमान",
      partlyCloudy: "आंशिक बादल",
      heavyRain: "भारी बारिश",
      cloudy: "बादल",
      sunny: "धूप",
      lightRain: "हल्की बारिश",
    },
    soilHealth: {
      title: "मिट्टी स्वास्थ्य विश्लेषण",
      testSoil: "मिट्टी की जांच",
      takePhoto: "फोटो लें",
      selectFromGallery: "गैलरी से चुनें",
      analyzing: "मिट्टी का विश्लेषण...",
      results: "विश्लेषण परिणाम",
      ph: "pH स्तर",
      nitrogen: "नाइट्रोजन",
      phosphorus: "फास्फोरस",
      potassium: "पोटेशियम",
      recommendations: "सिफारिशें",
    },
    pestDetection: {
      title: "कीट पहचान",
      detectPest: "कीट की पहचान",
      takePhoto: "फोटो लें",
      selectFromGallery: "गैलरी से चुनें",
      scanning: "कीट के लिए स्कैन कर रहे हैं...",
      noPestFound: "कोई कीट नहीं मिला",
      pestFound: "कीट मिला",
      confidence: "विश्वास",
      treatment: "उपचार",
      prevention: "बचाव",
    },
    marketPrices: {
      title: "बाजार मूल्य",
      searchCrop: "फसल खोजें...",
      todaysPrices: "आज की कीमतें",
      pricePerQuintal: "प्रति क्विंटल",
      location: "स्थान",
      lastUpdated: "अंतिम अपडेट",
      priceChange: "मूल्य परिवर्तन",
      increased: "बढ़ा",
      decreased: "घटा",
      stable: "स्थिर",
    },
  },

  pa: {
    common: {
      loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
      error: "ਗਲਤੀ",
      success: "ਸਫਲ",
      retry: "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼",
      cancel: "ਰੱਦ ਕਰੋ",
      save: "ਸੇਵ ਕਰੋ",
      delete: "ਮਿਟਾਓ",
      edit: "ਸੰਪਾਦਨ",
      add: "ਸ਼ਾਮਲ ਕਰੋ",
      search: "ਖੋਜੋ",
      back: "ਵਾਪਸ",
      next: "ਅਗਲਾ",
      previous: "ਪਿਛਲਾ",
      submit: "ਭੇਜੋ",
      confirm: "ਪੁਸ਼ਟੀ ਕਰੋ",
      close: "ਬੰਦ ਕਰੋ",
      yes: "ਹਾਂ",
      no: "ਨਹੀਂ",
    },
    navigation: {
      home: "ਘਰ",
      advisory: "ਸਲਾਹ",
      assistant: "ਸਹਾਇਕ",
      marketplace: "ਬਾਜ਼ਾਰ",
      settings: "ਸੈਟਿੰਗਜ਼",
    },
    welcome: {
      title: "ਕਿਸਾਨ ਸੇਤੂ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ",
      subtitle: "ਤੁਹਾਡਾ ਖੇਤੀਬਾੜੀ ਸਾਥੀ",
      getStarted: "ਸ਼ੁਰੂ ਕਰੋ",
      description:
        "ਇੱਕ ਹੀ ਸਥਾਨ ਤੇ ਮਾਹਰ ਖੇਤੀਬਾੜੀ ਸਲਾਹ, ਮੌਸਮ ਅਪਡੇਟ ਅਤੇ ਮਾਰਕੀਟ ਦੀਆਂ ਕੀਮਤਾਂ ਪ੍ਰਾਪਤ ਕਰੋ।",
    },
    onboarding: {
      title: "ਕਿਸਾਨ ਰਜਿਸਟਰੇਸ਼ਨ",
      name: "ਪੂਰਾ ਨਾਮ",
      location: "ਸਥਾਨ",
      farmSize: "ਫਾਰਮ ਦਾ ਸਾਈਜ਼ (ਏਕੜ ਵਿੱਚ)",
      cropType: "ਮੁੱਖ ਫਸਲ ਦੀ ਕਿਸਮ",
      experience: "ਖੇਤੀਬਾੜੀ ਦਾ ਤਜਰਬਾ (ਸਾਲ)",
      language: "ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ",
      submit: "ਰਜਿਸਟਰੇਸ਼ਨ ਪੂਰਾ ਕਰੋ",
      namePlaceholder: "ਆਪਣਾ ਪੂਰਾ ਨਾਮ ਦਰਜ ਕਰੋ",
      locationPlaceholder: "ਆਪਣਾ ਸਥਾਨ ਦਰਜ ਕਰੋ",
      farmSizePlaceholder: "ਏਕੜ ਵਿੱਚ ਫਾਰਮ ਸਾਈਜ਼ ਦਰਜ ਕਰੋ",
      cropTypePlaceholder: "ਜਿਵੇਂ ਕਿ ਕਣਕ, ਚਾਵਲ, ਕਪਾਸ",
      experiencePlaceholder: "ਖੇਤੀਬਾੜੀ ਤਜਰਬੇ ਦੇ ਸਾਲ",
    },
    home: {
      title: "ਡੈਸ਼ਬੋਰਡ",
      greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਕਿਸਾਨ ਜੀ!",
      todaysWeather: "ਅੱਜ ਦਾ ਮੌਸਮ",
      quickActions: "ਤੇਜ਼ ਕਾਰਵਾਈਆਂ",
      recentActivity: "ਹਾਲੀਆ ਗਤੀਵਿਧੀ",
      cropHealth: "ਫਸਲ ਦੀ ਸਿਹਤ",
      soilAnalysis: "ਮਿੱਟੀ ਵਿਸ਼ਲੇਸ਼ਣ",
      pestDetection: "ਕੀਟ ਪਛਾਣ",
      marketPrices: "ਮਾਰਕੀਟ ਦੀਆਂ ਕੀਮਤਾਂ",
      weatherAlert: "ਮੌਸਮ ਚੇਤਾਵਨੀ",
    },
    advisory: {
      title: "ਖੇਤੀਬਾੜੀ ਸਲਾਹ",
      subtitle: "ਵਿਅਕਤਿਗਤ ਖੇਤੀਬਾੜੀ ਸਿਫਾਰਸ਼ਾਂ",
      searchPlaceholder: "ਖੇਤੀਬਾੜੀ ਸਲਾਹ ਖੋਜੋ...",
      currentConditions: "ਮੌਜੂਦਾ ਸਥਿਤੀਆਂ",
      location: "ਸਥਾਨ",
      currentLocation: "ਮੌਜੂਦਾ ਸਥਾਨ",
      temperature: "ਤਾਪਮਾਨ",
      humidity: "ਨਮੀ",
      highPriority: "ਉੱਚ ਤਰਜੀਹ",
      mediumPriority: "ਮੱਧਮ ਤਰਜੀਹ",
      lowPriority: "ਘੱਟ ਤਰਜੀਹ",
      todaysRecommendations: "ਅੱਜ ਦੀਆਂ ਸਿਫਾਰਸ਼ਾਂ",
      actionItems: "ਕਾਰਵਾਈ ਆਈਟਮਾਂ",
      weatherAlert: "ਮੌਸਮ ਚੇਤਾਵਨੀ",
      weatherAlertDescription:
        "ਕੱਲ੍ਹ ਭਾਰੀ ਬਰਸਾਤ ਦੀ ਉਮੀਦ ਹੈ। ਨੀਵੇਂ ਖੇਤਰਾਂ ਵਿੱਚ ਸੰਭਾਵਿਤ ਜਲ ਜਮਾਅ ਲਈ ਤਿਆਰ ਰਹੋ। ਬਰਸਾਤ ਤੋਂ ਬਾਅਦ ਤੱਕ ਕਿਸੇ ਵੀ ਯੋਜਨਾਬੱਧ ਖਾਦ ਅਪਲੀਕੇਸ਼ਨ ਨੂੰ ਮੁਲਤਵੀ ਕਰੋ।",
      farmingTip: "ਖੇਤੀਬਾੜੀ ਸੁਝਾਅ",
      farmingTipDescription:
        "ਕੀਟ ਅਤੇ ਬਿਮਾਰੀ ਦੀਆਂ ਸਮੱਸਿਆਵਾਂ ਦੇ ਸ਼ੁਰੂਆਤੀ ਸੰਕੇਤਾਂ ਲਈ ਨਿਯਮਿਤ ਤੌਰ 'ਤੇ ਆਪਣੀਆਂ ਫਸਲਾਂ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ। ਜਲਦੀ ਪਛਾਣ ਅਤੇ ਇਲਾਜ ਵੱਡੇ ਫਸਲ ਨੁਕਸਾਨ ਨੂੰ ਰੋਕ ਸਕਦੇ ਹਨ ਅਤੇ ਇਲਾਜ ਦੀ ਲਾਗਤ ਘਟਾ ਸਕਦੇ ਹਨ।",
      advisoryCards: {
        wheatDisease: {
          title: "ਕਣਕ ਰੋਗ ਚੇਤਾਵਨੀ",
          description:
            "ਹਾਲੀਆ ਬਰਸਾਤ ਅਤੇ ਨਮ ਸਥਿਤੀਆਂ ਕਾਰਨ ਫੰਗਲ ਰੋਗਾਂ ਦਾ ਉੱਚ ਜੋਖਮ।",
          actionItems: [
            "48 ਘੰਟਿਆਂ ਦੇ ਅੰਦਰ ਫੰਗੀਸਾਈਡ ਲਗਾਓ",
            "ਸ਼ੁਰੂਆਤੀ ਲੱਛਣਾਂ ਲਈ ਰੋਜ਼ਾਨਾ ਫਸਲਾਂ ਦਾ ਨਿਰੀਖਣ ਕਰੋ",
            "ਉਚਿਤ ਖੇਤ ਨਿਕਾਸ ਨੂੰ ਯਕੀਨੀ ਬਣਾਓ",
            "ਸੰਕਰਮਿਤ ਪੌਧਿਆਂ ਦਾ ਮਲਬਾ ਹਟਾਓ",
          ],
        },
        irrigation: {
          title: "ਸਰਵੋਤਮ ਸਿੰਚਾਈ ਸਮਾਂ",
          description:
            "ਮੌਜੂਦਾ ਮਿੱਟੀ ਦੀ ਨਮੀ ਦਾ ਪੱਧਰ ਬਿਹਤਰ ਫਸਲ ਪੈਦਾਵਾਰ ਲਈ ਸਿੰਚਾਈ ਦੀ ਲੋੜ ਦਾ ਸੁਝਾਅ ਦਿੰਦਾ ਹੈ।",
          actionItems: [
            "ਸਵੇਰੇ ਜਲਦੀ ਸਿੰਚਾਈ ਕਰੋ",
            "6 ਇੰਚ ਦੀ ਡੂੰਘਾਈ ਤੇ ਮਿੱਟੀ ਦੀ ਨਮੀ ਦੀ ਜਾਂਚ ਕਰੋ",
            "ਹਰ ਸੈਸ਼ਨ ਵਿੱਚ 2-3 ਇੰਚ ਪਾਣੀ ਲਗਾਓ",
            "ਸਿੰਚਾਈ ਤੋਂ ਪਹਿਲਾਂ ਮੌਸਮ ਪੂਰਵਾਨੁਮਾਨ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ",
          ],
        },
        harvest: {
          title: "ਕਟਾਈ ਦੀ ਸਿਫਾਰਸ਼",
          description:
            "ਪਰਿਪੱਕਤਾ ਸੰਕੇਤਕਾਂ ਦੇ ਆਧਾਰ 'ਤੇ ਤੁਹਾਡੇ ਖੇਤਰ ਵਿੱਚ ਚਾਵਲ ਦੀ ਫਸਲ ਕਟਾਈ ਲਈ ਤਿਆਰ ਹੈ।",
          actionItems: [
            "ਅਗਲੇ 5-7 ਦਿਨਾਂ ਵਿੱਚ ਕਟਾਈ ਸ਼ੁਰੂ ਕਰੋ",
            "ਅਨਾਜ ਦੀ ਨਮੀ ਸਮੱਗਰੀ ਦੀ ਜਾਂਚ ਕਰੋ",
            "ਭੰਡਾਰਣ ਸਹੂਲਤਾਂ ਤਿਆਰ ਕਰੋ",
            "ਕਟੀ ਹੋਈ ਫਸਲ ਲਈ ਆਵਾਜਾਈ ਦਾ ਪ੍ਰਬੰਧ ਕਰੋ",
          ],
        },
        fertilizer: {
          title: "ਖਾਦ ਲਗਾਉਣਾ",
          description: "ਮੱਕੀ ਦੀ ਫਸਲ ਲਈ ਖਾਦ ਦੀ ਦੂਜੀ ਖੁਰਾਕ ਦਾ ਸਮਾਂ ਹੈ।",
          actionItems: [
            "4:2:1 ਅਨੁਪਾਤ ਵਿੱਚ NPK ਖਾਦ ਲਗਾਓ",
            "ਲਗਾਉਣ ਤੋਂ ਬਾਅਦ ਚੰਗੀ ਤਰ੍ਹਾਂ ਪਾਣੀ ਦਿਓ",
            "ਦਿਨ ਦੇ ਠੰਡੇ ਹਿੱਸਿਆਂ ਵਿੱਚ ਲਗਾਓ",
            "7 ਦਿਨ ਬਾਅਦ ਫਸਲ ਪ੍ਰਤੀਕਿਰਿਆ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ",
          ],
        },
      },
      categories: {
        irrigation: "ਸਿੰਚਾਈ",
        fertilizers: "ਖਾਦ",
        pestControl: "ਕੀਟ ਨਿਯੰਤਰਣ",
        soilHealth: "ਮਿੱਟੀ ਦੀ ਸਿਹਤ",
        cropManagement: "ਫਸਲ ਪ੍ਰਬੰਧਨ",
        harvesting: "ਕਟਾਈ",
      },
      noResults: "ਕੋਈ ਸਲਾਹ ਨਹੀਂ ਮਿਲੀ",
      trySearching: "ਖਾਸ ਵਿਸ਼ਿਆਂ ਦੀ ਖੋਜ ਕਰੋ",
    },
    assistant: {
      title: "ਆਵਾਜ਼ ਸਹਾਇਕ",
      tapToSpeak: "ਬੋਲਣ ਲਈ ਟੈਪ ਕਰੋ",
      listening: "ਸੁਣ ਰਿਹਾ ਹੈ...",
      processing: "ਪ੍ਰਕਿਰਿਆ...",
      speakNow: "ਹੁਣ ਬੋਲੋ",
      stopListening: "ਸੁਣਨਾ ਬੰਦ ਕਰੋ",
      noMicrophone: "ਮਾਈਕ੍ਰੋਫੋਨ ਉਪਲਬਧ ਨਹੀਂ",
      permissionDenied: "ਮਾਈਕ੍ਰੋਫੋਨ ਦੀ ਇਜਾਜ਼ਤ ਨਾਮਂਜ਼ੂਰ",
      askAnything: "ਖੇਤੀਬਾੜੀ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ!",
      examples: {
        title: "ਪੁੱਛਣ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰੋ:",
        questions: [
          "ਟਮਾਟਰ ਕਿਵੇਂ ਉਗਾਉਣੇ?",
          "ਕਣਕ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਖਾਦ?",
          "ਅੱਜ ਦਾ ਮੌਸਮ ਪੂਰਵ ਅਨੁਮਾਨ?",
          "ਚਾਵਲ ਦੀ ਮਾਰਕੀਟ ਕੀਮਤ?",
        ],
      },
    },
    marketplace: {
      title: "ONDC ਬਾਜ਼ਾਰ",
      searchProducts: "ਉਤਪਾਦ ਖੋਜੋ...",
      categories: "ਸ਼੍ਰੇਣੀਆਂ",
      featured: "ਖਾਸ ਉਤਪਾਦ",
      nearbyStores: "ਨੇੜਲੇ ਸਟੋਰ",
      addToCart: "ਕਾਰਟ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ",
      buyNow: "ਹੁਣੇ ਖਰੀਦੋ",
      price: "ਕੀਮਤ",
      quantity: "ਮਾਤਰਾ",
      inStock: "ਸਟਾਕ ਵਿੱਚ",
      outOfStock: "ਸਟਾਕ ਵਿੱਚ ਨਹੀਂ",
      all: "ਸਭ",
      vegetables: "ਸਬਜ਼ੀਆਂ",
      fruits: "ਫਲ",
      grains: "ਅਨਾਜ",
      dairy: "ਡੇਰੀ",
      organic: "ਜੈਵਿਕ",
      freshness: "ਤਾਜ਼ਗੀ",
      harvestedToday: "ਅੱਜ ਵੱਢਿਆ ਗਿਆ",
      certification: "ਪ੍ਰਮਾਣੀਕਰਣ",
      farmer: "ਕਿਸਾਨ",
      location: "ਸਥਾਨ",
      rating: "ਰੇਟਿੰਗ",
      description: "ਵੇਰਵਾ",
      viewDetails: "ਵੇਰਵਾ ਵੇਖੋ",
      addedToCart: "ਕਾਰਟ ਵਿੱਚ ਸ਼ਾਮਲ ਕੀਤਾ ਗਿਆ",
      viewCart: "ਕਾਰਟ ਵੇਖੋ",
      checkout: "ਚੈੱਕਆਊਟ",
      totalItems: "ਕੁੱਲ ਆਈਟਮਾਂ",
      subtotal: "ਉਪ-ਜੋੜ",
      ondcBadge: {
        poweredBy: "ONDC ਦੁਆਰਾ ਸੰਚਾਲਿਤ",
        directFrom: "ਕਿਸਾਨਾਂ ਤੋਂ ਸਿੱਧੇ ਤੁਹਾਡੇ ਦਰਵਾਜ਼ੇ ਤੱਕ",
      },
      farmerCta: {
        question: "ਕੀ ਤੁਸੀਂ ਕਿਸਾਨ ਹੋ?",
        description: "ਸਾਡੇ ਬਾਜ਼ਾਰ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ ਅਤੇ ਗਾਹਕਾਂ ਨੂੰ ਸਿੱਧੇ ਵੇਚੋ",
        joinButton: "ਹੁਣੇ ਸ਼ਾਮਲ ਹੋਵੋ",
      },
      alerts: {
        addedToCart: "ਕਾਰਟ ਵਿੱਚ ਸ਼ਾਮਲ ਕੀਤਾ ਗਿਆ",
        productAdded: "ਉਤਪਾਦ ਸਫਲਤਾਪੂਰਵਕ ਤੁਹਾਡੇ ਕਾਰਟ ਵਿੱਚ ਸ਼ਾਮਲ ਕੀਤਾ ਗਿਆ!",
        ondcOrder: "ONDC ਆਰਡਰ",
        proceedToBuy: "ਖਰੀਦਣ ਲਈ ਅੱਗੇ ਵਧੋ",
        from: "ਤੋਂ",
        price: "ਕੀਮਤ",
        cancel: "ਰੱਦ ਕਰੋ",
        proceed: "ਅੱਗੇ ਵਧੋ",
        orderPlaced: "ਆਰਡਰ ਦਿੱਤਾ ਗਿਆ",
        orderSuccess:
          "ਤੁਹਾਡਾ ਆਰਡਰ ONDC ਨੈੱਟਵਰਕ ਰਾਹੀਂ ਦਿੱਤਾ ਗਿਆ ਹੈ। ਤੁਹਾਨੂੰ ਜਲਦੀ ਅਪਡੇਟ ਮਿਲੇਗਾ।",
        contactFarmer: "ਕਿਸਾਨ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
        connectWith: "ਨਾਲ ਜੁੜੋ",
        call: "ਕਾਲ ਕਰੋ",
        calling: "ਕਾਲ ਕਰ ਰਹੇ ਹਾਂ",
        message: "ਸੰਦੇਸ਼",
        openingChat: "ਨਾਲ ਚੈਟ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ",
      },
      products: {
        freshTomatoes: {
          name: "ਤਾਜ਼ੇ ਟਮਾਟਰ",
          description:
            "ਅੱਜ ਸਵੇਰੇ ਤੋੜੇ ਗਏ ਤਾਜ਼ੇ, ਜੈਵਿਕ ਰੂਪ ਵਿੱਚ ਉਗਾਏ ਗਏ ਟਮਾਟਰ। ਵਿਟਾਮਿਨਾਂ ਨਾਲ ਭਰਪੂਰ ਅਤੇ ਖਾਣਾ ਪਕਾਉਣ ਲਈ ਬਿਲਕੁਲ ਸਹੀ।",
        },
        basmatiRice: {
          name: "ਬਾਸਮਤੀ ਚਾਵਲ",
          description:
            "ਪ੍ਰਮਾਣਿਕ ਸੁਗੰਧ ਅਤੇ ਲੰਬੇ ਦਾਣਿਆਂ ਵਾਲਾ ਪ੍ਰੀਮੀਅਮ ਗੁਣਵੱਤਾ ਦਾ ਬਾਸਮਤੀ ਚਾਵਲ। ਪਰੰਪਰਾਗਤ ਤਰੀਕਿਆਂ ਨਾਲ ਉਗਾਇਆ ਗਿਆ।",
        },
        freshMangoes: {
          name: "ਤਾਜ਼ੇ ਅੰਬ",
          description:
            "ਮਿੱਠੇ ਅਤੇ ਰਸੀਲੇ ਅਲਫਾਂਸੋ ਅੰਬ, ਫਲਾਂ ਦੇ ਰਾਜਾ। ਪੂਰੀ ਤਰ੍ਹਾਂ ਪੱਕੇ ਹੋਏ ਅਤੇ ਖਾਣ ਲਈ ਤਿਆਰ।",
        },
        farmFreshMilk: {
          name: "ਫਾਰਮ ਫਰੈਸ਼ ਦੁੱਧ",
          description:
            "ਘਾਹ ਖਾਣ ਵਾਲੀਆਂ ਗਾਵਾਂ ਦਾ ਸ਼ੁੱਧ ਦੁੱਧ। ਪੋਸ਼ਕ ਤੱਤਾਂ ਨਾਲ ਭਰਪੂਰ ਅਤੇ ਰੋਜ਼ਾਨਾ ਤਾਜ਼ਾ ਪਹੁੰਚਾਇਆ ਜਾਂਦਾ ਹੈ।",
        },
        organicSpinach: {
          name: "ਜੈਵਿਕ ਪਾਲਕ",
          description:
            "ਤਾਜ਼ੇ ਜੈਵਿਕ ਪਾਲਕ ਦੇ ਪੱਤੇ, ਕੀਟਨਾਸ਼ਕ ਰਹਿਤ ਅਤੇ ਆਇਰਨ ਨਾਲ ਭਰਪੂਰ। ਸਿਹਤਮੰਦ ਭੋਜਨ ਲਈ ਬਿਲਕੁਲ ਸਹੀ।",
        },
        wheatFlour: {
          name: "ਕਣਕ ਦਾ ਆਟਾ",
          description:
            "ਜੈਵਿਕ ਰੂਪ ਵਿੱਚ ਉਗਾਈ ਗਈ ਕਣਕ ਤੋਂ ਪੱਥਰ ਉੱਤੇ ਪਿਸਿਆ ਸਾਬਤ ਕਣਕ ਦਾ ਆਟਾ। ਕੋਈ ਸੰਰਕਸ਼ਕ ਨਹੀਂ ਮਿਲਾਇਆ ਗਿਆ।",
        },
      },
      farmers: {
        rajeshKumar: "ਰਾਜੇਸ਼ ਕੁਮਾਰ",
        priyaSingh: "ਪ੍ਰਿਯਾ ਸਿੰਘ",
        sureshPatel: "ਸੁਰੇਸ਼ ਪਟੇਲ",
        mohitSharma: "ਮੋਹਿਤ ਸ਼ਰਮਾ",
        anitaDevi: "ਅਨੀਤਾ ਦੇਵੀ",
        vikramSingh: "ਵਿਕਰਮ ਸਿੰਘ",
      },
      locations: {
        haryana: "ਹਰਿਆਣਾ, ਭਾਰਤ",
        punjab: "ਪੰਜਾਬ, ਭਾਰਤ",
        gujarat: "ਗੁਜਰਾਤ, ਭਾਰਤ",
        rajasthan: "ਰਾਜਸਥਾਨ, ਭਾਰਤ",
        uttarPradesh: "ਉੱਤਰ ਪ੍ਰਦੇਸ਼, ਭਾਰਤ",
        madhyaPradesh: "ਮੱਧ ਪ੍ਰਦੇਸ਼, ਭਾਰਤ",
      },
      certifications: {
        organic: "ਜੈਵਿਕ",
        fssai: "FSSAI",
        premiumGrade: "ਪ੍ਰੀਮੀਅਮ ਗ੍ਰੇਡ",
        exportQuality: "ਨਿਰਯਾਤ ਗੁਣਵੱਤਾ",
        premium: "ਪ੍ਰੀਮੀਅਮ",
        pasteurized: "ਪਾਸਚਰਾਈਜ਼ਡ",
        pesticideFree: "ਕੀਟਨਾਸ਼ਕ ਮੁਕਤ",
        stoneGround: "ਪੱਥਰ ਉੱਤੇ ਪਿਸਿਆ",
      },
      freshnessTypes: {
        harvestedToday: "ਅੱਜ ਵੱਢਿਆ ਗਿਆ",
        freshStock: "ਤਾਜ਼ਾ ਸਟਾਕ",
        treeFresh: "ਰੁੱਖ ਤੋਂ ਤਾਜ਼ਾ",
        dailyFresh: "ਰੋਜ਼ਾਨਾ ਤਾਜ਼ਾ",
        morningFresh: "ਸਵੇਰ ਦਾ ਤਾਜ਼ਾ",
        freshGround: "ਤਾਜ਼ਾ ਪਿਸਿਆ ਹੋਇਆ",
      },
      units: {
        kg: "ਕਿਲੋ",
        liter: "ਲੀਟਰ",
        bunch: "ਗੁੱਛਾ",
      },
    },
    settings: {
      title: "ਸੈਟਿੰਗਜ਼",
      profile: "ਪ੍ਰੋਫਾਈਲ",
      language: "ਭਾਸ਼ਾ",
      notifications: "ਸੂਚਨਾਵਾਂ",
      privacy: "ਗੁਪਤਤਾ",
      about: "ਬਾਰੇ",
      logout: "ਲਾਗ ਆਊਟ",
      accessibility: "ਪਹੁੰਚਯੋਗਤਾ",
      voiceSupport: "ਆਵਾਜ਼ ਸਹਾਇਤਾ",
      feedback: "ਪ੍ਰਤੀਕਿਰਿਆ",
      reportIssue: "ਸਮੱਸਿਆ ਦੀ ਰਿਪੋਰਟ ਕਰੋ",
      provideFeedback: "ਪ੍ਰਤੀਕਿਰਿਆ ਪ੍ਰਦਾਨ ਕਰੋ",
      currentLocation: "ਮੌਜੂਦਾ ਸਥਾਨ: ਫਾਰਮਵਿਲ",
      languageSelection: {
        title: "ਭਾਸ਼ਾ ਚੁਣੋ",
        subtitle: "ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ",
        current: "ਵਰਤਮਾਨ: ",
      },
      notification: {
        title: "ਸੂਚਨਾ ਸੈਟਿੰਗਜ਼",
        weatherAlerts: "ਮੌਸਮ ਚੇਤਾਵਨੀ",
        marketUpdates: "ਮਾਰਕੀਟ ਅਪਡੇਟ",
        cropReminders: "ਫਸਲ ਰਿਮਾਈਂਡਰ",
        systemUpdates: "ਸਿਸਟਮ ਅਪਡੇਟ",
      },
    },
    weather: {
      title: "ਮੌਸਮ ਪੂਰਵ ਅਨੁਮਾਨ",
      temperature: "ਤਾਪਮਾਨ",
      humidity: "ਨਮੀ",
      windSpeed: "ਹਵਾ ਦੀ ਗਤੀ",
      wind: "ਹਵਾ",
      visibility: "ਦਿੱਖ",
      pressure: "ਦਬਾਅ",
      precipitation: "ਬਰਸਾਤ",
      uvIndex: "UV ਸੂਚਕਾਂਕ",
      sunrise: "ਸੂਰਜ ਚੜ੍ਹਨਾ",
      sunset: "ਸੂਰਜ ਡੁੱਬਣਾ",
      today: "ਅੱਜ",
      tomorrow: "ਕੱਲ੍ਹ",
      weekly: "ਹਫਤਾਵਾਰੀ ਪੂਰਵ ਅਨੁਮਾਨ",
      feelsLike: "ਮਹਿਸੂਸ ਹੋ ਰਿਹਾ ਹੈ",
      weatherAlert: "ਮੌਸਮ ਚੇਤਾਵਨੀ",
      weatherAlertText: "ਕੱਲ੍ਹ ਭਾਰੀ ਬਰਸਾਤ ਦੀ ਉਮੀਦ ਹੈ। ਜਲ ਜਮਾਅ ਲਈ ਤਿਆਰ ਰਹੋ।",
      sevenDayForecast: "7-ਦਿਨ ਦਾ ਪੂਰਵ ਅਨੁਮਾਨ",
      partlyCloudy: "ਅੰਸ਼ਿਕ ਬੱਦਲ",
      heavyRain: "ਭਾਰੀ ਬਰਸਾਤ",
      cloudy: "ਬੱਦਲ",
      sunny: "ਧੁੱਪ",
      lightRain: "ਹਲਕੀ ਬਰਸਾਤ",
    },
    soilHealth: {
      title: "ਮਿੱਟੀ ਸਿਹਤ ਵਿਸ਼ਲੇਸ਼ਣ",
      testSoil: "ਮਿੱਟੀ ਦੀ ਜਾਂਚ",
      takePhoto: "ਫੋਟੋ ਲਓ",
      selectFromGallery: "ਗੈਲਰੀ ਤੋਂ ਚੁਣੋ",
      analyzing: "ਮਿੱਟੀ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ...",
      results: "ਵਿਸ਼ਲੇਸ਼ਣ ਨਤੀਜੇ",
      ph: "pH ਲੈਵਲ",
      nitrogen: "ਨਾਈਟ੍ਰੋਜਨ",
      phosphorus: "ਫਾਸਫੋਰਸ",
      potassium: "ਪੋਟਾਸ਼ੀਅਮ",
      recommendations: "ਸਿਫਾਰਸ਼ਾਂ",
    },
    pestDetection: {
      title: "ਕੀਟ ਪਛਾਣ",
      detectPest: "ਕੀਟ ਦੀ ਪਛਾਣ",
      takePhoto: "ਫੋਟੋ ਲਓ",
      selectFromGallery: "ਗੈਲਰੀ ਤੋਂ ਚੁਣੋ",
      scanning: "ਕੀਟਾਂ ਲਈ ਸਕੈਨ ਕਰ ਰਹੇ ਹਾਂ...",
      noPestFound: "ਕੋਈ ਕੀਟ ਨਹੀਂ ਮਿਲਿਆ",
      pestFound: "ਕੀਟ ਮਿਲਿਆ",
      confidence: "ਭਰੋਸਾ",
      treatment: "ਇਲਾਜ",
      prevention: "ਬਚਾਅ",
    },
    marketPrices: {
      title: "ਮਾਰਕੀਟ ਕੀਮਤਾਂ",
      searchCrop: "ਫਸਲ ਖੋਜੋ...",
      todaysPrices: "ਅੱਜ ਦੀਆਂ ਕੀਮਤਾਂ",
      pricePerQuintal: "ਪ੍ਰਤੀ ਕੁਇੰਟਲ",
      location: "ਸਥਾਨ",
      lastUpdated: "ਆਖਰੀ ਅਪਡੇਟ",
      priceChange: "ਕੀਮਤ ਬਦਲਾਅ",
      increased: "ਵਧਿਆ",
      decreased: "ਘਟਿਆ",
      stable: "ਸਥਿਰ",
    },
  },
};

class LocalizationService {
  private currentLanguage: string = "en";
  private translations: Translations = translations;
  private languageChangeListeners: Array<(language: string) => void> = [];

  constructor() {
    this.loadSavedLanguage();
  }

  // Load saved language from storage
  private async loadSavedLanguage(): Promise<void> {
    try {
      const savedLanguage = await AsyncStorage.getItem("app_language");
      if (savedLanguage && this.isLanguageSupported(savedLanguage)) {
        this.currentLanguage = savedLanguage;
      }
    } catch (error) {
      console.warn("Failed to load saved language:", error);
    }
  }

  // Check if language is supported
  private isLanguageSupported(language: string): boolean {
    return Object.keys(SUPPORTED_LANGUAGES).includes(language);
  }

  // Get current language
  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  // Get current language details
  getCurrentLanguageDetails() {
    return SUPPORTED_LANGUAGES[
      this.currentLanguage as keyof typeof SUPPORTED_LANGUAGES
    ];
  }

  // Set language and save to storage
  async setLanguage(language: string): Promise<void> {
    if (!this.isLanguageSupported(language)) {
      throw new Error(`Language '${language}' is not supported`);
    }

    this.currentLanguage = language;

    try {
      await AsyncStorage.setItem("app_language", language);
      this.notifyLanguageChange(language);
    } catch (error) {
      console.error("Failed to save language preference:", error);
    }
  }

  // Get translated string
  t(key: string, params?: Record<string, string>): string {
    const keys = key.split(".");
    let translation: any = this.translations[this.currentLanguage];

    // Navigate through nested keys
    for (const k of keys) {
      if (translation && typeof translation === "object" && k in translation) {
        translation = translation[k];
      } else {
        // Fallback to English if key not found
        translation = this.translations["en"];
        for (const fallbackKey of keys) {
          if (
            translation &&
            typeof translation === "object" &&
            fallbackKey in translation
          ) {
            translation = translation[fallbackKey];
          } else {
            console.warn(
              `Translation key '${key}' not found for language '${this.currentLanguage}'`
            );
            return key; // Return the key itself as fallback
          }
        }
        break;
      }
    }

    if (typeof translation !== "string") {
      console.warn(`Translation for '${key}' is not a string`);
      return key;
    }

    // Replace parameters if provided
    if (params) {
      let result = translation;
      Object.entries(params).forEach(([param, value]) => {
        result = result.replace(new RegExp(`{{${param}}}`, "g"), value);
      });
      return result;
    }

    return translation;
  }

  // Get supported languages
  getSupportedLanguages() {
    return SUPPORTED_LANGUAGES;
  }

  // Add language change listener
  addLanguageChangeListener(listener: (language: string) => void): () => void {
    this.languageChangeListeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.languageChangeListeners.indexOf(listener);
      if (index > -1) {
        this.languageChangeListeners.splice(index, 1);
      }
    };
  }

  // Notify language change
  private notifyLanguageChange(language: string): void {
    this.languageChangeListeners.forEach((listener) => {
      try {
        listener(language);
      } catch (error) {
        console.error("Error in language change listener:", error);
      }
    });
  }

  // Check if current language is RTL
  isRTL(): boolean {
    const languageDetails = this.getCurrentLanguageDetails();
    return languageDetails?.rtl || false;
  }
}

// Export singleton instance
export const localizationService = new LocalizationService();
export default localizationService;
