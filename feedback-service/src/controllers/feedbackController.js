const Feedback = require('../models/feedbackModel');
const axios = require('axios');

const DOCTOR_SERVICE_URL = process.env.DOCTOR_SERVICE_URL || 'http://localhost:3002';

exports.createFeedback = async (req, res) => {
  try {
    const { appointmentId, userId, doctorId, rating, comment } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Verify doctor exists
    try {
      await axios.get(`${DOCTOR_SERVICE_URL}/${doctorId}`, { timeout: 5000 });
    } catch (err) {
      return res.status(400).json({ message: 'Doctor not found' });
    }

    // Check for duplicate feedback for same appointment
    const existingFeedback = await Feedback.findOne({ appointmentId, userId });
    if (existingFeedback) {
      return res.status(409).json({ message: 'Feedback already submitted for this appointment' });
    }

    const feedback = new Feedback({
      appointmentId,
      userId,
      doctorId,
      rating,
      comment,
      status: 'submitted'
    });

    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateFeedback = async (req, res) => {
  try {
    const { rating, comment, status } = req.body;

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { rating, comment, status },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.json({ message: 'Feedback deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeedbackByDoctor = async (req, res) => {
  try {
    const feedback = await Feedback.find({ doctorId: req.params.doctorId })
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeedbackByUser = async (req, res) => {
  try {
    const feedback = await Feedback.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAverageRating = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    const feedbacks = await Feedback.find({ 
      doctorId,
      status: 'submitted'
    });

    if (feedbacks.length === 0) {
      return res.json({ 
        doctorId, 
        averageRating: 0, 
        totalReviews: 0 
      });
    }

    const averageRating = (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(2);

    res.json({ 
      doctorId, 
      averageRating: parseFloat(averageRating),
      totalReviews: feedbacks.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.notifyAppointment = async (req, res) => {
  try {
    const { appointmentId, userId, doctorId } = req.body;

    if (!appointmentId || !userId || !doctorId) {
      return res.status(400).json({ 
        message: 'appointmentId, userId, and doctorId are required' 
      });
    }

    // Check if feedback already exists
    let feedback = await Feedback.findOne({ appointmentId });

    if (!feedback) {
      // Create pending feedback placeholder
      feedback = new Feedback({
        appointmentId,
        userId,
        doctorId,
        status: 'pending'
      });
      await feedback.save();
    }

    res.status(200).json({ 
      message: 'Appointment notification received',
      feedback 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
