const supabaseClient = require('../config/supabaseClient');
const { TABLES } = require('../config/constants');
const logger = require('../utils/logger');

class Payment {
  
  static async create(paymentData) {
    try {
      const { data, error } = await supabaseClient
        .from(TABLES.CUSTOMER_PAYMENT)
        .insert([paymentData])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error creating payment record:', error);
      throw error;
    }
  }
  
  
  static async getByOrderId(orderId) {
    try {
      const { data, error } = await supabaseClient
        .from(TABLES.CUSTOMER_PAYMENT)
        .select('*')
        .eq('order_id', orderId)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error(`Error fetching payment by order ID ${orderId}:`, error);
      throw error;
    }
  }
  
 
  static async updateStatus(orderId, updateData) {
    try {
      const { data, error } = await supabaseClient
        .from(TABLES.CUSTOMER_PAYMENT)
        .update(updateData)
        .eq('order_id', orderId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error(`Error updating payment status for order ${orderId}:`, error);
      throw error;
    }
  }
  
  
  static async getByCustomerId(customerId, page = 1, limit = 10) {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      const { data, count, error } = await supabaseClient
        .from(TABLES.CUSTOMER_PAYMENT)
        .select('*', { count: 'exact' })
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
        .range(from, to);
        
      if (error) throw error;
      
      return {
        data,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      logger.error(`Error fetching payments for customer ${customerId}:`, error);
      throw error;
    }
  }
  
  
  static async getByReservationId(reservationId) {
    try {
      const { data, error } = await supabaseClient
        .from(TABLES.CUSTOMER_PAYMENT)
        .select('*')
        .eq('reservation_id', reservationId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error(`Error fetching payments for reservation ${reservationId}:`, error);
      throw error;
    }
  }
}

module.exports = Payment;