// paymentService.js
const { v4: uuidv4 } = require('uuid');
const Payment = require('../models/payment');
const { ERROR_MESSAGES } = require('../config/constants');
const logger = require('../utils/logger');
const pushNotification = require('../utils/pushNotification');
const supabaseClient = require('../config/supabaseClient');

class PaymentService {
  /**
   * Get reservation details with table information
   * @param {string} reservationId - Reservation ID
   * @returns {Object} - Reservation details with table information
   */
  static async getReservationWithTable(reservationId) {
    try {
      // Use a JOIN query to get reservation and table details in one go
      const { data, error } = await supabaseClient
        .from('reservation')
        .select(`
          id,
          table_id,
          customer_id,
          start_time,
          end_time,
          status,
          table:table_id (
            id,
            seats
          )
        `)
        .eq('id', reservationId)
        .single();
      
      if (error) throw error;
      
      if (!data) {
        throw new Error('Reservation not found');
      }
      
      return data;
    } catch (error) {
      logger.error(`Error fetching reservation with table: ${error.message}`);
      throw error;
    }
  }

  /**
   * Initialize a payment
   * @param {Object} paymentData - Payment details including amount, customerId, reservationId
   * @returns {Object} - Payment initialization details including checkout URL
   */
  static async initializePayment(paymentData) {
    try {
      const { customerId, reservationId, customerInfo, amount: providedAmount } = paymentData;
      
      if (!customerId) {
        throw new Error('Customer ID is required');
      }
      
      let amount = providedAmount;
      
      // If reservation ID is provided, calculate price based on seat count
      if (reservationId) {
        try {
          const reservation = await this.getReservationWithTable(reservationId);
          const seatCount = reservation.table.seats;
          
          // Calculate price based on seat count
          amount = this.calculatePriceBySeatCount(seatCount);
          
          logger.info(`Calculated price for reservation ${reservationId} with ${seatCount} seats: ${amount}`);
        } catch (error) {
          logger.error(`Error calculating price for reservation: ${error.message}`);
          // If there's an error with price calculation, use the provided amount as fallback
          if (!amount) {
            throw new Error('Unable to calculate price, and no default amount provided');
          }
        }
      } else if (!amount) {
        // If no reservation ID and no amount, we can't proceed
        throw new Error('Either reservation ID or amount must be provided');
      }
      
      // Generate a unique order ID
      const orderId = `ORD-${uuidv4().substring(0, 8)}-${Date.now()}`;
      
      // Create payment record in database
      const paymentRecord = await Payment.create({
        order_id: orderId,
        customer_id: customerId,
        reservation_id: reservationId,
        amount: amount,
        currency: 'LKR',
        status: 'PENDING'
      });
      
      // For simulation, generate a payment link based on the amount
      const paymentLink = `/simulation/pay/${orderId}`;
      
      return {
        paymentRecord,
        paymentLink,
        simulationUrl: `/api/payments/simulate?orderId=${orderId}`
      };
    } catch (error) {
      logger.error('Error initializing payment:', error);
      throw new Error(ERROR_MESSAGES.PAYMENT.INITIALIZATION_FAILED);
    }
  }
  
  /**
   * Process simulated payment
   * @param {Object} paymentData - Payment data
   * @returns {Object} - Updated payment record
   */
  static async processSimulatedPayment(orderId, status = 'success') {
    try {
      // Get payment record
      const paymentRecord = await Payment.getByOrderId(orderId);
      
      if (!paymentRecord) {
        throw new Error(ERROR_MESSAGES.PAYMENT.NOT_FOUND);
      }
      
      // Map status to codes
      const statusMap = {
        'success': 'COMPLETED',
        'pending': 'PENDING',
        'canceled': 'CANCELED',
        'failed': 'FAILED'
      };
      
      const paymentStatus = statusMap[status] || 'COMPLETED'; // Default to COMPLETED
      
      // Update payment record
      const updateData = {
        status: paymentStatus,
        payment_id: `SIM_${Date.now()}`,
        payhere_amount: paymentRecord.amount,
        payhere_currency: paymentRecord.currency,
        method: 'SIMULATION',
        status_code: paymentStatus === 'COMPLETED' ? 2 : 0,
        status_message: `Payment ${paymentStatus.toLowerCase()}`
      };
      
      const updatedPayment = await Payment.updateStatus(orderId, updateData);
      
      // If payment is completed, update reservation status
      if (paymentStatus === 'COMPLETED' && updatedPayment.reservation_id) {
        try {
          await supabaseClient
            .from('reservation')
            .update({ status: 'CONFIRMED' })
            .eq('id', updatedPayment.reservation_id);
        } catch (error) {
          logger.error(`Error updating reservation status: ${error.message}`);
          // Continue processing even if reservation update fails
        }
      }
      
      // Send notification based on payment status
      if (updatedPayment && updatedPayment.customer_id) {
        try {
          await pushNotification.sendPaymentStatusNotification(updatedPayment);
        } catch (notificationError) {
          logger.error('Error sending payment notification:', notificationError);
          // Continue anyway - notification failure shouldn't stop the process
        }
      }
      
      return updatedPayment;
    } catch (error) {
      logger.error('Error processing simulated payment:', error);
      throw error;
    }
  }
  
  /**
   * Get payment status by order ID
   * @param {string} orderId - Payment order ID
   * @returns {Object} - Payment status details
   */
  static async getPaymentStatus(orderId) {
    try {
      // Check our database
      const paymentRecord = await Payment.getByOrderId(orderId);
      
      if (!paymentRecord) {
        throw new Error(ERROR_MESSAGES.PAYMENT.NOT_FOUND);
      }
      
      return paymentRecord;
    } catch (error) {
      logger.error(`Error getting payment status for order ${orderId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get customer payment history
   * @param {string} customerId - Customer ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Object} - Payment history with pagination
   */
  static async getCustomerPaymentHistory(customerId, page = 1, limit = 10) {
    try {
      return await Payment.getByCustomerId(customerId, page, limit);
    } catch (error) {
      logger.error(`Error fetching payment history for customer ${customerId}:`, error);
      throw new Error(ERROR_MESSAGES.PAYMENT.FETCH_ERROR);
    }
  }
  
  /**
   * Get payments by reservation
   * @param {string} reservationId - Reservation ID
   * @returns {Array} - Payment records
   */
  static async getPaymentsByReservation(reservationId) {
    try {
      return await Payment.getByReservationId(reservationId);
    } catch (error) {
      logger.error(`Error fetching payments for reservation ${reservationId}:`, error);
      throw new Error(ERROR_MESSAGES.PAYMENT.FETCH_ERROR);
    }
  }
  
  /**
   * Calculate price based on seat count
   * @param {number} seatCount - Number of seats
   * @returns {number} - Calculated price
   */
  static calculatePriceBySeatCount(seatCount) {
    if (seatCount === 1) return 50;
    if (seatCount === 2) return 100;
    if (seatCount === 3) return 150;
    if (seatCount === 4) return 200;
    return 250; // 5+ seats
  }
}

module.exports = PaymentService;