const express = require("express");
const router = express.Router();
const {
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation,
} = require("../controllers/reservationController");

router.post("/get", getReservations);
router.post("/create", createReservation);
router.put("/update", updateReservation);
router.delete("/delete/:reservation_id", deleteReservation);

module.exports = router;
