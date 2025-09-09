import 'expo-router/entry';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Preferences() {
  const [notificationsOn, setNotificationsOn] = React.useState(true);
  const [voiceSupportOn, setVoiceSupportOn] = React.useState(false);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1a2b1a" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        
        {/* Preferences Section */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="location-outline" size={20} color="#ffffff" />
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Location</Text>
                <Text style={styles.menuItemSubtitle}>Current location: Farmville</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888888" />
          </TouchableOpacity>

          <View style={styles.menuItemBorder} />

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="notifications-outline" size={20} color="#ffffff" />
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Notifications</Text>
                <Text style={styles.menuItemSubtitle}>On</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: '#4a4a4a', true: '#4CAF50' }}
              thumbColor={notificationsOn ? '#ffffff' : '#ffffff'}
              ios_backgroundColor="#4a4a4a"
              onValueChange={setNotificationsOn}
              value={notificationsOn}
              style={styles.switch}
            />
          </TouchableOpacity>

          <View style={styles.menuItemBorder} />

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="globe-outline" size={20} color="#ffffff" />
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Language</Text>
                <Text style={styles.menuItemSubtitle}>English</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888888" />
          </TouchableOpacity>
        </View>

        {/* Accessibility Section */}
        <Text style={styles.sectionTitle}>Accessibility</Text>
        
        <View style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="mic-outline" size={20} color="#ffffff" />
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Voice Support</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: '#4a4a4a', true: '#4CAF50' }}
              thumbColor={voiceSupportOn ? '#ffffff' : '#ffffff'}
              ios_backgroundColor="#4a4a4a"
              onValueChange={setVoiceSupportOn}
              value={voiceSupportOn}
              style={styles.switch}
            />
          </TouchableOpacity>
        </View>

        {/* Feedback Section */}
        <Text style={styles.sectionTitle}>Feedback</Text>
        
        <View style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="flag-outline" size={20} color="#ffffff" />
              <Text style={styles.menuItemTitle}>Report an Issue</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888888" />
          </TouchableOpacity>

          <View style={styles.menuItemBorder} />

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="chatbubble-outline" size={20} color="#ffffff" />
              <Text style={styles.menuItemTitle}>Provide Feedback</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888888" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => router.push('welcome')}
        >
          <Ionicons name="home-outline" size={24} color="#666666" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => router.push('advisory')}
        >
          <Ionicons name="shield-outline" size={24} color="#666666" />
          <Text style={styles.navText}>Advisory</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => router.push('marketplace')}
        >
          <Ionicons name="trending-up-outline" size={24} color="#666666" />
          <Text style={styles.navText}>Market</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemActive}>
          <View style={styles.activeNavButton}>
            <Ionicons name="settings" size={20} color="#0a1a0a" />
          </View>
          <Text style={styles.navTextActive}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ...keep your existing styles as is



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a2b1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1a2b1a',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginRight: 32,
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 24,
    marginBottom: 16,
  },
  menuGroup: {
    backgroundColor: '#2a3f2a',
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3a4f3a',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    marginLeft: 12,
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#888888',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#1a2b1a',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a3f2a',
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
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  navTextActive: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
  },
});