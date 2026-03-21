const Doctor = require("../models/doctorModel");
const axios = require("axios");

const FEEDBACK_SERVICE_URL = process.env.FEEDBACK_SERVICE_URL || 'http://localhost:3004';

exports.getDoctors = async (req, res) => {
  try {
    const { specialization, name } = req.query;
    
    // Build filter
    const filter = {};
    if (specialization) {
      filter.specialization = { $regex: specialization, $options: 'i' };
    }
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    const doctors = await Doctor.find(filter);
    
    // Optionally enrich with ratings (set queryParam ?withRatings=true to include)
    if (req.query.withRatings === 'true') {
      const enrichedDoctors = await Promise.all(doctors.map(async (doctor) => {
        try {
          const ratingRes = await axios.get(
            `${FEEDBACK_SERVICE_URL}/doctor/${doctor._id}/average`,
            { timeout: 3000 }
          );
          return {
            ...doctor.toObject(),
            averageRating: ratingRes.data.averageRating || 0,
            totalReviews: ratingRes.data.totalReviews || 0
          };
        } catch {
          return {
            ...doctor.toObject(),
            averageRating: 0,
            totalReviews: 0
          };
        }
      }));
      return res.json(enrichedDoctors);
    }

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor)
      return res.status(404).json({ message: "Doctor not found" });

    res.json(doctor);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createDoctor = async (req, res) => {
  try {
    const { name, specialization, contact } = req.body;

    if (!name || !specialization) {
      return res.status(400).json({ 
        message: "Name and specialization are required" 
      });
    }

    const doctor = new Doctor({
      name,
      specialization,
      contact
    });

    await doctor.save();

    res.status(201).json(doctor);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const { name, specialization, contact } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { name, specialization, contact },
      { new: true, runValidators: true }
    );

    if (!doctor)
      return res.status(404).json({ message: "Doctor not found" });

    res.json(doctor);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor)
      return res.status(404).json({ message: "Doctor not found" });

    res.json({ message: "Doctor deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDoctorAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor)
      return res.status(404).json({ message: "Doctor not found" });

    // Return basic availability (can be extended with full scheduling)
    res.json({
      doctorId: doctor._id,
      name: doctor.name,
      availability: {
        monday: { start: "09:00", end: "17:00", available: true },
        tuesday: { start: "09:00", end: "17:00", available: true },
        wednesday: { start: "09:00", end: "17:00", available: true },
        thursday: { start: "09:00", end: "17:00", available: true },
        friday: { start: "09:00", end: "17:00", available: true },
        saturday: { start: "10:00", end: "14:00", available: true },
        sunday: { available: false }
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDoctorAppointments = async (req, res) => {
  try {
    // This would typically call the appointment service
    // For now, return placeholder
    res.json({
      doctorId: req.params.id,
      appointments: [],
      message: "Appointment integration in progress"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDoctorFeedback = async (req, res) => {
  try {
    try {
      const feedbackRes = await axios.get(
        `${FEEDBACK_SERVICE_URL}/doctor/${req.params.id}`,
        { timeout: 5000 }
      );
      res.json(feedbackRes.data);
    } catch (err) {
      if (err.response?.status === 404) {
        return res.status(404).json({ message: "Doctor or feedback not found" });
      }
      res.json({
        doctorId: req.params.id,
        feedback: [],
        message: "No feedback available"
      });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.healthCheck = async (req, res) => {
  try {
    res.json({ status: 'Doctor Service is running', port: process.env.PORT });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};