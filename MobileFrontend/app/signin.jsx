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
import { validateSigninForm } from '../../utils/validation';

// Required for web browser redirect
WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { theme, isDarkMode } = useTheme();
  const { signIn, socialLogin } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Validation state
  const [touched, setTouched] = useState({
    email: false,
    password: false
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
      const { errors: validationErrors } = validateSigninForm({
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
    const { errors: validationErrors } = validateSigninForm(formData);
    setErrors(prev => ({ ...prev, [field]: validationErrors[field] }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate all fields
    const validation = validateSigninForm(formData);
    setErrors(validation.errors);

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true
    });

    // If form is valid, submit
    if (validation.isValid) {
      setIsSubmitting(true);

      try {
        const result = await signIn(formData.email, formData.password);

        if (result.success) {
          // Navigate to home screen on success
          router.replace('/home');
        } else {
          Alert.alert('Sign In Failed', result.error);
        }
      } catch (error) {
        console.error('Sign in error:', error);
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
            Welcome Back!
          </Text>
          <Text style={[styles.subHeaderText, { color: theme.textSecondary }]}>
            Sign in to continue
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
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
            placeholder="Enter your password"
            secureTextEntry
            icon="lock-closed-outline"
            error={errors.password}
            touched={touched.password}
            onBlur={() => handleBlur('password')}
          />

          <Link href="/auth/reset-password" asChild>
            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </Link>

          <AuthButton
            title="Sign In"
            onPress={handleSubmit}
            loading={isSubmitting}
            style={styles.signInButton}
          />
        </View>

        {/* Social Sign In */}
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

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={[styles.signUpText, { color: theme.textSecondary }]}>
            Don't have an account?
          </Text>
          <Link href="/auth/signup" asChild>
            <TouchableOpacity>
              <Text style={[styles.signUpLinkText, { color: theme.primary }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>

      <LoadingSpinner
        visible={isSubmitting || googleLoading || facebookLoading || appleLoading}
        message="Signing in..."
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
    paddingTop: hp('4%'),
    paddingBottom: hp('6%'),
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: hp('2%'),
    marginBottom: hp('2%'),
  },
  logo: {
    width: wp('20%'),
    height: wp('20%'),
  },
  appName: {
    fontSize: wp('8%'),
    fontWeight: 'bold',
    marginTop: hp('1%'),
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: hp('2%'),
  },
  forgotPasswordText: {
    fontSize: wp('3.8%'),
    fontWeight: '500',
  },
  signInButton: {
    marginTop: hp('1%'),
  },
  socialContainer: {
    marginBottom: hp('3%'),
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
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  signUpText: {
    fontSize: wp('4%'),
  },
  signUpLinkText: {
    fontSize: wp('4%'),
    fontWeight: '600',
    marginLeft: wp('1%'),
  },
});
