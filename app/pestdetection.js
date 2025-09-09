import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function PestDetection() {
  const navigation = useNavigation();

  const recentScans = [
    {
      name: 'Leaf Blight',
      timeAgo: 'Scanned 2 days ago',
      image: 'https://images.pexels.com/photos/1145434/pexels-photo-1145434.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
    },
    {
      name: 'Stem Rust',
      timeAgo: 'Scanned 1 week ago',
      image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* ... header, upload section, recent scans remain the same ... */}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Welcome')}>
          <Ionicons name="home-outline" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]} onPress={() => navigation.navigate('Advisory')}>
          <Ionicons name="leaf" size={24} color="#4ADE80" />
          <Text style={[styles.navText, styles.activeNavText]}>Advisory</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Marketplace')}>
          <Ionicons name="storefront-outline" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>Market</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Settings')}>
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
    paddingHorizontal: 16,
  },
  uploadSection: {
    paddingTop: 20,
  },
  description: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#374151',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginBottom: 32,
  },
  uploadContent: {
    alignItems: 'center',
  },
  cloudIcon: {
    marginBottom: 16,
  },
  uploadTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  uploadSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  recentSection: {
    paddingTop: 8,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  scanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  scanImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 16,
  },
  scanInfo: {
    flex: 1,
  },
  scanName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  scanTime: {
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
