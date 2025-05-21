const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  preferences: {
    language: {
      type: String,
      enum: ['en', 'vi', 'fr', 'es', 'de', 'zh'],
      default: 'en'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    notifications: {
      email: {
        newBookings: { type: Boolean, default: true },
        bookingUpdates: { type: Boolean, default: true },
        promotions: { type: Boolean, default: true }
      },
      sms: {
        newBookings: { type: Boolean, default: false },
        bookingUpdates: { type: Boolean, default: false },
        promotions: { type: Boolean, default: false }
      },
      inApp: {
        newBookings: { type: Boolean, default: true },
        bookingUpdates: { type: Boolean, default: true },
        promotions: { type: Boolean, default: true },
        systemUpdates: { type: Boolean, default: true }
      }
    },
    displayPreferences: {
      dateFormat: {
        type: String,
        enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
        default: 'MM/DD/YYYY'
      },
      timeFormat: {
        type: String,
        enum: ['12h', '24h'],
        default: '12h'
      },
      showPricesWithTax: {
        type: Boolean,
        default: true
      }
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Middleware to automatically update timestamp when changed
SettingSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Create model with the schema
const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);

module.exports = Setting; 