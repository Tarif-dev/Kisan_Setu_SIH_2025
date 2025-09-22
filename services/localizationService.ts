// Multilingual localization service for Kisan Setu
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Translation {
  [key: string]: string | Translation | string[];
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
      searchPlaceholder: "Search for farming advice...",
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
    },
    settings: {
      title: "Settings",
      profile: "Profile",
      language: "Language",
      notifications: "Notifications",
      privacy: "Privacy",
      about: "About",
      logout: "Logout",
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
      precipitation: "Precipitation",
      uvIndex: "UV Index",
      sunrise: "Sunrise",
      sunset: "Sunset",
      today: "Today",
      tomorrow: "Tomorrow",
      weekly: "Weekly Forecast",
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
      searchPlaceholder: "कृषि सलाह खोजें...",
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
    },
    settings: {
      title: "सेटिंग्स",
      profile: "प्रोफाइल",
      language: "भाषा",
      notifications: "सूचनाएं",
      privacy: "गोपनीयता",
      about: "के बारे में",
      logout: "लॉग आउट",
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
      precipitation: "वर्षा",
      uvIndex: "UV सूचकांक",
      sunrise: "सूर्योदय",
      sunset: "सूर्यास्त",
      today: "आज",
      tomorrow: "कल",
      weekly: "साप्ताहिक पूर्वानुमान",
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
      searchPlaceholder: "ਖੇਤੀਬਾੜੀ ਸਲਾਹ ਖੋਜੋ...",
      categories: {
        irrigation: "ਸਿੰਚਾਈ",
        fertilizers: "ਖਾਦ",
        pestControl: "ਕੀਟ ਨਿਯੰਤਰਣ",
        soilHealth: "ਮਿੱਟੀ ਦੀ ਸਿਹਤ",
        cropManagement: "ਫਸਲ ਪ੍ਰਬੰਧਨ",
        harvesting: "ਵਾਢੀ",
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
    },
    settings: {
      title: "ਸੈਟਿੰਗਜ਼",
      profile: "ਪ੍ਰੋਫਾਈਲ",
      language: "ਭਾਸ਼ਾ",
      notifications: "ਸੂਚਨਾਵਾਂ",
      privacy: "ਗੁਪਤਤਾ",
      about: "ਬਾਰੇ",
      logout: "ਲਾਗ ਆਊਟ",
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
      precipitation: "ਬਰਸਾਤ",
      uvIndex: "UV ਸੂਚਕਾਂਕ",
      sunrise: "ਸੂਰਜ ਚੜ੍ਹਨਾ",
      sunset: "ਸੂਰਜ ਡੁੱਬਣਾ",
      today: "ਅੱਜ",
      tomorrow: "ਕੱਲ੍ਹ",
      weekly: "ਹਫਤਾਵਾਰੀ ਪੂਰਵ ਅਨੁਮਾਨ",
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
