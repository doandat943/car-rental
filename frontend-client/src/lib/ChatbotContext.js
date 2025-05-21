'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { chatbotAPI } from './api';
import chatbotDataService from './services/chatbotDataService';

// Create the context
const ChatbotContext = createContext();

// Chatbot provider component
export function ChatbotProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [faqs, setFAQs] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [websiteData, setWebsiteData] = useState(null);
  const [cachedData, setCachedData] = useState({
    cars: [],
    brands: [],
    categories: []
  });
  const [aiMode, setAIMode] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Initialize the chatbot
  useEffect(() => {
    if (!isInitialized) {
      // Add initial welcome message
      setMessages([{
        id: 1,
        text: "Hello! I'm the virtual assistant of CarRental. How can I help you?",
        sender: 'bot',
        timestamp: new Date()
      }]);
      
      // Fetch FAQs
      fetchFAQs();
      
      // Fetch website data
      fetchWebsiteData();
      
      setIsInitialized(true);
    }
  }, [isInitialized]);
  
  // Handle unread message count
  useEffect(() => {
    // If new bot message comes in and chat is closed, increment unread count
    if (messages.length > 0 && !isOpen) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'bot') {
        setUnreadCount(prev => prev + 1);
      }
    }
    
    // Reset unread count when chat is opened
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [messages, isOpen]);
  
  // Fetch FAQs from API
  const fetchFAQs = async () => {
    try {
      const response = await chatbotAPI.getFAQs();
      if (response.data && response.data.success) {
        setFAQs(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      // Set some default FAQs as fallback
      setFAQs([
        { question: "How do I book a car?", answer: "Browse the list of cars, select dates, and proceed to payment." },
        { question: "Can I cancel my booking?", answer: "Yes, cancellations will follow our cancellation policy." },
        { question: "What payment methods are available?", answer: "We accept credit cards, debit cards, and PayPal." }
      ]);
    }
  };

  // Fetch website data for AI context
  const fetchWebsiteData = async () => {
    try {
      const data = await chatbotDataService.getChatbotData();
      setWebsiteData(data);
      
      // Cache common data for quick access
      if (data) {
        setCachedData({
          cars: data.cars || [],
          brands: data.brands || [],
          categories: data.categories || []
        });
      }
    } catch (error) {
      console.error('Error fetching website data:', error);
    }
  };
  
  // Send message to chatbot
  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Get bot response
    try {
      // If AI mode is enabled, use AI directly
      if (aiMode) {
        try {
          // Prepare session data with context
          const sessionData = {
            chatHistory: messages.slice(-5),
            websiteData: websiteData ? {
              cars: websiteData.cars?.slice(0, 10) || [],
              categories: websiteData.categories || [],
              brands: websiteData.brands || []
            } : null
          };
          
          const aiResponse = await chatbotAPI.sendAIMessage(text, sessionData);
          
          if (aiResponse.data && aiResponse.data.success) {
            const botMessage = {
              id: userMessage.id + 1,
              text: aiResponse.data.message,
              sender: 'bot',
              timestamp: new Date(),
              isAI: true,
              data: aiResponse.data.data // Include car data from AI response
            };
            
            // If car data is present, add visual indication
            if (botMessage.data && botMessage.data.type === 'car_search_results') {
              setShowSearchResults(true);
            }
            
            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
            return;
          } else {
            throw new Error('Invalid AI response');
          }
        } catch (aiError) {
          console.error('AI service error, using fallback:', aiError);
          // Fall through to regular API if AI fails
        }
      }
      
      // Try the regular backend API if not in AI mode or if AI failed
      try {
        const sessionData = {
          chatHistory: messages.slice(-5) // Last 5 messages for context
        };
        
        const response = await chatbotAPI.sendMessage(text, sessionData);
        
        if (response.data && response.data.success) {
          const botMessage = {
            id: userMessage.id + 1,
            text: response.data.message,
            sender: 'bot',
            timestamp: new Date(),
            data: response.data.data, // Additional data like car search results
            isAI: false
          };
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
          return;
        }
      } catch (apiError) {
        console.error('API error, using AI service via backend:', apiError);
      }
      
      // Use AI service via backend as fallback for regular mode
      if (!aiMode) {
        try {
          // Prepare session data with context
          const sessionData = {
            chatHistory: messages.slice(-5),
            websiteData: websiteData ? {
              cars: websiteData.cars?.slice(0, 10) || [],
              categories: websiteData.categories || [],
              brands: websiteData.brands || []
            } : null
          };
          
          const aiResponse = await chatbotAPI.sendAIMessage(text, sessionData);
          
          if (aiResponse.data && aiResponse.data.success) {
            const botMessage = {
              id: userMessage.id + 1,
              text: aiResponse.data.message,
              sender: 'bot',
              timestamp: new Date(),
              isAI: true
            };
            
            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
            return;
          } else {
            throw new Error('Invalid AI response');
          }
        } catch (aiError) {
          console.error('AI service error, using fallback:', aiError);
        }
      }
      
      // Final fallback to local response generation if both API calls fail
      const botResponse = await generateFallbackResponse(text);
      const botMessage = {
        id: userMessage.id + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        isAI: false
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      const errorMessage = {
        id: userMessage.id + 1,
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
        isAI: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  
  // Search cars based on criteria
  const searchCars = async (criteria) => {
    try {
      const results = await chatbotDataService.searchCars(criteria);
      
      if (results.length > 0) {
        let message = `I found ${results.length} cars matching your requirements:\n\n`;
        
        results.forEach((car, index) => {
          message += `${index + 1}. ${car.make} ${car.model} (${car.year})\n`;
          message += `   - Type: ${car.category}\n`;
          message += `   - Price: $${car.pricePerDay.toLocaleString()}/day\n\n`;
        });
        
        const searchResultMessage = {
          id: messages.length + 1,
          text: message,
          sender: 'bot',
          timestamp: new Date(),
          data: { type: 'car_search_results', cars: results }
        };
        
        setMessages(prev => [...prev, searchResultMessage]);
      } else {
        const noResultsMessage = {
          id: messages.length + 1,
          text: "I couldn't find any cars matching your requirements. You can try with different criteria or browse all our cars.",
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, noResultsMessage]);
      }
    } catch (error) {
      console.error('Error searching cars:', error);
      const errorMessage = {
        id: messages.length + 1,
        text: "An error occurred while searching for cars. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };
  
  // Generate fallback responses when API is not available
  const generateFallbackResponse = async (userMessage) => {
    // Check if any FAQ matches
    const lowerCaseMessage = userMessage.toLowerCase();
    const matchingFAQ = faqs.find(faq => 
      faq.question.toLowerCase().includes(lowerCaseMessage) || 
      lowerCaseMessage.includes(faq.question.toLowerCase())
    );
    
    if (matchingFAQ) {
      return matchingFAQ.answer;
    }
    
    // Check if this is a car search query
    if (
      lowerCaseMessage.includes('find car') || 
      lowerCaseMessage.includes('rent car') || 
      lowerCaseMessage.includes('show car') ||
      lowerCaseMessage.includes('thẻ xe') ||
      lowerCaseMessage.includes('card') ||
      (lowerCaseMessage.includes('car') && (lowerCaseMessage.includes('price') || lowerCaseMessage.includes('book')))
    ) {
      const criteria = extractSearchCriteria(lowerCaseMessage);
      if (Object.keys(criteria).length > 0) {
        // Schedule a search instead of direct response
        setTimeout(() => {
          searchCars(criteria);
        }, 500);
        
        return "Searching for cars that match your requirements...";
      }
    }
    
    // Handle specific request to show a car card
    if (
      (lowerCaseMessage.includes('show') || lowerCaseMessage.includes('display') || lowerCaseMessage.includes('hiển thị')) && 
      (lowerCaseMessage.includes('card') || lowerCaseMessage.includes('thẻ'))
    ) {
      // Extract brand and model from the message
      const criteria = extractSearchCriteria(lowerCaseMessage);
      
      if (Object.keys(criteria).length > 0) {
        setTimeout(() => {
          searchCars(criteria);
        }, 500);
        
        return "I'll display car cards for you right away...";
      } else {
        return "I can display car cards for you. Please specify which car you're interested in, like 'Show me Mercedes C300 cars' or 'Show BMW card'.";
      }
    }
    
    // Basic keyword responses
    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
      return "Hello! How can I help you with our car rental service?";
    } else if (lowerCaseMessage.includes('book') || lowerCaseMessage.includes('rent')) {
      return "To book a car, you need to browse our car list, select pickup and return dates, then proceed to payment. You need to be logged in to complete your booking.";
    } else if (lowerCaseMessage.includes('cancel')) {
      return "You can cancel your booking through your account. Please note that our cancellation policy will apply depending on when you cancel.";
    } else if (lowerCaseMessage.includes('price') || lowerCaseMessage.includes('cost')) {
      // Use cached data for price ranges
      if (cachedData.cars.length > 0) {
        const prices = cachedData.cars.map(car => car.pricePerDay);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        
        return `Our car rental prices range from $${minPrice.toLocaleString()} to $${maxPrice.toLocaleString()} per day, depending on the car type. The average price is about $${Math.round(avgPrice).toLocaleString()} per day.`;
      }
      
      return "Our rental prices vary based on car type, rental duration, and additional services. You can view detailed pricing when browsing our car list.";
    } else if (lowerCaseMessage.includes('payment')) {
      return "We accept payment via credit cards, debit cards, and PayPal. Full payment is required at the time of booking.";
    } else if (lowerCaseMessage.includes('pickup') || lowerCaseMessage.includes('location')) {
      return "We have multiple pickup locations. You can select your preferred pickup location during the booking process.";
    } else if (lowerCaseMessage.includes('insurance')) {
      return "Basic insurance is included with all rentals. We also offer comprehensive insurance options for an additional fee.";
    } else if (lowerCaseMessage.includes('thank')) {
      return "You're welcome! I'm happy to help. If you have any other questions, feel free to ask me.";
    } else {
      return "Thank you for your question. I can help you find cars, provide information about booking, our policies, or answer other questions about our car rental service. How can I specifically assist you?";
    }
  };

  // Extract search criteria from a message
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
    
    // Extract specific model mentions (if any)
    const modelPatterns = [
      { pattern: /c300/i, model: 'C300' },
      { pattern: /accord/i, model: 'Accord' },
      { pattern: /camry/i, model: 'Camry' },
      { pattern: /civic/i, model: 'Civic' },
      { pattern: /corolla/i, model: 'Corolla' },
      { pattern: /x5/i, model: 'X5' },
      { pattern: /a4/i, model: 'A4' },
      { pattern: /mustang/i, model: 'Mustang' }
    ];
    
    modelPatterns.forEach(({ pattern, model }) => {
      if (pattern.test(message)) criteria.model = model;
    });
    
    // Look for general intent to see cars when model is detected
    if (
      (message.includes('xem') || message.includes('show') || message.includes('display') || message.includes('hiển thị')) && 
      (message.includes('xe') || message.includes('car')) && 
      Object.keys(criteria).length > 0
    ) {
      // If we already have some criteria, this is likely a valid car search
      console.log("Detected car search with criteria:", criteria);
    }
    
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
    
    // Find seats
    const seatsMatch = message.match(/(\d+)\s?seat/i) || message.match(/(\d+)\s?people/i) || message.match(/(\d+)\s?passenger/i);
    if (seatsMatch) {
      criteria.seats = parseInt(seatsMatch[1]);
    }
    
    return criteria;
  };
  
  // Clear chat history
  const clearChat = () => {
    setMessages([{
      id: 1,
      text: "Hello! I'm the virtual assistant of CarRental. How can I help you?",
      sender: 'bot',
      timestamp: new Date()
    }]);
  };
  
  // Toggle AI mode
  const toggleAIMode = () => {
    setAIMode(prev => !prev);
    
    // Send a system message when mode changes
    const newMessage = {
      id: messages.length + 1,
      text: !aiMode ? "AI mode enabled. I'll try to be more helpful with advanced responses." : "Standard mode enabled. I'll use predefined answers when possible.",
      sender: 'bot',
      timestamp: new Date(),
      isSystem: true
    };
    
    setMessages(prev => [...prev, newMessage]);
  };
  
  // Context value
  const value = {
    isOpen,
    setIsOpen,
    messages,
    sendMessage,
    unreadCount,
    faqs,
    clearChat,
    isTyping,
    websiteData,
    searchCars,
    aiMode,
    toggleAIMode,
    showSearchResults,
    setShowSearchResults
  };
  
  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
}

// Custom hook for using the chatbot context
export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
} 