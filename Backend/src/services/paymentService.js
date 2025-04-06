const { v4: uuidv4 } = require("uuid");
const Payment = require("../models/payment");
const { ERROR_MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");
const supabaseClient = require("../config/supabaseClient");

class PaymentService {
  static async getReservationWithTable(reservationId) {
    try {
      const { data, error } = await supabaseClient
        .from("reservation")
        .select(
          `
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
        `
        )
        .eq("id", reservationId)
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error("Reservation not found");
      }

      return data;
    } catch (error) {
      logger.error(`Error fetching reservation with table: ${error.message}`);
      throw error;
    }
  }

  static async initializePayment(paymentData) {
    try {
      const {
        customerId,
        reservationId,
        customerInfo,
        amount: providedAmount,
      } = paymentData;

      if (!customerId) {
        throw new Error("Customer ID is required");
      }

      let amount = providedAmount;
      if (!amount && reservationId) {
        try {
          const reservation = await this.getReservationWithTable(reservationId);
          const seatCount = reservation.table.seats;
          amount = this.calculatePriceBySeatCount(seatCount);
          logger.info(
            `Calculated price for reservation ${reservationId} with ${seatCount} seats: ${amount}`
          );
        } catch (error) {
          logger.error(
            `Error calculating price for reservation: ${error.message}`
          );
          if (!amount) {
            throw new Error(
              "Unable to calculate price, and no default amount provided"
            );
          }
        }
      } else if (!amount) {
        throw new Error("Either reservation ID or amount must be provided");
      }

      const orderId = `ORD-${uuidv4().substring(0, 8)}-${Date.now()}`;
      const paymentRecord = await Payment.create({
        order_id: orderId,
        customer_id: customerId,
        reservation_id: reservationId,
        amount: amount,
        currency: "LKR",
        status: "PENDING",
      });

      const paymentLink = `/simulation/pay/${orderId}`;

      return {
        paymentRecord,
        paymentLink,
        simulationUrl: `/api/payments/simulate?orderId=${orderId}`,
      };
    } catch (error) {
      logger.error("Error initializing payment:", error);
      throw new Error(ERROR_MESSAGES.PAYMENT.INITIALIZATION_FAILED);
    }
  }

  static async processSimulatedPayment(orderId, status = "success") {
    try {
      const paymentRecord = await Payment.getByOrderId(orderId);

      if (!paymentRecord) {
        throw new Error(ERROR_MESSAGES.PAYMENT.NOT_FOUND);
      }
      const statusMap = {
        success: "COMPLETED",
        pending: "PENDING",
        canceled: "CANCELED",
        failed: "FAILED",
      };

      const paymentStatus = statusMap[status] || "COMPLETED";
      const updateData = {
        status: paymentStatus,
        payment_id: `SIM_${Date.now()}`,
        payhere_amount: paymentRecord.amount,
        payhere_currency: paymentRecord.currency,
        method: "SIMULATION",
        status_code: paymentStatus === "COMPLETED" ? 2 : 0,
        status_message: `Payment ${paymentStatus.toLowerCase()}`,
      };

      const updatedPayment = await Payment.updateStatus(orderId, updateData);
      if (paymentStatus === "COMPLETED" && updatedPayment.reservation_id) {
        try {
          await supabaseClient
            .from("reservation")
            .update({ status: "CONFIRMED" })
            .eq("id", updatedPayment.reservation_id);
        } catch (error) {
          logger.error(`Error updating reservation status: ${error.message}`);
        }
      }

      // Removed the notification sending logic

      return updatedPayment;
    } catch (error) {
      logger.error("Error processing simulated payment:", error);
      throw error;
    }
  }

  static async getPaymentStatus(orderId) {
    try {
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

  static async getCustomerPaymentHistory(customerId, page = 1, limit = 10) {
    try {
      return await Payment.getByCustomerId(customerId, page, limit);
    } catch (error) {
      logger.error(
        `Error fetching payment history for customer ${customerId}:`,
        error
      );
      throw new Error(ERROR_MESSAGES.PAYMENT.FETCH_ERROR);
    }
  }

  static async getPaymentsByReservation(reservationId) {
    try {
      return await Payment.getByReservationId(reservationId);
    } catch (error) {
      logger.error(
        `Error fetching payments for reservation ${reservationId}:`,
        error
      );
      throw new Error(ERROR_MESSAGES.PAYMENT.FETCH_ERROR);
    }
  }

  static calculatePriceBySeatCount(seatCount) {
    if (seatCount === 1) return 50;
    if (seatCount === 2) return 100;
    if (seatCount === 3) return 150;
    if (seatCount === 4) return 200;
    return 250;
  }
}

module.exports = PaymentService;
