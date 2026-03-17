const axios = require('axios');
const mongoose = require('mongoose');
const Appointment = require('../models/appointmentModel');

const doctorServiceUrl = process.env.DOCTOR_SERVICE_URL;
const userServiceUrl = process.env.USER_SERVICE_URL;

exports.createAppointment = async (req, res) => {
  try {
    const { userId, doctorId, date, notes } = req.body;

    if (!userId || !doctorId || !date) {
      return res.status(400).json({ message: 'userId, doctorId and date are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: 'Invalid userId or doctorId' });
    }

    // Verify doctor exists
    try {
      await axios.get(`${doctorServiceUrl}/doctors/${doctorId}`);
    } catch (err) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Verify user exists
    try {
      await axios.get(`${userServiceUrl}/users/${userId}`);
    } catch (err) {
      return res.status(404).json({ message: 'User not found' });
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
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
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

exports.getAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(doctorId)) return res.status(400).json({ message: 'Invalid doctor id' });
    const appointments = await Appointment.find({ doctor: doctorId });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const updates = req.body;
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
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
