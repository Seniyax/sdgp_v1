const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON requests

module.exports = app; // Export the configured app
