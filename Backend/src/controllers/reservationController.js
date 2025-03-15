const axios = require("axios");
const {
  getReservationsByBusiness,
  createReservationModel,
  updateReservationModel,
  deleteReservationModel,
} = require("../models/reservation");

exports.getReservations = async (req, res) => {
  const { business_id } = req.body;
  if (!business_id) {
    return res.status(400).json({
      success: false,
      message: "business_id is required",
    });
  }
  try {
    const reservations = await getReservationsByBusiness(business_id);
    return res.status(200).json({
      success: true,
      reservations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving reservations",
      error: error.message,
    });
  }
};

exports.createReservation = async (req, res) => {
  const {
    business_id,
    table_number,
    customer_username,
    group_size,
    slot_type,
    start_time,
  } = req.body;
  if (
    !business_id ||
    !table_number ||
    !customer_username ||
    !group_size ||
    !slot_type ||
    !start_time
  ) {
    return res.status(400).json({
      success: false,
      message:
        "business_id, table_number, customer_username, group_size, slot_type and start_time are required",
    });
  }
  const today = new Date()
    .toLocaleString("en-CA", { timeZone: "Asia/Colombo" })
    .split(",")[0];

  try {
    const mlResponse = await axios.post(
      "http://localhost:3000/api/ml/predict",
      {
        group_size: group_size.toString(),
        slot_type: "casual",
        date: today,
        time: start_time,
      }
    );

    if (!mlResponse.data.success) {
      throw new Error("ML prediction failed");
    }
    const predictedTime = mlResponse.data.predicted_time;

    const reservationData = {
      businessId: business_id,
      tableNumber: table_number,
      customerUsername: customer_username,
      groupSize: group_size,
      startTime: start_time,
      endTime: predictedTime,
    };

    const reservation = await createReservationModel(reservationData);

    if (req.app.locals.io) {
      req.app.locals.io.emit("reservationCreated", reservation);
    }
    return res.status(201).json({
      success: true,
      reservation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating reservation",
      error: error.message,
    });
  }
};

exports.updateReservation = async (req, res) => {
  const { reservation_id, update_data } = req.body;
  if (!reservation_id || !customer_username) {
    return res.status(400).json({
      success: false,
      message: "reservation_id and customer_username are required",
    });
  }
  try {
    const reservation = await updateReservationModel(
      reservation_id,
      update_data
    );
    if (req.app.locals.io) {
      req.app.locals.io.emit("reservationUpdated", reservation);
    }
    return res.status(200).json({
      success: true,
      reservation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating reservation",
      error: error.message,
    });
  }
};

exports.deleteReservation = async (req, res) => {
  const { reservation_id } = req.params;
  if (!reservation_id) {
    return res.status(400).json({
      success: false,
      message: "reservation_id is required",
    });
  }
  try {
    await deleteReservationModel(reservation_id);
    if (req.app.locals.io) {
      req.app.locals.io.emit("reservationDeleted", reservation_id);
    }
    return res.status(200).json({
      success: true,
      message: "Reservation deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting reservation",
      error: error.message,
    });
  }
};
