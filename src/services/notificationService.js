const supabase = require('../config/supabaseClient');
const logger = require('../utils/logger');

class NotificationService {
  async createNotification(data) {
    try {
      const allowedTypes = ['New Reservation', 'Cancelled', 'Reminder', 'Promotional', 'Other'];
      if (!allowedTypes.includes(data.type)) {
        throw new Error(`Notification type must be one of: ${allowedTypes.join(', ')}`);
      }

      const { data: notification, error } = await supabase
        .from('notification')
        .insert([{
          customer_id: data.customer_id,
          business_id: data.business_id,
          reservation_id: data.reservation_id,
          type: data.type,
          title: data.title,
          message: data.message,
          is_read: false
        }])
        .select('*')
        .single();

      if (error) throw error;
      return notification;
    } catch (error) {
      logger.error(`Error creating notification: ${error.message}`, { error });
      throw error;
    }
  }

  async getUserNotifications(customerId, unreadOnly = false) {
    try {
      let query = supabase
        .from('notification')
        .select('*, reservation:reservation_id(*)')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
        
      if (unreadOnly) {
        query = query.eq('is_read', false);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error(`Error getting user notifications: ${error.message}`, { error });
      throw error;
    }
  }

  async markAsRead(notificationId) {
    try {
      const { data, error } = await supabase
        .from('notification')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId)
        .select('*')
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error(`Error marking notification as read: ${error.message}`, { error });
      throw error;
    }
  }
  
  async markAllAsRead(customerId) {
    try {
      const { error } = await supabase
        .from('notification')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('customer_id', customerId)
        .eq('is_read', false);
        
      if (error) throw error;
      return true;
    } catch (error) {
      logger.error(`Error marking all notifications as read: ${error.message}`, { error });
      throw error;
    }
  }

  async createNewReservationNotification(reservation) {
    return this.createNotification({
      customer_id: reservation.user_id,
      business_id: reservation.business_id,
      reservation_id: reservation.id,
      type: 'New Reservation',
      title: 'Reservation Confirmed',
      message: `Your reservation on ${new Date(reservation.start_time).toLocaleDateString()} has been confirmed.`
    });
  }

  async createReservationUpdateNotification(reservation, notificationType, title, message) {
    return this.createNotification({
      customer_id: reservation.user_id,
      business_id: reservation.business_id,
      reservation_id: reservation.id,
      type: notificationType,
      title: title,
      message: message
    });
  }

  async createCancellationNotification(reservation) {
    return this.createNotification({
      customer_id: reservation.user_id,
      business_id: reservation.business_id,
      reservation_id: reservation.id,
      type: 'Cancelled',
      title: 'Reservation Cancelled',
      message: `Your reservation on ${new Date(reservation.start_time).toLocaleDateString()} has been cancelled.`
    });
  }

  async createReminderNotification(reservation) {
    return this.createNotification({
      customer_id: reservation.user_id,
      business_id: reservation.business_id,
      reservation_id: reservation.id,
      type: 'Reminder',
      title: 'Upcoming Reservation',
      message: `Reminder: You have a reservation tomorrow at ${new Date(reservation.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
    });
  }

  async createBusinessReservationNotification(reservation, businessOwnerCustomerId) {
    return this.createNotification({
      customer_id: businessOwnerCustomerId,
      business_id: reservation.business_id,
      reservation_id: reservation.id,
      type: 'New Reservation',
      title: 'New Reservation',
      message: `You have a new reservation for ${new Date(reservation.start_time).toLocaleDateString()} at ${new Date(reservation.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
    });
  }

  async createPromotionalNotification(customerId, businessId, title, message) {
    return this.createNotification({
      customer_id: customerId,
      business_id: businessId,
      type: 'Promotional',
      title: title,
      message: message
    });
  }
}

module.exports = new NotificationService();