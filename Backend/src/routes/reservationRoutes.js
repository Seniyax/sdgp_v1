<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const asyncHandler = require('../utils/asyncHandler');

// Get available slots for a business on a specific date
router.get(
    '/available-slots',
    asyncHandler(reservationController.getAvailableSlots)
);

// Create a new reservation
router.post(
    '/',
    asyncHandler(reservationController.createReservation)
);

// Get reservation by ID
router.get(
    '/:id',
    asyncHandler(reservationController.getReservation)
);

// Get reservation history for a user
router.get(
    '/history/:userId',
    asyncHandler(reservationController.getReservationHistory)
);

// Get reservations for a business
router.get(
    '/business/:business_id',
    asyncHandler(reservationController.getBusinessReservations)
);

// Update a reservation
router.put(
    '/:id',
    asyncHandler(reservationController.updateReservation)
);

// Cancel a reservation
router.delete(
    '/:id',
    asyncHandler(reservationController.cancelReservation)
);

module.exports = router;
=======
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
>>>>>>> teamA
