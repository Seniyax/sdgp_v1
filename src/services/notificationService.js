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
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert([{
          user_id: data.user_id,
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
      
      // For in-app notifications, Supabase Realtime will automatically send updates
      // to subscribed clients via WebSockets
      
      // If push notification is enabled, trigger it
      if (data.sendPush) {
        await this.triggerPushNotification(data.user_id, data.title, data.message);
      }
      
      return notification;
    } catch (error) {
      logger.error(`Error creating notification: ${error.message}`, { error });
      throw error;
    }
  }

  /**
   * Get all notifications for a user
   * @param {number} userId User ID
   * @param {boolean} unreadOnly Only get unread notifications
   * @returns {Promise<Array>} User notifications
   */
  async getUserNotifications(userId, unreadOnly = false) {
    try {
      let query = supabase
        .from('notifications')
        .select('*, reservation:reservation_id(*)')
        .eq('user_id', userId)
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
        .from('notifications')
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
   * @param {number} userId User ID
   * @returns {Promise<boolean>} Success status
   */
  async markAllAsRead(userId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('user_id', userId)
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
   * @param {number} userId User ID
   * @param {string} deviceToken Device token
   * @param {string} deviceType Device type (ANDROID, IOS)
   * @returns {Promise<Object>} Created or updated device token
   */
  async registerDeviceToken(userId, deviceToken, deviceType) {
    try {
      // Check if token already exists
      const { data: existingToken, error: fetchError } = await supabase
        .from('device_tokens')
        .select('*')
        .eq('device_token', deviceToken)
        .single();
        
      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw fetchError;
      }
      
      // Update existing token or create new one
      if (existingToken) {
        const { data, error } = await supabase
          .from('device_tokens')
          .update({
            user_id: userId,
            device_type: deviceType,
            last_used_at: new Date().toISOString()
          })
          .eq('id', existingToken.id)
          .select('*')
          .single();
          
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('device_tokens')
          .insert([{
            user_id: userId,
            device_token: deviceToken,
            device_type: deviceType
          }])
          .select('*')
          .single();
          
        if (error) throw error;
        return data;
      }
    } catch (error) {
      logger.error(`Error registering device token: ${error.message}`, { error });
      throw error;
    }
  }

  /**
   * Trigger push notification to a user's devices
   * This will be handled by the mobile app subscribing to Supabase Realtime
   * and/or a Supabase Edge Function that forwards to a push notification service
   * @param {number} userId User ID
   * @param {string} title Notification title
   * @param {string} message Notification message
   * @returns {Promise<boolean>} Success status
   */
  async triggerPushNotification(userId, title, message) {
    try {
      // Get user's device tokens
      const { data: tokens, error } = await supabase
        .from('device_tokens')
        .select('device_token, device_type')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      if (!tokens || tokens.length === 0) {
        logger.info(`No device tokens found for user ${userId}`);
        return false;
      }
      
      // For actual push notifications, you would either:
      // 1. Call a Supabase Edge Function that forwards to a push service
      // 2. Have the mobile app subscribe to Supabase Realtime and handle notifications
      // 3. Implement your own push notification service
      
      // This is a placeholder for the actual implementation
      logger.info(`Push notification triggered for user ${userId} with ${tokens.length} devices`);
      
      return true;
    } catch (error) {
      logger.error(`Error triggering push notification: ${error.message}`, { error });
      // Don't throw the error, just log it and return false
      return false;
    }
  }

  /**
   * Create reservation confirmation notification
   * @param {Object} reservation Reservation object
   * @returns {Promise<Object>} Created notification
   */
  async createReservationConfirmation(reservation) {
    return this.createNotification({
      user_id: reservation.user_id,
      business_id: reservation.business_id,
      reservation_id: reservation.id,
      type: 'RESERVATION_CONFIRMATION',
      title: 'Reservation Confirmed',
      message: `Your reservation on ${new Date(reservation.start_time).toLocaleDateString()} has been confirmed.`,
      sendPush: true
    });
  }

  /**
   * Create reservation update notification
   * @param {Object} reservation Updated reservation object
   * @returns {Promise<Object>} Created notification
   */
  async createReservationUpdate(reservation) {
    return this.createNotification({
      user_id: reservation.user_id,
      business_id: reservation.business_id,
      reservation_id: reservation.id,
      type: 'RESERVATION_UPDATE',
      title: 'Reservation Updated',
      message: `Your reservation has been updated to ${new Date(reservation.start_time).toLocaleDateString()} at ${new Date(reservation.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      sendPush: true
    });
  }

  /**
   * Create reservation cancellation notification
   * @param {Object} reservation Cancelled reservation object
   * @returns {Promise<Object>} Created notification
   */
  async createReservationCancellation(reservation) {
    return this.createNotification({
      user_id: reservation.user_id,
      business_id: reservation.business_id,
      reservation_id: reservation.id,
      type: 'RESERVATION_CANCELLATION',
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
  async createReservationReminder(reservation) {
    return this.createNotification({
      user_id: reservation.user_id,
      business_id: reservation.business_id,
      reservation_id: reservation.id,
      type: 'RESERVATION_REMINDER',
      title: 'Upcoming Reservation',
      message: `Reminder: You have a reservation tomorrow at ${new Date(reservation.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      sendPush: true
    });
  }

  /**
   * Create business notification about new reservation
   * @param {Object} reservation New reservation object
   * @param {number} businessOwnerId Business owner user ID
   * @returns {Promise<Object>} Created notification
   */
  async createBusinessReservationNotification(reservation, businessOwnerId) {
    return this.createNotification({
      user_id: businessOwnerId,
      business_id: reservation.business_id,
      reservation_id: reservation.id,
      type: 'BUSINESS_NEW_RESERVATION',
      title: 'New Reservation',
      message: `You have a new reservation for ${new Date(reservation.start_time).toLocaleDateString()} at ${new Date(reservation.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      sendPush: true
    });
  }
}

module.exports = new NotificationService();