const ApiResponse = require('../utils/responses');
const notificationService = require('../services/notificationService');
const supabase = require('../config/supabaseClient');
const logger = require('../utils/logger');

class NotificationController {
  /**
   * Get notifications for the authenticated user
   * @param {Object} req Express request
   * @param {Object} res Express response
   */
  async getUserNotifications(req, res) {
    const { unread_only } = req.query;
    const userId = req.user.id; // Assuming auth middleware sets req.user
    
    try {
      const notifications = await notificationService.getUserNotifications(
        userId,
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

  /**
   * Get count of unread notifications for the user
   * @param {Object} req Express request
   * @param {Object} res Express response
   */
  async getUnreadCount(req, res) {
    const userId = req.user.id; // Assuming auth middleware sets req.user
    
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
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

  /**
   * Mark a notification as read
   * @param {Object} req Express request
   * @param {Object} res Express response
   */
  async markAsRead(req, res) {
    const { id } = req.params;
    const userId = req.user.id; // Assuming auth middleware sets req.user
    
    try {
      // First check if the notification belongs to the user
      const { data: notification, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
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

  /**
   * Mark all user's notifications as read
   * @param {Object} req Express request
   * @param {Object} res Express response
   */
  async markAllAsRead(req, res) {
    const userId = req.user.id; // Assuming auth middleware sets req.user
    
    try {
      await notificationService.markAllAsRead(userId);
      
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

  /**
   * Register a device token for push notifications
   * @param {Object} req Express request
   * @param {Object} res Express response
   */
  async registerDeviceToken(req, res) {
    const { device_token, device_type } = req.body;
    const userId = req.user.id; // Assuming auth middleware sets req.user
    
    if (!device_token || !device_type) {
      return ApiResponse.badRequest(res, {
        message: 'Device token and device type are required'
      });
    }
    
    if (!['ANDROID', 'IOS'].includes(device_type)) {
      return ApiResponse.badRequest(res, {
        message: 'Device type must be ANDROID or IOS'
      });
    }
    
    try {
      const token = await notificationService.registerDeviceToken(
        userId,
        device_token,
        device_type
      );
      
      return ApiResponse.success(res, {
        message: 'Device token registered successfully',
        data: token
      });
    } catch (error) {
      logger.error(`Error registering device token: ${error.message}`);
      return ApiResponse.error(res, {
        message: 'Error registering device token',
        errors: error.message
      });
    }
  }

  /**
   * Delete a device token
   * @param {Object} req Express request
   * @param {Object} res Express response
   */
  async deleteDeviceToken(req, res) {
    const { device_token } = req.body;
    const userId = req.user.id; // Assuming auth middleware sets req.user
    
    if (!device_token) {
      return ApiResponse.badRequest(res, {
        message: 'Device token is required'
      });
    }
    
    try {
      const { error } = await supabase
        .from('device_tokens')
        .delete()
        .eq('device_token', device_token)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      return ApiResponse.success(res, {
        message: 'Device token deleted successfully'
      });
    } catch (error) {
      logger.error(`Error deleting device token: ${error.message}`);
      return ApiResponse.error(res, {
        message: 'Error deleting device token',
        errors: error.message
      });
    }
  }

  /**
   * Subscribe to real-time notifications
   * This endpoint provides information to the client
   * about how to subscribe to real-time updates
   * @param {Object} req Express request
   * @param {Object} res Express response 
   */
  async subscribeToNotifications(req, res) {
    const userId = req.user.id; // Assuming auth middleware sets req.user
    
    // The client will need to use Supabase's subscribe functionality
    // We're just providing instructions here
    return ApiResponse.success(res, {
      message: 'To receive real-time notifications, subscribe to the notifications table with your user ID',
      data: {
        channel: 'notifications',
        filter: `user_id=eq.${userId}`,
        instructions: 'Use supabase.channel(channel).on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter }, callback).subscribe()'
      }
    });
  }
}

module.exports = new NotificationController();