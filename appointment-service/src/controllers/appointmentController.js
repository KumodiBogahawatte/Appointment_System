const axios = require('axios');
const mongoose = require('mongoose');
const Appointment = require('../models/appointmentModel');

const doctorServiceUrl = process.env.DOCTOR_SERVICE_URL;
const userServiceUrl = process.env.USER_SERVICE_URL;
const feedbackServiceUrl = process.env.FEEDBACK_SERVICE_URL;

exports.createAppointment = async (req, res) => {
  try {
    const { userId, doctorId, date, notes } = req.body;

    if (!userId || !doctorId || !date) {
      return res.status(400).json({ message: 'userId, doctorId and date are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: 'Invalid userId or doctorId' });
    }

    // Verify doctor exists (direct service URL — no /doctors prefix; gateway strips that)
    try {
      console.log(`Verifying doctor at: ${doctorServiceUrl}/${doctorId}`);
      const doctorRes = await axios.get(`${doctorServiceUrl}/${doctorId}`, { timeout: 5000 });
      console.log('Doctor verified:', doctorRes.data);
    } catch (err) {
      console.error('Doctor verification failed:', err.message);
      return res.status(404).json({ message: 'Doctor not found', error: err.message });
    }

    // Verify user exists (direct service URL — no /users prefix)
    try {
      console.log(`Verifying user at: ${userServiceUrl}/${userId}`);
      const userRes = await axios.get(`${userServiceUrl}/${userId}`, { timeout: 5000 });
      console.log('User verified:', userRes.data);
    } catch (err) {
      console.error('User verification failed:', err.message);
      return res.status(404).json({ message: 'User not found', error: err.message });
    }

    const appointment = await Appointment.create({
      user: userId,
      doctor: doctorId,
      date,
      notes,
      status: 'booked'
    });

    res.status(201).json(appointment);

  } catch (error) {
    console.error('Appointment creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAppointmentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: 'Invalid user id' });
    const appointments = await Appointment.find({ user: userId }).sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(doctorId)) return res.status(400).json({ message: 'Invalid doctor id' });
    const appointments = await Appointment.find({ doctor: doctorId }).sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status, notes },
      { new: true, runValidators: true }
    );

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // If appointment completed, notify feedback service
    if (status === 'completed' && feedbackServiceUrl) {
      try {
        await axios.post(
          `${feedbackServiceUrl}/notify-appointment`,
          {
            appointmentId: appointment._id,
            userId: appointment.user,
            doctorId: appointment.doctor
          },
          { timeout: 3000 }
        );
      } catch (err) {
        // Log error but don't fail the response
        console.error('Feedback service notification failed:', err.message);
      }
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.healthCheck = async (req, res) => {
  try {
    res.json({ status: 'Appointment Service is running', port: process.env.PORT });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
