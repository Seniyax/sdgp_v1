const express= require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes")
const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON requests

app.use('/auth',authRoutes)

module.exports = app; // Export the configured app
