const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import Routes
const userRoutes = require('./routes/userRoutes');
const patientRoutes = require('./routes/patientRoutes');

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

module.exports = app;
