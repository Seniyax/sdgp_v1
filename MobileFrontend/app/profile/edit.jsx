import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as ImagePicker from 'expo-image-picker';

import FormInput from '../../components/FormInput';
import AuthButton from '../../components/AuthButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { validateProfileForm } from '../../utils/validation';

export default function EditProfileScreen() {
  const { user, updateProfile, loading } = useAuth();
  const { theme, isDarkMode } = useTheme();

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    pronouns: '',
    bio: ''
  });

  // Image state
  const [profileImage, setProfileImage] = useState(null);

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  // Validation state
  const [touched, setTouched] = useState({
    fullName: false,
    phone: false,
    pronouns: false,
    bio: false
  });
  const [errors, setErrors] = useState({});

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.full_name || '',
        phone: user.phone || '',
        pronouns: user.pronouns || '',
        bio: user.bio || ''
      });

      if (user.profileImage) {
        setProfileImage(user.profileImage);
      }
    }
  }, [user]);

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Validate on change if field has been touched
    if (touched[field]) {
      const { errors: validationErrors } = validateProfileForm({
        ...formData,
        [field]: value
      });
      setErrors(prev => ({ ...prev, [field]: validationErrors[field] }));
    }
  };

  // Handle input blur (for validation)
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    // Validate the field
    const { errors: validationErrors } = validateProfileForm(formData);
    setErrors(prev => ({ ...prev, [field]: validationErrors[field] }));
  };

  // Pick image from gallery
  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setProfileImage(selectedImage.uri);

        // Upload image to server
        handleImageUpload(selectedImage.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera permissions to make this work!');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setProfileImage(selectedImage.uri);

        // Upload image to server
        handleImageUpload(selectedImage.uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  // Upload image to server
  const handleImageUpload = async (uri) => {
    setIsImageUploading(true);

    try {
      // Create form data for image upload
      const formData = new FormData();

      // Get file name and type
      const uriParts = uri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append('avatar', {
        uri,
        name: `profile-${Date.now()}.${fileType}`,
        type: `image/${fileType}`
      });

      // Note: This API endpoint doesn't exist in the provided backend code
      // You would need to implement an image upload endpoint in your backend
      // For now, we'll simulate a successful upload

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, you would call the API to upload the image
      // Example: const response = await profileAPI.updateAvatar(formData);

      console.log('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');

      // Reset profile image to the previous one
      setProfileImage(user?.profileImage || null);
    } finally {
      setIsImageUploading(false);
    }
  };

  // Show image options dialog
  const showImageOptions = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto
        },
        {
          text: 'Choose from Gallery',
          onPress: pickImage
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  // Generate initials from user's name
  const getInitials = (name) => {
    if (!name) return '?';

    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();

    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate all fields
    const validation = validateProfileForm(formData);
    setErrors(validation.errors);

    // Mark fields as touched
    setTouched({
      fullName: true,
      phone: true,
      pronouns: true,
      bio: true
    });

    // If form is valid, submit
    if (validation.isValid) {
      setIsSubmitting(true);

      try {
        // Prepare user data for update
        const userData = {
          full_name: formData.fullName,
          phone: formData.phone,
          pronouns: formData.pronouns,
          bio: formData.bio,
          profileImage: profileImage
        };

        // Update profile
        const result = await updateProfile(userData);

        if (result.success) {
          Alert.alert('Success', 'Your profile has been updated successfully.');
          router.back();
        } else {
          Alert.alert('Update Failed', result.error);
        }
      } catch (error) {
        console.error('Profile update error:', error);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
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
          Edit Profile
        </Text>

        <View style={styles.placeholderButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <TouchableOpacity
            style={styles.imageWrapper}
            onPress={showImageOptions}
            disabled={isImageUploading}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={[styles.initialsContainer, { backgroundColor: theme.primary }]}>
                <Text style={styles.initials}>
                  {getInitials(formData.fullName || user?.full_name)}
                </Text>
              </View>
            )}

            <View style={[styles.editImageButton, { backgroundColor: theme.primary }]}>
              <Ionicons
                name="camera"
                size={wp('4%')}
                color="white"
              />
            </View>

            {isImageUploading && (
              <View style={styles.uploadingOverlay}>
                <LoadingSpinner
                  visible={true}
                  size="small"
                  overlay={false}
                  message="Uploading..."
                />
              </View>
            )}
          </TouchableOpacity>

          <Text style={[styles.changePhotoText, { color: theme.primary }]}>
            Change Photo
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <FormInput
            label="Full Name"
            value={formData.fullName}
            onChangeText={(value) => handleChange('fullName', value)}
            placeholder="Enter your full name"
            icon="person-outline"
            error={errors.fullName}
            touched={touched.fullName}
            onBlur={() => handleBlur('fullName')}
            autoCapitalize="words"
          />

          <FormInput
            label="Phone Number"
            value={formData.phone}
            onChangeText={(value) => handleChange('phone', value)}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            icon="call-outline"
            error={errors.phone}
            touched={touched.phone}
            onBlur={() => handleBlur('phone')}
          />

          <FormInput
            label="Pronouns"
            value={formData.pronouns}
            onChangeText={(value) => handleChange('pronouns', value)}
            placeholder="e.g. he/him, she/her, they/them"
            icon="person-circle-outline"
            error={errors.pronouns}
            touched={touched.pronouns}
            onBlur={() => handleBlur('pronouns')}
          />

          <FormInput
            label="Bio"
            value={formData.bio}
            onChangeText={(value) => handleChange('bio', value)}
            placeholder="Tell us a bit about yourself"
            icon="information-circle-outline"
            error={errors.bio}
            touched={touched.bio}
            onBlur={() => handleBlur('bio')}
            multiline
            numberOfLines={4}
          />

          <View style={styles.buttonContainer}>
            <AuthButton
              title="Cancel"
              onPress={() => router.back()}
              variant="outlined"
              style={styles.cancelButton}
              disabled={isSubmitting}
            />

            <AuthButton
              title="Save Changes"
              onPress={handleSubmit}
              loading={isSubmitting}
              style={styles.saveButton}
              fullWidth={false}
            />
          </View>
        </View>
      </ScrollView>

      <LoadingSpinner
        visible={loading || isSubmitting}
        message="Saving changes..."
      />
    </KeyboardAvoidingView>
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
    paddingHorizontal: wp('6%'),
    paddingTop: hp('3%'),
    paddingBottom: hp('5%'),
  },
  scrollContainer: {
    paddingHorizontal: wp('6%'),
    paddingTop: hp('3%'),
    paddingBottom: hp('5%'),
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: hp('3%'),
  },
  imageWrapper: {
    position: 'relative',
    width: wp('25%'),
    height: wp('25%'),
    borderRadius: wp('12.5%'),
    overflow: 'hidden',
    marginBottom: hp('1%'),
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  initialsContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: 'white',
    fontSize: wp('10%'),
    fontWeight: 'bold',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoText: {
    fontSize: wp('4%'),
    fontWeight: '500',
  },
  formContainer: {
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
  },
  cancelButton: {
    flex: 1,
    marginRight: wp('2%'),
  },
  saveButton: {
    flex: 1,
    marginLeft: wp('2%'),
  }
});