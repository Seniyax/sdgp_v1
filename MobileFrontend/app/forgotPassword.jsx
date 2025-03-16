import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';

import { useTheme } from '../contexts/ThemeContext';

const ForgotPasswordScreen = () => {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState('');
  
  const animationRef = useRef(null);
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handleResetPassword = async () => {
    // Clear previous errors
    setError('');
    
    // Validate email
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      setLoading(true);
      
      // In a real application, this would be an API call to your backend
      // Simulating API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful password reset email
      setResetSent(true);
    } catch (error) {
      console.error('Error sending password reset:', error);
      setError('Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // If reset email has been sent, show success screen
  if (resetSent) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        
        <View style={styles.successContainer}>
          <LottieView
            source={require('../assets/email-sent.json')}
            autoPlay
            loop={false}
            style={styles.successAnimation}
          />
          
          <Text style={[styles.successTitle, { color: theme.text }]}>
            Reset Link Sent!
          </Text>
          
          <Text style={[styles.successMessage, { color: theme.text }]}>
            We've sent a password reset link to {email}. Please check your email and follow the instructions to reset your password.
          </Text>
          
          <TouchableOpacity
            style={[styles.backToLoginButton, { backgroundColor: theme.primary }]}
            onPress={() => router.push('/signin')}
          >
            <Text style={styles.backToLoginButtonText}>
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Animation */}
        <View style={styles.animationContainer}>
          <LottieView
            ref={animationRef}
            source={require('../assets/forgot-password.json')}
            autoPlay
            loop
            style={styles.animation}
          />
        </View>
        
        {/* Header */}
        <Text style={[styles.headerText, { color: theme.text }]}>
          Forgot Password?
        </Text>
        
        <Text style={[styles.subHeaderText, { color: theme.primary }]}>
          Enter your email to receive a password reset link
        </Text>
        
        {/* Error message */}
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}
        
        {/* Email Field */}
        <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
          <Ionicons name="mail-outline" size={wp('6%')} color={theme.primary} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Email"
            placeholderTextColor={theme.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            returnKeyType="done"
          />
        </View>
        
        {/* Reset Button */}
        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: theme.primary }]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.resetButtonText}>Send Reset Link</Text>
          )}
        </TouchableOpacity>
        
        {/* Back to Login */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons 
            name="arrow-back" 
            size={wp('5%')} 
            color={theme.primary} 
          />
          <Text style={[styles.backButtonText, { color: theme.primary }]}>
            Back to Login
          </Text>
        </TouchableOpacity>
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
    marginBottom: hp('4%'),
    textAlign: 'center',
  },
  errorText: {
    color: '#FF0000',
    fontFamily: 'Poppins-Regular',
    fontSize: wp('3.5%'),
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('90%'),
    height: hp('7%'),
    borderRadius: wp('3%'),
    paddingHorizontal: wp('4%'),
    marginBottom: hp('3%'),
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'Poppins-Regular',
    fontSize: wp('4%'),
    marginLeft: wp('2%'),
  },
  resetButton: {
    width: wp('90%'),
    height: hp('7%'),
    borderRadius: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('3%'),
  },
  resetButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: wp('4.5%'),
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  backButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: wp('4%'),
    marginLeft: wp('2%'),
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('10%'),
  },
  successAnimation: {
    width: wp('70%'),
    height: wp('70%'),
  },
  successTitle: {
    fontSize: wp('7%'),
    fontFamily: 'Poppins-Bold',
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  successMessage: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: hp('4%'),
  },
  backToLoginButton: {
    width: wp('90%'),
    height: hp('7%'),
    borderRadius: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backToLoginButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: wp('4.5%'),
  },
});

export default ForgotPasswordScreen;