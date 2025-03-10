const supabase = require('../config/supabaseClient');
const logger = require('../utils/logger');

class NotificationService {
  /**
   * Create a notification in the database
   * @param {Object} data Notification data
   * @returns {Promise<Object>} Created notification
   */
  async createNotification(data) {
    try {
      // Validate type to ensure it matches the allowed values
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
          // created_at is handled automatically by Supabase
        }])
        .select('*')
        .single();

      if (error) throw error;
      
      // For in-app notifications, Supabase Realtime will automatically send updates
      // to subscribed clients via WebSockets
      
      // If push notification is enabled, trigger it
      if (data.sendPush) {
        await this.triggerPushNotification(data.customer_id, data.title, data.message);
      }
      
      return notification;
    } catch (error) {
      logger.error(`Error creating notification: ${error.message}`, { error });
      throw error;
    }
  }

  /**
   * Get all notifications for a user
   * @param {string} customerId Customer ID (UUID)
   * @param {boolean} unreadOnly Only get unread notifications
   * @returns {Promise<Array>} User notifications
   */
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

  /**
   * Mark a notification as read
   * @param {number} notificationId Notification ID
   * @returns {Promise<Object>} Updated notification
   */
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

  /**
   * Mark all user's notifications as read
   * @param {string} customerId Customer ID (UUID)
   * @returns {Promise<boolean>} Success status
   */
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

  /**
   * Register a device token for push notifications
   * @param {string} customerId Customer ID (UUID)
   * @param {string} deviceToken Device token
   * @param {string} deviceType Device type ('Android', 'iOS')
   * @returns {Promise<Object>} Created or updated device token
   */
  async registerDeviceToken(customerId, deviceToken, deviceType) {
    try {
      // Validate device type
      if (!['Android', 'iOS'].includes(deviceType)) {
        throw new Error("Device type must be 'Android' or 'iOS'");
      }

      // Due to the UNIQUE constraint on device_token, we can just insert
      // and handle conflicts by updating the record
      const { data, error } = await supabase
        .from('device_token')
        .upsert([{
          customer_id: customerId,
          device_token: deviceToken,
          device_type: deviceType,
          last_used_at: new Date().toISOString()
        }], {
          onConflict: 'device_token',
          returning: 'representation'
        })
        .select('*')
        .single();
          
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error(`Error registering device token: ${error.message}`, { error });
      throw error;
    }
  }

  /**
   * Trigger push notification to a user's devices
   * This will be handled by the mobile app subscribing to Supabase Realtime
   * @param {string} customerId Customer ID (UUID)
   * @param {string} title Notification title
   * @param {string} message Notification message
   * @returns {Promise<boolean>} Success status
   */
  async triggerPushNotification(customerId, title, message) {
    try {
      // Get user's device tokens
      const { data: tokens, error } = await supabase
        .from('device_token')
        .select('device_token, device_type')
        .eq('customer_id', customerId);
        
      if (error) throw error;
      
      if (!tokens || tokens.length === 0) {
        logger.info(`No device tokens found for customer ${customerId}`);
        return false;
      }
      
      // With Supabase, the app uses Realtime subscriptions to handle push notifications
      // This means the app will listen for changes to the notification table
      // and handle notifications as they come in
      
      logger.info(`Push notification triggerable for customer ${customerId} with ${tokens.length} devices`);
      
      return true;
    } catch (error) {
      logger.error(`Error triggering push notification: ${error.message}`, { error });
      // Don't throw the error, just log it and return false
      return false;
    }
  }

  /**
   * Create new reservation notification
   * @param {Object} reservation Reservation object
   * @returns {Promise<Object>} Created notification
   */
  async createNewReservationNotification(reservation) {
    return this.createNotification({
      customer_id: reservation.user_id,
      business_id: reservation.business_id,
      reservation_id: reservation.id,
      type: 'New Reservation',
      title: 'Reservation Confirmed',
      message: `Your reservation on ${new Date(reservation.start_time).toLocaleDateString()} has been confirmed.`,
      sendPush: true
    });
  }

  /**
   * Create reservation update notification (used for both updates and reminders)
   * @param {Object} reservation Updated reservation object
   * @param {string} notificationType Type of notification ('Reminder' or 'Other')
   * @param {string} title Notification title
   * @param {string} message Notification message
   * @returns {Promise<Object>} Created notification
   */
  async createReservationUpdateNotification(reservation, notificationType, title, message) {
    return this.createNotification({
      customer_id: reservation.user_id,
      business_id: reservation.business_id,
      reservation_id: reservation.id,
      type: notificationType,
      title: title,
      message: message,
      sendPush: true
    });
  }

  /**
   * Create reservation cancellation notification
   * @param {Object} reservation Cancelled reservation object
   * @returns {Promise<Object>} Created notification
   */
  async createCancellationNotification(reservation) {
    return this.createNotification({
      customer_id: reservation.user_id,
      business_id: reservation.business_id,
      reservation_id: reservation.id,
      type: 'Cancelled',
      title: 'Reservation Cancelled',
      message: `Your reservation on ${new Date(reservation.start_time).toLocaleDateString()} has been cancelled.`,
      sendPush: true
    });
  }

  /**
   * Create reservation reminder notification
   * @param {Object} reservation Reservation object
   * @returns {Promise<Object>} Created notification
   */
  async createReminderNotification(reservation) {
    return this.createNotification({
      customer_id: reservation.user_id,
      business_id: reservation.business_id,
      reservation_id: reservation.id,
      type: 'Reminder',
      title: 'Upcoming Reservation',
      message: `Reminder: You have a reservation tomorrow at ${new Date(reservation.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      sendPush: true
    });
  }

  /**
   * Create business notification about new reservation
   * @param {Object} reservation New reservation object
   * @param {string} businessOwnerCustomerId Business owner customer ID (UUID)
   * @returns {Promise<Object>} Created notification
   */
  async createBusinessReservationNotification(reservation, businessOwnerCustomerId) {
    return this.createNotification({
      customer_id: businessOwnerCustomerId,
      business_id: reservation.business_id,
      reservation_id: reservation.id,
      type: 'New Reservation',
      title: 'New Reservation',
      message: `You have a new reservation for ${new Date(reservation.start_time).toLocaleDateString()} at ${new Date(reservation.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      sendPush: true
    });
  }

  /**
   * Create promotional notification
   * @param {string} customerId Customer ID (UUID)
   * @param {number} businessId Business ID 
   * @param {string} title Notification title
   * @param {string} message Notification message
   * @returns {Promise<Object>} Created notification
   */
  async createPromotionalNotification(customerId, businessId, title, message) {
    return this.createNotification({
      customer_id: customerId,
      business_id: businessId,
      type: 'Promotional',
      title: title,
      message: message,
      sendPush: true
    });
  }
}

module.exports = new NotificationService();