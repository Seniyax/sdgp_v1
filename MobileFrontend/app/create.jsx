import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Platform
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';

import TableMap from '../../components/TableMap';
import LoadingSpinner from '../../components/LoadingSpinner';
import AuthButton from '../../components/AuthButton';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
// import { restaurantAPI, reservationAPI } from '../../services/api'; // Uncomment when API is ready

// Mock data for restaurants
const mockRestaurants = {
  '1': {
    id: '1',
    name: 'Italian Bistro',
    imageUrl: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    cuisine: 'Italian',
    address: '123 Main St, New York, NY',
    openingHours: '10:00 AM - 10:00 PM',
  },
  '2': {
    id: '2',
    name: 'Sushi Place',
    imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    cuisine: 'Japanese',
    address: '456 Broadway, New York, NY',
    openingHours: '11:30 AM - 11:00 PM',
  }
};

// Mock data for reservations
const mockReservations = {
  '1': {
    id: '1',
    restaurantId: '1',
    date: new Date().toISOString(),
    time: '7:00 PM',
    partySize: 2,
    tableId: 'T1',
    notes: 'Window table requested',
    status: 'confirmed'
  },
  '2': {
    id: '2',
    restaurantId: '2',
    date: new Date().toISOString(),
    time: '8:00 PM',
    partySize: 4,
    tableId: 'T2',
    notes: '',
    status: 'pending'
  }
};

// Available time slots
const timeSlots = [
  '5:00 PM',
  '5:30 PM',
  '6:00 PM',
  '6:30 PM',
  '7:00 PM',
  '7:30 PM',
  '8:00 PM',
  '8:30 PM',
  '9:00 PM',
  '9:30 PM'
];

// Mock table layout
const mockTables = [
  {
    id: 'T1',
    label: 'A1',
    type: 'small',
    status: 'available',
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

export default function CreateReservationScreen() {
  const { theme, isDarkMode } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const params = useLocalSearchParams();
  const { id, restaurantId, edit } = params;
  
  // State
  const [isEditMode] = useState(edit === 'true');
  const [restaurant, setRestaurant] = useState(null);
  const [reservation, setReservation] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [date, setDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(timeSlots[2]); // Default to 6:00 PM
  const [partySize, setPartySize] = useState(2);
  const [notes, setNotes] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load data on mount
  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to create a reservation.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => router.back()
          },
          {
            text: 'Sign In',
            onPress: () => router.replace('/auth/signin')
          }
        ]
      );
      return;
    }
    
    // Load appropriate data based on mode
    if (isEditMode && id) {
      // If editing existing reservation
      fetchReservation();
    } else if (restaurantId) {
      // If creating new reservation for a specific restaurant
      fetchRestaurant(restaurantId);
    } else {
      // No reservation ID or restaurant ID provided
      Alert.alert('Error', 'Missing required information');
      router.back();
    }
  }, [isEditMode, id, restaurantId]);
  
  // Fetch existing reservation for editing
  const fetchReservation = async () => {
    setLoading(true);
    
    try {
      // In a real app, you would call the API
      // const response = await reservationAPI.getReservation(id);
      // const reservationData = response.data;
      
      // For now, use mock data
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (mockReservations[id]) {
        const reservationData = mockReservations[id];
        setReservation(reservationData);
        
        // Set form values from reservation data
        setDate(new Date(reservationData.date));
        setSelectedTimeSlot(reservationData.time);
        setPartySize(reservationData.partySize);
        setNotes(reservationData.notes || '');
        
        // Fetch restaurant details and tables
        await fetchRestaurant(reservationData.restaurantId);
        
        // Set selected table
        const table = mockTables.find(t => t.id === reservationData.tableId);
        if (table) {
          setSelectedTable(table);
        }
      } else {
        Alert.alert('Error', 'Reservation not found');
        router.back();
      }
    } catch (error) {
      console.error('Error fetching reservation:', error);
      Alert.alert('Error', 'Failed to load reservation details');
      router.back();
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch restaurant details
  const fetchRestaurant = async (id) => {
    try {
      // In a real app, you would call the API
      // const response = await restaurantAPI.getRestaurant(id);
      // setRestaurant(response.data);
      
      // For now, use mock data
      if (mockRestaurants[id]) {
        setRestaurant(mockRestaurants[id]);
        
        // Also fetch tables
        fetchTables();
      } else {
        Alert.alert('Error', 'Restaurant not found');
        router.back();
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      Alert.alert('Error', 'Failed to load restaurant details');
      router.back();
    }
  };
  
  // Fetch available tables
  const fetchTables = async () => {
    try {
      // In a real app, you would call the API with the selected date and time
      // const response = await restaurantAPI.getTables(restaurant.id, { date, time: selectedTimeSlot });
      // setTables(response.data);
      
      // For now, use mock data
      setTables(mockTables);
    } catch (error) {
      console.error('Error fetching tables:', error);
      Alert.alert('Error', 'Failed to load tables');
    }
  };
  
  // Update tables when date or time changes
  useEffect(() => {
    if (restaurant) {
      fetchTables();
      
      // Clear selected table when date or time changes
      // Don't clear in edit mode to preserve original selection
      if (!isEditMode || !reservation) {
        setSelectedTable(null);
      }
    }
  }, [date, selectedTimeSlot, restaurant]);
  
  // Handle date selection
  const handleConfirmDate = (selectedDate) => {
    setDatePickerVisible(false);
    setDate(selectedDate);
  };
  
  // Handle party size change
  const handlePartySizeChange = (delta) => {
    const newSize = partySize + delta;
    if (newSize >= 1 && newSize <= 10) {
      setPartySize(newSize);
      // Clear selected table when party size changes (except in edit mode)
      if (!isEditMode || !reservation) {
        setSelectedTable(null);
      }
    }
  };
  
  // Handle table selection
  const handleTableSelect = (table) => {
    // Check if table capacity is sufficient
    if (table.capacity < partySize) {
      Alert.alert(
        'Table Too Small',
        `This table can only accommodate ${table.capacity} people. Please select a larger table or reduce your party size.`
      );
      return;
    }
    
    setSelectedTable(table);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!selectedTable) {
      Alert.alert('Error', 'Please select a table');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create reservation data
      const reservationData = {
        restaurantId: restaurant.id,
        date: date.toISOString().split('T')[0],
        time: selectedTimeSlot,
        tableId: selectedTable.id,
        partySize,
        notes,
        userId: user.id
      };
      
      if (isEditMode && id) {
        // Update existing reservation
        // In a real app, you would call the API
        // const response = await reservationAPI.updateReservation(id, reservationData);
        
        // For now, simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        Alert.alert(
          'Reservation Updated',
          'Your reservation has been updated successfully.',
          [
            {
              text: 'OK',
              onPress: () => router.push('/reservations')
            }
          ]
        );
      } else {
        // Create new reservation
        // In a real app, you would call the API
        // const response = await reservationAPI.createReservation(reservationData);
        
        // For now, simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Navigate to payment screen
        router.push({
          pathname: '/payments',
          params: {
            restaurantId: restaurant.id,
            tableId: selectedTable.id,
            date: date.toISOString(),
            time: selectedTimeSlot,
            partySize,
            reservationId: 'mock-id-123'
          }
        });
      }
    } catch (error) {
      console.error('Error saving reservation:', error);
      Alert.alert('Error', 'Failed to save reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <LoadingSpinner visible={true} message={isEditMode ? "Loading reservation..." : "Loading restaurant details..."} />
      </View>
    );
  }

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
          {isEditMode ? 'Modify Reservation' : 'New Reservation'}
        </Text>
        
        <View style={styles.placeholderButton} />
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Restaurant Info */}
        <View style={[styles.restaurantCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.restaurantName, { color: theme.text }]}>
            {restaurant?.name || 'Restaurant'}
          </Text>
          
          <Text style={[styles.restaurantAddress, { color: theme.textSecondary }]}>
            {restaurant?.address || 'Address'}
          </Text>
          
          {isEditMode && (
            <View style={[
              styles.statusBadge, 
              { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }
            ]}>
              <Text style={[
                styles.statusText, 
                { 
                  color: reservation?.status === 'confirmed' ? theme.success : 
                         reservation?.status === 'pending' ? '#FFC107' : theme.textSecondary 
                }
              ]}>
                {reservation?.status?.toUpperCase() || 'STATUS'}
              </Text>
            </View>
          )}
        </View>
        
        {/* Reservation Options */}
        <View style={[styles.optionsCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Choose Date & Time
          </Text>
          
          {/* Date Selector */}
          <View style={styles.optionRow}>
            <View style={styles.optionLabelContainer}>
              <Ionicons
                name="calendar-outline"
                size={wp('5%')}
                color={theme.primary}
                style={styles.optionIcon}
              />
              <Text style={[styles.optionLabel, { color: theme.text }]}>
                Date
              </Text>
            </View>
            
            <TouchableOpacity
              style={[
                styles.dateSelector,
                { borderColor: theme.border }
              ]}
              onPress={() => setDatePickerVisible(true)}
            >
              <Text style={[styles.dateText, { color: theme.text }]}>
                {format(date, 'EEEE, MMMM d, yyyy')}
              </Text>
              <Ionicons
                name="chevron-down"
                size={wp('5%')}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          </View>
          
          {/* Time Selector */}
          <View style={styles.timeRow}>
            <View style={styles.optionLabelContainer}>
              <Ionicons
                name="time-outline"
                size={wp('5%')}
                color={theme.primary}
                style={styles.optionIcon}
              />
              <Text style={[styles.optionLabel, { color: theme.text }]}>
                Time
              </Text>
            </View>
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.timeSlotContainer}
            >
              {timeSlots.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeSlot,
                    selectedTimeSlot === time && [
                      styles.selectedTimeSlot,
                      { backgroundColor: theme.primary }
                    ]
                  ]}
                  onPress={() => setSelectedTimeSlot(time)}
                >
                  <Text style={[
                    styles.timeSlotText,
                    { color: selectedTimeSlot === time ? 'white' : theme.text }
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          {/* Party Size Selector */}
          <View style={styles.optionRow}>
            <View style={styles.optionLabelContainer}>
              <Ionicons
                name="people-outline"
                size={wp('5%')}
                color={theme.primary}
                style={styles.optionIcon}
              />
              <Text style={[styles.optionLabel, { color: theme.text }]}>
                Party Size
              </Text>
            </View>
            
            <View style={styles.partySizeSelector}>
              <TouchableOpacity
                style={[
                  styles.partySizeButton,
                  { borderColor: theme.border }
                ]}
                onPress={() => handlePartySizeChange(-1)}
                disabled={partySize <= 1}
              >
                <Ionicons
                  name="remove"
                  size={wp('5%')}
                  color={partySize <= 1 ? theme.textSecondary : theme.text}
                />
              </TouchableOpacity>
              
              <Text style={[styles.partySizeText, { color: theme.text }]}>
                {partySize}
              </Text>
              
              <TouchableOpacity
                style={[
                  styles.partySizeButton,
                  { borderColor: theme.border }
                ]}
                onPress={() => handlePartySizeChange(1)}
                disabled={partySize >= 10}
              >
                <Ionicons
                  name="add"
                  size={wp('5%')}
                  color={partySize >= 10 ? theme.textSecondary : theme.text}
                />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Special Requests */}
          <View style={styles.optionRow}>
            <View style={styles.optionLabelContainer}>
              <Ionicons
                name="create-outline"
                size={wp('5%')}
                color={theme.primary}
                style={styles.optionIcon}
              />
              <Text style={[styles.optionLabel, { color: theme.text }]}>
                Special Requests
              </Text>
            </View>
          </View>
          
          <TextInput
            style={[
              styles.notesInput,
              { 
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                color: theme.text
              }
            ]}
            placeholder="Any special requests or notes for the restaurant?"
            placeholderTextColor={theme.textSecondary}
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
          />
        </View>
        
        {/* Table Selection */}
        <View style={[styles.tableCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Select Your Table
          </Text>
          
          <Text style={[styles.tableInstructions, { color: theme.textSecondary }]}>
            Tap on an available table to select it. Green tables are available, red tables are occupied, and yellow tables are reserved.
          </Text>
          
          <View style={styles.tableMapContainer}>
            <TableMap
              tables={tables}
              selectedTableId={selectedTable?.id}
              onTableSelect={handleTableSelect}
            />
          </View>
          
          {selectedTable && (
            <View style={[
              styles.selectedTableInfo,
              { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }
            ]}>
              <Text style={[styles.selectedTableText, { color: theme.text }]}>
                Selected: Table {selectedTable.label} (Capacity: {selectedTable.capacity})
              </Text>
            </View>
          )}
        </View>
        
        {/* Submit Button */}
        <AuthButton
          title={isEditMode ? "Update Reservation" : "Continue to Payment"}
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={!selectedTable || isSubmitting}
          style={styles.submitButton}
        />
      </ScrollView>
      
      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={date}
        minimumDate={new Date()}
        maximumDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // 30 days from now
        onConfirm={handleConfirmDate}
        onCancel={() => setDatePickerVisible(false)}
      />
      
      <LoadingSpinner visible={isSubmitting} message={isEditMode ? "Updating reservation..." : "Creating reservation..."} />
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
  placeholderButton: {
    width: wp('10%'),
  },
  scrollContainer: {
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('4%'),
  },
  restaurantCard: {
    borderRadius: wp('4%'),
    padding: wp('4%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  restaurantName: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginBottom: hp('0.5%'),
  },
  restaurantAddress: {
    fontSize: wp('3.5%'),
    marginBottom: hp('1%'),
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('10%'),
  },
  statusText: {
    fontSize: wp('3%'),
    fontWeight: '600',
  },
  optionsCard: {
    borderRadius: wp('4%'),
    padding: wp('4%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    marginBottom: hp('2%'),
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
  },
  optionLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: wp('2%'),
  },
  optionLabel: {
    fontSize: wp('4%'),
    fontWeight: '500',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('2%'),
    borderWidth: 1,
    borderRadius: wp('2%'),
  },
  dateText: {
    fontSize: wp('3.5%'),
    marginRight: wp('2%'),
  },
  timeRow: {
    marginBottom: hp('2%'),
  },
  timeSlotContainer: {
    marginTop: hp('1%'),
  },
  timeSlot: {
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('5%'),
    marginRight: wp('2%'),
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedTimeSlot: {
    borderWidth: 0,
  },
  timeSlotText: {
    fontSize: wp('3.5%'),
    fontWeight: '500',
  },
  partySizeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partySizeButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderWidth: 1,
    borderRadius: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  partySizeText: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    marginHorizontal: wp('4%'),
  },
  notesInput: {
    borderRadius: wp('3%'),
    padding: wp('3%'),
    textAlignVertical: 'top',
    minHeight: hp('10%'),
    fontSize: wp('3.5%'),
  },
  tableCard: {
    borderRadius: wp('4%'),
    padding: wp('4%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tableInstructions: {
    fontSize: wp('3.5%'),
    marginBottom: hp('2%'),
    lineHeight: wp('5%'),
  },
  tableMapContainer: {
    marginBottom: hp('2%'),
  },
  selectedTableInfo: {
    padding: wp('3%'),
    borderRadius: wp('3%'),
  },
  selectedTableText: {
    fontSize: wp('3.5%'),
    fontWeight: '500',
    textAlign: 'center',
  },
  submitButton: {
    marginTop: hp('2%'),
  },
});
