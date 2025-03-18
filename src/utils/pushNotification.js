const notificationService = require('../services/notificationService');
const logger = require('./logger');

class PushNotification {
  async sendToUser(customerId, title, message, metadata = {}) {
    try {
      let notificationType = 'Other';
      const notification = await notificationService.createNotification({
        customer_id: customerId,
        business_id: metadata.businessId,
        reservation_id: metadata.reservationId,
        type: notificationType,
        title: title,
        message: message,
        sendPush: true, 
        metadata: metadata
      });

      logger.info(`Notification sent to user ${customerId}: ${title}`);
      return notification;
    } catch (error) {
      logger.error(`Error sending notification to user ${customerId}: ${error.message}`);
      return null;
    }
  }

 
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

  
  async sendPaymentStatusNotification(payment) {
    switch (payment.status) {
      case 'COMPLETED':
        return this.sendPaymentConfirmation(payment);
      case 'FAILED':
        return this.sendPaymentFailure(payment);
      case 'CANCELED':
        return this.sendPaymentCancellation(payment);
      default:
        return null;
    }
  }
}

module.exports = new PushNotification();