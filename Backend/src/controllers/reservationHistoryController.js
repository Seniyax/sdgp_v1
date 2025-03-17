const { getReservationHistoryByUser } = require("../models/reservationHistory");

exports.getReservationHistory = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId is required",
    });
  }

  try {
    const reservationHistory = await getReservationHistoryByUser(userId);
    return res.status(200).json({
      success: true,
      reservationHistory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving reservation history",
      error: error.message,
    });
  }
};