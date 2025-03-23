const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Initialize a payment
router.post("/initialize", paymentController.initializePayment);

// Simulate payment - can be accessed via both GET and POST (remains public)
router.get("/simulate", paymentController.simulatePayment);
router.post("/simulate", paymentController.simulatePayment);

// Get payment status by order ID
router.get("/status/:orderId", paymentController.getPaymentStatus);

// Get customer payment history
router.get("/history", paymentController.getCustomerPaymentHistory);

// Get payments by reservation ID
router.get(
  "/reservation/:reservationId",
  paymentController.getPaymentsByReservation
);

module.exports = router;
