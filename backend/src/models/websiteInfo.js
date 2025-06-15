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
    aboutUs: { 
      type: String, 
      default: `
        <div class="space-y-6">
          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Who We Are</h2>
            <p class="text-gray-700 leading-relaxed">
              We are a premier car rental service committed to providing exceptional vehicles and outstanding customer service. 
              With years of experience in the industry, we understand what our customers need and strive to exceed their expectations.
            </p>
          </section>
          
          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p class="text-gray-700 leading-relaxed">
              To provide reliable, affordable, and convenient car rental services that enable our customers to travel with confidence 
              and comfort. We believe that everyone deserves access to quality transportation solutions.
            </p>
          </section>
          
          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <ul class="list-disc list-inside text-gray-700 space-y-2">
              <li>Wide selection of well-maintained vehicles</li>
              <li>Competitive pricing with no hidden fees</li>
              <li>24/7 customer support and roadside assistance</li>
              <li>Easy online booking and flexible rental terms</li>
              <li>Comprehensive insurance coverage</li>
              <li>Professional and friendly service</li>
            </ul>
          </section>
        </div>
      ` 
    },
    termsAndConditions: { 
      type: String, 
      default: `
        <div class="space-y-6">
          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p class="text-gray-700 leading-relaxed">
              By using our car rental services, you agree to be bound by these Terms and Conditions. 
              Please read them carefully before making a reservation.
            </p>
          </section>
          
          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">2. Rental Requirements</h2>
            <ul class="list-disc list-inside text-gray-700 space-y-2">
              <li>Must be at least 21 years old (25 for luxury vehicles)</li>
              <li>Valid driver's license required</li>
              <li>Credit card in renter's name</li>
              <li>Clean driving record</li>
            </ul>
          </section>
          
          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">3. Payment Terms</h2>
            <p class="text-gray-700 leading-relaxed">
              Payment is due at the time of booking. We accept major credit cards and may require a security deposit 
              depending on the vehicle type and rental duration.
            </p>
          </section>
          
          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">4. Cancellation Policy</h2>
            <p class="text-gray-700 leading-relaxed">
              Free cancellation up to 24 hours before pickup. Cancellations within 24 hours may incur charges. 
              No-shows are non-refundable.
            </p>
          </section>
        </div>
      ` 
    },
    privacyPolicy: { 
      type: String, 
      default: `
        <div class="space-y-6">
          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              make a reservation, or contact us for support.
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2">
              <li>Personal identification information</li>
              <li>Driver's license information</li>
              <li>Payment information</li>
              <li>Rental history and preferences</li>
            </ul>
          </section>
          
          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <p class="text-gray-700 leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services, 
              process transactions, and communicate with you about your rentals.
            </p>
          </section>
          
          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p class="text-gray-700 leading-relaxed">
              We implement appropriate security measures to protect your personal information against unauthorized 
              access, alteration, disclosure, or destruction.
            </p>
          </section>
          
          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p class="text-gray-700 leading-relaxed">
              You have the right to access, update, or delete your personal information. 
              Contact us if you wish to exercise these rights.
            </p>
          </section>
        </div>
      ` 
    },
    cancellationPolicy: { 
      type: String, 
      default: `
        <div class="space-y-6">
          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Cancellation Terms</h2>
            <p class="text-gray-700 leading-relaxed">
              We understand that plans can change. Our flexible cancellation policy is designed to 
              accommodate your needs while protecting our business interests.
            </p>
          </section>
          
          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Free Cancellation</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Cancel your reservation at no charge up to 24 hours before your scheduled pickup time.
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2">
              <li>Full refund for cancellations 24+ hours in advance</li>
              <li>No questions asked policy</li>
              <li>Instant confirmation of cancellation</li>
            </ul>
          </section>
          
          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Late Cancellation</h2>
            <p class="text-gray-700 leading-relaxed">
              Cancellations within 24 hours of pickup may incur a cancellation fee of 50% of the rental cost.
            </p>
          </section>
          
          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">No-Show Policy</h2>
            <p class="text-gray-700 leading-relaxed">
              Failure to show up for your rental without prior cancellation will result in forfeiture of 
              the full rental amount with no refund.
            </p>
          </section>
        </div>
      ` 
    }
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