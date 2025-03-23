import React from 'react';
import { 
  StyleSheet, 
  View, 
  ActivityIndicator, 
  Text, 
  Modal 
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../contexts/ThemeContext';

const LoadingSpinner = ({ 
  visible = false, 
  message = 'Loading...', 
  overlay = true,
  size = 'large',
  fullScreen = false
}) => {
  const { theme } = useTheme();
  
  if (!visible) return null;
  
  const spinner = (
    <View style={[
      styles.container, 
      fullScreen && styles.fullScreen,
      { backgroundColor: overlay ? 'rgba(0, 0, 0, 0.4)' : 'transparent' }
    ]}>
      <View style={[
        styles.spinnerContainer,
        { backgroundColor: theme.background }
      ]}>
        <ActivityIndicator 
          size={size} 
          color={theme.primary} 
          style={styles.spinner} 
        />
        {message && (
          <Text style={[styles.message, { color: theme.text }]}>
            {message}
          </Text>
        )}
      </View>
    </View>
  );
  
  if (overlay) {
    return (
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={() => {}}
      >
        {spinner}
      </Modal>
    );
  }
  
  return spinner;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  fullScreen: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  spinnerContainer: {
    padding: wp('5%'),
    borderRadius: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: wp('40%'),
  },
  spinner: {
    marginBottom: hp('1%'),
  },
  message: {
    fontSize: wp('4%'),
    fontWeight: '500',
    textAlign: 'center',
  }
});

export default LoadingSpinner;
