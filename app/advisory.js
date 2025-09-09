import 'expo-router/entry';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Advisory() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1a2b1a" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AgriAssist</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#666666" />
            <Text style={styles.searchPlaceholder}>Search for crops, diseases...</Text>
          </View>
        </View>

        {/* Today's Advisory */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{"Today's Advisory"}</Text>
          
          <View style={styles.advisoryCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=180&fit=crop' }}
              style={styles.advisoryImage}
              resizeMode="cover"
            />
            <View style={styles.advisoryContent}>
              <Text style={styles.advisoryTitle}>Wheat Advisory</Text>
              <Text style={styles.advisoryDescription}>
                High risk of fungal diseases due to recent rainfall. Apply fungicide within 48 hours.
              </Text>
              <TouchableOpacity style={styles.learnMoreButton}>
                <Text style={styles.learnMoreText}>Learn More</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Weather */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weather</Text>
          
          <View style={styles.weatherCard}>
            <View style={styles.weatherContent}>
              <View style={styles.weatherLeft}>
                <Text style={styles.weatherLabel}>Current Conditions</Text>
                <Text style={styles.temperature}>28°C</Text>
                <Text style={styles.weatherCondition}>Partly Cloudy</Text>
              </View>
              <View style={styles.weatherIconContainer}>
                <Ionicons name="partly-sunny" size={44} color="#FFA500" />
              </View>
            </View>
          </View>

          <View style={styles.weatherAlertCard}>
            <View style={styles.weatherAlertContent}>
              <View style={styles.weatherAlertLeft}>
                <Text style={styles.weatherAlertLabel}>Weather Alert</Text>
                <Text style={styles.weatherAlertText}>
                  Heavy rainfall expected tomorrow. Prepare for waterlogging.
                </Text>
              </View>
              <View style={styles.weatherAlertIconContainer}>
                <Ionicons name="water" size={36} color="#4A90E2" />
              </View>
            </View>
          </View>
        </View>

        {/* Quick Access */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          
          <View style={styles.quickAccessGrid}>
            <TouchableOpacity style={styles.quickAccessItem}>
              <View style={styles.quickAccessIconContainer}>
                <Ionicons name="leaf" size={28} color="#ffffff" />
              </View>
              <Text style={styles.quickAccessText}>Soil Health</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAccessItem}>
              <View style={styles.quickAccessIconContainer}>
                <Ionicons name="settings" size={28} color="#ffffff" />
              </View>
              <Text style={styles.quickAccessText}>Pest Detection</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAccessItem}>
              <View style={styles.quickAccessIconContainer}>
                <Ionicons name="trending-up" size={28} color="#ffffff" />
              </View>
              <Text style={styles.quickAccessText}>Market Prices</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => router.push('welcome')}
        >
          <Ionicons name="home-outline" size={24} color="#666666" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItemActive}>
          <Ionicons name="document-text" size={24} color="#ffffff" />
          <Text style={styles.navTextActive}>Advisory</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => router.push('marketplace')}
        >
          <Ionicons name="trending-up-outline" size={24} color="#666666" />
          <Text style={styles.navText}>Market</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => router.push('preferences')}
        >
          <Ionicons name="settings-outline" size={24} color="#666666" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1a0a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1a2b1a',
  },
  menuButton: {
    padding: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  notificationButton: {
    padding: 2,
  },
  content: {
    flex: 1,
    backgroundColor: '#0a1a0a',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a2b1a',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 24,
  },
  searchPlaceholder: {
    marginLeft: 10,
    fontSize: 15,
    color: '#888888',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  advisoryCard: {
    backgroundColor: '#1a2b1a',
    borderRadius: 16,
    overflow: 'hidden',
  },
  advisoryImage: {
    width: '100%',
    height: 140,
  },
  advisoryContent: {
    padding: 20,
  },
  advisoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  advisoryDescription: {
    fontSize: 14,
    color: '#b0b0b0',
    lineHeight: 20,
    marginBottom: 16,
  },
  learnMoreButton: {
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  weatherCard: {
    backgroundColor: '#1a2b1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  weatherContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherLeft: {
    flex: 1,
  },
  weatherLabel: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 6,
  },
  temperature: {
    fontSize: 36,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  weatherCondition: {
    fontSize: 16,
    color: '#b0b0b0',
  },
  weatherIconContainer: {
    marginLeft: 20,
  },
  weatherAlertCard: {
    backgroundColor: '#1a2b1a',
    borderRadius: 16,
    padding: 20,
  },
  weatherAlertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherAlertLeft: {
    flex: 1,
  },
  weatherAlertLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
  },
  weatherAlertText: {
    fontSize: 14,
    color: '#b0b0b0',
    lineHeight: 18,
  },
  weatherAlertIconContainer: {
    marginLeft: 20,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  quickAccessItem: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 12,
  },
  quickAccessIconContainer: {
    width: 68,
    height: 68,
    backgroundColor: '#1a2b1a',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickAccessText: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#0a1a0a',
    paddingVertical: 12,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 10,
    color: '#666666',
    marginTop: 4,
  },
  navTextActive: {
    fontSize: 10,
    color: '#ffffff',
    marginTop: 4,
  },
});






