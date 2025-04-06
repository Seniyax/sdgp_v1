const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/initialize", authMiddleware, paymentController.initializePayment);
router.get("/simulate", paymentController.simulatePayment);
router.post("/simulate", paymentController.simulatePayment);
router.get(
  "/status/:orderId",
  authMiddleware,
  paymentController.getPaymentStatus
);
router.get(
  "/history",
  authMiddleware,
  paymentController.getCustomerPaymentHistory
);
router.get(
  "/reservation/:reservationId",
  authMiddleware,
  paymentController.getPaymentsByReservation
);

module.exports = router;
