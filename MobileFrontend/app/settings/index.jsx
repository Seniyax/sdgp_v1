import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  Platform,
  Linking
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';

import { useTheme } from '../../contexts/ThemeContext';
import { getNotificationPreference, saveNotificationPreference } from '../../services/storage';

export default function SettingsScreen() {
  const { theme, isDarkMode, themePreference, setTheme, themeOptions } = useTheme();
  
  // State for notification settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reservationReminders, setReservationReminders] = useState(true);
  const [promotionalNotifications, setPromotionalNotifications] = useState(false);
  
  // Check stored notification preferences on mount
  React.useEffect(() => {
    const loadNotificationPreferences = async () => {
      const enabled = await getNotificationPreference();
      setNotificationsEnabled(enabled);
    };
    
    loadNotificationPreferences();
  }, []);
  
  // Theme selection handler
  const handleThemeChange = (themeOption) => {
    setTheme(themeOption);
  };
  
  // Notification toggle handler
  const handleNotificationToggle = async (value) => {
    if (value) {
      // Request permission when enabling notifications
      const { status } = await requestNotificationPermission();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'To receive notifications, you need to grant permission in your device settings.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Open Settings',
              onPress: () => {
                // Open app settings (this is a placeholder - actual implementation depends on device)
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
        return;
      }
    }
    
    setNotificationsEnabled(value);
    await saveNotificationPreference(value);
  };
  
  // Request notification permission
  const requestNotificationPermission = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return { status };
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return { status: 'error' };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons 
            name="arrow-back" 
            size={wp('6%')} 
            color={theme.text} 
          />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Settings
        </Text>
        
        <View style={styles.placeholderButton} />
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme Section */}
        <View style={[styles.sectionContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Appearance
          </Text>
          
          <View style={styles.themeOptionsContainer}>
            {/* Light Theme Option */}
            <TouchableOpacity
              style={[
                styles.themeOption,
                themePreference === themeOptions.LIGHT && styles.selectedThemeOption,
                { 
                  borderColor: themePreference === themeOptions.LIGHT 
                    ? theme.primary
                    : theme.border
                }
              ]}
              onPress={() => handleThemeChange(themeOptions.LIGHT)}
            >
              <View style={[styles.themePreview, { backgroundColor: '#FFFFFF' }]}>
                <View style={styles.themePreviewHeader} />
                <View style={styles.themePreviewContent}>
                  <View style={styles.themePreviewLine} />
                  <View style={styles.themePreviewLine} />
                </View>
              </View>
              <Text style={[
                styles.themeOptionText, 
                { color: theme.text }
              ]}>
                Light
              </Text>
              {themePreference === themeOptions.LIGHT && (
                <Ionicons 
                  name="checkmark-circle" 
                  size={wp('6%')} 
                  color={theme.primary} 
                  style={styles.selectedIcon}
                />
              )}
            </TouchableOpacity>
            
            {/* Dark Theme Option */}
            <TouchableOpacity
              style={[
                styles.themeOption,
                themePreference === themeOptions.DARK && styles.selectedThemeOption,
                { 
                  borderColor: themePreference === themeOptions.DARK 
                    ? theme.primary
                    : theme.border
                }
              ]}
              onPress={() => handleThemeChange(themeOptions.DARK)}
            >
              <View style={[styles.themePreview, { backgroundColor: '#121212' }]}>
                <View style={[styles.themePreviewHeader, { backgroundColor: '#1E1E1E' }]} />
                <View style={styles.themePreviewContent}>
                  <View style={[styles.themePreviewLine, { backgroundColor: '#2A2A2A' }]} />
                  <View style={[styles.themePreviewLine, { backgroundColor: '#2A2A2A' }]} />
                </View>
              </View>
              <Text style={[
                styles.themeOptionText, 
                { color: theme.text }
              ]}>
                Dark
              </Text>
              {themePreference === themeOptions.DARK && (
                <Ionicons 
                  name="checkmark-circle" 
                  size={wp('6%')} 
                  color={theme.primary} 
                  style={styles.selectedIcon}
                />
              )}
            </TouchableOpacity>
            
            {/* System Theme Option */}
            <TouchableOpacity
              style={[
                styles.themeOption,
                themePreference === themeOptions.SYSTEM && styles.selectedThemeOption,
                { 
                  borderColor: themePreference === themeOptions.SYSTEM 
                    ? theme.primary
                    : theme.border
                }
              ]}
              onPress={() => handleThemeChange(themeOptions.SYSTEM)}
            >
              <View style={[styles.themePreview, { backgroundColor: '#F0F0F0' }]}>
                <View style={[styles.themePreviewHalf, { backgroundColor: '#FFFFFF' }]}>
                  <View style={styles.themePreviewLine} />
                </View>
                <View style={[styles.themePreviewHalf, { backgroundColor: '#121212' }]}>
                  <View style={[styles.themePreviewLine, { backgroundColor: '#2A2A2A' }]} />
                </View>
              </View>
              <Text style={[
                styles.themeOptionText, 
                { color: theme.text }
              ]}>
                System
              </Text>
              {themePreference === themeOptions.SYSTEM && (
                <Ionicons 
                  name="checkmark-circle" 
                  size={wp('6%')} 
                  color={theme.primary} 
                  style={styles.selectedIcon}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Notifications Section */}
        <View style={[styles.sectionContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Notifications
          </Text>
          
          {/* Main Notifications Toggle */}
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>
                Push Notifications
              </Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                Enable or disable all notifications
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: '#D1D1D6', true: theme.primary }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#D1D1D6"
            />
          </View>
          
          {/* Reservation Reminders Toggle */}
          <View style={[
            styles.settingItem,
            !notificationsEnabled && styles.disabledSettingItem
          ]}>
            <View style={styles.settingTextContainer}>
              <Text style={[
                styles.settingTitle, 
                { color: notificationsEnabled ? theme.text : theme.textSecondary }
              ]}>
                Reservation Reminders
              </Text>
              <Text style={[
                styles.settingDescription, 
                { color: theme.textSecondary, opacity: notificationsEnabled ? 1 : 0.5 }
              ]}>
                Get reminded about upcoming reservations
              </Text>
            </View>
            <Switch
              value={reservationReminders}
              onValueChange={setReservationReminders}
              disabled={!notificationsEnabled}
              trackColor={{ false: '#D1D1D6', true: theme.primary }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#D1D1D6"
            />
          </View>
          
          {/* Promotional Notifications Toggle */}
          <View style={[
            styles.settingItem,
            !notificationsEnabled && styles.disabledSettingItem
          ]}>
            <View style={styles.settingTextContainer}>
              <Text style={[
                styles.settingTitle, 
                { color: notificationsEnabled ? theme.text : theme.textSecondary }
              ]}>
                Promotional Notifications
              </Text>
              <Text style={[
                styles.settingDescription, 
                { color: theme.textSecondary, opacity: notificationsEnabled ? 1 : 0.5 }
              ]}>
                Receive promotions and special offers
              </Text>
            </View>
            <Switch
              value={promotionalNotifications}
              onValueChange={setPromotionalNotifications}
              disabled={!notificationsEnabled}
              trackColor={{ false: '#D1D1D6', true: theme.primary }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#D1D1D6"
            />
          </View>
        </View>
        
        {/* About Section */}
        <View style={[styles.sectionContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            About
          </Text>
          
          <TouchableOpacity
            style={styles.aboutItem}
            onPress={() => {
              Alert.alert('Terms of Service', 'Our terms of service will be displayed here.');
            }}
          >
            <Text style={[styles.aboutItemText, { color: theme.text }]}>
              Terms of Service
            </Text>
            <Ionicons
              name="chevron-forward"
              size={wp('5%')}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.aboutItem}
            onPress={() => {
              Alert.alert('Privacy Policy', 'Our privacy policy will be displayed here.');
            }}
          >
            <Text style={[styles.aboutItemText, { color: theme.text }]}>
              Privacy Policy
            </Text>
            <Ionicons
              name="chevron-forward"
              size={wp('5%')}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.aboutItem}
            onPress={() => {
              Alert.alert('About SLOTZI', 'Version 1.0.0\n\nSLOTZI helps you find and book your perfect slot for restaurants, meeting rooms, and more.');
            }}
          >
            <Text style={[styles.aboutItemText, { color: theme.text }]}>
              App Version
            </Text>
            <Text style={[styles.versionText, { color: theme.textSecondary }]}>
              1.0.0
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? hp('6%') : hp('2%'),
    paddingBottom: hp('2%'),
    paddingHorizontal: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    padding: wp('2%'),
  },
  headerTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
  },
  placeholderButton: {
    width: wp('10%'),
  },
  scrollContainer: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
  },
  sectionContainer: {
    borderRadius: wp('4%'),
    marginBottom: hp('2%'),
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    margin: wp('4%'),
  },
  themeOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingBottom: wp('4%'),
  },
  themeOption: {
    width: wp('25%'),
    borderRadius: wp('3%'),
    borderWidth: 2,
    padding: wp('2%'),
    alignItems: 'center',
  },
  selectedThemeOption: {
    borderWidth: 2,
  },
  themePreview: {
    width: wp('20%'),
    height: wp('15%'),
    borderRadius: wp('2%'),
    overflow: 'hidden',
    marginBottom: hp('1%'),
  },
  themePreviewHeader: {
    height: wp('3%'),
    backgroundColor: '#E0E0E0',
  },
  themePreviewContent: {
    flex: 1,
    padding: wp('1%'),
    justifyContent: 'center',
  },
  themePreviewLine: {
    height: wp('1.5%'),
    backgroundColor: '#E0E0E0',
    borderRadius: wp('0.5%'),
    marginVertical: wp('0.5%'),
  },
  themePreviewHalf: {
    height: '50%',
    padding: wp('1%'),
    justifyContent: 'center',
  },
  themeOptionText: {
    fontSize: wp('3.5%'),
    fontWeight: '500',
    marginVertical: hp('0.5%'),
  },
  selectedIcon: {
    position: 'absolute',
    top: -wp('3%'),
    right: -wp('3%'),
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  disabledSettingItem: {
    opacity: 0.7,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: wp('4%'),
  },
  settingTitle: {
    fontSize: wp('4%'),
    fontWeight: '500',
    marginBottom: hp('0.3%'),
  },
  settingDescription: {
    fontSize: wp('3.5%'),
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  aboutItemText: {
    fontSize: wp('4%'),
    fontWeight: '500',
  },
  versionText: {
    fontSize: wp('3.5%'),
  },
});
