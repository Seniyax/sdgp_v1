const { getReservationHistoryByUser } = require("../models/reservationHistory");

exports.getReservationHistory = async (req, res) => {
  // Default user ID
  const defaultUserId = "86b0fb25-e1f7-41a1-8338-fee52ca2669d";
  
  // For POST requests, try to get userId from body
  // For GET requests, use the default userId
  const userId = req.method === 'POST' ? (req.body.userId || defaultUserId) : defaultUserId;
  
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