import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  Text, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../contexts/ThemeContext';

const FormInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  error,
  touched,
  onBlur,
  icon,
  autoCapitalize = 'none',
  multiline = false,
  numberOfLines = 1,
  style,
  maxLength,
  editable = true
}) => {
  const { theme, isDarkMode } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  };

  const borderColor = error ? theme.error : isFocused ? theme.primary : theme.border;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: theme.text }]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer, 
        { 
          borderColor,
          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : theme.card
        }
      ]}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={wp('5%')} 
            color={isFocused ? theme.primary : theme.textSecondary} 
            style={styles.icon} 
          />
        )}
        
        <TextInput
          style={[
            styles.input,
            { 
              color: theme.text,
              height: multiline ? hp('15%') : undefined
            }
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          textAlignVertical={multiline ? 'top' : 'center'}
          maxLength={maxLength}
          editable={editable}
        />
        
        {secureTextEntry && (
          <TouchableOpacity 
            onPress={togglePasswordVisibility}
            style={styles.passwordIcon}
          >
            <Ionicons 
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} 
              size={wp('6%')} 
              color={theme.textSecondary} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && touched && (
        <Text style={[styles.errorText, { color: theme.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: hp('2%'),
    width: '100%',
  },
  label: {
    fontSize: wp('4%'),
    marginBottom: hp('0.5%'),
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: wp('3%'),
    paddingHorizontal: wp('3%'),
    minHeight: hp('6%'),
  },
  icon: {
    marginRight: wp('2%'),
  },
  input: {
    flex: 1,
    fontSize: wp('4%'),
    paddingVertical: hp('1%'),
  },
  passwordIcon: {
    padding: wp('1%'),
  },
  errorText: {
    fontSize: wp('3.5%'),
    marginTop: hp('0.5%'),
    marginLeft: wp('1%'),
  }
});

export default FormInput;
