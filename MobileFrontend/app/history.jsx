import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  SafeAreaView,
  ActivityIndicator,
  Image,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';

const History = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch reservation history from API
  const fetchReservationHistory = async () => {
    setLoading(true);
    try {
      // Update to use the new API endpoint
      const response = await axios.get('http://10.0.2.2:3000/api/reservation-history?userId=user123');
      if (response.data.success) {
        // Update to use the new response structure
        setReservations(response.data.reservationHistory.map(item => ({
          id: item.id,
          venueName: item.venue_name || "Unknown Venue", // Map API fields to component fields
          date: new Date(item.start_time).toISOString().split('T')[0],
          time: new Date(item.start_time).toTimeString().substring(0, 5),
          tableNumber: item.table_number || item.room_number,
          guests: item.guests || item.attendees,
          status: item.status || "completed",
          imageUrl: item.image_url,
          venueType: item.venue_type || "Restaurant",
          totalAmount: item.total_amount || "$0.00",
          orderItems: item.order_items || [],
          roomNumber: item.room_number,
          attendees: item.attendees,
          duration: item.duration,
          equipment: item.equipment || []
        })));
      } else {
        setError('Failed to fetch history: ' + (response.data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error fetching reservation history:', err);
      setError('Network error: ' + err.message);
    
      // Keep the mock data for testing when API fails
      // The existing mock data can remain as is
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    fetchReservationHistory();
  }, []);

  // Handle reservation item press to show modal
  const handleReservationPress = (item) => {
    setSelectedReservation(item);
    setModalVisible(true);
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render each reservation item
  const renderReservationItem = ({ item }) => {
    // Determine icon based on venue type
    const venueIcon = item.venueType === 'Restaurant' 
      ? 'restaurant-outline' 
      : item.venueType === 'Meeting Room' 
        ? 'business-outline' 
        : 'grid-outline';

    return (
      <TouchableOpacity 
        style={styles.reservationItem}
        onPress={() => handleReservationPress(item)}
      >
        <View style={styles.reservationItemHeader}>
          {item.imageUrl ? (
            <Image 
              source={{ uri: item.imageUrl }} 
              style={styles.venueImage}
            />
          ) : (
            <View style={styles.iconContainer}>
              <Ionicons name={venueIcon} size={wp('12%')} color="#420F54" />
            </View>
          )}
          
          <View style={styles.reservationDetails}>
            <Text style={styles.venueName}>{item.venueName}</Text>
            <View style={styles.dateTimeContainer}>
              <Ionicons name="calendar-outline" size={wp('4%')} color="#666" />
              <Text style={styles.dateText}>{formatDate(item.date)}</Text>
            </View>
            <View style={styles.dateTimeContainer}>
              <Ionicons name="time-outline" size={wp('4%')} color="#666" />
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
            <View style={styles.dateTimeContainer}>
              <Ionicons 
                name={item.venueType === 'Restaurant' ? 'people-outline' : 'person-outline'} 
                size={wp('4%')} 
                color="#666" 
              />
              <Text style={styles.guestsText}>
                {item.guests || item.attendees || 0} {item.venueType === 'Restaurant' ? 'guests' : 'attendees'}
              </Text>
            </View>
          </View>
          
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge,
              item.status === 'completed' && styles.completedBadge,
              item.status === 'cancelled' && styles.cancelledBadge,
            ]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
            <Ionicons name="chevron-forward" size={wp('6%')} color="#420F54" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Render detailed modal for the selected reservation
  const renderDetailModal = () => {
    if (!selectedReservation) return null;
    
    const isRestaurant = selectedReservation.venueType === 'Restaurant';
    
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header with close button */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reservation Details</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={wp('6%')} color="#420F54" />
              </TouchableOpacity>
            </View>
            
            {/* Venue Image/Icon */}
            {selectedReservation.imageUrl ? (
              <Image 
                source={{ uri: selectedReservation.imageUrl }} 
                style={styles.modalImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.modalIconContainer}>
                <Ionicons 
                  name={isRestaurant ? 'restaurant' : 'business'} 
                  size={wp('15%')} 
                  color="#420F54" 
                />
              </View>
            )}
            
            {/* Venue Name */}
            <Text style={styles.modalVenueName}>{selectedReservation.venueName}</Text>
            
            {/* Basic Details Section */}
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Basic Details</Text>
              
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar" size={wp('5%')} color="#420F54" />
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Date</Text>
                    <Text style={styles.detailValue}>{formatDate(selectedReservation.date)}</Text>
                  </View>
                </View>
                
                <View style={styles.detailItem}>
                  <Ionicons name="time" size={wp('5%')} color="#420F54" />
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Time</Text>
                    <Text style={styles.detailValue}>{selectedReservation.time}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Ionicons 
                    name={isRestaurant ? 'restaurant' : 'business'} 
                    size={wp('5%')} 
                    color="#420F54" 
                  />
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>
                      {isRestaurant ? 'Table Number' : 'Room Number'}
                    </Text>
                    <Text style={styles.detailValue}>
                      {isRestaurant ? selectedReservation.tableNumber : selectedReservation.roomNumber}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.detailItem}>
                  <Ionicons name="people" size={wp('5%')} color="#420F54" />
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>
                      {isRestaurant ? 'Guests' : 'Attendees'}
                    </Text>
                    <Text style={styles.detailValue}>
                      {isRestaurant ? selectedReservation.guests : selectedReservation.attendees}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Conditional Content based on venue type */}
            {isRestaurant ? (
              // Restaurant Order Details
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Order Details</Text>
                
                {selectedReservation.orderItems && selectedReservation.orderItems.map((item, index) => (
                  <View key={index} style={styles.orderItem}>
                    <View style={styles.orderItemNameQty}>
                      <Text style={styles.orderItemName}>{item.name}</Text>
                      <Text style={styles.orderItemQty}>x{item.quantity}</Text>
                    </View>
                    <Text style={styles.orderItemPrice}>{item.price}</Text>
                  </View>
                ))}
                
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalAmount}>{selectedReservation.totalAmount}</Text>
                </View>
              </View>
            ) : (
              // Meeting Room Details
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Meeting Details</Text>
                
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name="time" size={wp('5%')} color="#420F54" />
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Duration</Text>
                      <Text style={styles.detailValue}>{selectedReservation.duration}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Ionicons name="cash" size={wp('5%')} color="#420F54" />
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Total</Text>
                      <Text style={styles.detailValue}>{selectedReservation.totalAmount}</Text>
                    </View>
                  </View>
                </View>
                
                {selectedReservation.equipment && (
                  <View style={styles.equipmentContainer}>
                    <Text style={styles.equipmentLabel}>Equipment Used:</Text>
                    <View style={styles.equipmentList}>
                      {selectedReservation.equipment.map((item, index) => (
                        <View key={index} style={styles.equipmentItem}>
                          <Ionicons name="checkmark-circle" size={wp('4%')} color="#420F54" />
                          <Text style={styles.equipmentText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}
            
            {/* Status Badge at bottom */}
            <View style={styles.modalStatusContainer}>
              <View style={[
                styles.modalStatusBadge,
                selectedReservation.status === 'completed' && styles.completedBadge,
                selectedReservation.status === 'cancelled' && styles.cancelledBadge,
              ]}>
                <Text style={styles.modalStatusText}>{selectedReservation.status}</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Pull to refresh handler
  const handleRefresh = () => {
    setRefreshing(true);
    fetchReservationHistory();
  };

  // Main render
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reservation History</Text>
      </View>
      
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
          {reservations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={wp('20%')} color="#420F54" />
              <Text style={styles.emptyText}>No reservations found</Text>
            </View>
          ) : (
            <FlatList
              data={reservations}
              renderItem={renderReservationItem}
              keyExtractor={(item) => item.id}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: wp('5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#420F54',
  },
  reservationItem: {
    padding: wp('5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reservationItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueImage: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
    marginRight: wp('5%'),
  },
  iconContainer: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('5%'),
  },
  reservationDetails: {
    flex: 1,
  },
  venueName: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#420F54',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
  },
  dateText: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginLeft: wp('2%'),
  },
  timeText: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginLeft: wp('2%'),
  },
  guestsText: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginLeft: wp('2%'),
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('2%'),
    backgroundColor: '#eee',
  },
  completedBadge: {
    backgroundColor: '#d4edda',
  },
  cancelledBadge: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: wp('3.5%'),
    color: '#420F54',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: wp('90%'),
    backgroundColor: '#fff',
    borderRadius: wp('5%'),
    padding: wp('5%'),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  modalTitle: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#420F54',
  },
  closeButton: {
    padding: wp('2%'),
  },
  modalImage: {
    width: '100%',
    height: hp('20%'),
    borderRadius: wp('5%'),
    marginBottom: hp('2%'),
  },
  modalIconContainer: {
    width: '100%',
    height: hp('20%'),
    borderRadius: wp('5%'),
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  modalVenueName: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#420F54',
    marginBottom: hp('2%'),
  },
  detailSection: {
    marginBottom: hp('2%'),
  },
  sectionTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#420F54',
    marginBottom: hp('1%'),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailTextContainer: {
    marginLeft: wp('2%'),
  },
  detailLabel: {
    fontSize: wp('3.5%'),
    color: '#666',
  },
  detailValue: {
    fontSize: wp('4%'),
    color: '#420F54',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  orderItemNameQty: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderItemName: {
    fontSize: wp('4%'),
    color: '#420F54',
  },
  orderItemQty: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginLeft: wp('2%'),
  },
  orderItemPrice: {
    fontSize: wp('4%'),
    color: '#420F54',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  totalLabel: {
    fontSize: wp('4%'),
    color: '#420F54',
  },
  totalAmount: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#420F54',
  },
  equipmentContainer: {
    marginTop: hp('1%'),
  },
  equipmentLabel: {
    fontSize: wp('4%'),
    color: '#420F54',
    marginBottom: hp('1%'),
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp('2%'),
    marginBottom: hp('1%'),
  },
  equipmentText: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginLeft: wp('1%'),
  },
  modalStatusContainer: {
    marginTop: hp('2%'),
    alignItems: 'center',
  },
  modalStatusBadge: {
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('2%'),
    backgroundColor: '#eee',
  },
  modalStatusText: {
    fontSize: wp('4%'),
    color: '#420F54',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: wp('4%'),
    color: '#ff0000',
    marginBottom: hp('2%'),
  },
  retryButton: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
    backgroundColor: '#420F54',
    borderRadius: wp('2%'),
  },
  retryButtonText: {
    fontSize: wp('4%'),
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: wp('4%'),
    color: '#420F54',
    marginTop: hp('2%'),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: wp('4%'),
    color: '#420F54',
    marginTop: hp('2%'),
  },
});

export default History;