const supabase = require("../config/supabaseClient");
const logger = require("../utils/logger");

class NotificationService {
  async createNotification(data) {
    try {
      const allowedTypes = [
        "Reservation - Pending",
        "Reservation - Active",
        "Reservation - Dashboard",
        "Reservation - Completed",
        "Reservation - Cancelled",
      ];
      if (!allowedTypes.includes(data.type)) {
        throw new Error(
          `Notification type must be one of: ${allowedTypes.join(", ")}`
        );
      }
      const { data: notification, error } = await supabase
        .from("notification")
        .insert([
          {
            customer_id: data.customer_id,
            business_id: data.business_id,
            reservation_id: data.reservation_id,
            type: data.type,
            title: data.title,
            message: data.message,
            is_read: false,
          },
        ])
        .select("*")
        .single();
      if (error) throw error;
      return notification;
    } catch (error) {
      logger.error(`Error creating notification: ${error.message}`, { error });
      throw error;
    }
  }
  async getUserNotifications(customerId, unreadOnly = false) {
    try {
      let query = supabase
        .from("notification")
        .select("*, reservation:reservation_id(*)")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });
      if (unreadOnly) {
        query = query.eq("is_read", false);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error(`Error getting user notifications: ${error.message}`, {
        error,
      });
      throw error;
    }
  }
  async getUnreadCount(customerId) {
    try {
      const { count, error } = await supabase
        .from("notification")
        .select("*", { count: "exact", head: true })
        .eq("customer_id", customerId)
        .eq("is_read", false);
      if (error) throw error;
      return count;
    } catch (error) {
      logger.error(`Error getting unread count: ${error.message}`, { error });
      throw error;
    }
  }
  async markAsRead(notificationId) {
    try {
      const { data, error } = await supabase
        .from("notification")
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq("id", notificationId)
        .select("*")
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error(`Error marking notification as read: ${error.message}`, {
        error,
      });
      throw error;
    }
  }
  async markAllAsRead(customerId) {
    try {
      const { error } = await supabase
        .from("notification")
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq("customer_id", customerId)
        .eq("is_read", false);
      if (error) throw error;
      return true;
    } catch (error) {
      logger.error(
        `Error marking all notifications as read: ${error.message}`,
        { error }
      );
      throw error;
    }
  }
  async createNewReservationNotification(reservation) {
    return this.createNotification({
      customer_id: reservation.customer_id,
      business_id: reservation.business_id,
      reservation_id: reservation.id,
      type: "Reservation - Pending",
      title: "Reservation Created",
      message: `Your reservation (ID: ${reservation.id}) has been created and is pending payment.`,
    });
  }
  async createDashboardReservationNotification(reservation) {
    return this.createNotification({
      customer_id: reservation.customer_id,
      business_id: reservation.business_id,
      reservation_id: reservation.id,
      type: "Reservation - Dashboard",
      title: "Reservation Created",
      message: `A new reservation (ID: ${reservation.id}) has been created from the business dashboard.`,
    });
  }
  async createReservationUpdateNotification(reservation) {
    if (reservation.status === "Active") {
      return this.createNotification({
        customer_id: reservation.customer_id,
        business_id: reservation.business_id,
        reservation_id: reservation.id,
        type: "Reservation - Active",
        title: "Reservation Active",
        message: `Your reservation (ID: ${reservation.id}) is now active.`,
      });
    } else if (reservation.status === "Completed") {
      return this.createNotification({
        customer_id: reservation.customer_id,
        business_id: reservation.business_id,
        reservation_id: reservation.id,
        type: "Reservation - Completed",
        title: "Reservation Completed",
        message: `Your reservation (ID: ${reservation.id}) has been completed.`,
      });
    } else {
      return null;
    }
  }
  async createCancellationNotification(reservation) {
    return this.createNotification({
      customer_id: reservation.customer_id,
      business_id: reservation.business_id,
      reservation_id: reservation.id,
      type: "Reservation - Cancelled",
      title: "Reservation Cancelled",
      message: `Your reservation (ID: ${reservation.id}) has been cancelled.`,
    });
  }
}

module.exports = new NotificationService();
