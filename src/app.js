const express = require("express");
const cors = require("cors");
const passport = require("passport");
require("./config/passport");

// Import routes
const reservationRoutes = require("./routes/reservationRoutes");
const businessRoutes = require("./routes/businessRoutes");
const emailRoutes = require("./routes/emailRoutes");
const userRoutes = require("./routes/userRoutes");
const bHURoutes = require("./routes/bHURoutes");
const mLRoutes = require("./routes/mLRoutes");
const floorPlanRoutes = require("./routes/floorPlanRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reservationHistoryRoutes = require("./routes/reservationHistoryRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:8081"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(passport.initialize());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/reservation", reservationRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/user", userRoutes);
app.use("/api/business-user-relation", bHURoutes);
app.use("/api/ml", mLRoutes);
app.use("/api/floor-plan", floorPlanRoutes);
app.use("/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reservations/history", reservationHistoryRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message,
  });
});
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;
