const mongoose = require('mongoose');

// Check if model already exists to avoid redefining
const WebsiteInfo = mongoose.models.WebsiteInfo || mongoose.model('WebsiteInfo', new mongoose.Schema({
  siteName: { type: String, default: 'Car Rental Service' },
  description: { type: String, default: 'Premium car rental service for all your travel needs' },
  logo: { type: String, default: '/uploads/logo.png' },
  contactInfo: {
    email: { type: String, default: 'support@carrental.example.com' },
    phone: { type: String, default: '+1 (555) 123-4567' },
    address: { type: String, default: '123 Rental Street, City, Country' },
    businessHours: { type: String, default: 'Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 5:00 PM, Sun: Closed' }
  },
  socialLinks: {
    facebook: { type: String, default: 'https://facebook.com/carental' },
    instagram: { type: String, default: 'https://instagram.com/carental' },
    twitter: { type: String, default: 'https://twitter.com/carental' }
  },
  paymentSettings: {
    currencySymbol: { type: String, default: '$' },
    currencyCode: { type: String, default: 'USD' },
    taxRate: { type: Number, default: 8.5 },
    bookingFee: { type: Number, default: 5 },
    maintenanceFee: { type: Number, default: 25 },
    depositPercentage: { type: Number, default: 15 },
    enablePaypal: { type: Boolean, default: true },
    enableCreditCard: { type: Boolean, default: true },
    enableCash: { type: Boolean, default: true },
    enableBankTransfer: { type: Boolean, default: true }
  },
  bookingSettings: {
    minimumBookingHours: { type: Number, default: 4 },
    maximumBookingDays: { type: Number, default: 30 },
    bookingAdvanceDays: { type: Number, default: 1 }
  },
  seoSettings: {
    googleAnalyticsId: { type: String, default: 'UA-XXXXXXXXX-X' },
    metaDescription: { type: String, default: 'Book your dream car rental today with our easy-to-use platform' },
    metaKeywords: { type: String, default: 'car rental, vehicle rental, rent a car' }
  },
  contentPages: {
    aboutUs: { type: String, default: 'About us content goes here' },
    termsAndConditions: { type: String, default: 'Standard terms and conditions for vehicle rental' },
    privacyPolicy: { type: String, default: 'Privacy policy for user data and booking information' },
    cancellationPolicy: { type: String, default: 'Free cancellation up to 24 hours before pickup' }
  },
  faqs: [{
    question: String,
    answer: String
  }],
  featureSettings: {
    enableReviews: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false }
  },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true }));

// Middleware to automatically update timestamp when changed
WebsiteInfo.schema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = WebsiteInfo; 