import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';  // <-- Added

export default function Marketplace() {
  const router = useRouter();  // <-- Added
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('Rice');

  const trendingCrops = ['Rice', 'Wheat', 'Corn', 'Soybeans'];
  
  const cropPrices = [
    {
      name: 'Rice',
      price: '$15.50',
      change: '+1.2%',
      changePositive: true,
      image: 'https://images.pexels.com/photos/33265/rice-yellow-seeds-cereals.jpg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
    },
    {
      name: 'Wheat',
      price: '$7.25',
      change: '-0.8%',
      changePositive: false,
      image: 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
    },
    {
      name: 'Corn',
      price: '$4.75',
      change: '+2.1%',
      changePositive: true,
      image: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
    },
    {
      name: 'Soybeans',
      price: '$12.00',
      change: '0.0%',
      changePositive: null,
      image: 'https://images.pexels.com/photos/2954024/pexels-photo-2954024.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
    },
    {
      name: 'Cotton',
      price: '$0.75',
      change: '-0.5%',
      changePositive: false,
      image: 'https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('welcome')}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Market Prices</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for crops"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Trending Crops */}
        <View style={styles.trendingSection}>
          <Text style={styles.sectionTitle}>Trending Crops</Text>
          <View style={styles.trendingCrops}>
            {trendingCrops.map((crop, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.trendingCrop,
                  selectedCrop === crop && styles.selectedCrop
                ]}
                onPress={() => setSelectedCrop(crop)}
              >
                <Text style={[
                  styles.trendingCropText,
                  selectedCrop === crop && styles.selectedCropText
                ]}>
                  {crop}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Crop Prices List */}
        <View style={styles.pricesSection}>
          {cropPrices.map((crop, index) => (
            <TouchableOpacity key={index} style={styles.cropCard}>
              <Image source={{ uri: crop.image }} style={styles.cropImage} />
              <View style={styles.cropInfo}>
                <Text style={styles.cropName}>{crop.name}</Text>
                <Text style={styles.cropUnit}>per bushel</Text>
              </View>
              <View style={styles.priceInfo}>
                <Text style={styles.cropPrice}>{crop.price}</Text>
                <Text style={[
                  styles.cropChange,
                  crop.changePositive === true && styles.positiveChange,
                  crop.changePositive === false && styles.negativeChange,
                  crop.changePositive === null && styles.neutralChange,
                ]}>
                  {crop.change}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('welcome')}>
          <Ionicons name="home-outline" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('advisory')}>
          <Ionicons name="bar-chart-outline" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>Advisory</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <Ionicons name="storefront" size={24} color="#4ADE80" />
          <Text style={[styles.navText, styles.activeNavText]}>Market</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('preferences')}>
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
  content: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchBar: {
    backgroundColor: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    marginLeft: 12,
  },
  trendingSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  trendingCrops: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  trendingCrop: {
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCrop: {
    backgroundColor: '#4ADE80',
  },
  trendingCropText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCropText: {
    color: '#1F2937',
  },
  pricesSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
  },
  cropCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  cropImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 16,
  },
  cropInfo: {
    flex: 1,
  },
  cropName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cropUnit: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  cropPrice: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cropChange: {
    fontSize: 14,
  },
  positiveChange: {
    color: '#22C55E',
  },
  negativeChange: {
    color: '#EF4444',
  },
  neutralChange: {
    color: '#9CA3AF',
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












// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   TouchableOpacity,
//   TextInput,
//   ScrollView,
//   Image,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// export default function Marketplace() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCrop, setSelectedCrop] = useState('Rice');

//   const trendingCrops = ['Rice', 'Wheat', 'Corn', 'Soybeans'];
  
//   const cropPrices = [
//     {
//       name: 'Rice',
//       price: '$15.50',
//       change: '+1.2%',
//       changePositive: true,
//       image: 'https://images.pexels.com/photos/33265/rice-yellow-seeds-cereals.jpg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
//     },
//     {
//       name: 'Wheat',
//       price: '$7.25',
//       change: '-0.8%',
//       changePositive: false,
//       image: 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
//     },
//     {
//       name: 'Corn',
//       price: '$4.75',
//       change: '+2.1%',
//       changePositive: true,
//       image: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
//     },
//     {
//       name: 'Soybeans',
//       price: '$12.00',
//       change: '0.0%',
//       changePositive: null,
//       image: 'https://images.pexels.com/photos/2954024/pexels-photo-2954024.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
//     },
//     {
//       name: 'Cotton',
//       price: '$0.75',
//       change: '-0.5%',
//       changePositive: false,
//       image: 'https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
//     },
//   ];

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton}>
//           <Ionicons name="chevron-back" size={24} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Market Prices</Text>
//       </View>

//       <ScrollView style={styles.content}>
//         {/* Search Bar */}
//         <View style={styles.searchContainer}>
//           <View style={styles.searchBar}>
//             <Ionicons name="search" size={20} color="#9CA3AF" />
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search for crops"
//               placeholderTextColor="#9CA3AF"
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//             />
//           </View>
//         </View>

//         {/* Trending Crops */}
//         <View style={styles.trendingSection}>
//           <Text style={styles.sectionTitle}>Trending Crops</Text>
//           <View style={styles.trendingCrops}>
//             {trendingCrops.map((crop, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={[
//                   styles.trendingCrop,
//                   selectedCrop === crop && styles.selectedCrop
//                 ]}
//                 onPress={() => setSelectedCrop(crop)}
//               >
//                 <Text style={[
//                   styles.trendingCropText,
//                   selectedCrop === crop && styles.selectedCropText
//                 ]}>
//                   {crop}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Crop Prices List */}
//         <View style={styles.pricesSection}>
//           {cropPrices.map((crop, index) => (
//             <TouchableOpacity key={index} style={styles.cropCard}>
//               <Image source={{ uri: crop.image }} style={styles.cropImage} />
//               <View style={styles.cropInfo}>
//                 <Text style={styles.cropName}>{crop.name}</Text>
//                 <Text style={styles.cropUnit}>per bushel</Text>
//               </View>
//               <View style={styles.priceInfo}>
//                 <Text style={styles.cropPrice}>{crop.price}</Text>
//                 <Text style={[
//                   styles.cropChange,
//                   crop.changePositive === true && styles.positiveChange,
//                   crop.changePositive === false && styles.negativeChange,
//                   crop.changePositive === null && styles.neutralChange,
//                 ]}>
//                   {crop.change}
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>

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
//           <Ionicons name="storefront" size={24} color="#4ADE80" />
//           <Text style={[styles.navText, styles.activeNavText]}>Market</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.navItem}>
//           <Ionicons name="settings-outline" size={24} color="#9CA3AF" />
//           <Text style={styles.navText}>Settings</Text>
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
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   backButton: {
//     marginRight: 16,
//   },
//   headerTitle: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   content: {
//     flex: 1,
//   },
//   searchContainer: {
//     paddingHorizontal: 16,
//     paddingTop: 16,
//   },
//   searchBar: {
//     backgroundColor: '#374151',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   searchInput: {
//     flex: 1,
//     color: 'white',
//     fontSize: 16,
//     marginLeft: 12,
//   },
//   trendingSection: {
//     paddingHorizontal: 16,
//     paddingTop: 24,
//   },
//   sectionTitle: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 16,
//   },
//   trendingCrops: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   trendingCrop: {
//     backgroundColor: '#374151',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginRight: 8,
//     marginBottom: 8,
//   },
//   selectedCrop: {
//     backgroundColor: '#4ADE80',
//   },
//   trendingCropText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   selectedCropText: {
//     color: '#1F2937',
//   },
//   pricesSection: {
//     paddingHorizontal: 16,
//     paddingTop: 24,
//     paddingBottom: 20,
//   },
//   cropCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#374151',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   cropImage: {
//     width: 48,
//     height: 48,
//     borderRadius: 8,
//     marginRight: 16,
//   },
//   cropInfo: {
//     flex: 1,
//   },
//   cropName: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   cropUnit: {
//     color: '#9CA3AF',
//     fontSize: 14,
//   },
//   priceInfo: {
//     alignItems: 'flex-end',
//   },
//   cropPrice: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   cropChange: {
//     fontSize: 14,
//   },
//   positiveChange: {
//     color: '#22C55E',
//   },
//   negativeChange: {
//     color: '#EF4444',
//   },
//   neutralChange: {
//     color: '#9CA3AF',
//   },
//   bottomNav: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#374151',
//   },
//   navItem: {
//     alignItems: 'center',
//   },
//   activeNavItem: {},
//   navText: {
//     color: '#9CA3AF',
//     fontSize: 12,
//     marginTop: 4,
//   },
//   activeNavText: {
//     color: '#4ADE80',
//   },
// });
