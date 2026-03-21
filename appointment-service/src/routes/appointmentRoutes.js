const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Health check
router.get('/health', appointmentController.healthCheck);

// Appointment CRUD (API Gateway prepends /appointments via pathRewrite)
router.post('/', appointmentController.createAppointment);
router.get('/', appointmentController.getAppointments);

// Filter by user or doctor
router.get('/user/:userId', appointmentController.getAppointmentsByUser);
router.get('/doctor/:doctorId', appointmentController.getAppointmentsByDoctor);

// Individual appointment
router.get('/:id', appointmentController.getAppointmentById);
router.put('/:id', appointmentController.updateAppointment);
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
