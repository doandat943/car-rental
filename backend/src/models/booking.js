const mongoose = require('mongoose');

// Check if model already exists to avoid redefining
const Booking = mongoose.models.Booking || mongoose.model('Booking', new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  pickupLocation: String,
  dropoffLocation: String,
  createdAt: { type: Date, default: Date.now }
}));

module.exports = Booking; 