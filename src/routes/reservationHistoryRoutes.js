const express = require("express");
const router = express.Router();
const {
  getReservationHistory,
} = require("../controllers/reservationHistoryController");

router.post("/", getReservationHistory);

module.exports = router;
