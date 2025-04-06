const ApiResponse = require("../utils/responses");
const notificationService = require("../services/notificationService");
const logger = require("../utils/logger");

class NotificationController {
  async getUserNotifications(req, res) {
    if (!req.user)
      return ApiResponse.error(res, { message: "Unauthorized access" });
    const { unread_only } = req.query;
    const customerId = req.user.id;
    try {
      const notifications = await notificationService.getUserNotifications(
        customerId,
        unread_only === "true"
      );
      return ApiResponse.success(res, { data: notifications });
    } catch (error) {
      logger.error(`Error getting user notifications: ${error.message}`);
      return ApiResponse.error(res, {
        message: "Error fetching notifications",
        errors: error.message,
      });
    }
  }
  async getUnreadCount(req, res) {
    if (!req.user)
      return ApiResponse.error(res, { message: "Unauthorized access" });
    const customerId = req.user.id;
    try {
      const count = await notificationService.getUnreadCount(customerId);
      return ApiResponse.success(res, { data: { count } });
    } catch (error) {
      logger.error(`Error getting unread notification count: ${error.message}`);
      return ApiResponse.error(res, {
        message: "Error fetching unread notification count",
        errors: error.message,
      });
    }
  }
  async markAsRead(req, res) {
    if (!req.user)
      return ApiResponse.error(res, { message: "Unauthorized access" });
    const { id } = req.params;
    const customerId = req.user.id;
    try {
      const notifications = await notificationService.getUserNotifications(
        customerId
      );
      if (!notifications || notifications.length === 0) {
        return ApiResponse.notFound(res, {
          message: "No notifications found for the user",
        });
      }
      const notif = notifications.find((n) => n.id == id);
      if (!notif) {
        return ApiResponse.notFound(res, {
          message: "Notification not found or does not belong to the user",
        });
      }
      const updatedNotification = await notificationService.markAsRead(id);
      return ApiResponse.success(res, {
        message: "Notification marked as read",
        data: updatedNotification,
      });
    } catch (error) {
      logger.error(`Error marking notification as read: ${error.message}`);
      return ApiResponse.error(res, {
        message: "Error marking notification as read",
        errors: error.message,
      });
    }
  }
  async markAllAsRead(req, res) {
    if (!req.user)
      return ApiResponse.error(res, { message: "Unauthorized access" });
    const customerId = req.user.id;
    try {
      await notificationService.markAllAsRead(customerId);
      return ApiResponse.success(res, {
        message: "All notifications marked as read",
      });
    } catch (error) {
      logger.error(`Error marking all notifications as read: ${error.message}`);
      return ApiResponse.error(res, {
        message: "Error marking all notifications as read",
        errors: error.message,
      });
    }
  }
}

module.exports = new NotificationController();
