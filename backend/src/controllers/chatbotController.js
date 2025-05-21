const Faq = require('../models/Faq');
const Car = require('../models/car');
const Booking = require('../models/booking');
const Brand = require('../models/Brand');
const Category = require('../models/category');
const axios = require('axios');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI if API key is available
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Default FAQs if none exist in the database
const defaultFaqs = [
  { 
    question: "How do I book a car?", 
    answer: "To book a car, browse our collection, select your preferred dates, and follow the checkout process. You'll need to be logged in to complete the booking." 
  },
  { 
    question: "Can I cancel my booking?", 
    answer: "Yes, you can cancel your booking through your account dashboard. Cancellation fees may apply depending on how close to the pickup date you cancel." 
  },
  { 
    question: "What payment methods do you accept?", 
    answer: "We accept all major credit cards, debit cards, and PayPal. The full payment is required at the time of booking." 
  },
  { 
    question: "Is insurance included?", 
    answer: "Basic insurance is included with all rentals. We offer additional insurance options for more comprehensive coverage at checkout." 
  },
  { 
    question: "What is the fuel policy?", 
    answer: "Our standard policy is 'full-to-full'. You'll receive the car with a full tank and should return it with a full tank. Otherwise, a refueling fee will apply." 
  },
  { 
    question: "Do you offer airport pickup?", 
    answer: "Yes, we offer pickup and drop-off at major airports. Select your preferred airport location during the booking process." 
  },
  { 
    question: "What happens if I return the car late?", 
    answer: "Late returns are charged at an hourly rate, which can amount to more than the daily rate. Always contact us if you expect to be late." 
  }
];

// Get data from other models to integrate into the response
const getWebsiteData = async () => {
  try {
    const websiteData = {};
    
    // Get featured cars (10 newest cars)
    const cars = await Car.find({ isAvailable: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('brand')
      .populate('category')
      .populate('transmission')
      .populate('fuel');
    
    websiteData.cars = cars.map(car => ({
      id: car._id,
      model: car.model,
      brand: car.brand ? car.brand.name : 'Unknown',
      category: car.category ? car.category.name : 'Unknown',
      year: car.year,
      pricePerDay: car.pricePerDay,
      features: car.features
    }));
    
    // Get car categories
    const categories = await Category.find().limit(10);
    websiteData.categories = categories.map(cat => ({
      name: cat.name,
      description: cat.description
    }));
    
    // Get brands
    const brands = await Brand.find().limit(10);
    websiteData.brands = brands.map(brand => ({
      name: brand.name,
      country: brand.country || 'Unknown'
    }));
    
    // Get price statistics
    websiteData.priceStats = {
      avg: await Car.aggregate([{ $group: { _id: null, avg: { $avg: "$pricePerDay" } } }])
        .then(result => result[0]?.avg || 0),
      min: await Car.aggregate([{ $group: { _id: null, min: { $min: "$pricePerDay" } } }])
        .then(result => result[0]?.min || 0),
      max: await Car.aggregate([{ $group: { _id: null, max: { $max: "$pricePerDay" } } }])
        .then(result => result[0]?.max || 0)
    };
    
    return websiteData;
  } catch (error) {
    console.error('Error getting website data:', error);
    return null;
  }
};

// Helper function to generate AI response using Gemini
const generateGeminiResponse = async (prompt) => {
  try {
    if (!genAI) {
      throw new Error('Gemini API not configured');
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-preview-05-20" // Updated model name that works with the current API
    });
    
    // Generate content
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    throw error;
  }
};

// Find cars by criteria
const findCarsByCriteria = async (criteria) => {
  try {
    const query = { isAvailable: true };
    
    console.log("Original criteria:", criteria);
    
    // Handle brand search
    if (criteria.brand) {
      try {
        // Log all available brands first
        const allBrands = await Brand.find().select('name');
        console.log("Available brands:", allBrands.map(b => b.name));
        
        // Use more flexible regex matching for brand
        const brandRegex = new RegExp(criteria.brand, 'i');
        const brand = await Brand.findOne({ name: brandRegex });
        
        if (brand) {
          console.log("Found brand:", brand.name, brand._id);
          query.brand = brand._id;
        } else {
          console.log("Brand not found:", criteria.brand);
        }
      } catch (err) {
        console.error("Error finding brand:", err);
      }
    }
    
    // Handle model search - this needs a different approach as model is a field on Car
    if (criteria.model) {
      // Use regex for partial model matching
      query.model = { $regex: criteria.model, $options: 'i' };
      console.log("Looking for model containing:", criteria.model);
    }
    
    if (criteria.category) {
      try {
        const categoryRegex = new RegExp(criteria.category, 'i');
        const category = await Category.findOne({ name: categoryRegex });
        if (category) {
          console.log("Found category:", category.name);
          query.category = category._id;
        } else {
          console.log("Category not found:", criteria.category);
        }
      } catch (err) {
        console.error("Error finding category:", err);
      }
    }
    
    if (criteria.minPrice) query.pricePerDay = { $gte: criteria.minPrice };
    if (criteria.maxPrice) {
      if (query.pricePerDay) {
        query.pricePerDay.$lte = criteria.maxPrice;
      } else {
        query.pricePerDay = { $lte: criteria.maxPrice };
      }
    }
    
    if (criteria.seats) query.seats = criteria.seats;
    
    console.log("Final query:", JSON.stringify(query));
    
    // First check how many cars match without limit
    const totalCount = await Car.countDocuments(query);
    console.log("Total matching cars:", totalCount);
    
    const cars = await Car.find(query)
      .sort({ pricePerDay: 1 })
      .limit(5)
      .populate('brand')
      .populate('category');
    
    console.log("Found cars:", cars.length);
    if (cars.length > 0) {
      console.log("First car:", cars[0].model, cars[0].brand ? cars[0].brand.name : 'Unknown brand');
    }
    
    return cars.map(car => ({
      id: car._id,
      model: car.model,
      make: car.brand ? car.brand.name : 'Unknown',
      brand: car.brand ? car.brand.name : 'Unknown',
      category: car.category ? car.category.name : 'Unknown',
      year: car.year,
      pricePerDay: car.pricePerDay,
      seats: car.seats
    }));
  } catch (error) {
    console.error('Error finding cars by criteria:', error);
    return [];
  }
};

// Extract search criteria from message for AI endpoint
const extractSearchCriteria = (message) => {
  const criteria = {};
  
  // Find category
  if (message.includes('sedan') || message.includes('4 door')) criteria.category = 'sedan';
  if (message.includes('suv') || message.includes('terrain')) criteria.category = 'suv';
  if (message.includes('sports') || message.includes('sport')) criteria.category = 'sport';
  if (message.includes('luxury')) criteria.category = 'luxury';
  
  // Find brand
  const brandPatterns = [
    { pattern: /toyota/i, brand: 'Toyota' },
    { pattern: /honda/i, brand: 'Honda' },
    { pattern: /bmw/i, brand: 'BMW' },
    { pattern: /mercedes/i, brand: 'Mercedes' },
    { pattern: /audi/i, brand: 'Audi' },
    { pattern: /lexus/i, brand: 'Lexus' },
    { pattern: /ford/i, brand: 'Ford' },
    { pattern: /hyundai/i, brand: 'Hyundai' },
    { pattern: /kia/i, brand: 'Kia' }
  ];
  
  brandPatterns.forEach(({ pattern, brand }) => {
    if (pattern.test(message)) criteria.brand = brand;
  });
  
  // Extract specific model mentions
  const modelPatterns = [
    { pattern: /c300/i, model: 'C300' },
    { pattern: /accord/i, model: 'Accord' },
    { pattern: /camry/i, model: 'Camry' },
    { pattern: /civic/i, model: 'Civic' },
    { pattern: /corolla/i, model: 'Corolla' },
    { pattern: /x5/i, model: 'X5' },
    { pattern: /a4/i, model: 'A4' },
    { pattern: /mustang/i, model: 'Mustang' },
    { pattern: /prius/i, model: 'Prius' },
    { pattern: /c-class/i, model: 'C-Class' },
    { pattern: /3 series/i, model: '3 Series' },
    { pattern: /rav4/i, model: 'RAV4' },
    { pattern: /crv/i, model: 'CR-V' },
    { pattern: /land cruiser/i, model: 'Land Cruiser' },
    { pattern: /model 3/i, model: 'Model 3' },
    { pattern: /tucson/i, model: 'Tucson' },
    { pattern: /santa fe/i, model: 'Santa Fe' }
  ];
  
  modelPatterns.forEach(({ pattern, model }) => {
    if (pattern.test(message)) criteria.model = model;
  });
  
  // Find price range
  const minPriceMatch = message.match(/above (\d+)k/i) || message.match(/over (\d+)\s?k/i) || message.match(/more than (\d+)k/i);
  if (minPriceMatch) {
    const value = parseInt(minPriceMatch[1]);
    criteria.minPrice = value * 1000;
  }
  
  const maxPriceMatch = message.match(/below (\d+)k/i) || message.match(/under (\d+)\s?k/i) || message.match(/less than (\d+)k/i);
  if (maxPriceMatch) {
    const value = parseInt(maxPriceMatch[1]);
    criteria.maxPrice = value * 1000;
  }
  
  // Find number of seats
  const seatsMatch = message.match(/(\d+)\s?seat/i) || message.match(/(\d+)\s?people/i) || message.match(/(\d+)\s?passenger/i);
  if (seatsMatch) {
    criteria.seats = parseInt(seatsMatch[1]);
  }
  
  return criteria;
};

// Get all FAQs
exports.getFAQs = async (req, res) => {
  try {
    let faqs = await Faq.find()
      .sort({ createdAt: -1 });
    
    // If no FAQs in database, return default ones
    if (faqs.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Default FAQs retrieved successfully',
        data: defaultFaqs
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'FAQs retrieved successfully',
      data: faqs
    });
  } catch (error) {
    console.error('Error getting FAQs:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving FAQs',
      error: error.message
    });
  }
};

// Create a new FAQ (for admin use)
exports.createFAQ = async (req, res) => {
  try {
    const { question, answer, category } = req.body;
    
    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Question and answer are required'
      });
    }
    
    const newFAQ = new Faq({
      question,
      answer,
      category: category || 'General'
    });
    
    await newFAQ.save();
    
    return res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: newFAQ
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating FAQ',
      error: error.message
    });
  }
};

// Process chatbot messages with enhanced intelligence
exports.processMessage = async (req, res) => {
  try {
    const { message, sessionData } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }
    
    // Save chat history (if any)
    const chatHistory = sessionData?.chatHistory || [];
    
    // Step 1: Check what area the question belongs to
    const lowerCaseMsg = message.toLowerCase();
    
    // Step 2: Find the most matching FAQ
    let faqs = await Faq.find();
    if (faqs.length === 0) faqs = defaultFaqs;
    
    const matchingFAQ = faqs.find(faq => 
      faq.question.toLowerCase().includes(lowerCaseMsg) || 
      lowerCaseMsg.includes(faq.question.toLowerCase())
    );
    
    if (matchingFAQ) {
      return res.status(200).json({
        success: true,
        message: matchingFAQ.answer
      });
    }
    
    // Step 3: Search for cars based on request
    if (
      lowerCaseMsg.includes('find car') || 
      lowerCaseMsg.includes('rent car') || 
      lowerCaseMsg.includes('which car') || 
      (lowerCaseMsg.includes('car') && lowerCaseMsg.includes('price'))
    ) {
      const criteria = extractSearchCriteria(lowerCaseMsg);
      const cars = await findCarsByCriteria(criteria);
      
      if (cars.length > 0) {
        let response = "I found several cars that match your requirements:\n\n";
        
        cars.forEach((car, index) => {
          response += `${index + 1}. ${car.brand} ${car.model} (${car.year})\n`;
          response += `   - Type: ${car.category}\n`;
          response += `   - Price: $${car.pricePerDay.toLocaleString()}/day\n`;
          response += `   - Seats: ${car.seats}\n\n`;
        });
        
        response += "Would you like more information about any of these cars?";
        
        return res.status(200).json({
          success: true,
          message: response,
          data: { type: 'car_search', cars }
        });
      }
    }
    
    // Step 4: Answer based on keywords
    let response;
    
    if (lowerCaseMsg.includes('hello') || lowerCaseMsg.includes('hi')) {
      response = "Hello! How can I help you with our car rental service?";
    } else if (lowerCaseMsg.includes('book') || lowerCaseMsg.includes('reservation')) {
      response = "To book a car, you need to select a car, choose pickup and return dates, then complete the payment. You need to be logged in to your account to complete the booking process.";
    } else if (lowerCaseMsg.includes('cancel')) {
      response = "You can cancel your booking through your order management page. If you cancel 24 hours before the pickup time, you will receive a full refund. If you cancel within 24 hours, a cancellation fee may apply.";
    } else if (lowerCaseMsg.includes('price') || lowerCaseMsg.includes('cost')) {
      // Get price information from database
      const priceStats = await Car.aggregate([
        { $match: { isAvailable: true } },
        { $group: { 
          _id: null, 
          avg: { $avg: "$pricePerDay" },
          min: { $min: "$pricePerDay" },
          max: { $max: "$pricePerDay" }
        }}
      ]);
      
      if (priceStats.length > 0) {
        const { min, avg, max } = priceStats[0];
        response = `Our rental prices range from $${min.toLocaleString()} to $${max.toLocaleString()} per day, depending on the car type. The average price is about $${Math.round(avg).toLocaleString()} per day.`;
      } else {
        response = "Our rental prices vary depending on the car type and rental duration. Please see the car listing page for details.";
      }
    } else if (lowerCaseMsg.includes('payment')) {
      response = "We accept payment via credit cards, debit cards, and PayPal. Full payment is required when booking.";
    } else if (lowerCaseMsg.includes('pickup') || lowerCaseMsg.includes('location')) {
      response = "We have multiple pickup locations. You can select your preferred pickup location during the booking process.";
    } else if (lowerCaseMsg.includes('insurance')) {
      response = "All cars come with basic insurance. We also offer comprehensive insurance packages for an additional fee.";
    } else if (lowerCaseMsg.includes('thank')) {
      response = "You're welcome! I'm happy to help. If you have any other questions, feel free to ask.";
    } else {
      // Step 5: Use Gemini AI to generate responses for unidentified questions
      try {
        // If Gemini API is configured
        if (GEMINI_API_KEY && genAI) {
          const websiteData = await getWebsiteData();
          
          // Create prompt for Gemini
          const prompt = `
          You are a virtual assistant for CarRental service. Answer concisely and in a friendly manner.
          
          Service information:
          - Provides short-term and long-term car rental services
          - Car types available: ${websiteData?.categories?.map(c => c.name).join(', ') || 'sedan, SUV, sports, luxury'}
          - Brands: ${websiteData?.brands?.map(b => b.name).join(', ') || 'Toyota, Honda, BMW, Mercedes, Audi'}
          - Average rental price: $${websiteData?.priceStats?.avg.toLocaleString() || '1,000'}/day
          
          Chat history:
          ${chatHistory.slice(-3).map(item => `${item.sender === 'user' ? 'Customer' : 'Assistant'}: ${item.text}`).join('\n')}
          
          Customer: ${message}
          `;
          
          // Call Gemini API
          response = await generateGeminiResponse(prompt);
        } else {
          // Case where Gemini API is not available
          response = "Thank you for your question. How else can I help you with our car rental service, available cars, or booking process?";
        }
      } catch (aiError) {
        console.error('AI service error:', aiError);
        // Fallback if AI fails
        response = "Sorry, I don't understand your question clearly. You can ask about how to book a car, pricing, our car types, or contact our support team directly at support@carrental.com or hotline 1900-1234.";
      }
    }
    
    return res.status(200).json({
      success: true,
      message: response
    });
  } catch (error) {
    console.error('Error processing message:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing your message',
      error: error.message
    });
  }
};

// Get FAQ by ID
exports.getFAQById = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'FAQ retrieved successfully',
      data: faq
    });
  } catch (error) {
    console.error('Error getting FAQ:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving FAQ',
      error: error.message
    });
  }
};

// Update FAQ (for admin use)
exports.updateFAQ = async (req, res) => {
  try {
    const { question, answer, category } = req.body;
    
    const updatedFAQ = await Faq.findByIdAndUpdate(
      req.params.id,
      { question, answer, category },
      { new: true, runValidators: true }
    );
    
    if (!updatedFAQ) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'FAQ updated successfully',
      data: updatedFAQ
    });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating FAQ',
      error: error.message
    });
  }
};

// Delete FAQ (for admin use)
exports.deleteFAQ = async (req, res) => {
  try {
    const deletedFAQ = await Faq.findByIdAndDelete(req.params.id);
    
    if (!deletedFAQ) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting FAQ',
      error: error.message
    });
  }
};

// Process messages specifically with AI (for direct frontend-to-backend AI requests)
exports.processAIMessage = async (req, res) => {
  try {
    const { message, sessionData } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Extract necessary context from session data
    const chatHistory = sessionData?.chatHistory || [];
    const websiteData = sessionData?.websiteData || await getWebsiteData();
    
    // Check if this is a request to show car cards
    const lowerCaseMsg = message.toLowerCase();
    let carData = null;
    
    // If request is for showing car cards or specific cars
    if (
      (lowerCaseMsg.includes('show') || lowerCaseMsg.includes('display') || lowerCaseMsg.includes('hiển thị') || lowerCaseMsg.includes('xem')) && 
      (lowerCaseMsg.includes('card') || lowerCaseMsg.includes('thẻ') || lowerCaseMsg.includes('car') || lowerCaseMsg.includes('xe'))
    ) {
      // Extract car criteria from the message
      const criteria = extractSearchCriteria(lowerCaseMsg);
      
      // Add logging to debug
      console.log("Car search criteria:", criteria);
      
      if (Object.keys(criteria).length > 0) {
        // Search for cars based on criteria
        const cars = await findCarsByCriteria(criteria);
        console.log("Found cars:", cars ? cars.length : 0);
        
        if (cars && cars.length > 0) {
          carData = {
            type: 'car_search_results',
            cars: cars
          };
        } else {
          // If no cars found with specific criteria, get some default cars
          console.log("No cars found with specific criteria, getting default cars");
          try {
            const defaultCars = await Car.find({ isAvailable: true })
              .sort({ createdAt: -1 })
              .limit(3)
              .populate('brand')
              .populate('category');
              
            if (defaultCars && defaultCars.length > 0) {
              console.log("Using default cars instead:", defaultCars.length);
              carData = {
                type: 'car_search_results',
                cars: defaultCars.map(car => ({
                  id: car._id,
                  model: car.model,
                  make: car.brand ? car.brand.name : 'Unknown',
                  brand: car.brand ? car.brand.name : 'Unknown',
                  category: car.category ? car.category.name : 'Unknown',
                  year: car.year,
                  pricePerDay: car.pricePerDay,
                  seats: car.seats
                }))
              };
            }
          } catch (err) {
            console.error("Error getting default cars:", err);
          }
        }
      }
    }
    
    try {
      // If Gemini API is configured, use it
      if (GEMINI_API_KEY && genAI) {
        // Create prompt for Gemini
        const prompt = `
        You are a virtual assistant for CarRental service. Answer concisely and in a friendly manner.
        
        Service information:
        - Provides short-term and long-term car rental services
        - Car types available: ${websiteData?.categories?.map(c => c.name).join(', ') || 'sedan, SUV, sports, luxury'}
        - Brands: ${websiteData?.brands?.map(b => b.name).join(', ') || 'Toyota, Honda, BMW, Mercedes, Audi'}
        - Average rental price: $${websiteData?.priceStats?.avg.toLocaleString() || '1,000'}/day
        
        IMPORTANT INSTRUCTIONS:
        - When users ask to see specific cars or car cards, tell them you'll display car cards for them
        - DO NOT say you can't display car cards - the chatbot interface CAN show interactive car cards
        - For car search requests, say you'll show them matching cars and mention using the interface
        - You CAN show car details and images through the chat interface
        - Users CAN click on car cards to navigate to car detail pages
        
        Chat history:
        ${chatHistory.slice(-5).map(item => `${item.sender === 'user' ? 'Customer' : 'Assistant'}: ${item.text}`).join('\n')}
        
        Customer: ${message}
        `;
        
        // Call Gemini API
        const aiResponse = await generateGeminiResponse(prompt);
        
        // Return response with car data if available
        return res.status(200).json({
          success: true,
          message: aiResponse,
          data: carData
        });
      } else {
        // Fallback to rule-based response
        let response = "I don't have a specific answer for that question. Please ask about our car types, booking process, or rental policies.";
        
        // Use basic keyword matching for common questions
        const lowerCaseMsg = message.toLowerCase();
        
        if (lowerCaseMsg.includes('hello') || lowerCaseMsg.includes('hi')) {
          response = "Hello! How can I help you with our car rental service?";
        } else if (lowerCaseMsg.includes('book') || lowerCaseMsg.includes('reservation')) {
          response = "To book a car, you need to select a car, choose pickup and return dates, then complete the payment. You need to be logged in to your account to complete the booking process.";
        } else if (lowerCaseMsg.includes('cancel')) {
          response = "You can cancel your booking through your order management page. If you cancel 24 hours before the pickup time, you will receive a full refund. If you cancel within 24 hours, a cancellation fee may apply.";
        } else if (lowerCaseMsg.includes('price') || lowerCaseMsg.includes('cost')) {
          response = "Our rental prices vary depending on the car type and rental duration. Please see the car listing page for details.";
        }
        
        return res.status(200).json({
          success: true,
          message: response
        });
      }
    } catch (aiError) {
      console.error('AI service error:', aiError);
      
      // Return a generic response on error
      return res.status(200).json({
        success: true,
        message: "Sorry, I'm having trouble processing your request right now. Please try asking a different question or contact our support team."
      });
    }
  } catch (error) {
    console.error('Error processing AI message:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing your message',
      error: error.message
    });
  }
}; 