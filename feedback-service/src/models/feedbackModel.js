const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'submitted', 'archived'],
    default: 'pending'
  }
}, { timestamps: true });

// Index for quick lookups
feedbackSchema.index({ doctorId: 1 });
feedbackSchema.index({ userId: 1 });
feedbackSchema.index({ appointmentId: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
