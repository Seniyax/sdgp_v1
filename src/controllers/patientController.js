// const Patient = require('../models/patient');

// exports.createPatient = async (req, res) => {
//     try {
//         const patient = new Patient({
//             user: req.body.user,
//             medicalHistory: req.body.medicalHistory,
//             contactNumber: req.body.contactNumber,
//         });
//         const savedPatient = await patient.save();
//         res.status(201).json(savedPatient);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// exports.getAllPatients = async (req, res) => {
//     try {
//         const patients = await Patient.find().populate('user', 'name email');
//         res.status(200).json(patients);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.getPatientById = async (req, res) => {
//     try {
//         const patient = await Patient.findById(req.params.id).populate('user', 'name email');
//         if (!patient) {
//             return res.status(404).json({ error: 'Patient not found' });
//         }
//         res.status(200).json(patient);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.updatePatient = async (req, res) => {
//     try {
//         const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!updatedPatient) {
//             return res.status(404).json({ error: 'Patient not found' });
//         }
//         res.status(200).json(updatedPatient);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// exports.deletePatient = async (req, res) => {
//     try {
//         const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
//         if (!deletedPatient) {
//             return res.status(404).json({ error: 'Patient not found' });
//         }
//         res.status(200).json({ message: 'Patient deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
