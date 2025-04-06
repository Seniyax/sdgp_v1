const express = require("express");
const router = express.Router();
const {
  getReservationHistory,
} = require("../controllers/reservationHistoryController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, getReservationHistory);

module.exports = router;
