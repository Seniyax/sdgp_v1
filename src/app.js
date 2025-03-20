const express= require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes")
const authers = require("./controllers/authControllers")
const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON requests

app.use('/auth',authRoutes)
app.use(cookieParser());

// very protected api
app.get('/profile',authers.requireAuth,profileController.getProfile);


module.exports = app; // Export the configured app
