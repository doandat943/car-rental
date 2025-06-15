// Chatbot controller file
// This file has been cleared to rebuild from scratch

const { GoogleGenerativeAI } = require('@google/generative-ai');
const Car = require('../models/car');
const Brand = require('../models/brand');
const Category = require('../models/category');
const Transmission = require('../models/transmission');
const Fuel = require('../models/fuel');
const Feature = require('../models/feature');
const Booking = require('../models/booking');
const mongoose = require('mongoose');

// Initialize Gemini AI
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

/**
 * Fetch all necessary data from database to include in AI prompt
 * @returns {Object} Database data including cars, brands, categories, etc.
 */
const fetchDatabaseData = async () => {
  try {
    // Fetch cars with all related data
    const cars = await Car.find()
      .populate('brand')
      .populate('category')
      .populate('transmission')
      .populate('fuel')
      .populate('features')
      .lean();
    
    console.log(`Fetched ${cars.length} cars from database`);
    
    // Format car data for easier processing by AI
    const formattedCars = cars.map(car => ({
      id: car._id.toString(),
      name: car.name,
      model: car.model,
      brand: car.brand ? car.brand.name : 'Unknown',
      brandId: car.brand ? car.brand._id.toString() : null,
      category: car.category ? car.category.name : 'Unknown',
      categoryId: car.category ? car.category._id.toString() : null,
      year: car.year,
      price: car.price,
      description: car.description,
      features: car.features ? car.features.map(f => f.name) : [],
      seats: car.seats,
      transmission: car.transmission ? car.transmission.name : 'Unknown',
      fuel: car.fuel ? car.fuel.name : 'Unknown',
      status: car.status,
      isAvailable: car.status === 'active',
      images: car.images
    }));
    
    // Log a sample car to verify data structure
    if (formattedCars.length > 0) {
      console.log('Sample car data:', JSON.stringify(formattedCars[0]));
    }
    
    // Fetch all brands
    const brands = await Brand.find().lean();
    const formattedBrands = brands.map(brand => ({
      id: brand._id.toString(),
      name: brand.name,
      country: brand.country
    }));
    
    // Fetch all categories
    const categories = await Category.find().lean();
    const formattedCategories = categories.map(category => ({
      id: category._id.toString(),
      name: category.name,
      description: category.description
    }));
    
    // Fetch all transmissions
    const transmissions = await Transmission.find().lean();
    const formattedTransmissions = transmissions.map(transmission => ({
      id: transmission._id.toString(),
      name: transmission.name
    }));
    
    // Fetch all fuel types
    const fuels = await Fuel.find().lean();
    const formattedFuels = fuels.map(fuel => ({
      id: fuel._id.toString(),
      name: fuel.name
    }));
    
    // Fetch all features
    const features = await Feature.find().lean();
    const formattedFeatures = features.map(feature => ({
      id: feature._id.toString(),
      name: feature.name
    }));
    
    // Fetch all bookings with populated car and customer data
    const bookings = await Booking.find()
      .populate({
        path: 'car',
        populate: [
          { path: 'brand' },
          { path: 'category' }
        ]
      })
      .populate('customer')
      .lean();
      
    const formattedBookings = bookings.map(booking => ({
      id: booking._id.toString(),
      carName: booking.car ? `${booking.car.brand?.name || 'Unknown'} ${booking.car.model}` : 'Unknown Car',
      carId: booking.car ? booking.car._id.toString() : null,
      customerName: booking.customer ? `${booking.customer.firstName} ${booking.customer.lastName}` : 'Unknown Customer',
      customerId: booking.customer ? booking.customer._id.toString() : null,
      customerEmail: booking.customer ? booking.customer.email : null,
      startDate: booking.startDate,
      endDate: booking.endDate,
      totalDays: booking.totalDays,
      totalAmount: booking.totalAmount,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      pickupLocation: booking.pickupLocation,
      dropoffLocation: booking.dropoffLocation,
      includeDriver: booking.includeDriver,
      doorstepDelivery: booking.doorstepDelivery,
      driverFee: booking.driverFee,
      deliveryFee: booking.deliveryFee,
      specialRequests: booking.specialRequests,
      cancelReason: booking.cancelReason,
      createdAt: booking.createdAt
    }));
    
    // Calculate price statistics
    const priceStats = {
      min: Math.min(...formattedCars.map(car => car.price)),
      max: Math.max(...formattedCars.map(car => car.price)),
      avg: formattedCars.reduce((sum, car) => sum + car.price, 0) / formattedCars.length
    };
    
    // Calculate booking statistics
    const bookingStats = {
      total: formattedBookings.length,
      confirmed: formattedBookings.filter(b => b.status === 'confirmed').length,
      pending: formattedBookings.filter(b => b.status === 'pending').length,
      ongoing: formattedBookings.filter(b => b.status === 'ongoing').length,
      completed: formattedBookings.filter(b => b.status === 'completed').length,
      cancelled: formattedBookings.filter(b => b.status === 'cancelled').length,
      totalRevenue: formattedBookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.totalAmount, 0)
    };
    
    return {
      cars: formattedCars,
      brands: formattedBrands,
      categories: formattedCategories,
      transmissions: formattedTransmissions,
      fuels: formattedFuels,
      features: formattedFeatures,
      bookings: formattedBookings,
      priceStats,
      bookingStats
    };
  } catch (error) {
    console.error('Error fetching database data:', error);
    return {
      cars: [],
      brands: [],
      categories: [],
      transmissions: [],
      fuels: [],
      features: [],
      bookings: [],
      priceStats: { min: 0, max: 0, avg: 0 },
      bookingStats: { total: 0, confirmed: 0, pending: 0, ongoing: 0, completed: 0, cancelled: 0, totalRevenue: 0 }
    };
  }
};

/**
 * Process AI message with Gemini API
 */
exports.processAIMessage = async (req, res) => {
  try {
    const { message, sessionData } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message is required' 
      });
    }

    // Check if Gemini API is configured
    if (!genAI) {
      return res.status(500).json({ 
        success: false, 
        message: 'AI service not configured' 
      });
    }
    
    // Extract chat history from session data
    const chatHistory = sessionData?.chatHistory || [];
    
    // Fetch all database data to include in prompt
    const dbData = await fetchDatabaseData();

    // Get the generative model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-preview-05-20"
    });
    
    // Create prompt for Gemini with database data
    const prompt = `
    You are an AI assistant for a car rental service. Answer questions based on the database information provided below.
    
    DATABASE INFORMATION:
    
    Cars (${dbData.cars.length} cars): ${JSON.stringify(dbData.cars.slice(0, 20))}
    
    Brands (${dbData.brands.length} brands): ${JSON.stringify(dbData.brands)}
    
    Categories (${dbData.categories.length} categories): ${JSON.stringify(dbData.categories)}
    
    Transmissions: ${JSON.stringify(dbData.transmissions)}
    
    Fuel Types: ${JSON.stringify(dbData.fuels)}
    
    Features: ${JSON.stringify(dbData.features)}
    
    Bookings (${dbData.bookings.length} bookings): ${JSON.stringify(dbData.bookings.slice(0, 15))}
    
    Price Statistics: 
    - Minimum price: $${dbData.priceStats.min}/day
    - Maximum price: $${dbData.priceStats.max}/day
    - Average price: $${Math.round(dbData.priceStats.avg)}/day
    
    Booking Statistics:
    - Total bookings: ${dbData.bookingStats.total}
    - Confirmed bookings: ${dbData.bookingStats.confirmed}  
    - Pending bookings: ${dbData.bookingStats.pending}
    - Ongoing bookings: ${dbData.bookingStats.ongoing}
    - Completed bookings: ${dbData.bookingStats.completed}
    - Cancelled bookings: ${dbData.bookingStats.cancelled}
    - Total revenue (paid bookings): $${dbData.bookingStats.totalRevenue}
    
    IMPORTANT INSTRUCTIONS:
    
    1. When answering questions about cars or bookings, use ONLY the information provided in the database above.
    
    2. For price-related queries, use the "price" field to determine car prices.
    
    3. If the user asks to see specific cars (by brand, category, features, price range, etc.), include a JSON object in your response with the following format:
       {
         "action": "show_cars",
         "car_ids": ["car_id_1", "car_id_2", "car_id_3"]
       }
       
    4. The car_ids should be actual IDs from the database that match the user's request.
    
    5. If the user asks for details about a specific car, include a JSON object:
       {
         "action": "show_car_details",
         "car_id": "specific_car_id"
       }
       
    6. If the user wants to book a specific car or asks about booking availability for a car, include a JSON object:
       {
         "action": "show_booking_calendar",
         "car_id": "specific_car_id"
       }
       This will show the booking calendar for that car so users can see available dates.
       
    7. For booking-related questions, you can answer about:
       - Booking statistics and trends
       - Customer booking history 
       - Car rental performance
       - Revenue information
       - Booking status updates
       - Popular cars (based on booking frequency)
       - Busiest rental periods
       - Customer preferences
       
    8. When answering booking questions, reference the booking data provided above. You can mention specific booking details, customer names, car models, dates, and amounts as needed.
    
    9. When a user asks to book a specific car (e.g., "I want to book BMW X5", "tôi muốn đặt xe BMW X5"), do the following:
       - First, find the car in the cars database by matching the brand and model
       - Check the booking data to see if that car has any current or upcoming bookings (status: confirmed, ongoing, pending)
       - If the car has bookings, mention the specific dates when it's booked
       - Also mention the available periods when the car is free for booking
       - Always include the show_booking_calendar action so users can see the full calendar with both booked and available periods
       - Be helpful by suggesting the available date ranges where they can book the car
       - If there are no available periods, let them know the car is fully booked
    
    10. For general questions about prices, availability, or service information, provide a helpful response based on the database information.
    
    11. Always respond in a friendly, helpful manner. Be concise but informative.
    
    12. If the information requested is not in the database, say so politely rather than making up information.
    
    Chat history:
    ${chatHistory.slice(-5).map(item => `${item.sender === 'user' ? 'Customer' : 'Assistant'}: ${item.text}`).join('\n')}
    
    Customer: ${message}
    `;
    
    // Generate content
    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();
    
    // Try to extract JSON action data from the response
    let actionData = null;
    try {
      // Look for JSON pattern in the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*"action"[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        actionData = JSON.parse(jsonStr);
        
        // If we have car_ids, fetch the actual cars to return to frontend
        if (actionData.action === 'show_cars' && Array.isArray(actionData.car_ids) && actionData.car_ids.length > 0) {
          const carIds = actionData.car_ids.map(id => {
            try {
              return new mongoose.Types.ObjectId(id);
            } catch (e) {
              return null;
            }
          }).filter(id => id !== null);
          
          if (carIds.length > 0) {
            const cars = await Car.find({ _id: { $in: carIds } })
              .populate('brand')
              .populate('category')
              .populate('transmission')
              .populate('fuel')
              .populate('features')
              .limit(10);
              
            // Format cars for frontend display
            const formattedCars = cars.map(car => ({
              id: car._id,
              model: car.model,
              brand: car.brand ? car.brand.name : 'Unknown',
              category: car.category ? car.category.name : 'Unknown',
              year: car.year,
              price: car.price,
              seats: car.seats,
              transmission: car.transmission ? car.transmission.name : null,
              fuelType: car.fuel ? car.fuel.name : null, 
              features: car.features ? car.features.map(f => f.name) : [],
              imageUrl: car.images && car.images.length > 0 ? car.images[0] : null,
              images: car.images
            }));
            
            // Return AI response with car data
            return res.status(200).json({
              success: true,
              message: aiResponse.replace(jsonMatch[0], '').trim(), // Remove JSON from visible response
              data: {
                type: 'car_search_results',
                cars: formattedCars
              }
            });
          }
        }
        
        // Handle show_car_details action
        if (actionData.action === 'show_car_details' && actionData.car_id) {
          try {
            const carId = new mongoose.Types.ObjectId(actionData.car_id);
            const car = await Car.findById(carId)
              .populate('brand')
              .populate('category')
              .populate('transmission')
              .populate('fuel')
              .populate('features');
              
            if (car) {
              // Format car for frontend display
              const formattedCar = {
                id: car._id,
                model: car.model,
                brand: car.brand ? car.brand.name : 'Unknown',
                category: car.category ? car.category.name : 'Unknown',
                year: car.year,
                price: car.price,
                seats: car.seats,
                transmission: car.transmission ? car.transmission.name : 'Unknown',
                fuel: car.fuel ? car.fuel.name : 'Unknown',
                features: car.features ? car.features.map(f => f.name) : [],
                description: car.description,
                imageUrl: car.images && car.images.length > 0 ? car.images[0] : null,
                images: car.images
              };
              
              // Return AI response with car details
              return res.status(200).json({
                success: true,
                message: aiResponse.replace(jsonMatch[0], '').trim(), // Remove JSON from visible response
                data: {
                  type: 'car_details',
                  car: formattedCar
                }
              });
            }
          } catch (e) {
            console.error('Error fetching car details:', e);
          }
        }
        
        // Handle show_booking_calendar action
        if (actionData.action === 'show_booking_calendar' && actionData.car_id) {
          try {
            const carId = new mongoose.Types.ObjectId(actionData.car_id);
            const car = await Car.findById(carId)
              .populate('brand')
              .populate('category')
              .populate('transmission')
              .populate('fuel')
              .populate('features');
              
            if (car) {
              // Get bookings for this car
              const carBookings = await Booking.find({ 
                car: carId,
                status: { $in: ['confirmed', 'ongoing', 'pending'] }
              }).select('startDate endDate status').sort({ startDate: 1 });
              
              // Calculate available periods
              const calculateAvailablePeriods = (bookings) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const maxDate = new Date();
                maxDate.setDate(maxDate.getDate() + 30); // Show availability for next 30 days
                
                const availablePeriods = [];
                const sortedBookings = bookings
                  .map(b => ({
                    start: new Date(b.startDate),
                    end: new Date(b.endDate),
                    status: b.status
                  }))
                  .sort((a, b) => a.start - b.start);
                
                let currentDate = new Date(today);
                
                for (const booking of sortedBookings) {
                  // If there's a gap before this booking
                  if (currentDate < booking.start) {
                    const gapEnd = new Date(booking.start);
                    gapEnd.setDate(gapEnd.getDate() - 1);
                    
                    if (currentDate <= gapEnd) {
                      availablePeriods.push({
                        startDate: new Date(currentDate),
                        endDate: gapEnd
                      });
                    }
                  }
                  
                  // Move current date to after this booking
                  currentDate = new Date(booking.end);
                  currentDate.setDate(currentDate.getDate() + 1);
                }
                
                // Add final period if there's time left until maxDate
                if (currentDate <= maxDate) {
                  availablePeriods.push({
                    startDate: new Date(currentDate),
                    endDate: maxDate
                  });
                }
                
                return availablePeriods;
              };
              
              const availablePeriods = calculateAvailablePeriods(carBookings);
              
              // Format car for frontend display
              const formattedCar = {
                id: car._id,
                model: car.model,
                brand: car.brand ? car.brand.name : 'Unknown',
                category: car.category ? car.category.name : 'Unknown',
                year: car.year,
                price: car.price,
                seats: car.seats,
                transmission: car.transmission ? car.transmission.name : 'Unknown',
                fuel: car.fuel ? car.fuel.name : 'Unknown',
                features: car.features ? car.features.map(f => f.name) : [],
                description: car.description,
                imageUrl: car.images && car.images.length > 0 ? car.images[0] : null,
                images: car.images
              };
              
              // Return AI response with booking calendar
              return res.status(200).json({
                success: true,
                message: aiResponse.replace(jsonMatch[0], '').trim(), // Remove JSON from visible response
                data: {
                  type: 'booking_calendar',
                  car: formattedCar,
                  bookings: carBookings,
                  availablePeriods: availablePeriods
                }
              });
            }
          } catch (e) {
            console.error('Error fetching car booking calendar:', e);
          }
        }
      }
    } catch (jsonError) {
      console.error('Error parsing action data from AI response:', jsonError);
    }
    
    // If no action data or error processing it, just return the AI response
    return res.status(200).json({
      success: true,
      message: aiResponse
    });
    
  } catch (error) {
    console.error('Error processing AI message:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error processing your message',
      error: error.message
    });
  }
}; 