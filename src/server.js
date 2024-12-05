const app = require('./app');
// const connectDB = require('./config/db'); // Temporarily commented out

const PORT = process.env.PORT || 5000;

// connectDB(); // Skip this for now if database isn't ready

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});