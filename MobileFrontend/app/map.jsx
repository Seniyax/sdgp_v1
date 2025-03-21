import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

import LoadingSpinner from '../../components/LoadingSpinner';
import { useTheme } from '../../context/ThemeContext';
// import { reservationAPI } from '../../services/api'; // Uncomment when API is ready

// Screen dimensions
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// Mock data for reservation locations
const mockReservations = {
  '1': {
    id: '1',
    venue: {
      id: '101',
      name: 'Italian Bistro',
      address: '123 Main St, New York, NY 10001',
      coordinates: { latitude: 40.7128, longitude: -74.0060 }
    }
  },
  '2': {
    id: '2',
    venue: {
      id: '102',
      name: 'Sushi Place',
      address: '456 Broadway, New York, NY 10012',
      coordinates: { latitude: 40.7228, longitude: -73.9971 }
    }
  }
};

export default function ReservationMapScreen() {
  const { theme, isDarkMode } = useTheme();
  const params = useLocalSearchParams();
  const { id } = params;
  
  // State
  const [reservation, setReservation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationPermission, setLocationPermission] = useState(false);
  
  // Load reservation details and request location permission on mount
  useEffect(() => {
    fetchReservationDetails();
    requestLocationPermission();
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
  
  // Request location permission
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        setLocationPermission(true);
        getCurrentLocation();
      } else {
        setLocationPermission(false);
        Alert.alert(
          'Location Permission',
          'Location permission is required to show your current location on the map.'
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLocationPermission(false);
    }
  };
  
  // Get current location
  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });
      
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };
  
  // Handle get directions
  const handleGetDirections = () => {
    if (!reservation?.venue?.coordinates) {
      Alert.alert('Error', 'Venue coordinates not available.');
      return;
    }
    
    const { latitude, longitude } = reservation.venue.coordinates;
    const label = encodeURIComponent(reservation.venue.name);
    
    let url;
    if (Platform.OS === 'ios') {
      url = `maps:0,0?q=${label}@${latitude},${longitude}`;
    } else {
      url = `geo:0,0?q=${latitude},${longitude}(${label})`;
    }
    
    Linking.openURL(url);
  };
  
  // Get initial region for map
  const getInitialRegion = () => {
    if (reservation?.venue?.coordinates) {
      const { latitude, longitude } = reservation.venue.coordinates;
      
      return {
        latitude,
        longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      };
    }
    
    // Default to NYC if no coordinates
    return {
      latitude: 40.7128,
      longitude: -74.0060,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    };
  };

  if (loading || !reservation) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <LoadingSpinner visible={true} message="Loading map..." />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Map */}
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={getInitialRegion()}
        showsUserLocation={locationPermission}
        showsMyLocationButton={locationPermission}
        showsCompass
        showsScale
      >
        {/* Venue Marker */}
        {reservation?.venue?.coordinates && (
          <Marker
            coordinate={reservation.venue.coordinates}
            title={reservation.venue.name}
            description={reservation.venue.address}
            pinColor="#420F54"
          />
        )}
      </MapView>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: 'rgba(255, 255, 255, 0.9)' }]}
          onPress={() => router.back()}
        >
          <Ionicons 
            name="arrow-back" 
            size={wp('6%')} 
            color="#333" 
          />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          Map View
        </Text>
      </View>
      
      {/* Venue Info Card */}
      <View style={[styles.venueCard, { backgroundColor: theme.card }]}>
        <View style={styles.venueInfo}>
          <Text style={[styles.venueName, { color: theme.text }]}>
            {reservation.venue.name}
          </Text>
          
          <Text style={[styles.venueAddress, { color: theme.textSecondary }]}>
            {reservation.venue.address}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[styles.directionsButton, { backgroundColor: theme.primary }]}
          onPress={handleGetDirections}
        >
          <Ionicons name="navigate" size={wp('5%')} color="white" />
          <Text style={styles.directionsText}>
            Directions
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? hp('5%') : hp('2%'),
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
  },
  backButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  headerTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: 'transparent',
    marginLeft: wp('4%'),
  },
  venueCard: {
    position: 'absolute',
    bottom: hp('4%'),
    left: wp('4%'),
    right: wp('4%'),
    borderRadius: wp('4%'),
    padding: wp('4%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  venueInfo: {
    flex: 1,
    marginRight: wp('3%'),
  },
  venueName: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    marginBottom: hp('0.5%'),
  },
  venueAddress: {
    fontSize: wp('3.5%'),
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('5%'),
  },
  directionsText: {
    color: 'white',
    fontSize: wp('3.5%'),
    fontWeight: '500',
    marginLeft: wp('1%'),
  },
});
