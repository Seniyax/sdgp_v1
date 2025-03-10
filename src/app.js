import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes"
const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON requests

app.use('/auth',authRoutes)

export default app; // Export the configured app
