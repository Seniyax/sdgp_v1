// paymentController.js
const PaymentService = require('../services/paymentService');
const ApiResponse = require('../utils/responses');
const logger = require('../utils/logger');
const { HTTP_STATUS, SUCCESS_MESSAGES } = require('../config/constants');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Initialize a payment
 */
const initializePayment = asyncHandler(async (req, res) => {
  const { amount, reservationId, customerInfo } = req.body;
  // Assuming auth middleware adds user or we get customerId from request
  const customerId = req.user?.id || req.body.customerId;
  
  if (!customerId) {
    return ApiResponse.badRequest(res, {
      message: 'Customer ID is required'
    });
  }
  
  const payment = await PaymentService.initializePayment({
    amount,
    customerId,
    reservationId,
    customerInfo
  });
  
  return ApiResponse.success(res, {
    message: SUCCESS_MESSAGES.PAYMENT.INITIALIZED,
    data: payment
  });
});

/**
 * Simulate a payment
 */
const simulatePayment = asyncHandler(async (req, res) => {
  const { orderId, status = 'success' } = req.query.orderId ? req.query : req.body;
  
  if (!orderId) {
    return ApiResponse.badRequest(res, {
      message: 'Order ID is required'
    });
  }
  
  // Validate status
  const validStatuses = ['success', 'failed', 'canceled', 'pending'];
  const paymentStatus = status || 'success';
  
  if (!validStatuses.includes(paymentStatus)) {
    return ApiResponse.badRequest(res, {
      message: 'Invalid status',
      errors: `Status must be one of: ${validStatuses.join(', ')}`
    });
  }
  
  const updatedPayment = await PaymentService.processSimulatedPayment(orderId, paymentStatus);
  
  return ApiResponse.success(res, {
    message: `Payment status simulated as ${paymentStatus}`,
    data: updatedPayment
  });
});

/**
 * Get payment status
 */
const getPaymentStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  
  const paymentStatus = await PaymentService.getPaymentStatus(orderId);
  
  return ApiResponse.success(res, {
    message: SUCCESS_MESSAGES.PAYMENT.FETCHED,
    data: paymentStatus
  });
});

/**
 * Get customer payment history
 */
const getCustomerPaymentHistory = asyncHandler(async (req, res) => {
  // Assuming auth middleware adds user object or we get customerId from request
  const customerId = req.user?.id || req.query.customerId;
  const { page = 1, limit = 10 } = req.query;
  
  if (!customerId) {
    return ApiResponse.badRequest(res, {
      message: 'Customer ID is required'
    });
  }
  
  const payments = await PaymentService.getCustomerPaymentHistory(
    customerId,
    parseInt(page),
    parseInt(limit)
  );
  
  return ApiResponse.success(res, {
    message: SUCCESS_MESSAGES.PAYMENT.FETCHED,
    data: payments.data,
    pagination: payments.pagination
  });
});

/**
 * Get payments by reservation
 */
const getPaymentsByReservation = asyncHandler(async (req, res) => {
  const { reservationId } = req.params;
  
  const payments = await PaymentService.getPaymentsByReservation(reservationId);
  
  return ApiResponse.success(res, {
    message: SUCCESS_MESSAGES.PAYMENT.FETCHED,
    data: payments
  });
});

module.exports = {
  initializePayment,
  simulatePayment,
  getPaymentStatus,
  getCustomerPaymentHistory,
  getPaymentsByReservation
};