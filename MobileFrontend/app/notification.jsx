import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl, 
  Animated,
  Alert,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { formatDistanceToNow } from 'date-fns';
import styles from '../styles/notificationstyle';
import { API_BASE_URL } from "@env";

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const router = useRouter();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  
  // Constants for API
  const API = `${API_BASE_URL}/api`;
  
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    
    // Animate the content when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/notifications`);
      
      if (response.data.success) {
        setNotifications(response.data.data);
        setError(null);
      } else {
        setError(response.data.message || 'Failed to fetch notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(`${API}/notifications/unread-count`);
      
      if (response.data.success) {
        setUnreadCount(response.data.data.count);
      }
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
    fetchUnreadCount();
  };
  
  const markAsRead = async (id) => {
    try {
      const response = await axios.put(`${API}/notifications/${id}/read`);
      
      if (response.data.success) {
        // Update the notification in local state
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => 
            notification.id === id 
              ? { ...notification, is_read: true, read_at: new Date().toISOString() } 
              : notification
          )
        );
        
        // Update unread count
        fetchUnreadCount();
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
      Alert.alert('Error', 'Failed to mark notification as read');
    }
  };
  
  const markAllAsRead = async () => {
    try {
      const response = await axios.put(`${API}/notifications/read-all`);
      
      if (response.data.success) {
        // Update all notifications to read in local state
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => ({ 
            ...notification, 
            is_read: true, 
            read_at: notification.read_at || new Date().toISOString() 
          }))
        );
        
        // Update unread count
        setUnreadCount(0);
        Alert.alert('Success', 'All notifications marked as read');
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      Alert.alert('Error', 'Failed to mark all notifications as read');
    }
  };
  
  const handleNotificationPress = (notification) => {
    // If notification is not read, mark it as read
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    
    // Handle different notification types
    if (notification.type === 'New Reservation' && notification.reservation) {
      // Navigate to reservation details
      router.push(`/reservations/${notification.reservation.id}`);
    } else if (notification.type === 'Cancelled' && notification.reservation) {
      // Navigate to reservation history or details
      router.push(`/reservations/${notification.reservation.id}`);
    } else if (notification.type === 'Promotional') {
      // Navigate to promotions page
      router.push('/promotions');
    } else {
      // Default action for other notification types
      Alert.alert('Notification', notification.message);
    }
  };
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'New Reservation':
        return 'calendar-outline';
      case 'Cancelled':
        return 'close-circle-outline';
      case 'Reminder':
        return 'alarm-outline';
      case 'Promotional':
        return 'megaphone-outline';
      default:
        return 'notifications-outline';
    }
  };
  
  const getIconColor = (type) => {
    switch (type) {
      case 'New Reservation':
        return '#4CAF50'; // Green
      case 'Cancelled':
        return '#F44336'; // Red
      case 'Reminder':
        return '#2196F3'; // Blue
      case 'Promotional':
        return '#FF9800'; // Orange
      default:
        return '#9C27B0'; // Purple
    }
  };
  
  const formatTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (err) {
      return dateString;
    }
  };
  
  const renderNotificationItem = ({ item }) => (
    <Animated.View style={styles.animatedContainer}>
      <TouchableOpacity 
        style={[
          styles.notificationItem, 
          !item.is_read && styles.unreadNotification
        ]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={[styles.iconContainer, {backgroundColor: getIconColor(item.type)}]}>
          <Ionicons 
            name={getNotificationIcon(item.type)} 
            size={wp('6%')} 
            color="#fff" 
          />
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.timeStamp}>{formatTime(item.created_at)}</Text>
          </View>
          
          <Text style={styles.notificationMessage}>{item.message}</Text>
          
          {!item.is_read && (
            <View style={styles.unreadIndicator} />
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
  
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons 
        name="notifications-off-outline" 
        size={wp('20%')} 
        color="#ccc" 
      />
      <Text style={styles.emptyStateText}>No notifications yet</Text>
      <Text style={styles.emptyStateSubText}>
        We'll notify you when something important happens
      </Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={wp('6%')} color="#420F54" />
          </TouchableOpacity>
          
          <Text style={styles.screenTitle}>Notifications</Text>
          
          {unreadCount > 0 && (
            <TouchableOpacity 
              style={styles.markAllReadButton}
              onPress={markAllAsRead}
            >
              <Text style={styles.markAllReadText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Notification Count Summary */}
        <Animated.View 
          style={[
            styles.summaryContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY }]
            }
          ]}
        >
          <View style={styles.countContainer}>
            <Text style={styles.totalCount}>
              {notifications.length} 
              <Text style={styles.countLabel}> Total</Text>
            </Text>
          </View>
          
          {unreadCount > 0 && (
            <View style={styles.unreadCountContainer}>
              <Text style={styles.unreadCount}>
                {unreadCount}
                <Text style={styles.countLabel}> Unread</Text>
              </Text>
            </View>
          )}
        </Animated.View>
        
        {/* Error state */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={fetchNotifications}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Notification list */}
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#420F54" />
            <Text style={styles.loadingText}>Loading notifications...</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={["#420F54"]}
              />
            }
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default NotificationScreen;