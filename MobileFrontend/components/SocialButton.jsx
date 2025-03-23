import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  View,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../contexts/ThemeContext';

const SocialButton = ({
  provider, // 'google', 'facebook', 'apple'
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle
}) => {
  const { theme, isDarkMode } = useTheme();
  
  // Provider-specific config
  const providerConfig = {
    google: {
      icon: 'logo-google',
      text: 'Continue with Google',
      color: isDarkMode ? '#ffffff' : '#DB4437',
      backgroundColor: isDarkMode ? '#333333' : '#ffffff'
    },
    facebook: {
      icon: 'logo-facebook',
      text: 'Continue with Facebook',
      color: '#1877F2',
      backgroundColor: isDarkMode ? '#333333' : '#ffffff'
    },
    apple: {
      icon: 'logo-apple',
      text: 'Continue with Apple',
      color: isDarkMode ? '#ffffff' : '#000000',
      backgroundColor: isDarkMode ? '#333333' : '#ffffff'
    }
  };
  
  const config = providerConfig[provider] || providerConfig.google;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { 
          backgroundColor: config.backgroundColor,
          borderColor: isDarkMode ? '#555555' : '#e0e0e0'
        },
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={theme.primary} 
        />
      ) : (
        <View style={styles.buttonContent}>
          <Ionicons 
            name={config.icon} 
            size={wp('6%')} 
            color={config.color} 
            style={styles.icon}
          />
          <Text 
            style={[
              styles.buttonText, 
              { color: isDarkMode ? theme.text : '#333333' },
              textStyle
            ]}
          >
            {config.text}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: hp('6%'),
    borderRadius: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    marginVertical: hp('1%'),
    borderWidth: 1,
    width: '100%'
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: wp('3%'),
  },
  buttonText: {
    fontSize: wp('4%'),
    fontWeight: '500',
  }
});

export default SocialButton;
