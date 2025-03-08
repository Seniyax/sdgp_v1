const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const asyncHandler = require('../utils/asyncHandler');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have auth middleware

// Apply auth middleware to all notification routes
router.use(authMiddleware);

// Get user's notifications
router.get(
  '/',
  asyncHandler(notificationController.getUserNotifications)
);

// Get count of unread notifications
router.get(
  '/unread-count',
  asyncHandler(notificationController.getUnreadCount)
);

// Get subscription info for real-time notifications
router.get(
  '/subscribe',
  asyncHandler(notificationController.subscribeToNotifications)
);

// Mark a notification as read
router.put(
  '/:id/read',
  asyncHandler(notificationController.markAsRead)
);

// Mark all notifications as read
router.put(
  '/read-all',
  asyncHandler(notificationController.markAllAsRead)
);

// Register device token for push notifications
router.post(
  '/device-token',
  asyncHandler(notificationController.registerDeviceToken)
);

// Delete device token
router.delete(
  '/device-token',
  asyncHandler(notificationController.deleteDeviceToken)
);

module.exports = router;