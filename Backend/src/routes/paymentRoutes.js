// paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// Initialize a payment
router.post('/initialize', authMiddleware, paymentController.initializePayment);

// Simulate payment - can be accessed via both GET and POST
router.get('/simulate', paymentController.simulatePayment);
router.post('/simulate', paymentController.simulatePayment);

// Get payment status by order ID
router.get('/status/:orderId', authMiddleware, paymentController.getPaymentStatus);

// Get customer payment history
router.get('/history', authMiddleware, paymentController.getCustomerPaymentHistory);

// Get payments by reservation ID
router.get('/reservation/:reservationId', authMiddleware, paymentController.getPaymentsByReservation);

module.exports = router;