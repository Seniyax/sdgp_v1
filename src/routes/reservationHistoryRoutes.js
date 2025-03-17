const express = require("express");
const router = express.Router();
const { getReservationHistory } = require("../controllers/reservationHistoryController");

router.get("/", getReservationHistory);

module.exports = router;