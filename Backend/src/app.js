const express = require("express");
const cors = require("cors");
const businessRoutes = require("./routes/businessRoutes");
const slotRoutes = require("./routes/slotRouter");

const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON requests

//routes
app.use("/api/business", businessRoutes);
app.use("/api/slot", slotRoutes);

module.exports = app; // Export the configured app
