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
    const customerId = req.user.id; // Assuming auth middleware sets req.user
    
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

  /**
   * Get count of unread notifications for the user
   * @param {Object} req Express request
   * @param {Object} res Express response
   */
  async getUnreadCount(req, res) {
    const customerId = req.user.id; // Assuming auth middleware sets req.user
    
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

  /**
   * Mark a notification as read
   * @param {Object} req Express request
   * @param {Object} res Express response
   */
  async markAsRead(req, res) {
    const { id } = req.params;
    const customerId = req.user.id; // Assuming auth middleware sets req.user
    
    try {
      // First check if the notification belongs to the user
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

  /**
   * Mark all user's notifications as read
   * @param {Object} req Express request
   * @param {Object} res Express response
   */
  async markAllAsRead(req, res) {
    const customerId = req.user.id; // Assuming auth middleware sets req.user
    
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

  /**
   * Register a device token for push notifications
   * @param {Object} req Express request
   * @param {Object} res Express response
   */
  async registerDeviceToken(req, res) {
    const { device_token, device_type } = req.body;
    const customerId = req.user.id; // Assuming auth middleware sets req.user
    
    if (!device_token || !device_type) {
      return ApiResponse.badRequest(res, {
        message: 'Device token and device type are required'
      });
    }
    
    // Make sure device_type matches the expected values in the DB schema
    const normalizedDeviceType = device_type.charAt(0).toUpperCase() + device_type.slice(1).toLowerCase();
    
    if (!['Android', 'iOS'].includes(normalizedDeviceType)) {
      return ApiResponse.badRequest(res, {
        message: "Device type must be 'Android' or 'iOS'"
      });
    }
    
    try {
      const token = await notificationService.registerDeviceToken(
        customerId,
        device_token,
        normalizedDeviceType
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
    const customerId = req.user.id; // Assuming auth middleware sets req.user
    
    if (!device_token) {
      return ApiResponse.badRequest(res, {
        message: 'Device token is required'
      });
    }
    
    try {
      const { error } = await supabase
        .from('device_token')
        .delete()
        .eq('device_token', device_token)
        .eq('customer_id', customerId);
        
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
    const customerId = req.user.id; // Assuming auth middleware sets req.user
    
    // The client will need to use Supabase's subscribe functionality
    // We're just providing instructions here
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