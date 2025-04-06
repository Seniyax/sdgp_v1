const notificationService = require("../services/notificationService");

class InAppNotification {
  async sendReservationCreationNotification(reservation) {
    if (reservation.customer_id) {
      return notificationService.createNewReservationNotification(reservation);
    } else {
      return notificationService.createDashboardReservationNotification(
        reservation
      );
    }
  }

  async sendReservationStatusUpdateNotification(reservation) {
    return notificationService.createReservationUpdateNotification(reservation);
  }

  async sendReservationCancellationNotification(reservation) {
    return notificationService.createCancellationNotification(reservation);
  }
}

module.exports = new InAppNotification();
