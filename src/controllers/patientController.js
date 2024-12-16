const patientModel = require('../models/patientModel');

// Create a new patient
exports.createPatient = async (req, res) => {
    const { userId, medicalHistory, contactNumber } = req.body;
    try {
        const newPatient = await patientModel.createPatient(userId, medicalHistory, contactNumber);
        res.status(201).json(newPatient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all patients
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await patientModel.getAllPatients();
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single patient by ID
exports.getPatientById = async (req, res) => {
    const { id } = req.params;
    try {
        const patient = await patientModel.getPatientById(id);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a patient's details
exports.updatePatient = async (req, res) => {
    const { id } = req.params;
    const { medicalHistory, contactNumber } = req.body;
    try {
        const updatedPatient = await patientModel.updatePatient(id, medicalHistory, contactNumber);
        if (!updatedPatient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(200).json(updatedPatient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a patient
exports.deletePatient = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPatient = await patientModel.deletePatient(id);
        if (!deletedPatient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(200).json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
