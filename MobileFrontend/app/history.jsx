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
  
