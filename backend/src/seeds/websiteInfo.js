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
          question: 'How do I book a car?',
          answer: 'To book a car, browse our collection, select your preferred dates, and follow the checkout process. You\'ll need to be logged in to complete the booking.'
        },
        {
          question: 'Can I cancel my booking?',
          answer: 'Yes, you can cancel your booking through your account dashboard. Cancellation fees may apply depending on how close to the pickup date you cancel.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards, debit cards, and PayPal. The full payment is required at the time of booking.'
        },
        {
          question: 'Is insurance included in the rental price?',
          answer: 'Basic insurance is included with all rentals. We offer additional insurance options for more comprehensive coverage at checkout.'
        },
        {
          question: 'What is the fuel policy?',
          answer: 'Our standard policy is \'full-to-full\'. You\'ll receive the car with a full tank and should return it with a full tank. Otherwise, a refueling fee will apply.'
        },
        {
          question: 'Do you offer airport pickup?',
          answer: 'Yes, we offer pickup and drop-off at major airports. Select your preferred airport location during the booking process.'
        },
        {
          question: 'What happens if I return the car late?',
          answer: 'Late returns are charged at an hourly rate, which can amount to more than the daily rate. Always contact us if you expect to be late.'
        },
        {
          question: 'What documents do I need to rent a car?',
          answer: 'You need a valid driver\'s license, a credit card in your name, and a government-issued ID. International customers may also need to provide a passport.'
        },
        {
          question: 'Is there a minimum age requirement to rent a car?',
          answer: 'Yes, the minimum age to rent a car is 21 years. Drivers under 25 may be subject to a young driver surcharge.'
        },
        {
          question: 'Can I add an additional driver?',
          answer: 'Yes, additional drivers can be added during the booking process. They must meet the same eligibility requirements and present their driver\'s license.'
        },
        {
          question: 'What is your mileage policy?',
          answer: 'Most of our rentals come with unlimited mileage. Any exceptions will be clearly noted in the car details and rental agreement.'
        },
        {
          question: 'How do I modify my reservation?',
          answer: 'You can modify your reservation through your account dashboard. Changes may affect the price, and some changes might not be possible if too close to pickup.'
        },
        {
          question: 'What if the car breaks down?',
          answer: 'All our rentals include 24/7 roadside assistance. In case of a breakdown, call the emergency number provided in your rental agreement.'
        },
        {
          question: 'Can I rent a car without a credit card?',
          answer: 'We primarily require a credit card for security deposit purposes. In some locations, debit cards may be accepted with additional documentation.'
        },
        {
          question: 'How do I access my account?',
          answer: 'You can log in to your account using the email and password you registered with. If you forgot your password, use the \'Forgot Password\' option.'
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