const express = require("express");
const cors = require("cors");
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON requests

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/categories', categoryRoutes);

// 404 handler - for unmatched routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

module.exports = app;