import React, { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  SafeAreaView,
  ActivityIndicator,
  Image,
  RefreshControl,
  Alert
} from 'react-native';
import styles from '../styles/historystyle'; // Import the styles from historystyle.js
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const History = () => {
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('active'); // Default to active tab
  const [userId, setUserId] = useState(null);
    // Configure axios with base URL and timeout
    const api = axios.create({
      baseURL: 'http://10.0.2.2:3000/api',
      timeout: 10000,
    });
  
    // Get user ID from AsyncStorage when component mounts
    useEffect(() => {
      const getUserId = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem('userId');
          if (storedUserId) {
            setUserId(storedUserId);
            console.log('Retrieved userId from storage:', storedUserId);
          } else {
            // For testing purposes - if no userId in storage, use the hardcoded one
            setUserId('86b0fb25-e1f7-41a1-8338-fee52ca2669d');
            console.log('No userId in storage, using default');
          }
        } catch (err) {
          console.error('Error getting userId from AsyncStorage:', err);
          // Fall back to hardcoded ID
          setUserId('86b0fb25-e1f7-41a1-8338-fee52ca2669d');
        }
      };
  
      getUserId();
    }, []);

  // Handle back button press using Expo Router
  const handleBackPress = () => {
    router.back();
    // Alternative: navigate directly to home
    // router.push('/home');
  };

  // Helper function to format date consistently
  const parseDate = (dateString) => {
    if (!dateString) return { formattedDate: '', formattedTime: '' };
    
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return {
          formattedDate: date.toISOString().split('T')[0],
          formattedTime: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
    } catch (err) {
      console.warn(`Error parsing date: ${dateString}`, err);
    }
    
    return { 
      formattedDate: '', 
      formattedTime: '' 
    };
  };
  // Process reservation data
  const processReservationData = (data) => {
    if (!Array.isArray(data)) {
      console.warn('Expected array for reservation data, got:', typeof data);
      return [];
    }
    
    return data.map(item => {
      // Handle date parsing
      const { formattedDate, formattedTime } = parseDate(item.date || item.start_time);
      
      // Normalize status to lowercase for consistent filtering
      let normalizedStatus = item.status ? item.status.toLowerCase() : "pending";
      
      // Map status values to expected filter values
      switch (normalizedStatus) {
        case 'active':
          normalizedStatus = 'pending';
          break;
        case 'completed':
          normalizedStatus = 'completed';
          break;
        case 'failed':
          normalizedStatus = 'failed';
          break;
        default:
          normalizedStatus = 'pending';
      }
      return {
        id: item.id || String(Math.random()),
        venueName: item.venueName || item.venue_name || "Unknown Venue", 
        date: formattedDate || item.date || '',
        time: formattedTime || item.time || '',
        tableNumber: item.tableNumber || item.table_number || item.roomNumber || 'N/A',
        guests: item.guests || item.attendees || 0,
        status: normalizedStatus,
        originalStatus: item.status || "pending", // Keep original status for display
        imageUrl: item.imageUrl || item.image_url || null,
        venueType: item.venueType || item.venue_type || "Restaurant",
        totalAmount: item.totalAmount || item.total_amount || "$0.00",
        orderItems: item.orderItems || item.order_items || [],
        roomNumber: item.roomNumber || item.room_number || 'N/A',
        attendees: item.attendees || 0,
        duration: item.duration || 'N/A',
        equipment: item.equipment || [],
        userId: item.userId || item.user_id // Store the userId related to this reservation
      };
    });
  };

  // Mock fetch for testing with your provided data
  const fetchReservationHistoryMock = async () => {
    setLoading(true);
    setError(null);
    try {
      // This is your provided data
      const mockData = [
        {"attendees": 0, "date": "", "duration": "N/A", "equipment": [], "guests": 0, "id": 41, "imageUrl": null, "orderItems": [], "roomNumber": "N/A", "status": "Completed", "tableNumber": "N/A", "time": "", "totalAmount": "$0.00", "userId": undefined, "venueName": "Unknown Venue", "venueType": "Restaurant"},
        {"attendees": 0, "date": "", "duration": "N/A", "equipment": [], "guests": 0, "id": 43, "imageUrl": null, "orderItems": [], "roomNumber": "N/A", "status": "Completed", "tableNumber": "N/A", "time": "", "totalAmount": "$0.00", "userId": undefined, "venueName": "Unknown Venue", "venueType": "Restaurant"},
        // Add more mockData as needed
        {"attendees": 0, "date": "", "duration": "N/A", "equipment": [], "guests": 0, "id": 51, "imageUrl": null, "orderItems": [], "roomNumber": "N/A", "status": "Active", "tableNumber": "N/A", "time": "", "totalAmount": "$0.00", "userId": undefined, "venueName": "Unknown Venue", "venueType": "Restaurant"}
      ];
      
      const processedData = processReservationData(mockData);
      console.log('Processed reservation data:', processedData);
      setReservations(processedData);
      
    } catch (err) {
      console.error('Error fetching reservation history:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch reservation history from API
  const fetchReservationHistory = async () => {
    if (!userId) {
      console.log('No userId available yet, waiting...');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching reservation history for userId:', userId);
      
      // For testing purposes, use the mock data
      // Comment this out and uncomment the API call when ready to use the real API
      return fetchReservationHistoryMock();
      
      // Use the direct URL you provided with the userId
      /*
      const response = await axios.post('http://10.0.2.2:3000/api/reservations/history', {
        userId: userId
      });
      
      console.log('API Response:', response.data);
      
      if (response.data && response.data.success) {
        const processedData = processReservationData(response.data.reservationHistory || []);
        console.log('Processed reservation data:', processedData);
        setReservations(processedData);
        
        // If we got no data, show a message
        if (processedData.length === 0) {
          Alert.alert(
            'No Reservations Found',
            `No reservation history found for user ID: ${userId}`,
            [{ text: 'OK' }]
          );
        }
      } else {
        console.log('API response format unexpected:', response.data);
        throw new Error(response.data?.message || 'Failed to fetch reservation history');
      }
      */
    } catch (err) {
      console.error('Error fetching reservation history:', err);
      
      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        console.log('Server error status:', status);
        console.log('Server error data:', err.response.data);
        setError(`Server error (${status}): ${err.response.data?.message || err.message}`);
      } else if (err.request) {
        // Request made but no response received
        console.log('No response received from server');
        setError('Network error. Please check your internet connection.');
      } else {
        // Other errors
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch when component mounts and when userId changes
  useEffect(() => {
    if (userId) {
      fetchReservationHistory();
    }
  }, [userId]);

  // Format date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      // Try to parse as ISO date
      const date = new Date(dateString);
      
      // Check if date is valid
      if (!isNaN(date.getTime())) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
      }
      
      // If not a valid date object but has a string value, return the string
      return dateString;
    } catch (err) {
      console.warn('Error formatting date:', dateString);
      return dateString || 'N/A'; // Return original string or N/A if null/undefined
    }
  };



