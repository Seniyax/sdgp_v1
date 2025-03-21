import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const { isAuthenticated, loading } = useAuth();
  const { theme, isDarkMode } = useTheme();

  // Animation values
  const logoOpacity = new Animated.Value(0);
  const logoScale = new Animated.Value(0.3);
  const textOpacity = new Animated.Value(0);

  useEffect(() => {
    // Start animations
    Animated.sequence([
      // Fade in and scale up logo
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 7,
          tension: 40,
          useNativeDriver: true
        })
      ]),

      // Fade in text
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      })
    ]).start();

    // Check authentication and navigate after delay
    const timer = setTimeout(() => {
      if (!loading) {
        if (isAuthenticated()) {
          router.replace('/home');
        } else {
          router.replace('/auth/signin');
        }
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [loading, isAuthenticated]);

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <StatusBar style="light" />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }]
          }
        ]}
      >
        {/* <Image
          source={require('../assets/logo-white.png')}
          style={styles.logo}
          resizeMode="contain"
        /> */}
      </Animated.View>

      <Animated.View style={[styles.titleContainer, { opacity: textOpacity }]}>
        <Text style={styles.title}>SLOTZI</Text>
        <Text style={styles.subtitle}>Find and book your perfect slot</Text>
      </Animated.View>

      {loading && <LoadingSpinner visible={true} overlay={false} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: hp('5%'),
  },
  logo: {
    width: wp('40%'),
    height: wp('40%'),
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: wp('12%'),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: hp('1%'),
  },
  subtitle: {
    fontSize: wp('4%'),
    color: 'rgba(255, 255, 255, 0.8)',
  }
});
