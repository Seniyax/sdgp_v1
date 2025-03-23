import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../contexts/ThemeContext';
import { format } from 'date-fns';

const ReservationCard = ({
  reservation,
  onPress,
  onCancel,
  style
}) => {
  const { theme, isDarkMode } = useTheme();
  
  // Format date
  const formattedDate = format(new Date(reservation.date), 'EEEE, MMMM d, yyyy');
  
  // Format time
  const formattedTime = format(new Date(reservation.date), 'h:mm a');
  
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
  
  // Get status icon
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'cancelled':
        return 'close-circle';
      case 'completed':
        return 'checkmark-done-circle';
      default:
        return 'information-circle';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: theme.card },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Restaurant Image */}
      <Image
        source={{ uri: reservation.venue.imageUrl || 'https://via.placeholder.com/100' }}
        style={styles.image}
        resizeMode="cover"
      />
      
      {/* Content */}
      <View style={styles.contentContainer}>
        {/* Status Badge */}
        <View style={[
          styles.statusBadge,
          { backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5' }
        ]}>
          <Ionicons
            name={getStatusIcon(reservation.status)}
            size={wp('3.5%')}
            color={getStatusColor(reservation.status)}
            style={styles.statusIcon}
          />
          <Text style={[
            styles.statusText,
            { color: getStatusColor(reservation.status) }
          ]}>
            {reservation.status}
          </Text>
        </View>
        
        {/* Venue Name */}
        <Text style={[styles.venueName, { color: theme.text }]}>
          {reservation.venue.name}
        </Text>
        
        {/* Date & Time Row */}
        <View style={styles.detailRow}>
          <Ionicons
            name="calendar-outline"
            size={wp('4%')}
            color={theme.textSecondary}
            style={styles.detailIcon}
          />
          <Text style={[styles.detailText, { color: theme.text }]}>
            {formattedDate}
          </Text>
        </View>
        
        {/* Time Row */}
        <View style={styles.detailRow}>
          <Ionicons
            name="time-outline"
            size={wp('4%')}
            color={theme.textSecondary}
            style={styles.detailIcon}
          />
          <Text style={[styles.detailText, { color: theme.text }]}>
            {formattedTime}
          </Text>
        </View>
        
        {/* Party Size Row */}
        <View style={styles.detailRow}>
          <Ionicons
            name="people-outline"
            size={wp('4%')}
            color={theme.textSecondary}
            style={styles.detailIcon}
          />
          <Text style={[styles.detailText, { color: theme.text }]}>
            {reservation.partySize} {reservation.partySize === 1 ? 'Person' : 'People'}
          </Text>
        </View>
        
        {/* Table Number Row */}
        <View style={styles.detailRow}>
          <Ionicons
            name="grid-outline"
            size={wp('4%')}
            color={theme.textSecondary}
            style={styles.detailIcon}
          />
          <Text style={[styles.detailText, { color: theme.text }]}>
            Table {reservation.table.label}
          </Text>
        </View>
      </View>
      
      {/* Actions */}
      {reservation.status.toLowerCase() !== 'cancelled' && 
       reservation.status.toLowerCase() !== 'completed' && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => onCancel && onCancel(reservation)}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Ionicons
            name="close-circle"
            size={wp('6%')}
            color={theme.error}
          />
        </TouchableOpacity>
      )}
      
      {/* Arrow */}
      <View style={styles.arrowContainer}>
        <Ionicons
          name="chevron-forward"
          size={wp('6%')}
          color={theme.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: wp('4%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  image: {
    width: wp('25%'),
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    padding: wp('3%'),
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.3%'),
    borderRadius: wp('5%'),
    marginBottom: hp('0.5%'),
  },
  statusIcon: {
    marginRight: wp('1%'),
  },
  statusText: {
    fontSize: wp('3%'),
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  venueName: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    marginBottom: hp('0.5%'),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
  },
  detailIcon: {
    marginRight: wp('2%'),
  },
  detailText: {
    fontSize: wp('3.5%'),
  },
  cancelButton: {
    position: 'absolute',
    top: wp('2%'),
    right: wp('2%'),
    zIndex: 10,
  },
  arrowContainer: {
    justifyContent: 'center',
    paddingRight: wp('3%'),
  },
});

export default ReservationCard;
