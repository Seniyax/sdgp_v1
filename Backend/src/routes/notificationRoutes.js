const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const notificationController = require("../controllers/notificationController");
const asyncHandler = require("../utils/asyncHandler");

router.use(authMiddleware);
router.get("/", asyncHandler(notificationController.getUserNotifications));
router.get(
  "/unread-count",
  asyncHandler(notificationController.getUnreadCount)
);
router.put("/:id/read", asyncHandler(notificationController.markAsRead));
router.put("/read-all", asyncHandler(notificationController.markAllAsRead));

module.exports = router;
