import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';   

export default function Welcome() {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const languages = ['English', 'Hindi', 'Spanish', 'French', 'German'];

  const router = useRouter();   

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={32} color="#1F2937" />
          </View>
        </View>

        {/* Welcome Text */}
        <View style={styles.textSection}>
          <Text style={styles.welcomeTitle}>Welcome to</Text>
          <Text style={styles.appName}>AgriAssist</Text>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Select your preferred language to get started.
        </Text>

        {/* Language Selection */}
        <View style={styles.languageSection}>
          <TouchableOpacity
            style={styles.languageSelector}
            onPress={() => setShowLanguageDropdown(!showLanguageDropdown)}
          >
            <Text style={styles.languageText}>{selectedLanguage}</Text>
            <Ionicons name="chevron-down" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          {showLanguageDropdown && (
            <View style={styles.dropdown}>
              {languages.map((language, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dropdownItem,
                    language === selectedLanguage && styles.selectedDropdownItem
                  ]}
                  onPress={() => {
                    setSelectedLanguage(language);
                    setShowLanguageDropdown(false);
                  }}
                >
                  <Text style={[
                    styles.dropdownText,
                    language === selectedLanguage && styles.selectedDropdownText
                  ]}>
                    {language}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Continue Button */}
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => router.push('/voiceassistant')}   
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 48,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4ADE80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
  },
  appName: {
    color: 'white',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 4,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
    paddingHorizontal: 16,
  },
  languageSection: {
    width: '100%',
    marginBottom: 48,
    position: 'relative',
  },
  languageSelector: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  languageText: {
    color: 'white',
    fontSize: 16,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#374151',
    borderRadius: 12,
    marginTop: 8,
    zIndex: 1000,
    elevation: 5,
  },
  dropdownItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#4B5563',
  },
  selectedDropdownItem: {
    backgroundColor: '#4ADE80',
  },
  dropdownText: {
    color: 'white',
    fontSize: 16,
  },
  selectedDropdownText: {
    color: '#1F2937',
  },
  continueButton: {
    backgroundColor: '#4ADE80',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '600',
  },
});




// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   TouchableOpacity,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// export default function Welcome() {
//   const [selectedLanguage, setSelectedLanguage] = useState('English');
//   const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

//   const languages = ['English', 'Hindi', 'Spanish', 'French', 'German'];

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         {/* Success Icon */}
//         <View style={styles.iconContainer}>
//           <View style={styles.successIcon}>
//             <Ionicons name="checkmark" size={32} color="#1F2937" />
//           </View>
//         </View>

//         {/* Welcome Text */}
//         <View style={styles.textSection}>
//           <Text style={styles.welcomeTitle}>Welcome to</Text>
//           <Text style={styles.appName}>AgriAssist</Text>
//         </View>

//         {/* Subtitle */}
//         <Text style={styles.subtitle}>
//           Select your preferred language to get started.
//         </Text>

//         {/* Language Selection */}
//         <View style={styles.languageSection}>
//           <TouchableOpacity
//             style={styles.languageSelector}
//             onPress={() => setShowLanguageDropdown(!showLanguageDropdown)}
//           >
//             <Text style={styles.languageText}>{selectedLanguage}</Text>
//             <Ionicons name="chevron-down" size={24} color="#9CA3AF" />
//           </TouchableOpacity>

//           {showLanguageDropdown && (
//             <View style={styles.dropdown}>
//               {languages.map((language, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={[
//                     styles.dropdownItem,
//                     language === selectedLanguage && styles.selectedDropdownItem
//                   ]}
//                   onPress={() => {
//                     setSelectedLanguage(language);
//                     setShowLanguageDropdown(false);
//                   }}
//                 >
//                   <Text style={[
//                     styles.dropdownText,
//                     language === selectedLanguage && styles.selectedDropdownText
//                   ]}>
//                     {language}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}
//         </View>

//         {/* Continue Button */}
//         <TouchableOpacity style={styles.continueButton}>
//           <Text style={styles.continueButtonText}>Continue</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#1F2937',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 32,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   iconContainer: {
//     marginBottom: 48,
//   },
//   successIcon: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#4ADE80',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   textSection: {
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   welcomeTitle: {
//     color: 'white',
//     fontSize: 32,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   appName: {
//     color: 'white',
//     fontSize: 32,
//     fontWeight: '700',
//     textAlign: 'center',
//     marginTop: 4,
//   },
//   subtitle: {
//     color: '#9CA3AF',
//     fontSize: 16,
//     textAlign: 'center',
//     lineHeight: 24,
//     marginBottom: 48,
//     paddingHorizontal: 16,
//   },
//   languageSection: {
//     width: '100%',
//     marginBottom: 48,
//     position: 'relative',
//   },
//   languageSelector: {
//     backgroundColor: 'transparent',
//     borderWidth: 1,
//     borderColor: '#374151',
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//   },
//   languageText: {
//     color: 'white',
//     fontSize: 16,
//   },
//   dropdown: {
//     position: 'absolute',
//     top: '100%',
//     left: 0,
//     right: 0,
//     backgroundColor: '#374151',
//     borderRadius: 12,
//     marginTop: 8,
//     zIndex: 1000,
//     elevation: 5,
//   },
//   dropdownItem: {
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#4B5563',
//   },
//   selectedDropdownItem: {
//     backgroundColor: '#4ADE80',
//   },
//   dropdownText: {
//     color: 'white',
//     fontSize: 16,
//   },
//   selectedDropdownText: {
//     color: '#1F2937',
//   },
//   continueButton: {
//     backgroundColor: '#4ADE80',
//     width: '100%',
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   continueButtonText: {
//     color: '#1F2937',
//     fontSize: 18,
//     fontWeight: '600',
//   },
// });
