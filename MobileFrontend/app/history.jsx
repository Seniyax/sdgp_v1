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
import { API_BASE_URL } from "@env";

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
    baseURL: `${API_BASE_URL}/api`,
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

  // Handle reservation item press to show modal
  const handleReservationPress = (item) => {
    setSelectedReservation(item);
    setModalVisible(true);
  };

  // Pull to refresh handler
  const handleRefresh = () => {
    setRefreshing(true);
    fetchReservationHistory();
  };

  // Filter reservations based on tab
  const filteredReservations = () => {
    // First filter by userId if we have it
    const userReservations = userId 
      ? reservations.filter(item => !item.userId || item.userId === userId)
      : reservations;
    
    // Then filter by status
    switch (activeTab) {
      case 'active':
        return userReservations.filter(item => 
          item.status === 'pending' || item.status === 'confirmed' || item.status === 'in_progress'
        );
      case 'completed':
        return userReservations.filter(item => item.status === 'completed');
      case 'failed':
        return userReservations.filter(item => 
          item.status === 'cancelled' || item.status === 'rejected' || item.status === 'failed'
        );
      default:
        return userReservations;
    }
  };

  // Render tab bar with counts
  const renderTabBar = () => {
    // Get counts for each category
    const activeCount = reservations.filter(item => 
      ['pending', 'confirmed', 'in_progress'].includes(item.status)
    ).length;
    
    const completedCount = reservations.filter(item => 
      item.status === 'completed'
    ).length;
    
    const failedCount = reservations.filter(item => 
      ['cancelled', 'rejected', 'failed'].includes(item.status)
    ).length;
    
    return (
      <View style={styles.tabBarContainer}>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'active' && styles.activeTabItem]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active <Text style={styles.countBadge}>({activeCount})</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'completed' && styles.activeTabItem]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed <Text style={styles.countBadge}>({completedCount})</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'failed' && styles.activeTabItem]}
          onPress={() => setActiveTab('failed')}
        >
          <Text style={[styles.tabText, activeTab === 'failed' && styles.activeTabText]}>
            Failed <Text style={styles.countBadge}>({failedCount})</Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render each reservation item
  const renderReservationItem = ({ item }) => {
    // Determine the status icon based on reservation status
    let statusIcon;
    let statusColor;

    switch (item.status) {
      case 'completed':
        statusIcon = 'checkmark-circle';
        statusColor = '#4CAF50';
        break;
      case 'confirmed':
        statusIcon = 'time';
        statusColor = '#2196F3';
        break;
      case 'pending':
        statusIcon = 'hourglass';
        statusColor = '#FF9800';
        break;
      case 'in_progress':
        statusIcon = 'refresh-circle';
        statusColor = '#03A9F4';
        break;
      case 'cancelled':
      case 'rejected':
      case 'failed':
        statusIcon = 'close-circle';
        statusColor = '#F44336';
        break;
      default:
        statusIcon = 'help-circle';
        statusColor = '#9E9E9E';
    }

    // Show the original status text for display purposes
    const displayStatus = item.originalStatus || item.status;

    return (
      <TouchableOpacity 
        style={styles.reservationItem}
        onPress={() => handleReservationPress(item)}
      >
        <View style={styles.reservationHeader}>
          <Text style={styles.venueName}>{item.venueName}</Text>
          <View style={styles.statusContainer}>
            <Ionicons name={statusIcon} size={wp('4%')} color={statusColor} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1).replace('_', ' ')}
            </Text>
          </View>
        </View>
        
        <View style={styles.reservationDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={wp('4%')} color="#420F54" />
            <Text style={styles.detailText}>{formatDate(item.date)}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={wp('4%')} color="#420F54" />
            <Text style={styles.detailText}>{item.time || 'N/A'}</Text>
          </View>
          
          {item.venueType === 'Restaurant' ? (
            <View style={styles.detailItem}>
              <Ionicons name="people-outline" size={wp('4%')} color="#420F54" />
              <Text style={styles.detailText}>{item.guests} guests</Text>
            </View>
          ) : (
            <View style={styles.detailItem}>
              <Ionicons name="business-outline" size={wp('4%')} color="#420F54" />
              <Text style={styles.detailText}>{item.venueType}</Text>
            </View>
          )}
        </View>

        <View style={styles.reservationFooter}>
          <Text style={styles.totalAmount}>{item.totalAmount}</Text>
          <Text style={styles.viewDetailsText}>View Details</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Render detailed modal for the selected reservation
  const renderDetailModal = () => {
    if (!selectedReservation) return null;
    
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={wp('6%')} color="#420F54" />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>{selectedReservation.venueName}</Text>
            
            {selectedReservation.imageUrl ? (
              <Image 
                source={{ uri: selectedReservation.imageUrl }} 
                style={styles.venueImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="image-outline" size={wp('10%')} color="#CCCCCC" />
              </View>
            )}
            
            <View style={styles.modalDetailsContainer}>
              <View style={styles.modalDetailRow}>
                <View style={styles.modalDetailItem}>
                  <Ionicons name="calendar" size={wp('5%')} color="#420F54" />
                  <View>
                    <Text style={styles.modalDetailLabel}>Date</Text>
                    <Text style={styles.modalDetailValue}>{formatDate(selectedReservation.date)}</Text>
                  </View>
                </View>
                
                <View style={styles.modalDetailItem}>
                  <Ionicons name="time" size={wp('5%')} color="#420F54" />
                  <View>
                    <Text style={styles.modalDetailLabel}>Time</Text>
                    <Text style={styles.modalDetailValue}>{selectedReservation.time || 'N/A'}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.modalDetailRow}>
                {selectedReservation.venueType === 'Restaurant' ? (
                  <>
                    <View style={styles.modalDetailItem}>
                      <Ionicons name="people" size={wp('5%')} color="#420F54" />
                      <View>
                        <Text style={styles.modalDetailLabel}>Guests</Text>
                        <Text style={styles.modalDetailValue}>{selectedReservation.guests}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.modalDetailItem}>
                      <Ionicons name="restaurant" size={wp('5%')} color="#420F54" />
                      <View>
                        <Text style={styles.modalDetailLabel}>Table</Text>
                        <Text style={styles.modalDetailValue}>{selectedReservation.tableNumber}</Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.modalDetailItem}>
                      <Ionicons name="business" size={wp('5%')} color="#420F54" />
                      <View>
                        <Text style={styles.modalDetailLabel}>Room</Text>
                        <Text style={styles.modalDetailValue}>{selectedReservation.roomNumber}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.modalDetailItem}>
                      <Ionicons name="people" size={wp('5%')} color="#420F54" />
                      <View>
                        <Text style={styles.modalDetailLabel}>Attendees</Text>
                        <Text style={styles.modalDetailValue}>{selectedReservation.attendees}</Text>
                      </View>
                    </View>
                  </>
                )}
              </View>
              
              <View style={styles.modalDetailRow}>
                <View style={styles.modalDetailItem}>
                  <Ionicons name="pricetag" size={wp('5%')} color="#420F54" />
                  <View>
                    <Text style={styles.modalDetailLabel}>Total</Text>
                    <Text style={styles.modalDetailValue}>{selectedReservation.totalAmount}</Text>
                  </View>
                </View>
                
                <View style={styles.modalDetailItem}>
                  <Ionicons name="information-circle" size={wp('5%')} color="#420F54" />
                  <View>
                    <Text style={styles.modalDetailLabel}>Status</Text>
                    <Text style={styles.modalDetailValue}>
                      {selectedReservation.originalStatus || selectedReservation.status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Main render
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header with back button and title */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Ionicons name="arrow-back" size={wp('6%')} color="#420F54" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reservation History</Text>
        {userId && (
          <Text style={styles.userIdText}>User: {userId.substring(0, 8)}...</Text>
        )}
      </View>
      
      {/* Tab Bar */}
      {renderTabBar()}
      
      {/* Error View */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Loading View */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#420F54" />
          <Text style={styles.loadingText}>Loading your reservation history...</Text>
        </View>
      ) : (
        <>
          {/* Empty state */}
          {filteredReservations().length === 0 && !error ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={wp('20%')} color="#420F54" />
              <Text style={styles.emptyText}>No {activeTab} reservations found</Text>
              {userId && (
                <Text style={styles.emptySubText}>User ID: {userId}</Text>
              )}
              <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
                <Text style={styles.retryButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={filteredReservations()}
              renderItem={renderReservationItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={['#420F54']}
                />
              }
            />
          )}
        </>
      )}
      
      {/* Render the detail modal */}
      {renderDetailModal()}
    </SafeAreaView>
  );
};

export default History;
