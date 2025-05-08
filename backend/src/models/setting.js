const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'Car Rental Service'
  },
  contactEmail: {
    type: String,
    default: 'support@carrental.example.com'
  },
  contactPhone: {
    type: String,
    default: '+1 (555) 123-4567'
  },
  address: {
    type: String,
    default: '123 Rental Street, City, Country'
  },
  currencySymbol: {
    type: String,
    default: '$'
  },
  taxRate: {
    type: Number,
    default: 10
  },
  bookingFee: {
    type: Number,
    default: 5
  },
  maintenanceFee: {
    type: Number,
    default: 25
  },
  depositPercentage: {
    type: Number,
    default: 15
  },
  minimumBookingHours: {
    type: Number,
    default: 4
  },
  maximumBookingDays: {
    type: Number,
    default: 30
  },
  cancellationPolicy: {
    type: String,
    default: 'Free cancellation up to 24 hours before pickup'
  },
  termsAndConditions: {
    type: String,
    default: 'Standard terms and conditions for vehicle rental'
  },
  privacyPolicy: {
    type: String,
    default: 'Privacy policy for user data and booking information'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Middleware tự động cập nhật thời gian khi thay đổi
SettingSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('Setting', SettingSchema); 