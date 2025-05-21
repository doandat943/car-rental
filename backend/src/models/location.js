const mongoose = require('mongoose');

// Check if model already exists to avoid redefining
const Location = mongoose.models.Location || mongoose.model('Location', new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  code: { 
    type: String, 
    required: true,
    unique: true,
    trim: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  hours: { 
    type: String, 
    default: '24/7' 
  },
  description: { 
    type: String 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}));

module.exports = Location; 