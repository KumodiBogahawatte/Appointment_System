const axios = require('axios');
const mongoose = require('mongoose');
const Appointment = require('../models/appointmentModel');

/** All outbound calls to other microservices go through the API Gateway (same paths as the frontend). */
const gatewayBase = (process.env.API_GATEWAY_URL || 'http://localhost:3000').replace(/\/$/, '');

exports.createAppointment = async (req, res) => {
  try {
    const { userId, doctorId, date, notes } = req.body;

    if (!userId || !doctorId || !date) {
      return res.status(400).json({ message: 'userId, doctorId and date are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: 'Invalid userId or doctorId' });
    }

    // Verify doctor exists via API Gateway → doctor service
    try {
      const doctorUrl = `${gatewayBase}/doctors/${doctorId}`;
      console.log(`Verifying doctor at: ${doctorUrl}`);
      const doctorRes = await axios.get(doctorUrl, { timeout: 5000 });
      console.log('Doctor verified:', doctorRes.data);
    } catch (err) {
      console.error('Doctor verification failed:', err.message);
      return res.status(404).json({ message: 'Doctor not found', error: err.message });
    }

    // Verify user exists via API Gateway → user service
    try {
      const userUrl = `${gatewayBase}/users/${userId}`;
      console.log(`Verifying user at: ${userUrl}`);
      const userRes = await axios.get(userUrl, { timeout: 5000 });
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
    
    // Fetch doctor details for each appointment via API Gateway
    const enrichedAppointments = await Promise.all(
      appointments.map(async (apt) => {
        try {
          const doctorRes = await axios.get(`${gatewayBase}/doctors/${apt.doctor}`, { timeout: 5000 });
          return {
            ...apt.toObject(),
            doctor: doctorRes.data
          };
        } catch (err) {
          console.warn(`Failed to fetch doctor ${apt.doctor}:`, err.message);
          return {
            ...apt.toObject(),
            doctor: { name: 'Unknown Doctor', specialization: 'Not available' }
          };
        }
      })
    );
    
    res.json(enrichedAppointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    
    // Fetch doctor details via API Gateway
    try {
      const doctorRes = await axios.get(`${gatewayBase}/doctors/${appointment.doctor}`, { timeout: 5000 });
      return res.json({
        ...appointment.toObject(),
        doctor: doctorRes.data
      });
    } catch (err) {
      console.warn(`Failed to fetch doctor ${appointment.doctor}:`, err.message);
      res.json({
        ...appointment.toObject(),
        doctor: { name: 'Unknown Doctor', specialization: 'Not available' }
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAppointmentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: 'Invalid user id' });
    const appointments = await Appointment.find({ user: userId }).sort({ date: -1 });
    
    // Fetch doctor details for each appointment via API Gateway
    const enrichedAppointments = await Promise.all(
      appointments.map(async (apt) => {
        try {
          const doctorRes = await axios.get(`${gatewayBase}/doctors/${apt.doctor}`, { timeout: 5000 });
          return {
            ...apt.toObject(),
            doctor: doctorRes.data
          };
        } catch (err) {
          console.warn(`Failed to fetch doctor ${apt.doctor}:`, err.message);
          return {
            ...apt.toObject(),
            doctor: { name: 'Unknown Doctor', specialization: 'Not available' }
          };
        }
      })
    );
    
    res.json(enrichedAppointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(doctorId)) return res.status(400).json({ message: 'Invalid doctor id' });
    const appointments = await Appointment.find({ doctor: doctorId }).sort({ date: -1 });
    
    // Fetch doctor details via API Gateway (should be the same for all since filtered by doctorId)
    let doctorData = { name: 'Unknown Doctor', specialization: 'Not available' };
    try {
      const doctorRes = await axios.get(`${gatewayBase}/doctors/${doctorId}`, { timeout: 5000 });
      doctorData = doctorRes.data;
    } catch (err) {
      console.warn(`Failed to fetch doctor ${doctorId}:`, err.message);
    }
    
    const enrichedAppointments = appointments.map(apt => ({
      ...apt.toObject(),
      doctor: doctorData
    }));
    
    res.json(enrichedAppointments);
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

    // If appointment completed, notify feedback service via API Gateway
    if (status === 'completed') {
      try {
        await axios.post(
          `${gatewayBase}/feedback/notify-appointment`,
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
