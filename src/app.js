const express = require("express");
const cors = require("cors");
const passport = require("passport");
require("./config/passport");
const categoryRoutes = require("./routes/categoryRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const businessRoutes = require("./routes/businessRoutes");
const emailRoutes = require("./routes/emailRoutes");
const userRoutes = require("./routes/userRoutes");
const bHURoutes = require("./routes/bHURoutes");
const mLRoutes = require("./routes/mLRoutes");
const floorPlanRoutes = require("./routes/floorPlanRoutes");

const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Passport Initialization
app.use(passport.initialize()); // Passport initialization should be here

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/user", userRoutes);
app.use("/api/business-user-relation", bHURoutes);
app.use("/api/ml", mLRoutes);
app.use("/api/floor-plan", floorPlanRoutes);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message,
  });
});

// 404 handler - for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app; // Export the configured app
