import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import FormInput from '../../components/FormInput';
import AuthButton from '../../components/AuthButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useTheme } from '../../contexts/ThemeContext';
import { isValidEmail } from '../../utils/validation';
import { api } from '../../services/api';

export default function ResetPasswordScreen() {
  const { theme, isDarkMode } = useTheme();

  // Form state
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Handle email change
  const handleEmailChange = (value) => {
    setEmail(value);

    if (touched) {
      validateEmail(value);
    }
  };

  // Validate email
  const validateEmail = (email) => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }

    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }

    setEmailError('');
    return true;
  };

  // Handle input blur (for validation)
  const handleBlur = () => {
    setTouched(true);
    validateEmail(email);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setTouched(true);

    if (!validateEmail(email)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Note: This API endpoint doesn't exist in the provided backend code
      // You would need to implement a reset password endpoint in your backend
      await api.post('/auth/reset-password', { email });

      setResetSent(true);

      setTimeout(() => {
        router.replace('/auth/signin');
      }, 3000);

    } catch (error) {
      console.error('Reset password error:', error);

      // Even if the request fails, we'll show success message for security reasons
      // This prevents user enumeration attacks
      setResetSent(true);

      setTimeout(() => {
        router.replace('/auth/signin');
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

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

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          {/* <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          /> */}
        </View>

        {resetSent ? (
          // Success Message
          <View style={styles.successContainer}>
            <Ionicons
              name="checkmark-circle"
              size={wp('20%')}
              color={theme.success}
            />
            <Text style={[styles.successTitle, { color: theme.text }]}>
              Reset Link Sent
            </Text>
            <Text style={[styles.successText, { color: theme.textSecondary }]}>
              If an account exists with that email address, we've sent password reset instructions.
            </Text>
            <Text style={[styles.redirectText, { color: theme.textSecondary }]}>
              Redirecting to sign in...
            </Text>
          </View>
        ) : (
          // Reset Password Form
          <View style={styles.formContainer}>
            <Text style={[styles.headerText, { color: theme.text }]}>
              Reset Password
            </Text>
            <Text style={[styles.subHeaderText, { color: theme.textSecondary }]}>
              Enter your email address and we'll send you instructions to reset your password.
            </Text>

            <FormInput
              label="Email"
              value={email}
              onChangeText={handleEmailChange}
              placeholder="Enter your email"
              keyboardType="email-address"
              icon="mail-outline"
              error={emailError}
              touched={touched}
              onBlur={handleBlur}
              style={styles.emailInput}
            />

            <AuthButton
              title="Send Reset Link"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={!email}
            />
          </View>
        )}
      </View>

      <LoadingSpinner
        visible={isSubmitting}
        message="Sending reset link..."
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('6%'),
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: wp('2%'),
    marginTop: hp('4%'),
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp('10%'),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: hp('4%'),
  },
  logo: {
    width: wp('25%'),
    height: wp('25%'),
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  headerText: {
    fontSize: wp('7%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: wp('4%'),
    textAlign: 'center',
    marginBottom: hp('4%'),
    paddingHorizontal: wp('5%'),
  },
  emailInput: {
    marginBottom: hp('3%'),
  },
  successContainer: {
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  successTitle: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
  },
  successText: {
    fontSize: wp('4%'),
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
  redirectText: {
    fontSize: wp('3.8%'),
    fontStyle: 'italic',
    marginTop: hp('3%'),
  },
});
