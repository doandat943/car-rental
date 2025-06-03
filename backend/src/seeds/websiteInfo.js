const { WebsiteInfo } = require('../models');

/**
 * Seeds the database with initial website information
 */
const seedWebsiteInfo = async () => {
  try {
    // Check if website info already exists
    const existingInfo = await WebsiteInfo.findOne();
    
    if (existingInfo) {
      console.log('Website information already exists, skipping seed');
      return existingInfo;
    }
    
    // Create default website information
    const websiteInfo = await WebsiteInfo.create({
      siteName: 'Car Rental Service',
      description: 'Premium car rental service for all your travel needs',
      logo: '/uploads/logo.png',
      contactInfo: {
        email: 'support@carrental.example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Rental Street, San Francisco, CA 94107',
        businessHours: 'Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 5:00 PM, Sun: Closed'
      },
      socialLinks: {
        facebook: 'https://facebook.com/carental',
        instagram: 'https://instagram.com/carental',
        twitter: 'https://twitter.com/carental'
      },
      paymentSettings: {
        currencySymbol: '$',
        currencyCode: 'USD',
        taxRate: 8.5,
        bookingFee: 5,
        maintenanceFee: 25,
        depositPercentage: 15,
        enablePaypal: true,
        enableCreditCard: true,
        enableCash: true,
        enableBankTransfer: true
      },
      bookingSettings: {
        minimumBookingHours: 4,
        maximumBookingDays: 30,
        bookingAdvanceDays: 1
      },
      seoSettings: {
        googleAnalyticsId: 'UA-XXXXXXXXX-X',
        metaDescription: 'Book your dream car rental today with our easy-to-use platform',
        metaKeywords: 'car rental, vehicle rental, rent a car'
      },
      contentPages: {
        aboutUs: 'We are a premium car rental service dedicated to providing excellent vehicles and customer service.',
        termsAndConditions: 'Standard terms and conditions for vehicle rental apply to all bookings.',
        privacyPolicy: 'We respect your privacy and are committed to protecting your personal data.',
        cancellationPolicy: 'Free cancellation up to 24 hours before pickup. Late cancellations subject to one day fee.'
      },
      faqs: [
        {
          question: 'What documents do I need to rent a car?',
          answer: 'You will need a valid driver\'s license, credit card, and a form of identification.'
        },
        {
          question: 'Is there a security deposit?',
          answer: 'Yes, we require a security deposit that will be refunded after the car is returned in good condition.'
        },
        {
          question: 'What is the minimum rental period?',
          answer: 'Our minimum rental period is 4 hours.'
        },
        {
          question: 'Do you offer airport pickup?',
          answer: 'Yes, we offer pickup and drop-off services at major airports for an additional fee.'
        }
      ],
      featureSettings: {
        maintenanceMode: false
      }
    });
    
    console.log('Website information seeded successfully');
    return websiteInfo;
  } catch (error) {
    console.error('Error seeding website information:', error);
    throw error;
  }
};

module.exports = seedWebsiteInfo; 