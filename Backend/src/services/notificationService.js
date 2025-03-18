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
      if (data.sendPush) {
        await this.triggerPushNotification(data.customer_id, data.title, data.message);
      }
      
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

  
  async registerDeviceToken(customerId, deviceToken, deviceType) {
    try {
      if (!['Android', 'iOS'].includes(deviceType)) {
        throw new Error("Device type must be 'Android' or 'iOS'");
      }
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

  
  async triggerPushNotification(customerId, title, message) {
    try {
      const { data: tokens, error } = await supabase
        .from('device_token')
        .select('device_token, device_type')
        .eq('customer_id', customerId);
        
      if (error) throw error;
      
      if (!tokens || tokens.length === 0) {
        logger.info(`No device tokens found for customer ${customerId}`);
        return false;
      }
      
      
      logger.info(`Push notification triggerable for customer ${customerId} with ${tokens.length} devices`);
      
      return true;
    } catch (error) {
      logger.error(`Error triggering push notification: ${error.message}`, { error });
      return false;
    }
  }

  
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