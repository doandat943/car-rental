import api, { carsAPI, brandsAPI, categoriesAPI, websiteAPI } from '../api';

/**
 * Get data for chatbot from website APIs
 */
export const getChatbotData = async () => {
  try {
    // Initialize data storage object
    const chatbotData = {
      cars: [],
      categories: [],
      brands: [],
      websiteInfo: {},
      popularCars: [],
      featuredDeals: []
    };

    // Get car information
    const carsResponse = await carsAPI.getAllCars({
      limit: 10,
      sort: '-createdAt'
    });
    
    if (carsResponse?.data?.success) {
      chatbotData.cars = carsResponse.data.data.map(car => ({
        id: car._id,
        make: car.brand?.name || 'Unknown',
        model: car.model,
        year: car.year,
        category: car.category?.name || 'Unknown',
        pricePerDay: car.pricePerDay,
        transmission: car.transmission?.name || 'Unknown',
        fuel: car.fuel?.name || 'Unknown',
        seats: car.seats,
        isAvailable: car.isAvailable
      }));
    }

    // Get car categories information
    const categoriesResponse = await categoriesAPI.getAllCategories();
    if (categoriesResponse?.data?.success) {
      chatbotData.categories = categoriesResponse.data.data.map(category => ({
        id: category._id,
        name: category.name,
        description: category.description
      }));
    }

    // Get brand information
    const brandsResponse = await brandsAPI.getAllBrands();
    if (brandsResponse?.data?.success) {
      chatbotData.brands = brandsResponse.data.data.map(brand => ({
        id: brand._id,
        name: brand.name,
        country: brand.country
      }));
    }

    // Get website information
    const websiteResponse = await websiteAPI.getInfo();
    if (websiteResponse?.data?.success) {
      chatbotData.websiteInfo = websiteResponse.data.data;
    }

    // Get popular cars or frequently booked cars
    try {
      const popularCarsResponse = await api.get('/cars/popular');
      if (popularCarsResponse?.data?.success) {
        chatbotData.popularCars = popularCarsResponse.data.data.map(car => ({
          id: car._id,
          make: car.brand?.name || 'Unknown',
          model: car.model,
          pricePerDay: car.pricePerDay,
          category: car.category?.name || 'Unknown'
        }));
      }
    } catch (error) {
      console.log('Popular cars not available');
    }

    // Get special deals
    try {
      const dealsResponse = await api.get('/promotions/active');
      if (dealsResponse?.data?.success) {
        chatbotData.featuredDeals = dealsResponse.data.data;
      }
    } catch (error) {
      console.log('Deals not available');
    }

    return chatbotData;
  } catch (error) {
    console.error('Error fetching chatbot data:', error);
    return null;
  }
};

/**
 * Search cars by criteria
 */
export const searchCars = async (criteria) => {
  try {
    const { category, brand, model, minPrice, maxPrice, transmission, seats } = criteria;
    
    const params = {};
    
    if (category) params.category = category;
    if (brand) params.brand = brand;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (transmission) params.transmission = transmission;
    if (seats) params.seats = seats;
    
    // Add model as search parameter if specified
    if (model) params.model = model;
    
    const response = await carsAPI.getAllCars(params);
    
    if (response?.data?.success) {
      return response.data.data.map(car => ({
        id: car._id,
        make: car.brand?.name || 'Unknown',
        model: car.model,
        year: car.year,
        category: car.category?.name || 'Unknown',
        pricePerDay: car.pricePerDay,
        imageUrl: car.images && car.images.length > 0 ? car.images[0] : null
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error searching cars:', error);
    return [];
  }
};

/**
 * Get detailed car information
 */
export const getCarDetails = async (carId) => {
  try {
    const response = await carsAPI.getCarById(carId);
    
    if (response?.data?.success) {
      const car = response.data.data;
      return {
        id: car._id,
        make: car.brand?.name || 'Unknown',
        model: car.model,
        year: car.year,
        description: car.description,
        category: car.category?.name || 'Unknown',
        pricePerDay: car.pricePerDay,
        transmission: car.transmission?.name || 'Unknown',
        fuel: car.fuel?.name || 'Unknown',
        seats: car.seats,
        features: car.features || [],
        images: car.images || []
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting car details:', error);
    return null;
  }
};

/**
 * Check car availability during a timeframe
 */
export const checkCarAvailability = async (carId, startDate, endDate) => {
  try {
    const response = await carsAPI.checkStatus(carId, { startDate, endDate });
    return response;
  } catch (error) {
    console.error('Error checking car availability:', error);
    return { success: false, message: 'Error checking car status' };
  }
};

export default {
  getChatbotData,
  searchCars,
  getCarDetails,
  checkCarAvailability
}; 