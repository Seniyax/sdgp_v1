const ApiResponse = require('../utils/responses');
const notificationService = require('../services/notificationService');
const supabase = require('../config/supabaseClient');
const logger = require('../utils/logger');

class NotificationController {
  async getUserNotifications(req, res) {
    const { unread_only } = req.query;
    const customerId = req.user.id; 
    
    try {
      const notifications = await notificationService.getUserNotifications(
        customerId,
        unread_only === 'true'
      );
      
      return ApiResponse.success(res, {
        data: notifications
      });
    } catch (error) {
      logger.error(`Error getting user notifications: ${error.message}`);
      return ApiResponse.error(res, {
        message: 'Error fetching notifications',
        errors: error.message
      });
    }
  }

  async getUnreadCount(req, res) {
    const customerId = req.user.id; 
    
    try {
      const { count, error } = await supabase
        .from('notification')
        .select('*', { count: 'exact', head: true })
        .eq('customer_id', customerId)
        .eq('is_read', false);
        
      if (error) throw error;
      
      return ApiResponse.success(res, {
        data: { count }
      });
    } catch (error) {
      logger.error(`Error getting unread notification count: ${error.message}`);
      return ApiResponse.error(res, {
        message: 'Error fetching unread notification count',
        errors: error.message
      });
    }
  }
  
  async markAsRead(req, res) {
    const { id } = req.params;
    const customerId = req.user.id; 
    
    try {
      const { data: notification, error: fetchError } = await supabase
        .from('notification')
        .select('*')
        .eq('id', id)
        .eq('customer_id', customerId)
        .single();
        
      if (fetchError) {
        return ApiResponse.notFound(res, {
          message: 'Notification not found or does not belong to the user'
        });
      }
      
      const updatedNotification = await notificationService.markAsRead(id);
      
      return ApiResponse.success(res, {
        message: 'Notification marked as read',
        data: updatedNotification
      });
    } catch (error) {
      logger.error(`Error marking notification as read: ${error.message}`);
      return ApiResponse.error(res, {
        message: 'Error marking notification as read',
        errors: error.message
      });
    }
  }
  
  async markAllAsRead(req, res) {
    const customerId = req.user.id; 
    
    try {
      await notificationService.markAllAsRead(customerId);
      
      return ApiResponse.success(res, {
        message: 'All notifications marked as read'
      });
    } catch (error) {
      logger.error(`Error marking all notifications as read: ${error.message}`);
      return ApiResponse.error(res, {
        message: 'Error marking all notifications as read',
        errors: error.message
      });
    }
  }

  subscribeToNotifications(req, res) {
    const customerId = req.user.id; 
    return ApiResponse.success(res, {
      message: 'To receive real-time notifications, subscribe to the notification table with your customer ID',
      data: {
        channel: 'notification',
        filter: `customer_id=eq.${customerId}`,
        instructions: 'Use supabase.channel(channel).on("postgres_changes", { event: "*", schema: "public", table: "notification", filter }, callback).subscribe()'
      }
    });
  }
}

module.exports = new NotificationController();