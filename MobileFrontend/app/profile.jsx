import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as ImagePicker from 'expo-image-picker';

import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotification } from '../contexts/NotificationContext';

const ProfileScreen = () => {
  const { user, updateProfile, signOut, loading } = useAuth();
  const { theme, isDark } = useTheme();
  const { scheduleLocalNotification } = useNotification();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setPronouns(user.pronouns || '');
      setProfileImage(user.profilePicture || null);
    }
  }, [user]);

  const handleImagePick = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to change profile picture.');
      return;
    }
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const validateForm = () => {
    let formErrors = {};
    
    // Name validation
    if (!name) {
      formErrors.name = 'Name is required';
    }
    
    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      formErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      formErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (optional)
    if (phone) {
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
        formErrors.phone = 'Please enter a valid phone number';
      }
    }
    
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (validateForm()) {
      const updatedProfile = {
        name,
        email,
        phone,
        pronouns,
        profilePicture: profileImage,
      };
      
      const success = await updateProfile(updatedProfile);
      
      if (success) {
        scheduleLocalNotification(
          'Profile Updated',
          'Your profile has been updated successfully.',
          {},
          2 // Show notification after 2 seconds
        );
        setIsEditing(false);
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: signOut,
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          {profileImage ? (
            <Image 
              source={{ uri: profileImage }} 
              style={styles.profileImage} 
            />
          ) : (
            <View style={[styles.profileImagePlaceholder, { backgroundColor: theme.primary }]}>
              <FontAwesome5 name="user" size={wp('15%')} color="white" />
            </View>
          )}
          
          {isEditing && (
            <TouchableOpacity 
              style={[styles.editImageButton, { backgroundColor: theme.primary }]} 
              onPress={handleImagePick}
            >
              <Ionicons name="camera" size={wp('5%')} color="white" />
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={[styles.userName, { color: theme.text }]}>
          {user?.name || 'User Name'}
        </Text>
        
        {!isEditing && (
          <TouchableOpacity 
            style={[styles.editButton, { backgroundColor: theme.primary }]}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Profile Info */}
      <View style={styles.profileInfo}>
        {/* Name Field */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.fieldLabel, { color: theme.text }]}>Name</Text>
          {isEditing ? (
            <>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    color: theme.text,
                    backgroundColor: theme.card,
                    borderColor: errors.name ? theme.error : theme.border,
                  }
                ]}
                value={name}
                onChangeText={setName}
                editable={isEditing}
              />
              {errors.name && (
                <Text style={[styles.errorText, { color: theme.error }]}>
                  {errors.name}
                </Text>
              )}
            </>
          ) : (
            <Text style={[styles.fieldValue, { color: theme.text }]}>
              {user?.name || 'Not set'}
            </Text>
          )}
        </View>
        
        {/* Email Field */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.fieldLabel, { color: theme.text }]}>Email</Text>
          {isEditing ? (
            <>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    color: theme.text,
                    backgroundColor: theme.card,
                    borderColor: errors.email ? theme.error : theme.border,
                  }
                ]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={isEditing}
              />
              {errors.email && (
                <Text style={[styles.errorText, { color: theme.error }]}>
                  {errors.email}
                </Text>
              )}
            </>
          ) : (
            <Text style={[styles.fieldValue, { color: theme.text }]}>
              {user?.email || 'Not set'}
            </Text>
          )}
        </View>
        
        {/* Phone Field */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.fieldLabel, { color: theme.text }]}>Phone</Text>
          {isEditing ? (
            <>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    color: theme.text,
                    backgroundColor: theme.card,
                    borderColor: errors.phone ? theme.error : theme.border,
                  }
                ]}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                editable={isEditing}
              />
              {errors.phone && (
                <Text style={[styles.errorText, { color: theme.error }]}>
                  {errors.phone}
                </Text>
              )}
            </>
          ) : (
            <Text style={[styles.fieldValue, { color: theme.text }]}>
              {user?.phone || 'Not set'}
            </Text>
          )}
        </View>
        
        {/* Pronouns Field */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.fieldLabel, { color: theme.text }]}>Pronouns</Text>
          {isEditing ? (
            <TextInput
              style={[
                styles.input, 
                { 
                  color: theme.text,
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                }
              ]}
              value={pronouns}
              onChangeText={setPronouns}
              placeholder="e.g. he/him, she/her, they/them"
              placeholderTextColor={theme.placeholder}
              editable={isEditing}
            />
          ) : (
            <Text style={[styles.fieldValue, { color: theme.text }]}>
              {user?.pronouns || 'Not set'}
            </Text>
          )}
        </View>
        
        {/* Save/Cancel Buttons */}
        {isEditing && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.cancelButton, { backgroundColor: theme.secondary }]}
              onPress={() => {
                setIsEditing(false);
                setName(user?.name || '');
                setEmail(user?.email || '');
                setPhone(user?.phone || '');
                setPronouns(user?.pronouns || '');
                setProfileImage(user?.profilePicture || null);
                setErrors({});
              }}
            >
              <Text style={[styles.cancelButtonText, { color: theme.primary }]}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: theme.primary }]}
              onPress={handleSaveProfile}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* Logout Button */}
      <TouchableOpacity 
        style={[styles.logoutButton, { backgroundColor: theme.error }]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={wp('6%')} color="white" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: hp('5%'),
  },
  header: {
    alignItems: 'center',
    paddingVertical: hp('3%'),
  },
  profileImageContainer: {
    width: wp('35%'),
    height: wp('35%'),
    borderRadius: wp('17.5%'),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  userName: {
    fontSize: wp('6%'),
    fontFamily: 'Poppins-Bold',
    marginBottom: hp('1%'),
  },
  editButton: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('5%'),
    marginTop: hp('1%'),
  },
  editButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: wp('4%'),
  },
  profileInfo: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
  },
  fieldContainer: {
    marginBottom: hp('2.5%'),
  },
  fieldLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: wp('4%'),
    marginBottom: hp('0.5%'),
  },
  fieldValue: {
    fontFamily: 'Poppins-Regular',
    fontSize: wp('4.5%'),
  },
  input: {
    fontFamily: 'Poppins-Regular',
    fontSize: wp('4.5%'),
    borderWidth: 1,
    borderRadius: wp('2%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1%'),
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    fontSize: wp('3.5%'),
    marginTop: hp('0.5%'),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
  },
  cancelButton: {
    flex: 1,
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('2%'),
  },
  cancelButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: wp('4%'),
  },
  saveButton: {
    flex: 1,
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp('2%'),
  },
  saveButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: wp('4%'),
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp('5%'),
    marginTop: hp('3%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2%'),
  },
  logoutButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: wp('4.5%'),
    marginLeft: wp('2%'),
  },
});

export default ProfileScreen;
