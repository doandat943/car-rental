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
  
  // Payment information
  paymentMethod: {
    type: String,
    required: true,
    enum: ['paypal', 'credit_card', 'cash', 'demo'],
    default: 'demo'
  },
  paymentType: {
    type: String,
    enum: ['full', 'deposit'],
    default: 'full'
  },
  depositAmount: { type: Number, default: 0 },
  remainingAmount: { type: Number, default: 0 },
  paymentTransactionId: { type: String },
  
  // Terms acceptance
  termsAccepted: { type: Boolean, default: false },
  termsAcceptedAt: { type: Date },
  
  // Additional fields for premium services
  includeDriver: { type: Boolean, default: false },
  doorstepDelivery: { type: Boolean, default: false },
  driverFee: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  totalDays: { type: Number, required: true },
  
  // Tracking fields
  specialRequests: { type: String },
  cancelReason: { type: String },
  
  createdAt: { type: Date, default: Date.now }
}));

module.exports = Booking; 