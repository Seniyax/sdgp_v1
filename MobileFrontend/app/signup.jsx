import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as AppleAuthentication from 'expo-apple-authentication';

import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotification } from '../contexts/NotificationContext';

WebBrowser.maybeCompleteAuthSession();

const SignUpScreen = () => {
  const { signUp, loading } = useAuth();
  const { theme } = useTheme();
  const { scheduleLocalNotification } = useNotification();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const animationRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);

  // Google Authentication
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  // Facebook Authentication
  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: 'YOUR_FACEBOOK_APP_ID',
  });

  // Validate form fields
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
    
    // Password validation
    if (!password) {
      formErrors.password = 'Password is required';
    } else if (password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation
    if (!confirmPassword) {
      formErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (validateForm()) {
      const success = await signUp(email, password, name);
      
      if (success) {
        scheduleLocalNotification(
          'Welcome to SLOTZI!',
          'Your account has been created successfully.',
          {},
          2 // Show notification after 2 seconds
        );
      } else {
        setErrors({ form: 'Failed to create account. Please try again.' });
      }
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await googlePromptAsync();
      if (result.type === 'success') {
        // Here you would exchange the access token for user info
        // and create/login the user in your system
        console.log('Google Auth Success:', result);
        
        // For demo, simulate successful sign up
        const success = await signUp('google-user@example.com', 'dummy-password', 'Google User');
        
        if (success) {
          scheduleLocalNotification(
            'Welcome to SLOTZI!',
            'Your account has been created successfully with Google.',
            {},
            2
          );
        }
      }
    } catch (error) {
      console.error('Google Sign Up Error:', error);
      setErrors({ form: 'Failed to sign up with Google' });
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      const result = await fbPromptAsync();
      if (result.type === 'success') {
        // Here you would exchange the access token for user info
        // and create/login the user in your system
        console.log('Facebook Auth Success:', result);
        
        // For demo, simulate successful sign up
        const success = await signUp('facebook-user@example.com', 'dummy-password', 'Facebook User');
        
        if (success) {
          scheduleLocalNotification(
            'Welcome to SLOTZI!',
            'Your account has been created successfully with Facebook.',
            {},
            2
          );
        }
      }
    } catch (error) {
      console.error('Facebook Sign Up Error:', error);
      setErrors({ form: 'Failed to sign up with Facebook' });
    }
  };

  const handleAppleSignUp = async () => {
    try {
      if (Platform.OS === 'ios') {
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });
        
        // Here you would handle the credential and create/login the user in your system
        console.log('Apple Auth Success:', credential);
        
        let userName = 'Apple User';
        if (credential.fullName && (credential.fullName.givenName || credential.fullName.familyName)) {
          userName = `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim();
        }
        
        // For demo, simulate successful sign up
        const success = await signUp('apple-user@example.com', 'dummy-password', userName);
        
        if (success) {
          scheduleLocalNotification(
            'Welcome to SLOTZI!',
            'Your account has been created successfully with Apple.',
            {},
            2
          );
        }
      } else {
        setErrors({ form: 'Apple Sign In is only available on iOS devices' });
      }
    } catch (error) {
      console.error('Apple Sign Up Error:', error);
      
      // Only show error if it's not a user cancel
      if (error.code !== 'ERR_CANCELED') {
        setErrors({ form: 'Failed to sign up with Apple' });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Animation */}
        <View style={styles.animationContainer}>
          <LottieView
            ref={animationRef}
            source={require('../assets/signup.json')}
            autoPlay
            loop
            style={styles.animation}
          />
        </View>
        
        {/* Header */}
        <Text style={[styles.headerText, { color: theme.text }]}>Create Account</Text>
        <Text style={[styles.subHeaderText, { color: theme.primary }]}>
          Join SLOTZI and enjoy seamless reservations
        </Text>
        
        {/* Error message */}
        {errors.form && (
          <Text style={styles.errorText}>{errors.form}</Text>
        )}
        
        {/* Name Field */}
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={wp('6%')} color={theme.primary} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Full Name"
            placeholderTextColor={theme.placeholder}
            value={name}
            onChangeText={setName}
            onSubmitEditing={() => emailInputRef.current.focus()}
            returnKeyType="next"
          />
        </View>
        {errors.name && (
          <Text style={styles.errorText}>{errors.name}</Text>
        )}
        
        {/* Email Field */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={wp('6%')} color={theme.primary} />
          <TextInput
            ref={emailInputRef}
            style={[styles.input, { color: theme.text }]}
            placeholder="Email"
            placeholderTextColor={theme.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            onSubmitEditing={() => passwordInputRef.current.focus()}
            returnKeyType="next"
          />
        </View>
        {errors.email && (
          <Text style={styles.errorText}>{errors.email}</Text>
        )}
        
        {/* Password Field */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={wp('6%')} color={theme.primary} />
          <TextInput
            ref={passwordInputRef}
            style={[styles.input, { color: theme.text }]}
            placeholder="Password"
            placeholderTextColor={theme.placeholder}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={() => confirmPasswordInputRef.current.focus()}
            returnKeyType="next"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons 
              name={showPassword ? "eye-off-outline" : "eye-outline"} 
              size={wp('6%')} 
              color={theme.primary} 
            />
          </TouchableOpacity>
        </View>
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
        
        {/* Confirm Password Field */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={wp('6%')} color={theme.primary} />
          <TextInput
            ref={confirmPasswordInputRef}
            style={[styles.input, { color: theme.text }]}
            placeholder="Confirm Password"
            placeholderTextColor={theme.placeholder}
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            returnKeyType="done"
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons 
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
              size={wp('6%')} 
              color={theme.primary} 
            />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        )}
        
        {/* Sign Up Button */}
        <TouchableOpacity 
          style={[styles.signUpButton, { backgroundColor: theme.primary }]}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.signUpButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>
        
        {/* OR Divider */}
        <View style={styles.orContainer}>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <Text style={[styles.orText, { color: theme.text }]}>OR</Text>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
        </View>
        
        {/* Social Login Buttons */}
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity 
            style={[styles.socialButton, { backgroundColor: '#DB4437' }]}
            onPress={handleGoogleSignUp}
          >
            <Ionicons name="logo-google" size={wp('6%')} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.socialButton, { backgroundColor: '#4267B2' }]}
            onPress={handleFacebookSignUp}
          >
            <Ionicons name="logo-facebook" size={wp('6%')} color="white" />
          </TouchableOpacity>
          
          {Platform.OS === 'ios' && (
            <TouchableOpacity 
              style={[styles.socialButton, { backgroundColor: '#000000' }]}
              onPress={handleAppleSignUp}
            >
              <Ionicons name="logo-apple" size={wp('6%')} color="white" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Terms of Service */}
        <Text style={[styles.termsText, { color: theme.text }]}>
          By signing up, you agree to our{' '}
          <Text style={[styles.termsLink, { color: theme.primary }]}>
            Terms of Service
          </Text>
          {' '}and{' '}
          <Text style={[styles.termsLink, { color: theme.primary }]}>
            Privacy Policy
          </Text>
        </Text>
        
        {/* Sign In Link */}
        <View style={styles.signInContainer}>
          <Text style={[styles.haveAccountText, { color: theme.text }]}>
            Already have an account?
          </Text>
          <Link href="/signin" asChild>
            <TouchableOpacity>
              <Text style={[styles.signInText, { color: theme.primary }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('5%'),
  },
  animationContainer: {
    width: wp('50%'),
    height: hp('20%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('5%'),
  },
  animation: {
    width: '100%',
    height: '100%',
  },
  headerText: {
    fontSize: wp('8%'),
    fontFamily: 'Poppins-Bold',
    marginTop: hp('2%'),
  },
  subHeaderText: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Regular',
    marginBottom: hp('3%'),
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('90%'),
    height: hp('7%'),
    backgroundColor: '#F3E4FF',
    borderRadius: wp('3%'),
    paddingHorizontal: wp('4%'),
    marginVertical: hp('1%'),
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'Poppins-Regular',
    fontSize: wp('4%'),
    marginLeft: wp('2%'),
  },
  errorText: {
    color: '#FF0000',
    fontFamily: 'Poppins-Regular',
    fontSize: wp('3.5%'),
    alignSelf: 'flex-start',
    marginLeft: wp('4%'),
  },
  signUpButton: {
    width: wp('90%'),
    height: hp('7%'),
    borderRadius: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp('2%'),
  },
  signUpButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: wp('4.5%'),
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('90%'),
    marginVertical: hp('2%'),
  },
  divider: {
    flex: 1,
    height: 1,
  },
  orText: {
    fontFamily: 'Poppins-Regular',
    fontSize: wp('4%'),
    marginHorizontal: wp('3%'),
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: wp('90%'),
    marginVertical: hp('1%'),
  },
  socialButton: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('7.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp('3%'),
  },
  termsText: {
    fontFamily: 'Poppins-Regular',
    fontSize: wp('3.5%'),
    textAlign: 'center',
    marginVertical: hp('2%'),
    width: wp('80%'),
  },
  termsLink: {
    fontFamily: 'Poppins-Medium',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  haveAccountText: {
    fontFamily: 'Poppins-Regular',
    fontSize: wp('4%'),
  },
  signInText: {
    fontFamily: 'Poppins-Bold',
    fontSize: wp('4%'),
    marginLeft: wp('1%'),
  },
});

export default SignUpScreen;