import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import styles from './SignInScreenStyles';

const { width } = Dimensions.get('window');

export default function SignInScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>SIGN IN OR SIGN UP</Text>
      </View>
      
      <View style={styles.illustrationContainer}>
        <Image
          source={require('./assets/clock-illustration.png')}
          style={[styles.illustration, { width: width * 0.8, height: width * 0.8 }]}
          resizeMode="contain"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.emailButton} onPress={() => {}}>
          <Text style={styles.emailButtonText}>Sign up with email</Text>
        </TouchableOpacity>

        <Text style={styles.dividerText}>or use social sign up</Text>

        <TouchableOpacity style={styles.socialButton} onPress={() => {}}>
          <Image
            source={require('./assets/google-icon.png')}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} onPress={() => {}}>
          <Image
            source={require('./assets/facebook-icon.png')}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Continue with Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} onPress={() => {}}>
          <Image
            source={require('./assets/apple-icon.png')}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Continue with Apple</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text style={styles.signInText} onPress={() => {}}>
            Sign in
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}