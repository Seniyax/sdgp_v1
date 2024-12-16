const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Route to create a new patient
router.post('/', patientController.createPatient);

// Route to get all patients
router.get('/', patientController.getAllPatients);

// Route to get a patient by ID
router.get('/:id', patientController.getPatientById);

// Route to update patient details
router.put('/:id', patientController.updatePatient);

// Route to delete a patient
router.delete('/:id', patientController.deletePatient);

module.exports = router;
