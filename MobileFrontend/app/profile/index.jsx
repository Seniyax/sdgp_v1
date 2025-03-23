import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function ProfileScreen() {
  const { user, signOut, loading } = useAuth();
  const { theme, isDarkMode, themePreference, setTheme, themeOptions } = useTheme();

  // Handle sign out
  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Sign Out',
          onPress: async () => {
            const result = await signOut();
            if (!result.success) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = isDarkMode ? themeOptions.LIGHT : themeOptions.DARK;
    setTheme(newTheme);
  };

  // Generate initials from user's name
  const getInitials = (name) => {
    if (!name) return '?';
    
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <LoadingSpinner visible={true} message="Loading profile..." />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Section */}
        <View style={[styles.userInfoContainer, { backgroundColor: theme.card }]}>
          <View style={styles.avatarContainer}>
            {user.profileImage ? (
              <Image
                source={{ uri: user.profileImage }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.initialsContainer, { backgroundColor: theme.primary }]}>
                <Text style={styles.initials}>
                  {getInitials(user.full_name)}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.userDetailsContainer}>
            <Text style={[styles.userName, { color: theme.text }]}>
              {user.full_name || 'User'}
            </Text>
            <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
              {user.email}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/profile/edit')}
          >
            <Ionicons name="pencil" size={wp('6%')} color={theme.primary} />
          </TouchableOpacity>
        </View>
        
        {/* Options Section */}
        <View style={[styles.optionsContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Account Settings
          </Text>
          
          {/* Edit Profile */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => router.push('/profile/edit')}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons
                name="person-outline"
                size={wp('6%')}
                color={theme.primary}
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, { color: theme.text }]}>
                Edit Profile
              </Text>
              <Text style={[styles.optionDescription, { color: theme.textSecondary }]}>
                Update your personal information
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={wp('6%')}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
          
          {/* My Reservations */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => router.push('/history')}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons
                name="calendar-outline"
                size={wp('6%')}
                color={theme.primary}
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, { color: theme.text }]}>
                My Reservations
              </Text>
              <Text style={[styles.optionDescription, { color: theme.textSecondary }]}>
                View and manage your reservations
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={wp('6%')}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
          
          {/* Notifications */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => router.push('/settings')}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons
                name="notifications-outline"
                size={wp('6%')}
                color={theme.primary}
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, { color: theme.text }]}>
                Notifications
              </Text>
              <Text style={[styles.optionDescription, { color: theme.textSecondary }]}>
                Manage notification preferences
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={wp('6%')}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        </View>
        
        {/* Preferences Section */}
        <View style={[styles.optionsContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Preferences
          </Text>
          
          {/* Theme Toggle */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={toggleTheme}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons
                name={isDarkMode ? "sunny-outline" : "moon-outline"}
                size={wp('6%')}
                color={theme.primary}
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, { color: theme.text }]}>
                Theme
              </Text>
              <Text style={[styles.optionDescription, { color: theme.textSecondary }]}>
                {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </Text>
            </View>
            <View style={[
              styles.themeIndicator, 
              { backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
                borderColor: theme.border }
            ]}>
              <View style={[
                styles.themeIndicatorDot,
                { 
                  backgroundColor: isDarkMode ? '#FFFFFF' : '#121212',
                  left: isDarkMode ? '55%' : '5%'
                }
              ]} />
            </View>
          </TouchableOpacity>
          
          {/* Language */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              Alert.alert('Coming Soon', 'Language settings will be available soon.');
            }}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons
                name="language-outline"
                size={wp('6%')}
                color={theme.primary}
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, { color: theme.text }]}>
                Language
              </Text>
              <Text style={[styles.optionDescription, { color: theme.textSecondary }]}>
                English (US)
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={wp('6%')}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        </View>
        
        {/* Help Section */}
        <View style={[styles.optionsContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Support
          </Text>
          
          {/* Help Center */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              Alert.alert('Coming Soon', 'Help center will be available soon.');
            }}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons
                name="help-circle-outline"
                size={wp('6%')}
                color={theme.primary}
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, { color: theme.text }]}>
                Help Center
              </Text>
              <Text style={[styles.optionDescription, { color: theme.textSecondary }]}>
                FAQ and support resources
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={wp('6%')}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
          
          {/* About */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              Alert.alert('About SLOTZI', 'Version 1.0.0\n\nSLOTZI helps you find and book your perfect slot for restaurants, meeting rooms, and more.');
            }}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons
                name="information-circle-outline"
                size={wp('6%')}
                color={theme.primary}
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, { color: theme.text }]}>
                About
              </Text>
              <Text style={[styles.optionDescription, { color: theme.textSecondary }]}>
                App version and information
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={wp('6%')}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        </View>
        
        {/* Sign Out Button */}
        <TouchableOpacity
          style={[styles.signOutButton, { backgroundColor: theme.card }]}
          onPress={handleSignOut}
        >
          <Ionicons
            name="log-out-outline"
            size={wp('6%')}
            color={theme.error}
          />
          <Text style={[styles.signOutText, { color: theme.error }]}>
            Sign Out
          </Text>
        </TouchableOpacity>
        
        {/* App Version */}
        <Text style={[styles.versionText, { color: theme.textSecondary }]}>
          Version 1.0.0
        </Text>
      </ScrollView>
      
      <LoadingSpinner visible={loading} message="Loading..." />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? hp('6%') : hp('4%'),
    paddingBottom: hp('2%'),
    paddingHorizontal: wp('6%'),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerTitle: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('4%'),
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2%'),
    marginBottom: hp('2%'),
    padding: wp('4%'),
    borderRadius: wp('4%'),
  },
  avatarContainer: {
    marginRight: wp('4%'),
  },
  avatar: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
  },
  initialsContainer: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: wp('8%'),
    fontWeight: 'bold',
    color: 'white',
  },
  userDetailsContainer: {
    flex: 1,
  },
  userName: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginBottom: hp('0.5%'),
  },
  userEmail: {
    fontSize: wp('3.5%'),
  },
  editButton: {
    padding: wp('2%'),
  },
  optionsContainer: {
    borderRadius: wp('4%'),
    marginBottom: hp('2%'),
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: wp('4%'),
    fontWeight: '600',
    marginVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  optionIconContainer: {
    width: wp('12%'),
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: wp('4%'),
    fontWeight: '500',
    marginBottom: hp('0.3%'),
  },
  optionDescription: {
    fontSize: wp('3.5%'),
  },
  themeIndicator: {
    width: wp('12%'),
    height: hp('3%'),
    borderRadius: hp('1.5%'),
    borderWidth: 1,
    justifyContent: 'center',
  },
  themeIndicatorDot: {
    width: wp('5%'),
    height: wp('5%'),
    borderRadius: wp('2.5%'),
    position: 'absolute',
  },
  signOutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('1%'),
    marginBottom: hp('2%'),
    padding: hp('2%'),
    borderRadius: wp('4%'),
  },
  signOutText: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    marginLeft: wp('2%'),
  },
  versionText: {
    textAlign: 'center',
    fontSize: wp('3.5%'),
    marginBottom: hp('2%'),
  },
});
