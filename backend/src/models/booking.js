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
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  
  // Thêm các trường mới cho dịch vụ bổ sung
  includeDriver: { type: Boolean, default: false },
  doorstepDelivery: { type: Boolean, default: false },
  driverFee: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  totalDays: { type: Number, required: true },
  
  // Các trường theo dõi
  bookingCode: { type: String },
  specialRequests: { type: String },
  cancelReason: { type: String },
  
  createdAt: { type: Date, default: Date.now }
}));

module.exports = Booking; 