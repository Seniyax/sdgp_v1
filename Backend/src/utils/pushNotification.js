// utils/pushNotification.js
const notificationService = require('../services/notificationService');
const logger = require('./logger');

class PushNotification {
  /**
   * Send a notification to a specific user
   * @param {string} customerId - Customer ID to send notification to
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {Object} metadata - Additional metadata for the notification
   * @returns {Promise<Object>} - Created notification
   */
  async sendToUser(customerId, title, message, metadata = {}) {
    try {
      // Always use 'Other' for payment notifications for now
      // We'll change this to 'Payment' when the database schema is updated
      let notificationType = 'Other';

      // Create notification in database using notification service
      const notification = await notificationService.createNotification({
        customer_id: customerId,
        business_id: metadata.businessId,
        reservation_id: metadata.reservationId,
        type: notificationType,
        title: title,
        message: message,
        sendPush: true, // Enable push notification
        metadata: metadata
      });

      logger.info(`Notification sent to user ${customerId}: ${title}`);
      return notification;
    } catch (error) {
      logger.error(`Error sending notification to user ${customerId}: ${error.message}`);
      // Don't throw to prevent disrupting payment flow
      return null;
    }
  }

  /**
   * Send a payment confirmation notification
   * @param {Object} payment - Payment record
   * @returns {Promise<Object>} - Created notification
   */
  async sendPaymentConfirmation(payment) {
    try {
      const title = 'Payment Confirmed';
      const message = `Your payment of ${payment.amount} ${payment.currency} for reservation #${payment.reservation_id} has been confirmed.`;

      return this.sendToUser(payment.customer_id, title, message, {
        type: 'PAYMENT',
        paymentId: payment.id,
        reservationId: payment.reservation_id,
        status: 'COMPLETED'
      });
    } catch (error) {
      logger.error(`Error sending payment confirmation: ${error.message}`);
      return null;
    }
  }

  /**
   * Send a payment failure notification
   * @param {Object} payment - Payment record
   * @returns {Promise<Object>} - Created notification
   */
  async sendPaymentFailure(payment) {
    try {
      const title = 'Payment Failed';
      const message = `Your payment of ${payment.amount} ${payment.currency} for reservation #${payment.reservation_id} was unsuccessful. Please try again.`;

      return this.sendToUser(payment.customer_id, title, message, {
        type: 'PAYMENT',
        paymentId: payment.id,
        reservationId: payment.reservation_id,
        status: 'FAILED'
      });
    } catch (error) {
      logger.error(`Error sending payment failure notification: ${error.message}`);
      return null;
    }
  }

  /**
   * Send a payment cancellation notification
   * @param {Object} payment - Payment record
   * @returns {Promise<Object>} - Created notification
   */
  async sendPaymentCancellation(payment) {
    try {
      const title = 'Payment Cancelled';
      const message = `Your payment of ${payment.amount} ${payment.currency} for reservation #${payment.reservation_id} has been cancelled.`;

      return this.sendToUser(payment.customer_id, title, message, {
        type: 'PAYMENT',
        paymentId: payment.id,
        reservationId: payment.reservation_id,
        status: 'CANCELLED'
      });
    } catch (error) {
      logger.error(`Error sending payment cancellation notification: ${error.message}`);
      return null;
    }
  }

  /**
   * Send notification based on payment status
   * @param {Object} payment - Payment record
   * @returns {Promise<Object>} - Created notification
   */
  async sendPaymentStatusNotification(payment) {
    switch (payment.status) {
      case 'COMPLETED':
        return this.sendPaymentConfirmation(payment);
      case 'FAILED':
        return this.sendPaymentFailure(payment);
      case 'CANCELED':
        return this.sendPaymentCancellation(payment);
      default:
        // Don't send notifications for pending or other statuses
        return null;
    }
  }
}

module.exports = new PushNotification();