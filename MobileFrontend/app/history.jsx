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


