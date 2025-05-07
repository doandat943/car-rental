const mongoose = require('mongoose');

// Kiểm tra nếu model đã tồn tại để tránh định nghĩa lại
let Booking;
try {
  Booking = mongoose.model('Booking');
} catch (error) {
  // Nếu model chưa được định nghĩa, chúng ta sẽ tạo mới
  const bookingSchema = new mongoose.Schema({
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
  });

  Booking = mongoose.model('Booking', bookingSchema);
}

module.exports = Booking; 