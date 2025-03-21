import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import ReservationCard from '../../components/ReservationCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Platform } from 'react-native';

// import { reservationAPI } from '../../services/api'; // Uncomment when API is ready

// Mock data for reservations
const mockReservations = [
  {
    id: '1',
    venue: {
      id: '101',
      name: 'Italian Bistro',
      imageUrl: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    },
    date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    partySize: 2,
    status: 'confirmed',
    table: { id: 'T1', label: 'A1' }
  },
  {
    id: '2',
    venue: {
      id: '102',
      name: 'Sushi Place',
      imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    },
    date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    partySize: 4,
    status: 'pending',
    table: { id: 'T2', label: 'B3' }
  },
  {
    id: '3',
    venue: {
      id: '103',
      name: 'Coffee House',
      imageUrl: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    },
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    partySize: 1,
    status: 'completed',
    table: { id: 'T3', label: 'C5' }
  },
  {
    id: '4',
    venue: {
      id: '104',
      name: 'Steakhouse',
      imageUrl: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    },
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    partySize: 3,
    status: 'cancelled',
    table: { id: 'T4', label: 'D2' }
  },
];

export default function ReservationsScreen() {
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();

  // State
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');

  // Load reservations on mount
  useEffect(() => {
    fetchReservations();
  }, []);

  // Fetch reservations
  const fetchReservations = async () => {
    setLoading(true);

    try {
      // In a real app, you would call the API
      // const response = await reservationAPI.getReservations();
      // setReservations(response.data);

      // For now, use mock data
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReservations(mockReservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      Alert.alert('Error', 'Failed to load reservations. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchReservations();
  };

  // Handle reservation selection
  const handleReservationPress = (reservation) => {
    router.push({
      pathname: '/reservations/details',
      params: { id: reservation.id }
    });
  };

  // Handle reservation cancellation
  const handleCancelReservation = (reservation) => {
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
              // await reservationAPI.cancelReservation(reservation.id);

              // For now, update local state
              // Simulate API delay
              await new Promise(resolve => setTimeout(resolve, 1000));

              setReservations(prevReservations =>
                prevReservations.map(res =>
                  res.id === reservation.id
                    ? { ...res, status: 'cancelled' }
                    : res
                )
              );

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

  // Filter reservations based on active tab
  const filteredReservations = reservations.filter(reservation => {
    const reservationDate = new Date(reservation.date);
    const now = new Date();
    const isPast = reservationDate < now;

    if (activeTab === 'upcoming') {
      return !isPast && reservation.status !== 'cancelled';
    } else if (activeTab === 'past') {
      return isPast || reservation.status === 'cancelled';
    }

    return true; // all tab
  });

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="calendar-outline"
        size={wp('20%')}
        color={theme.textSecondary}
        style={styles.emptyIcon}
      />
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        No Reservations Found
      </Text>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        {activeTab === 'upcoming'
          ? "You don't have any upcoming reservations. Book a table to get started."
          : "You don't have any past reservations."}
      </Text>
      {activeTab === 'upcoming' && (
        <TouchableOpacity
          style={[styles.bookButton, { backgroundColor: theme.primary }]}
          onPress={() => router.push('/restaurants')}
        >
          <Text style={styles.bookButtonText}>
            Find a Restaurant
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Render reservation item
  const renderReservationItem = ({ item }) => (
    <ReservationCard
      reservation={item}
      onPress={() => handleReservationPress(item)}
      onCancel={() => handleCancelReservation(item)}
    />
  );

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
          My Reservations
        </Text>

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push('/restaurants')}
        >
          <Ionicons
            name="add"
            size={wp('6%')}
            color={theme.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Tab Selector */}
      <View style={[styles.tabContainer, { backgroundColor: theme.card }]}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'upcoming' && [
              styles.activeTabButton,
              { borderBottomColor: theme.primary }
            ]
          ]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'upcoming' ? theme.primary : theme.textSecondary }
          ]}>
            Upcoming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'past' && [
              styles.activeTabButton,
              { borderBottomColor: theme.primary }
            ]
          ]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'past' ? theme.primary : theme.textSecondary }
          ]}>
            Past
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'all' && [
              styles.activeTabButton,
              { borderBottomColor: theme.primary }
            ]
          ]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'all' ? theme.primary : theme.textSecondary }
          ]}>
            All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Reservations List */}
      <FlatList
        data={filteredReservations}
        renderItem={renderReservationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!loading && renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
      />

      {/* Create Reservation Button */}
      {activeTab === 'upcoming' && filteredReservations.length > 0 && (
        <TouchableOpacity
          style={[styles.floatingButton, { backgroundColor: theme.primary }]}
          onPress={() => router.push('/restaurants')}
        >
          <Ionicons name="add" size={wp('8%')} color="white" />
        </TouchableOpacity>
      )}

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
  createButton: {
    padding: wp('2%'),
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp('4%'),
    marginBottom: hp('2%'),
  },
  tabButton: {
    flex: 1,
    paddingVertical: hp('1.5%'),
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 3,
  },
  tabText: {
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('10%'),
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('10%'),
    paddingVertical: hp('10%'),
  },
  emptyIcon: {
    marginBottom: hp('2%'),
  },
  emptyTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  emptyText: {
    fontSize: wp('4%'),
    textAlign: 'center',
    marginBottom: hp('3%'),
  },
  bookButton: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('8%'),
    borderRadius: wp('10%'),
  },
  bookButtonText: {
    color: 'white',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    bottom: hp('3%'),
    right: wp('6%'),
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('7.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
