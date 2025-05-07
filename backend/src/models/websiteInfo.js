const mongoose = require('mongoose');

// Kiểm tra nếu model đã tồn tại để tránh định nghĩa lại
let WebsiteInfo;
try {
  WebsiteInfo = mongoose.model('WebsiteInfo');
} catch (error) {
  // Nếu model chưa được định nghĩa, chúng ta sẽ tạo mới
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

  WebsiteInfo = mongoose.model('WebsiteInfo', websiteInfoSchema);
}

module.exports = WebsiteInfo; 