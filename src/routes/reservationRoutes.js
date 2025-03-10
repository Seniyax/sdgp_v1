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