import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Share,
  Platform,
  Linking
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { format } from 'date-fns';
import QRCode from 'react-native-qrcode-svg';

import LoadingSpinner from '../../components/LoadingSpinner';
import TableMap from '../../components/TableMap';
import { useTheme } from '../../context/ThemeContext';
// import { reservationAPI } from '../../services/api'; // Uncomment when API is ready

// Mock data for reservation details
const mockReservations = {
  '1': {
    id: '1',
    venue: {
      id: '101',
      name: 'Italian Bistro',
      imageUrl: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      address: '123 Main St, New York, NY 10001',
      phone: '+1 (212) 555-1234',
      coordinates: { latitude: 40.7128, longitude: -74.0060 }
    },
    date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    partySize: 2,
    status: 'confirmed',
    table: { id: 'T1', label: 'A1' },
    notes: 'Window table requested',
    confirmationCode: 'IB12345',
    createdAt: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
  },
  '2': {
    id: '2',
    venue: {
      id: '102',
      name: 'Sushi Place',
      imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      address: '456 Broadway, New York, NY 10012',
      phone: '+1 (212) 555-5678',
      coordinates: { latitude: 40.7228, longitude: -73.9971 }
    },
    date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    partySize: 4,
    status: 'pending',
    table: { id: 'T2', label: 'B3' },
    notes: '',
    confirmationCode: 'SP67890',
    createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
  },
};

// Mock table layout
const mockTables = [
  {
    id: 'T1',
    label: 'A1',
    type: 'small',
    status: 'selected',
    x: 100,
    y: 150,
    width: 40,
    height: 40,
    capacity: 2
  },
  {
    id: 'T2',
    label: 'A2',
    type: 'small',
    status: 'available',
    x: 200,
    y: 150,
    width: 40,
    height: 40,
    capacity: 2
  },
  {
    id: 'T3',
    label: 'B1',
    type: 'medium',
    status: 'reserved',
    x: 100,
    y: 250,
    width: 60,
    height: 40,
    capacity: 4
  },
  {
    id: 'T4',
    label: 'B2',
    type: 'medium',
    status: 'occupied',
    x: 200,
    y: 250,
    width: 60,
    height: 40,
    capacity: 4
  },
  {
    id: 'T5',
    label: 'C1',
    type: 'large',
    status: 'available',
    x: 150,
    y: 350,
    width: 80,
    height: 50,
    capacity: 6
  },
];

export default function ReservationDetailsScreen() {
  const { theme, isDarkMode } = useTheme();
  const params = useLocalSearchParams();
  const { id } = params;
  
  // State
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Load reservation details on mount
  useEffect(() => {
    fetchReservationDetails();
  }, [id]);
  
  // Fetch reservation details
  const fetchReservationDetails = async () => {
    setLoading(true);
    
    try {
      // In a real app, you would call the API
      // const response = await reservationAPI.getReservation(id);
      // setReservation(response.data);
      
      // For now, use mock data
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (mockReservations[id]) {
        setReservation(mockReservations[id]);
      } else {
        Alert.alert('Error', 'Reservation not found.');
        router.back();
      }
    } catch (error) {
      console.error('Error fetching reservation details:', error);
      Alert.alert('Error', 'Failed to load reservation details. Please try again.');
      router.back();
    } finally {
      setLoading(false);
    }
  };
  
  // Handle reservation cancellation
  const handleCancelReservation = () => {
    Alert.alert(
      'Cancel Reservation',
      `Are you sure you want to cancel your reservation at ${reservation.venue.name}?`,
      [
        {
          text: 'No',
          style: 'cancel'
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            
            try {
              // In a real app, you would call the API
              // await reservationAPI.cancelReservation(id);
              
              // For now, update local state
              // Simulate API delay
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              setReservation(prev => ({
                ...prev,
                status: 'cancelled'
              }));
              
              Alert.alert('Success', 'Reservation cancelled successfully.');
            } catch (error) {
              console.error('Error cancelling reservation:', error);
              Alert.alert('Error', 'Failed to cancel reservation. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };
  
  // Handle modifying reservation
  const handleModifyReservation = () => {
    router.push({
      pathname: '/reservations/create',
      params: { 
        id: reservation.id,
        venueId: reservation.venue.id,
        edit: true
      }
    });
  };
  
  // Handle sharing reservation
  const handleShareReservation = async () => {
    try {
      const formattedDate = format(new Date(reservation.date), 'EEEE, MMMM d, yyyy');
      const formattedTime = format(new Date(reservation.date), 'h:mm a');
      
      const shareMessage = `I have a reservation at ${reservation.venue.name} on ${formattedDate} at ${formattedTime}. My confirmation code is ${reservation.confirmationCode}.`;
      
      await Share.share({
        message: shareMessage,
        title: 'My Reservation'
      });
    } catch (error) {
      console.error('Error sharing reservation:', error);
    }
  };
  
  // Handle calling the venue
  const handleCallVenue = () => {
    if (reservation.venue.phone) {
      Linking.openURL(`tel:${reservation.venue.phone}`);
    }
  };
  
  // Handle opening map to venue
  const handleOpenMap = () => {
    const { coordinates, address, name } = reservation.venue;
    
    if (coordinates) {
      const { latitude, longitude } = coordinates;
      const label = encodeURIComponent(name);
      
      let url;
      if (Platform.OS === 'ios') {
        url = `maps:0,0?q=${label}@${latitude},${longitude}`;
      } else {
        url = `geo:0,0?q=${latitude},${longitude}(${label})`;
      }
      
      Linking.openURL(url);
    } else if (address) {
      // If no coordinates, try using the address
      const encodedAddress = encodeURIComponent(address);
      
      let url;
      if (Platform.OS === 'ios') {
        url = `maps:0,0?q=${encodedAddress}`;
      } else {
        url = `geo:0,0?q=${encodedAddress}`;
      }
      
      Linking.openURL(url);
    }
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return theme.success;
      case 'pending':
        return '#FFC107';
      case 'cancelled':
        return theme.error;
      case 'completed':
        return '#757575';
      default:
        return theme.textSecondary;
    }
  };

  if (loading || !reservation) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <LoadingSpinner visible={true} message="Loading reservation details..." />
      </View>
    );
  }

  // Format date and time
  const formattedDate = format(new Date(reservation.date), 'EEEE, MMMM d, yyyy');
  const formattedTime = format(new Date(reservation.date), 'h:mm a');
  const createdDate = format(new Date(reservation.createdAt), 'MMMM d, yyyy');

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={styles.header}>
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
        
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Reservation Details
        </Text>
        
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShareReservation}
        >
          <Ionicons 
            name="share-outline" 
            size={wp('6%')} 
            color={theme.primary} 
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Venue Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: reservation.venue.imageUrl }}
            style={styles.venueImage}
            resizeMode="cover"
          />
          <View style={[
            styles.statusBadge,
            { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.9)' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: getStatusColor(reservation.status) }
            ]}>
              {reservation.status.toUpperCase()}
            </Text>
          </View>
        </View>
        
        {/* Venue Details */}
        <View style={[styles.detailsCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.venueName, { color: theme.text }]}>
            {reservation.venue.name}
          </Text>
          
          <View style={styles.detailRow}>
            <Ionicons
              name="calendar-outline"
              size={wp('5%')}
              color={theme.primary}
              style={styles.detailIcon}
            />
            <Text style={[styles.detailText, { color: theme.text }]}>
              {formattedDate}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons
              name="time-outline"
              size={wp('5%')}
              color={theme.primary}
              style={styles.detailIcon}
            />
            <Text style={[styles.detailText, { color: theme.text }]}>
              {formattedTime}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons
              name="people-outline"
              size={wp('5%')}
              color={theme.primary}
              style={styles.detailIcon}
            />
            <Text style={[styles.detailText, { color: theme.text }]}>
              {reservation.partySize} {reservation.partySize === 1 ? 'Person' : 'People'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons
              name="grid-outline"
              size={wp('5%')}
              color={theme.primary}
              style={styles.detailIcon}
            />
            <Text style={[styles.detailText, { color: theme.text }]}>
              Table {reservation.table.label}
            </Text>
          </View>
          
          {reservation.notes ? (
            <View style={styles.detailRow}>
              <Ionicons
                name="document-text-outline"
                size={wp('5%')}
                color={theme.primary}
                style={styles.detailIcon}
              />
              <Text style={[styles.detailText, { color: theme.text }]}>
                Notes: {reservation.notes}
              </Text>
            </View>
          ) : null}
          
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          
          <View style={styles.detailRow}>
            <Ionicons
              name="location-outline"
              size={wp('5%')}
              color={theme.primary}
              style={styles.detailIcon}
            />
            <TouchableOpacity
              style={styles.addressContainer}
              onPress={handleOpenMap}
            >
              <Text style={[styles.detailText, { color: theme.text }]}>
                {reservation.venue.address}
              </Text>
              <Text style={[styles.getDirections, { color: theme.primary }]}>
                Get Directions
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons
              name="call-outline"
              size={wp('5%')}
              color={theme.primary}
              style={styles.detailIcon}
            />
            <TouchableOpacity onPress={handleCallVenue}>
              <Text style={[styles.detailText, { color: theme.primary }]}>
                {reservation.venue.phone}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          
          {/* QR Code */}
          <View style={styles.qrCodeContainer}>
            <Text style={[styles.qrTitle, { color: theme.text }]}>
              Confirmation Code
            </Text>
            <View style={[
              styles.qrCodeBox,
              { backgroundColor: isDarkMode ? '#FFFFFF' : '#F5F5F5' }
            ]}>
              <QRCode
                value={reservation.confirmationCode}
                size={wp('40%')}
                backgroundColor={isDarkMode ? '#FFFFFF' : '#F5F5F5'}
                color="#000000"
              />
            </View>
            <Text style={[styles.confirmationCode, { color: theme.text }]}>
              {reservation.confirmationCode}
            </Text>
            <Text style={[styles.qrHint, { color: theme.textSecondary }]}>
              Show this code when you arrive at the venue
            </Text>
          </View>
          
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          
          {/* Table Map */}
          <View style={styles.mapContainer}>
            <Text style={[styles.mapTitle, { color: theme.text }]}>
              Table Location
            </Text>
            <TableMap
              tables={mockTables}
              selectedTableId={reservation.table.id}
              interactive={false}
            />
          </View>
        </View>
        
        {/* Booking Info */}
        <View style={[styles.bookingInfoCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.bookingInfoTitle, { color: theme.text }]}>
            Booking Information
          </Text>
          <View style={styles.bookingInfoRow}>
            <Text style={[styles.bookingInfoLabel, { color: theme.textSecondary }]}>
              Reservation ID:
            </Text>
            <Text style={[styles.bookingInfoValue, { color: theme.text }]}>
              {reservation.id}
            </Text>
          </View>
          <View style={styles.bookingInfoRow}>
            <Text style={[styles.bookingInfoLabel, { color: theme.textSecondary }]}>
              Date Booked:
            </Text>
            <Text style={[styles.bookingInfoValue, { color: theme.text }]}>
              {createdDate}
            </Text>
          </View>
        </View>
        
        {/* Action Buttons */}
        {reservation.status.toLowerCase() === 'confirmed' || reservation.status.toLowerCase() === 'pending' ? (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.modifyButton,
                { borderColor: theme.primary }
              ]}
              onPress={handleModifyReservation}
            >
              <Ionicons
                name="pencil"
                size={wp('5%')}
                color={theme.primary}
                style={styles.actionButtonIcon}
              />
              <Text style={[styles.actionButtonText, { color: theme.primary }]}>
                Modify
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.cancelButton,
                { borderColor: theme.error }
              ]}
              onPress={handleCancelReservation}
            >
              <Ionicons
                name="close"
                size={wp('5%')}
                color={theme.error}
                style={styles.actionButtonIcon}
              />
              <Text style={[styles.actionButtonText, { color: theme.error }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
      
      <LoadingSpinner visible={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? hp('6%') : hp('2%'),
    paddingBottom: hp('2%'),
    paddingHorizontal: wp('4%'),
  },
  backButton: {
    padding: wp('2%'),
  },
  headerTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
  },
  shareButton: {
    padding: wp('2%'),
  },
  scrollContainer: {
    paddingBottom: hp('4%'),
  },
  imageContainer: {
    position: 'relative',
  },
  venueImage: {
    width: '100%',
    height: hp('25%'),
  },
  statusBadge: {
    position: 'absolute',
    top: hp('2%'),
    right: wp('4%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('10%'),
  },
  statusText: {
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
  },
  detailsCard: {
    margin: wp('4%'),
    borderRadius: wp('4%'),
    padding: wp('4%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  venueName: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    marginBottom: hp('2%'),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  detailIcon: {
    marginRight: wp('3%'),
  },
  detailText: {
    fontSize: wp('4%'),
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: hp('2%'),
  },
  addressContainer: {
    flex: 1,
  },
  getDirections: {
    fontSize: wp('3.5%'),
    fontWeight: '600',
    marginTop: hp('0.5%'),
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginVertical: hp('1%'),
  },
  qrTitle: {
    fontSize: wp('5%'),
    fontWeight: '600',
    marginBottom: hp('1.5%'),
  },
  qrCodeBox: {
    padding: wp('5%'),
    borderRadius: wp('4%'),
  },
  confirmationCode: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginTop: hp('1.5%'),
  },
  qrHint: {
    fontSize: wp('3.5%'),
    marginTop: hp('0.5%'),
  },
  mapContainer: {
    marginTop: hp('1%'),
  },
  mapTitle: {
    fontSize: wp('5%'),
    fontWeight: '600',
    marginBottom: hp('1.5%'),
  },
  bookingInfoCard: {
    marginHorizontal: wp('4%'),
    marginBottom: wp('4%'),
    borderRadius: wp('4%'),
    padding: wp('4%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingInfoTitle: {
    fontSize: wp('5%'),
    fontWeight: '600',
    marginBottom: hp('1.5%'),
  },
  bookingInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  bookingInfoLabel: {
    fontSize: wp('4%'),
  },
  bookingInfoValue: {
    fontSize: wp('4%'),
    fontWeight: '500',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp('4%'),
    marginBottom: hp('2%'),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: wp('3%'),
    paddingVertical: hp('1.5%'),
    width: '48%',
  },
  actionButtonIcon: {
    marginRight: wp('2%'),
  },
  actionButtonText: {
    fontSize: wp('4%'),
    fontWeight: '600',
  },
});
