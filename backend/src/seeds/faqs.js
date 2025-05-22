const mongoose = require('mongoose');
const { Faq } = require('../models');

/**
 * Seeds the database with initial FAQ entries
 * This includes common questions and answers about car rental services
 */
const seedFaqs = async () => {
  try {
    // Default FAQs
    const faqs = [
      { 
        question: "How do I book a car?", 
        answer: "To book a car, browse our collection, select your preferred dates, and follow the checkout process. You'll need to be logged in to complete the booking.",
        category: "Booking"
      },
      { 
        question: "Can I cancel my booking?", 
        answer: "Yes, you can cancel your booking through your account dashboard. Cancellation fees may apply depending on how close to the pickup date you cancel.",
        category: "Booking"
      },
      { 
        question: "What payment methods do you accept?", 
        answer: "We accept all major credit cards, debit cards, and PayPal. The full payment is required at the time of booking.",
        category: "Payment"
      },
      { 
        question: "Is insurance included in the rental price?", 
        answer: "Basic insurance is included with all rentals. We offer additional insurance options for more comprehensive coverage at checkout.",
        category: "Insurance"
      },
      { 
        question: "What is the fuel policy?", 
        answer: "Our standard policy is 'full-to-full'. You'll receive the car with a full tank and should return it with a full tank. Otherwise, a refueling fee will apply.",
        category: "Vehicles"
      },
      { 
        question: "Do you offer airport pickup?", 
        answer: "Yes, we offer pickup and drop-off at major airports. Select your preferred airport location during the booking process.",
        category: "Booking"
      },
      { 
        question: "What happens if I return the car late?", 
        answer: "Late returns are charged at an hourly rate, which can amount to more than the daily rate. Always contact us if you expect to be late.",
        category: "Booking"
      },
      { 
        question: "What documents do I need to rent a car?", 
        answer: "You need a valid driver's license, a credit card in your name, and a government-issued ID. International customers may also need to provide a passport.",
        category: "General"
      },
      { 
        question: "Is there a minimum age requirement to rent a car?", 
        answer: "Yes, the minimum age to rent a car is 21 years. Drivers under 25 may be subject to a young driver surcharge.",
        category: "General"
      },
      { 
        question: "Can I add an additional driver?", 
        answer: "Yes, additional drivers can be added during the booking process. They must meet the same eligibility requirements and present their driver's license.",
        category: "Booking"
      },
      { 
        question: "What is your mileage policy?", 
        answer: "Most of our rentals come with unlimited mileage. Any exceptions will be clearly noted in the car details and rental agreement.",
        category: "Vehicles"
      },
      { 
        question: "How do I modify my reservation?", 
        answer: "You can modify your reservation through your account dashboard. Changes may affect the price, and some changes might not be possible if too close to pickup.",
        category: "Booking"
      },
      { 
        question: "What if the car breaks down?", 
        answer: "All our rentals include 24/7 roadside assistance. In case of a breakdown, call the emergency number provided in your rental agreement.",
        category: "Vehicles"
      },
      { 
        question: "Can I rent a car without a credit card?", 
        answer: "We primarily require a credit card for security deposit purposes. In some locations, debit cards may be accepted with additional documentation.",
        category: "Payment"
      },
      { 
        question: "How do I access my account?", 
        answer: "You can log in to your account using the email and password you registered with. If you forgot your password, use the 'Forgot Password' option.",
        category: "Account"
      }
    ];

    // Clear existing data
    await Faq.deleteMany();
    
    // Insert new data
    const createdFaqs = await Faq.insertMany(faqs);
    
    console.log(`${createdFaqs.length} FAQs seeded successfully`);
    return createdFaqs;
  } catch (error) {
    console.error('Error seeding FAQs:', error);
    throw error;
  }
};

module.exports = seedFaqs; 