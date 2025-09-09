// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   TouchableOpacity,
//   TextInput,
//   ScrollView,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// export default function SoilTest() {
//   const [phLevel, setPhLevel] = useState('');
//   const [organicMatter, setOrganicMatter] = useState('');
//   const [nutrientLevels, setNutrientLevels] = useState('');

//   const fertilizerRecommendations = [
//     {
//       name: 'Urea',
//       description: 'Nitrogen-rich fertilizer',
//       icon: 'leaf-outline',
//     },
//     {
//       name: 'Superphosphate',
//       description: 'Phosphorus-rich fertilizer',
//       icon: 'leaf-outline',
//     },
//     {
//       name: 'Potassium Chloride',
//       description: 'Potassium-rich fertilizer',
//       icon: 'leaf-outline',
//     },
//   ];

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView style={styles.scrollView}>
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity style={styles.backButton}>
//             <Ionicons name="chevron-back" size={24} color="white" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Soil Health</Text>
//           <TouchableOpacity style={styles.moreButton}>
//             <Ionicons name="ellipsis-horizontal" size={24} color="white" />
//           </TouchableOpacity>
//         </View>

//         {/* Soil Data Input */}
//         <View style={styles.inputSection}>
//           <Text style={styles.sectionTitle}>Soil Data Input</Text>
          
//           <TextInput
//             style={styles.input}
//             placeholder="Soil pH Level"
//             placeholderTextColor="#9CA3AF"
//             value={phLevel}
//             onChangeText={setPhLevel}
//           />
          
//           <TextInput
//             style={styles.input}
//             placeholder="Organic Matter (%)"
//             placeholderTextColor="#9CA3AF"
//             value={organicMatter}
//             onChangeText={setOrganicMatter}
//           />
          
//           <TextInput
//             style={styles.input}
//             placeholder="Nutrient Levels (N, P, K)"
//             placeholderTextColor="#9CA3AF"
//             value={nutrientLevels}
//             onChangeText={setNutrientLevels}
//           />

//           <TouchableOpacity style={styles.analyzeButton}>
//             <Ionicons name="flask-outline" size={20} color="#1F2937" />
//             <Text style={styles.analyzeButtonText}>Analyze Soil</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Fertilizer Guidance */}
//         <View style={styles.guidanceSection}>
//           <Text style={styles.sectionTitle}>Fertilizer Guidance</Text>
//           <Text style={styles.guidanceDescription}>
//             Based on your soil analysis, we recommend the following:
//           </Text>

//           {fertilizerRecommendations.map((fertilizer, index) => (
//             <View key={index} style={styles.fertilizerCard}>
//               <View style={styles.fertilizerIcon}>
//                 <Ionicons name={fertilizer.icon} size={24} color="#4ADE80" />
//               </View>
//               <View style={styles.fertilizerInfo}>
//                 <Text style={styles.fertilizerName}>{fertilizer.name}</Text>
//                 <Text style={styles.fertilizerDescription}>{fertilizer.description}</Text>
//               </View>
//             </View>
//           ))}
//         </View>

//         {/* Application Method */}
//         <View style={styles.applicationSection}>
//           <Text style={styles.sectionTitle}>Application Method</Text>
//           <Text style={styles.applicationText}>
//             Apply fertilizers evenly across the field before planting. Ensure proper soil coverage for optimal nutrient uptake.
//           </Text>
//         </View>
//       </ScrollView>

//       {/* Bottom Navigation */}
//       <View style={styles.bottomNav}>
//         <TouchableOpacity style={styles.navItem}>
//           <Ionicons name="home-outline" size={24} color="#9CA3AF" />
//           <Text style={styles.navText}>Home</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
//           <Ionicons name="bar-chart-outline" size={24} color="#4ADE80" />
//           <Text style={[styles.navText, styles.activeNavText]}>Advisory</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.navItem}>
//           <Ionicons name="storefront-outline" size={24} color="#9CA3AF" />
//           <Text style={styles.navText}>Market</Text>
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
  TextInput,
  ScrollView,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // ✅ added router

export default function SoilTest() {
  const [phLevel, setPhLevel] = useState('');
  const [organicMatter, setOrganicMatter] = useState('');
  const [nutrientLevels, setNutrientLevels] = useState('');

  const router = useRouter(); // ✅ initialize router

  const fertilizerRecommendations = [
    {
      name: 'Urea',
      description: 'Nitrogen-rich fertilizer',
      icon: 'leaf-outline',
    },
    {
      name: 'Superphosphate',
      description: 'Phosphorus-rich fertilizer',
      icon: 'leaf-outline',
    },
    {
      name: 'Potassium Chloride',
      description: 'Potassium-rich fertilizer',
      icon: 'leaf-outline',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Soil Health</Text>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Soil Data Input */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Soil Data Input</Text>
          <TextInput
            style={styles.input}
            placeholder="Soil pH Level"
            placeholderTextColor="#9CA3AF"
            value={phLevel}
            onChangeText={setPhLevel}
          />
          <TextInput
            style={styles.input}
            placeholder="Organic Matter (%)"
            placeholderTextColor="#9CA3AF"
            value={organicMatter}
            onChangeText={setOrganicMatter}
          />
          <TextInput
            style={styles.input}
            placeholder="Nutrient Levels (N, P, K)"
            placeholderTextColor="#9CA3AF"
            value={nutrientLevels}
            onChangeText={setNutrientLevels}
          />
          <TouchableOpacity style={styles.analyzeButton}>
            <Ionicons name="flask-outline" size={20} color="#1F2937" />
            <Text style={styles.analyzeButtonText}>Analyze Soil</Text>
          </TouchableOpacity>
        </View>

        {/* Fertilizer Guidance */}
        <View style={styles.guidanceSection}>
          <Text style={styles.sectionTitle}>Fertilizer Guidance</Text>
          <Text style={styles.guidanceDescription}>
            Based on your soil analysis, we recommend the following:
          </Text>

          {fertilizerRecommendations.map((fertilizer, index) => (
            <View key={index} style={styles.fertilizerCard}>
              <View style={styles.fertilizerIcon}>
                <Ionicons name={fertilizer.icon} size={24} color="#4ADE80" />
              </View>
              <View style={styles.fertilizerInfo}>
                <Text style={styles.fertilizerName}>{fertilizer.name}</Text>
                <Text style={styles.fertilizerDescription}>{fertilizer.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Application Method */}
        <View style={styles.applicationSection}>
          <Text style={styles.sectionTitle}>Application Method</Text>
          <Text style={styles.applicationText}>
            Apply fertilizers evenly across the field before planting. Ensure proper soil coverage for optimal nutrient uptake.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => router.push("welcome")} // ✅ navigate to Home
        >
          <Ionicons name="home-outline" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, styles.activeNavItem]} // Advisory active
          onPress={() => router.push("advisory")}
        >
          <Ionicons name="bar-chart-outline" size={24} color="#4ADE80" />
          <Text style={[styles.navText, styles.activeNavText]}>Advisory</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => router.push("marketplace")} // ✅ navigate to Market
        >
          <Ionicons name="storefront-outline" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>Market</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => router.push("preferences")} // ✅ navigate to Settings
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {},
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  moreButton: {},
  inputSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 16,
    color: 'white',
    fontSize: 16,
    marginBottom: 12,
  },
  analyzeButton: {
    backgroundColor: '#4ADE80',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  analyzeButtonText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  guidanceSection: {
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  guidanceDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 20,
  },
  fertilizerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  fertilizerIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#1F2937',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  fertilizerInfo: {
    flex: 1,
  },
  fertilizerName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  fertilizerDescription: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  applicationSection: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 20,
  },
  applicationText: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 20,
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








