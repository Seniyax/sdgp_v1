const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const asyncHandler = require('../utils/asyncHandler');
const authController = require('../controllers/authControllers'); // Changed import

// Apply auth middleware to all notification routes
router.use(authController.requireAuth); // Using requireAuth instead of authMiddleware

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

module.exports = router;