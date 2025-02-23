const express = require("express");
const cors = require("cors");
const businessRoutes = require("./routes/businessRoutes");
const emailRoutes = require("./routes/emailRoutes");
const userRoutes = require("./routes/userRoutes");
const bHURoutes = require("./routes/bHURoutes");
const slotRoutes = require("./routes/slotRoutes");
const mLRoutes = require("./routes/mLRoutes");

const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON requests

//routes
app.use("/api/business", businessRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/user", userRoutes);
app.use("/api/business-user-relation", bHURoutes);
app.use("/api/slot", slotRoutes);
app.use("/api/ml", mLRoutes);

module.exports = app; // Export the configured app
