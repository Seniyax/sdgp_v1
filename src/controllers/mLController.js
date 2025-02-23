// src/controllers/mlController.js
const { spawn } = require('child_process');

exports.makePrediction = (req, res) => {
  // Expecting: group_size, slot_type, date, and time in the request JSON
  const { group_size, slot_type, date, time } = req.body;

  const pythonProcess = spawn('py', [
    'src/ml_model/predict.py',
    group_size,
    slot_type,
    date,
    time
  ]);

  let dataSent = false;

  pythonProcess.stdout.on('data', (data) => {
    if (!dataSent) {
      res.status(200).json({
        success: true,
        predicted_time: data.toString().trim() // finishing time as HH:MM:SS
      });
      dataSent = true;
    }
  });

  pythonProcess.stderr.on('data', (error) => {
    if (!dataSent) {
      console.error('Error:', error.toString());
      res.status(500).json({ success: false, message: error.toString().trim() });
      dataSent = true;
    }
  });
};
