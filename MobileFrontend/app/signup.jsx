import React, { useState } from 'react';
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
import { router, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as AppleAuthentication from 'expo-apple-authentication';

import FormInput from '../../components/FormInput';
import AuthButton from '../../components/AuthButton';
import SocialButton from '../../components/SocialButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { validateSignupForm } from '../../utils/validation';

// Required for web browser redirect
WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const { theme, isDarkMode } = useTheme();
  const { signUp, socialLogin } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Validation state
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const [errors, setErrors] = useState({});

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  // Google auth configuration
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  // Facebook auth configuration
  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: 'YOUR_FACEBOOK_APP_ID',
  });

  // Handle text input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Validate on change if field has been touched
    if (touched[field]) {
      const { errors: validationErrors } = validateSignupForm({
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
    const { errors: validationErrors } = validateSignupForm(formData);
    setErrors(prev => ({ ...prev, [field]: validationErrors[field] }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate all fields
    const validation = validateSignupForm(formData);
    setErrors(validation.errors);

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    // If form is valid, submit
    if (validation.isValid) {
      setIsSubmitting(true);

      try {
        const result = await signUp(
          formData.email,
          formData.password,
          formData.name
        );

        if (result.success) {
          Alert.alert(
            'Account Created',
            'Your account has been created successfully. Please sign in.',
            [
              {
                text: 'Sign In',
                onPress: () => router.replace('/auth/signin')
              }
            ]
          );
        } else {
          Alert.alert('Sign Up Failed', result.error);
        }
      } catch (error) {
        console.error('Sign up error:', error);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Google sign in handler
  React.useEffect(() => {
    if (googleResponse?.type === 'success') {
      setGoogleLoading(true);
      handleGoogleSuccess(googleResponse.authentication.idToken);
    }
  }, [googleResponse]);

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await googlePromptAsync();
    } catch (error) {
      console.error('Google sign in error:', error);
      Alert.alert('Error', 'Google sign in failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  const handleGoogleSuccess = async (idToken) => {
    try {
      const result = await socialLogin('google', idToken);

      if (result.success) {
        router.replace('/home');
      } else {
        Alert.alert('Google Sign In Failed', result.error);
      }
    } catch (error) {
      console.error('Google auth error:', error);
      Alert.alert('Error', 'Failed to authenticate with Google. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Facebook sign in handler
  React.useEffect(() => {
    if (fbResponse?.type === 'success') {
      setFacebookLoading(true);
      const { access_token } = fbResponse.authentication;
      handleFacebookSuccess(access_token);
    }
  }, [fbResponse]);

  const handleFacebookSignIn = async () => {
    try {
      setFacebookLoading(true);
      await fbPromptAsync();
    } catch (error) {
      console.error('Facebook sign in error:', error);
      Alert.alert('Error', 'Facebook sign in failed. Please try again.');
      setFacebookLoading(false);
    }
  };

  const handleFacebookSuccess = async (accessToken) => {
    try {
      const result = await socialLogin('facebook', accessToken);

      if (result.success) {
        router.replace('/home');
      } else {
        Alert.alert('Facebook Sign In Failed', result.error);
      }
    } catch (error) {
      console.error('Facebook auth error:', error);
      Alert.alert('Error', 'Failed to authenticate with Facebook. Please try again.');
    } finally {
      setFacebookLoading(false);
    }
  };

  // Apple sign in handler
  const handleAppleSignIn = async () => {
    try {
      setAppleLoading(true);

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Use the identityToken for authentication with your backend
      const { identityToken } = credential;

      if (identityToken) {
        const result = await socialLogin('apple', identityToken);

        if (result.success) {
          router.replace('/home');
        } else {
          Alert.alert('Apple Sign In Failed', result.error);
        }
      } else {
        throw new Error('No identity token received from Apple');
      }
    } catch (error) {
      console.error('Apple sign in error:', error);

      // Don't show error for user cancellation
      if (error.code !== 'ERR_CANCELED') {
        Alert.alert('Error', 'Apple sign in failed. Please try again.');
      }
    } finally {
      setAppleLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
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

        {/* Logo */}
        <View style={styles.logoContainer}>
          {/* <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          /> */}
          <Text style={[styles.appName, { color: theme.primary }]}>
            SLOTZI
          </Text>
        </View>

        {/* Heading */}
        <View style={styles.headerContainer}>
          <Text style={[styles.headerText, { color: theme.text }]}>
            Create Account
          </Text>
          <Text style={[styles.subHeaderText, { color: theme.textSecondary }]}>
            Sign up to get started
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <FormInput
            label="Full Name"
            value={formData.name}
            onChangeText={(value) => handleChange('name', value)}
            placeholder="Enter your full name"
            icon="person-outline"
            error={errors.name}
            touched={touched.name}
            onBlur={() => handleBlur('name')}
            autoCapitalize="words"
          />

          <FormInput
            label="Email"
            value={formData.email}
            onChangeText={(value) => handleChange('email', value)}
            placeholder="Enter your email"
            keyboardType="email-address"
            icon="mail-outline"
            error={errors.email}
            touched={touched.email}
            onBlur={() => handleBlur('email')}
          />

          <FormInput
            label="Password"
            value={formData.password}
            onChangeText={(value) => handleChange('password', value)}
            placeholder="Create a password"
            secureTextEntry
            icon="lock-closed-outline"
            error={errors.password}
            touched={touched.password}
            onBlur={() => handleBlur('password')}
          />

          <FormInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(value) => handleChange('confirmPassword', value)}
            placeholder="Confirm your password"
            secureTextEntry
            icon="checkmark-circle-outline"
            error={errors.confirmPassword}
            touched={touched.confirmPassword}
            onBlur={() => handleBlur('confirmPassword')}
          />

          <AuthButton
            title="Sign Up"
            onPress={handleSubmit}
            loading={isSubmitting}
            style={styles.signUpButton}
          />
        </View>

        {/* Social Sign Up */}
        <View style={styles.socialContainer}>
          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <Text style={[styles.dividerText, { color: theme.textSecondary }]}>
              or continue with
            </Text>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <SocialButton
              provider="google"
              onPress={handleGoogleSignIn}
              loading={googleLoading}
              disabled={!googleRequest}
              style={styles.socialButton}
            />

            <SocialButton
              provider="facebook"
              onPress={handleFacebookSignIn}
              loading={facebookLoading}
              disabled={!fbRequest}
              style={styles.socialButton}
            />

            {Platform.OS === 'ios' && (
              <SocialButton
                provider="apple"
                onPress={handleAppleSignIn}
                loading={appleLoading}
                style={styles.socialButton}
              />
            )}
          </View>
        </View>

        {/* Sign In Link */}
        <View style={styles.signInContainer}>
          <Text style={[styles.signInText, { color: theme.textSecondary }]}>
            Already have an account?
          </Text>
          <Link href="/auth/signin" asChild>
            <TouchableOpacity>
              <Text style={[styles.signInLinkText, { color: theme.primary }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>

      <LoadingSpinner
        visible={isSubmitting || googleLoading || facebookLoading || appleLoading}
        message="Creating account..."
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: wp('6%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('6%'),
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: wp('2%'),
    marginBottom: hp('1%'),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  logo: {
    width: wp('16%'),
    height: wp('16%'),
  },
  appName: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    marginTop: hp('0.5%'),
  },
  headerContainer: {
    marginBottom: hp('3%'),
    alignItems: 'center',
  },
  headerText: {
    fontSize: wp('7%'),
    fontWeight: 'bold',
    marginBottom: hp('0.5%'),
  },
  subHeaderText: {
    fontSize: wp('4%'),
  },
  formContainer: {
    marginBottom: hp('3%'),
  },
  signUpButton: {
    marginTop: hp('1%'),
  },
  socialContainer: {
    marginBottom: hp('2%'),
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: wp('3%'),
    fontSize: wp('3.8%'),
  },
  socialButtonsContainer: {
    gap: hp('1.5%'),
  },
  socialButton: {
    marginVertical: 0,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  signInText: {
    fontSize: wp('4%'),
  },
  signInLinkText: {
    fontSize: wp('4%'),
    fontWeight: '600',
    marginLeft: wp('1%'),
  },
});
