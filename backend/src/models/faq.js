const mongoose = require('mongoose');

// Check if model already exists to avoid redefining
const Faq = mongoose.models.Faq || mongoose.model('Faq', new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    trim: true
  },
  category: {
    type: String,
    default: 'General',
    enum: ['General', 'Booking', 'Payment', 'Insurance', 'Vehicles', 'Account', 'Other'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
}));

module.exports = Faq;
