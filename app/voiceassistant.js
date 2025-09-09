// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   TouchableOpacity,
//   Image,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// export default function VoiceAssistant() {
//   const [isRecording, setIsRecording] = useState(false);

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton}>
//           <Ionicons name="chevron-back" size={24} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Voice Assistant</Text>
//       </View>

//       {/* Chat Content */}
//       <View style={styles.chatArea}>
//         {/* Assistant Message */}
//         <View style={styles.messageContainer}>
//           <View style={styles.assistantMessage}>
//             <Text style={styles.messageText}>
//               To provide the best advice, could you please share your current location?
//             </Text>
//           </View>
//           <View style={styles.avatarContainer}>
//             <Image
//               source={{ uri: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop' }}
//               style={styles.avatar}
//             />
//           </View>
//         </View>

//         {/* Location Display */}
//         <Text style={styles.locationText}>Location: Lagos, Nigeria</Text>

//         {/* Audio Waveform */}
//         <View style={styles.waveformContainer}>
//           <View style={styles.waveform}>
//             {[...Array(12)].map((_, index) => (
//               <View
//                 key={index}
//                 style={[
//                   styles.waveBar,
//                   {
//                     height: Math.random() * 30 + 10,
//                     backgroundColor: index >= 4 && index <= 7 ? '#4ADE80' : '#22C55E',
//                   },
//                 ]}
//               />
//             ))}
//           </View>
//         </View>

//         {/* User Query */}
//         <Text style={styles.userQuery}>{ 
//           "What are the best practices for managing pests in my area?"}
//         </Text>
//       </View>

//       {/* Microphone Button */}
//       <View style={styles.microphoneArea}>
//         <TouchableOpacity
//           style={[styles.microphoneButton, isRecording && styles.microphoneButtonActive]}
//           onPress={() => setIsRecording(!isRecording)}
//         >
//           <Ionicons name="mic" size={32} color="#1F2937" />
//         </TouchableOpacity>
//         <Text style={styles.tapToSpeakText}>Tap to speak</Text>
//       </View>

//       {/* Bottom Navigation */}
//       <View style={styles.bottomNav}>
//         <TouchableOpacity style={styles.navItem}>
//           <Ionicons name="home-outline" size={24} color="#9CA3AF" />
//           <Text style={styles.navText}>Home</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.navItem}>
//           <Ionicons name="bar-chart-outline" size={24} color="#9CA3AF" />
//           <Text style={styles.navText}>Advisory</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
//           <Ionicons name="mic-outline" size={24} color="#4ADE80" />
//           <Text style={[styles.navText, styles.activeNavText]}>Assistant</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.navItem}>
//           <Ionicons name="settings-outline" size={24} color="#9CA3AF" />
//           <Text style={styles.navText}>Settings</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }


import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // ✅ added router

export default function VoiceAssistant() {
  const [isRecording, setIsRecording] = useState(false);
  const router = useRouter(); // ✅ initialize router

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Voice Assistant</Text>
      </View>

      {/* Chat Content */}
      <View style={styles.chatArea}>
        {/* Assistant Message */}
        <View style={styles.messageContainer}>
          <View style={styles.assistantMessage}>
            <Text style={styles.messageText}>
              To provide the best advice, could you please share your current location?
            </Text>
          </View>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop' }}
              style={styles.avatar}
            />
          </View>
        </View>

        {/* Location Display */}
        <Text style={styles.locationText}>Location: Lagos, Nigeria</Text>

        {/* Audio Waveform */}
        <View style={styles.waveformContainer}>
          <View style={styles.waveform}>
            {[...Array(12)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.waveBar,
                  {
                    height: Math.random() * 30 + 10,
                    backgroundColor: index >= 4 && index <= 7 ? '#4ADE80' : '#22C55E',
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* User Query */}
        <Text style={styles.userQuery}>
          {"What are the best practices for managing pests in my area?"}
        </Text>
      </View>

      {/* Microphone Button */}
      <View style={styles.microphoneArea}>
        <TouchableOpacity
          style={[styles.microphoneButton, isRecording && styles.microphoneButtonActive]}
          onPress={() => setIsRecording(!isRecording)}
        >
          <Ionicons name="mic" size={32} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.tapToSpeakText}>Tap to speak</Text>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => router.push("welcome")} // ✅ Home
        >
          <Ionicons name="home-outline" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => router.push("advisory")} // ✅ Advisory
        >
          <Ionicons name="bar-chart-outline" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>Advisory</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, styles.activeNavItem]} // ✅ Assistant active
          onPress={() => router.push("voiceassistant")}
        >
          <Ionicons name="mic-outline" size={24} color="#4ADE80" />
          <Text style={[styles.navText, styles.activeNavText]}>Assistant</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => router.push("preferences")} // ✅ Settings
        >
          <Ionicons name="settings-outline" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>Settings</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  assistantMessage: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
  },
  avatarContainer: {
    marginTop: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  locationText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
  },
  waveformContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 40,
  },
  waveBar: {
    width: 3,
    backgroundColor: '#22C55E',
    marginHorizontal: 2,
    borderRadius: 1.5,
  },
  userQuery: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 40,
  },
  microphoneArea: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  microphoneButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4ADE80',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  microphoneButtonActive: {
    backgroundColor: '#22C55E',
  },
  tapToSpeakText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  navItem: {
    alignItems: 'center',
  },
  activeNavItem: {},
  navText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  activeNavText: {
    color: '#4ADE80',
  },
});













