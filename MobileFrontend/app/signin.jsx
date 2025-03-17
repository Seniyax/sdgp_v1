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
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, Link } from 'expo-router';
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

const SignInScreen = () => {
  const { signIn, loading } = useAuth();
  const { theme } = useTheme();
  const { scheduleLocalNotification } = useNotification();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const animationRef = useRef(null);
  const passwordInputRef = useRef(null);

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
    
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (validateForm()) {
      const success = await signIn(email, password);
      
      if (success) {
        scheduleLocalNotification(
          'Welcome back!',
          'You have successfully signed in to your account.',
          {},
          2 // Show notification after 2 seconds
        );
      } else {
        setErrors({ form: 'Invalid email or password' });
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await googlePromptAsync();
      if (result.type === 'success') {
        // Here you would exchange the access token for user info
        // and create/login the user in your system
        console.log('Google Auth Success:', result);
        
        // For demo, simulate successful login
        const success = await signIn('google-user@example.com', 'dummy-password');
        
        if (success) {
          scheduleLocalNotification(
            'Welcome back!',
            'You have successfully signed in with Google.',
            {},
            2
          );
        }
      }
    } catch (error) {
      console.error('Google Sign In Error:', error);
      setErrors({ form: 'Failed to sign in with Google' });
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const result = await fbPromptAsync();
      if (result.type === 'success') {
        // Here you would exchange the access token for user info
        // and create/login the user in your system
        console.log('Facebook Auth Success:', result);
        
        // For demo, simulate successful login
        const success = await signIn('facebook-user@example.com', 'dummy-password');
        
        if (success) {
          scheduleLocalNotification(
            'Welcome back!',
            'You have successfully signed in with Facebook.',
            {},
            2
          );
        }
      }
    } catch (error) {
      console.error('Facebook Sign In Error:', error);
      setErrors({ form: 'Failed to sign in with Facebook' });
    }
  };

  const handleAppleSignIn = async () => {
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
        
        // For demo, simulate successful login
        const success = await signIn('apple-user@example.com', 'dummy-password');
        
        if (success) {
          scheduleLocalNotification(
            'Welcome back!',
            'You have successfully signed in with Apple.',
            {},
            2
          );
        }
      } else {
        setErrors({ form: 'Apple Sign In is only available on iOS devices' });
      }
    } catch (error) {
      console.error('Apple Sign In Error:', error);
      
      // Only show error if it's not a user cancel
      if (error.code !== 'ERR_CANCELED') {
        setErrors({ form: 'Failed to sign in with Apple' });
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
            source={require('../assets/login.json')}
            autoPlay
            loop
            style={styles.animation}
          />
        </View>
        
        {/* Header */}
        <Text style={[styles.headerText, { color: theme.text }]}>Welcome Back</Text>
        <Text style={[styles.subHeaderText, { color: theme.primary }]}>Sign in to continue your journey with SLOTZI</Text>
        
        {/* Error message */}
        {errors.form && (
          <Text style={styles.errorText}>{errors.form}</Text>
        )}
        
        {/* Email Field */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={wp('6%')} color={theme.primary} />
          <TextInput
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
            returnKeyType="done"
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
        
        {/* Forgot Password */}
        <TouchableOpacity 
          style={styles.forgotPasswordContainer}
          onPress={() => router.push('/forgotPassword')}
        >
          <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
        
        {/* Sign In Button */}
        <TouchableOpacity 
          style={[styles.signInButton, { backgroundColor: theme.primary }]}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.signInButtonText}>Sign In</Text>
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
            onPress={handleGoogleSignIn}
          >
            <Ionicons name="logo-google" size={wp('6%')} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.socialButton, { backgroundColor: '#4267B2' }]}
            onPress={handleFacebookSignIn}
          >
            <Ionicons name="logo-facebook" size={wp('6%')} color="white" />
          </TouchableOpacity>
          
          {Platform.OS === 'ios' && (
            <TouchableOpacity 
              style={[styles.socialButton, { backgroundColor: '#000000' }]}
              onPress={handleAppleSignIn}
            >
              <Ionicons name="logo-apple" size={wp('6%')} color="white" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={[styles.noAccountText, { color: theme.text }]}>
            Don't have an account?
          </Text>
          <Link href="/signup" asChild>
            <TouchableOpacity>
              <Text style={[styles.signUpText, { color: theme.primary }]}>
                Sign Up
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
    width: wp('70%'),
    height: hp('30%'),
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
  forgotPasswordContainer: {
    width: wp('90%'),
    alignItems: 'flex-end',
    marginVertical: hp('1%'),
  },
  forgotPasswordText: {
    fontFamily: 'Poppins-Medium',
    fontSize: wp('3.5%'),
  },
  signInButton: {
    width: wp('90%'),
    height: hp('7%'),
    borderRadius: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp('2%'),
  },
  signInButtonText: {
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
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('3%'),
  },
  noAccountText: {
    fontFamily: 'Poppins-Regular',
    fontSize: wp('4%'),
  },
  signUpText: {
    fontFamily: 'Poppins-Bold',
    fontSize: wp('4%'),
    marginLeft: wp('1%'),
  },
});

export default SignInScreen;