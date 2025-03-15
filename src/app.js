const express = require("express");
const cors = require("cors");
const businessRoutes = require("./routes/businessRoutes");
const emailRoutes = require("./routes/emailRoutes");
const userRoutes = require("./routes/userRoutes");
const bHURoutes = require("./routes/bHURoutes");
const mLRoutes = require("./routes/mLRoutes");
const floorPlanRoutes = require("./routes/floorPlanRoutes");
const reservationRoutes = require("./routes/reservationRoutes"); // NEW

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:8081"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Routes
app.use("/api/business", businessRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/user", userRoutes);
app.use("/api/business-user-relation", bHURoutes);
app.use("/api/ml", mLRoutes);
app.use("/api/floor-plan", floorPlanRoutes);
app.use("/api/reservation", reservationRoutes); // NEW

module.exports = app;
