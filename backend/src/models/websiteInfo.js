const mongoose = require('mongoose');

const websiteInfoSchema = new mongoose.Schema({
  websiteName: { type: String, default: 'Car Rental Service' },
  logo: String,
  contactInfo: {
    email: String,
    phone: String,
    address: String
  },
  socialLinks: {
    facebook: String,
    instagram: String,
    twitter: String
  },
  aboutUs: String,
  termsAndConditions: String,
  privacyPolicy: String,
  faqs: [{
    question: String,
    answer: String
  }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WebsiteInfo', websiteInfoSchema); 