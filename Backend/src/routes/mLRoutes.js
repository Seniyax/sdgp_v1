const express = require('express');
const router = express.Router();
const { makePrediction } = require('../controllers/mLController');

router.post('/predict', makePrediction);

module.exports = router;
