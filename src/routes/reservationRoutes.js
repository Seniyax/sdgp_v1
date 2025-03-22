const express = require("express");
const router = express.Router();
const {
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation,
} = require("../controllers/reservationController");

// Retrieve reservations by business_id (expecting it in the request body)
router.post("/get", getReservations);

// Create a new reservation
router.post("/create", createReservation);

// Update an existing reservation
router.put("/update", updateReservation);

// Delete a reservation (using a URL parameter for reservation_id)
router.delete("/delete/:reservation_id", deleteReservation);

module.exports = router;
