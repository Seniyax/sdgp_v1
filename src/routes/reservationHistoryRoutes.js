const express = require("express");
const router = express.Router();
const { getReservationHistory } = require("../controllers/reservationHistoryController");
const authController = require('../controllers/authControllers'); 

router.post("/", authController.requireAuth, getReservationHistory);

module.exports = router;