import React, { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView,
  Alert,
  TextInput
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styles from '../styles/paymentsstyle';  // Import the styles from paymentsstyle.js

const Payments = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { reservationId, amount } = params;

  // States
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true); // Start as initializing
  const [paymentData, setPaymentData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('PENDING');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [error, setError] = useState(null);
  
  // Remove token dependency - set a dummy token for testing
  const token = 'dummy-token-for-testing';

  // Initialize with mock data directly instead of API call
  useEffect(() => {
    const mockInitialization = () => {
      setTimeout(() => {
        // Mock payment data that would normally come from the API
        setPaymentData({
          paymentRecord: {
            order_id: 'ORD-' + Math.floor(Math.random() * 1000000),
            reservation_id: reservationId || 'RSV-' + Math.floor(Math.random() * 1000000),
            amount: amount || 2500,
            currency: 'LKR',
            status: 'PENDING'
          }
        });
        setInitializing(false);
      }, 1000); // Simulate loading for 1 second
    };
    
    mockInitialization();
  }, [reservationId, amount]);

  // Process payment - mock implementation
  const processPayment = async () => {
    if (!validateCardDetails()) {
      Alert.alert('Invalid Card', 'Please check your card details and try again.');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setPaymentStatus('COMPLETED');
      setLoading(false);
      Alert.alert('Success', 'Payment completed successfully!');
      setTimeout(() => {
        // Just show success without navigating away
        setLoading(false);
      }, 2000);
    }, 1500);
  };

  // Validate card details
  const validateCardDetails = () => {
    const { number, expiry, cvc, name } = cardDetails;
    
    // Simple validation - would be more robust in production
    if (number.replace(/\s/g, '').length !== 16) return false;
    if (expiry.length !== 5 || !expiry.includes('/')) return false;
    if (cvc.length !== 3) return false;
    if (name.trim().length < 3) return false;
    
    return true;
  };

  // Handle card number formatting
  const handleCardNumberChange = (text) => {
    // Format with spaces every 4 digits
    const formatted = text.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    setCardDetails({ ...cardDetails, number: formatted });
  };

  // Handle expiry date formatting
  const handleExpiryChange = (text) => {
    const cleaned = text.replace(/\D/g, '');
    
    if (cleaned.length <= 2) {
      setCardDetails({ ...cardDetails, expiry: cleaned });
    } else {
      const month = cleaned.substring(0, 2);
      const year = cleaned.substring(2, 4);
      setCardDetails({ ...cardDetails, expiry: `${month}/${year}` });
    }
  };

  // Cancel payment
  const cancelPayment = () => {
    Alert.alert(
      'Cancel Payment',
      'Are you sure you want to cancel this payment?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          onPress: () => {
            // Just simulate cancellation locally
            setPaymentStatus('CANCELED');
          } 
        }
      ]
    );
  };

  if (initializing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#420F54" />
          <Text style={styles.loadingText}>Initializing payment...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={hp('8%')} color="#FF6347" />
          <Text style={styles.errorTitle}>Payment Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => setInitializing(true)}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Payment Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.pageTitle}>Payment Details</Text>
          
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Total Amount:</Text>
            <Text style={styles.amount}>
              {paymentData?.paymentRecord?.currency || 'LKR'} {paymentData?.paymentRecord?.amount || amount || 2500}
            </Text>
          </View>
          
          {paymentData?.paymentRecord?.reservation_id && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Reservation ID:</Text>
              <Text style={styles.infoValue}>{paymentData.paymentRecord.reservation_id}</Text>
            </View>
          )}
          
          {paymentData?.paymentRecord?.order_id && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order ID:</Text>
              <Text style={styles.infoValue}>{paymentData.paymentRecord.order_id}</Text>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <View style={[
              styles.statusBadge,
              paymentStatus === 'COMPLETED' ? styles.statusCompleted :
              paymentStatus === 'FAILED' ? styles.statusFailed :
              paymentStatus === 'CANCELED' ? styles.statusCanceled :
              styles.statusPending
            ]}>
              <Text style={styles.statusText}>{paymentStatus}</Text>
            </View>
          </View>
        </View>
        
        {/* Payment Form - Now directly showing card form without method selection */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Card Information</Text>
          
          {/* Card Number */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="card-outline" size={wp('5%')} color="#420F54" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                maxLength={19} // 16 digits + 3 spaces
                value={cardDetails.number}
                onChangeText={handleCardNumberChange}
              />
            </View>
          </View>
          
          {/* Expiry and CVC */}
          <View style={styles.rowInputs}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: wp('2%') }]}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="calendar-outline" size={wp('5%')} color="#420F54" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  keyboardType="numeric"
                  maxLength={5}
                  value={cardDetails.expiry}
                  onChangeText={handleExpiryChange}
                />
              </View>
            </View>
            
            <View style={[styles.inputContainer, { flex: 1, marginLeft: wp('2%') }]}>
              <Text style={styles.inputLabel}>CVC</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={wp('5%')} color="#420F54" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                  value={cardDetails.cvc}
                  onChangeText={(text) => setCardDetails({ ...cardDetails, cvc: text })}
                />
              </View>
            </View>
          </View>
          
          {/* Cardholder Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={wp('5%')} color="#420F54" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={cardDetails.name}
                onChangeText={(text) => setCardDetails({ ...cardDetails, name: text })}
              />
            </View>
          </View>
          
          {/* Card Images */}
          <View style={styles.cardBrandsContainer}>
            <View style={[styles.cardBrandPlaceholder, {backgroundColor: '#1A1F71'}]}>
              <Text style={styles.cardBrandText}>VISA</Text>
            </View>
            <View style={[styles.cardBrandPlaceholder, {backgroundColor: '#FF5F00'}]}>
              <Text style={styles.cardBrandText}>MC</Text>
            </View>
            <View style={[styles.cardBrandPlaceholder, {backgroundColor: '#2E77BC'}]}>
              <Text style={styles.cardBrandText}>AMEX</Text>
            </View>
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.payButton}
            onPress={processPayment}
            disabled={loading || paymentStatus === 'COMPLETED'}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.payButtonText}>
                {paymentStatus === 'COMPLETED' ? 'Payment Complete' : 'Pay Now'}
              </Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={cancelPayment}
            disabled={loading || paymentStatus === 'COMPLETED'}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Payments;