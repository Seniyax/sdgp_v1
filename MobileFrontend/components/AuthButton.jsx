import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  ActivityIndicator 
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../contexts/ThemeContext';

const AuthButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary', // primary, secondary, outlined
  style,
  textStyle,
  fullWidth = true
}) => {
  const { theme } = useTheme();
  
  // Determine background color based on variant and theme
  const getBackgroundColor = () => {
    if (disabled) return theme.border;
    
    switch (variant) {
      case 'primary':
        return theme.primary;
      case 'secondary':
        return theme.secondary;
      case 'outlined':
        return 'transparent';
      default:
        return theme.primary;
    }
  };
  
  // Determine text color based on variant and theme
  const getTextColor = () => {
    if (disabled) return '#999';
    
    switch (variant) {
      case 'primary':
      case 'secondary':
        return 'white';
      case 'outlined':
        return theme.primary;
      default:
        return 'white';
    }
  };
  
  // Determine border color and width based on variant
  const getBorderStyle = () => {
    switch (variant) {
      case 'outlined':
        return {
          borderWidth: 2,
          borderColor: disabled ? theme.border : theme.primary
        };
      default:
        return {};
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        getBorderStyle(),
        fullWidth ? styles.fullWidth : {},
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outlined' ? theme.primary : 'white'} 
        />
      ) : (
        <Text 
          style={[
            styles.buttonText, 
            { color: getTextColor() },
            textStyle
          ]}
        >
          {title}
        </Text>
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  fullWidth: {
    width: '100%',
  },
  buttonText: {
    fontSize: wp('4%'),
    fontWeight: '600',
    textAlign: 'center',
  }
});

export default AuthButton;
