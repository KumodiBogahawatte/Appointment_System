const express = require('express');
const router = express.Router();

const {
  createFeedback,
  getFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
  getFeedbackByDoctor,
  getFeedbackByUser,
  getAverageRating,
  notifyAppointment
} = require('../controllers/feedbackController');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'Feedback Service is running', port: process.env.PORT });
});

// Feedback CRUD (API Gateway strips /feedback via pathRewrite)
router.post('/', createFeedback);
router.get('/', getFeedback);
router.get('/:id', getFeedbackById);
router.put('/:id', updateFeedback);
router.delete('/:id', deleteFeedback);

// Get average rating for doctor (must come before /doctor/:doctorId)
router.get('/doctor/:doctorId/average', getAverageRating);

// Filter feedback by doctor
router.get('/doctor/:doctorId', getFeedbackByDoctor);

// Filter feedback by user
router.get('/user/:userId', getFeedbackByUser);

// Notification endpoint from appointment service
router.post('/notify-appointment', notifyAppointment);

module.exports = router;
