const express = require("express");
const cors = require("cors");
const passport = require('passport')
require('./config/passport')

const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON requests
app.use(passport.initialize());


module.exports = app; // Export the configured app
