'use client';

import { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaArrowUp, FaCommentDots, FaSearch, FaHistory, FaCircle, FaInfoCircle, FaCar, FaList, FaImages, FaChevronLeft, FaChevronRight, FaStar, FaPaperPlane, FaUser, FaComments, FaQuestionCircle, FaLifeRing } from 'react-icons/fa';
import Link from 'next/link';
import axios from 'axios';
import { chatbotAPI, websiteAPI } from '../lib/api';

// Constants for localStorage
const CHAT_HISTORY_KEY = 'carRental_chatHistory';
const CHAT_TIMESTAMP_KEY = 'carRental_chatTimestamp';
const CHAT_HISTORY_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export default function AdvancedChatbot() {
  // Basic state
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  // State for FAQs and website info
  const [faqs, setFaqs] = useState([]);
  const [websiteInfo, setWebsiteInfo] = useState(null);
  
  // State for search and display
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('carousel'); // 'carousel' or 'list'
  const [activeCarIndex, setActiveCarIndex] = useState(0); // For carousel mode
  
  // Refs for each tab container
  const chatTabRef = useRef(null);
  const searchTabRef = useRef(null);
  const helpTabRef = useRef(null);
  
  // Custom CSS for typing effect
  const typingCursorStyle = {
    animation: 'cursor-blink 0.8s step-end infinite',
  };
  
  // Add global style for animation
  useEffect(() => {
    // Add CSS animation for blinking cursor
    const style = document.createElement('style');
    style.textContent = `
      @keyframes cursor-blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      
      .typing-cursor {
        animation: cursor-blink 0.8s step-end infinite;
      }
      
      .typing-dot {
        width: 6px;
        height: 6px;
        background-color: #6B7280;
        border-radius: 50%;
        margin: 0 1px;
        display: inline-block;
        animation: typing-bounce 1.4s infinite ease-in-out both;
      }
      
      .typing-dot:nth-child(1) {
        animation-delay: -0.32s;
      }
      
      .typing-dot:nth-child(2) {
        animation-delay: -0.16s;
      }
      
      @keyframes typing-bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
      
      .chat-button-pulse {
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(79, 70, 229, 0); }
        100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Save messages to localStorage when messages change
  useEffect(() => {
    if (messages.length === 0) return;
    
    try {
      // Save messages and timestamp
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
      localStorage.setItem(CHAT_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error saving chat history to localStorage:', error);
    }
  }, [messages]);
  
  // Restore messages from localStorage when component mounts
  useEffect(() => {
    try {
      // Check if there are saved messages and timestamp
      const savedMessages = localStorage.getItem(CHAT_HISTORY_KEY);
      const savedTimestamp = localStorage.getItem(CHAT_TIMESTAMP_KEY);
      
      if (savedMessages && savedTimestamp) {
        const timestamp = parseInt(savedTimestamp);
        const now = Date.now();
        
        // Check if messages are too old
        if (now - timestamp <= CHAT_HISTORY_MAX_AGE) {
          const parsedMessages = JSON.parse(savedMessages);
          
          // If valid messages exist, update state
          if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
            setMessages(parsedMessages);
            return; // No need to add welcome message
          }
        } else {
          // Delete old messages if expired
          localStorage.removeItem(CHAT_HISTORY_KEY);
          localStorage.removeItem(CHAT_TIMESTAMP_KEY);
        }
      }
      
      // If no saved messages or messages are too old, show welcome message
      setMessages([{
        id: Date.now(),
        text: "Hello! I'm the CarRental AI assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
        isAI: true
      }]);
    } catch (error) {
      console.error('Error loading chat history from localStorage:', error);
      
      // Fallback if error
      setMessages([{
        id: Date.now(),
        text: "Hello! I'm the CarRental AI assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
        isAI: true
      }]);
    }
  }, []);
  
  // Initialize welcome message
  useEffect(() => {
    // Skip because we already handled in the restore messages useEffect
  }, [messages.length]);
  
  // Reset active car index when messages change
  useEffect(() => {
    // Check if the last message contains car data
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.data?.cars && lastMessage.data.cars.length > 0) {
      setActiveCarIndex(0);
    }
  }, [messages]);
  
  // Handle unread message count
  useEffect(() => {
    if (messages.length > 0 && !isOpen) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'bot') {
        setUnreadCount(prev => prev + 1);
      }
    }
    
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [messages, isOpen]);
  
  // Scroll down when new messages arrive
  useEffect(() => {
    if (isOpen && activeTab === 'chat' && messages.length > 0) {
      // Use requestAnimationFrame for optimal performance
      requestAnimationFrame(() => {
        scrollToBottom('smooth');
      });
    }
  }, [messages, isOpen, activeTab]);
  
  // Open/close chatbot
  const toggleChat = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    
    if (nextState && activeTab === 'chat') {
      // If chatbot is open and on chat tab, scroll down
      requestAnimationFrame(() => {
        scrollToBottom('smooth');
      });
    } else if (!nextState) {
      // Remove old car results display when closing chatbot
      const oldResults = document.getElementById('immediate-car-results');
      if (oldResults) oldResults.remove();
    }
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  // Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const text = inputValue;
    setInputValue('');
    
    // Add user message to the list
    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Remove old car results display if any
    const oldResults = document.getElementById('immediate-car-results');
    if (oldResults) oldResults.remove();
    
    try {
      // Call Gemini AI API
      const response = await axios.post('/api/chatbot/ai-message', {
        message: text,
        sessionData: {
          chatHistory: messages.slice(-5)
        }
      });
      
      if (response.data && response.data.success) {
        // Create bot message immediately without typing effect
        const botMessage = {
          id: Date.now(),
          text: response.data.message || "I understand your request. Let me help you with that.",
          sender: 'bot',
          timestamp: new Date(),
          isAI: true,
          data: response.data.data
        };
        
        // Add bot message to the list immediately
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Invalid AI response');
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback response if AI encounters an error
      const fallbackMessage = {
        id: Date.now(),
        text: "Sorry, I'm having trouble processing your request. Please try again later or ask a different question.",
        sender: 'bot',
        timestamp: new Date(),
        isAI: true
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  
  // Handle quick question
  const handleQuickQuestion = (question) => {
    setInputValue(question);
    
    // Submit the form programmatically
    const form = document.getElementById('chatbot-form');
    if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
  };

  // Handle view calendar for specific car
  const handleViewCalendar = async (carId, carBrand, carModel) => {
    const question = `Show me the booking calendar for ${carBrand} ${carModel}`;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: question,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      // Call AI API to get calendar
      const response = await axios.post('/api/chatbot/ai-message', {
        message: question,
        sessionData: {
          chatHistory: messages.slice(-5)
        }
      });
      
      if (response.data && response.data.success) {
        const botMessage = {
          id: Date.now(),
          text: response.data.message || `Here's the booking calendar for ${carBrand} ${carModel}:`,
          sender: 'bot',
          timestamp: new Date(),
          isAI: true,
          data: response.data.data
        };
        
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error getting calendar:', error);
      
      const fallbackMessage = {
        id: Date.now(),
        text: "Sorry, I couldn't load the calendar right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
        isAI: true
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  
  // Format time
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Handle tab change
  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    
    setActiveTab(tab);
    setSearchQuery(''); // Reset search when changing tabs
    
    // Scroll to bottom if chat tab
    if (tab === 'chat') {
      setTimeout(scrollToBottom, 100);
    }
  };
  
  // Handle search change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Toggle view mode between carousel and list
  const toggleViewMode = () => {
    setViewMode(prevMode => prevMode === 'carousel' ? 'list' : 'carousel');
  };
  
  // Navigate to next car in carousel
  const nextCar = (totalCars) => {
    if (totalCars <= 1) return; // Do nothing if only 1 car or less
    
    setActiveCarIndex(prevIndex => {
      if (prevIndex === totalCars - 1) return 0;
      return prevIndex + 1;
    });
  };
  
  // Navigate to previous car in carousel
  const prevCar = (totalCars) => {
    if (totalCars <= 1) return; // Do nothing if only 1 car or less
    
    setActiveCarIndex(prevIndex => {
      if (prevIndex === 0) return totalCars - 1;
      return prevIndex - 1;
    });
  };
  
  // Clear chat history
  const handleClearChat = () => {
    const confirmed = window.confirm('Are you sure you want to clear the chat history?');
    if (confirmed) {
      // Remove messages from localStorage
      try {
        localStorage.removeItem(CHAT_HISTORY_KEY);
        localStorage.removeItem(CHAT_TIMESTAMP_KEY);
      } catch (error) {
        console.error('Error clearing chat history from localStorage:', error);
      }
      
      setMessages([{
        id: Date.now(),
        text: "Hello! I'm the CarRental AI assistant. How can I help you today?",
        sender: 'bot',
        isAI: true,
        timestamp: new Date()
      }]);
    }
  };
  
  // Group messages by date
  const getMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  const groupedMessages = messages.reduce((groups, message) => {
    const date = getMessageDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});
  
  // Get formatted date for display
  const getFormattedDate = (date) => {
    const today = getMessageDate(new Date());
    if (date === today) {
      return 'Today';
    }
    return date;
  };
  
  // Car search from form
  const handleCarSearch = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const criteria = {
      category: formData.get('category') || undefined,
      brand: formData.get('brand') || undefined,
      model: formData.get('model') || undefined,
      minPrice: formData.get('minPrice') ? parseInt(formData.get('minPrice')) : undefined,
      maxPrice: formData.get('maxPrice') ? parseInt(formData.get('maxPrice')) : undefined,
      seats: formData.get('seats') || undefined,
      transmission: formData.get('transmission') || undefined
    };
    
    // Filter out undefined values
    Object.keys(criteria).forEach(key => 
      criteria[key] === undefined && delete criteria[key]
    );
    
    if (Object.keys(criteria).length === 0) {
      alert('Please enter at least one search criteria');
      return;
    }
    
    // Switch to chat tab
    setActiveTab('chat');
    
    // Use searchCars function to search for cars
    await searchCars(criteria);
  };
  
  // Render message content with special formatting
  const renderMessageContent = (text) => {
    // Replace newlines with <br> tags
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };
  
  // Get message class based on sender
  const getMessageClass = (message) => {
    if (message.isSystem) {
      return 'bg-gray-300 text-gray-800 system-message';
    } else if (message.sender === 'user') {
      return 'bg-primary text-white user-message';
    } else if (message.isAI) {
      return 'bg-indigo-600 text-white ai-message';
    } else {
      return 'bg-gray-200 text-gray-800 bot-message';
    }
  };
  
  // Search cars function
  const searchCars = async (criteria) => {
    setIsTyping(true);
    
    try {
      const response = await axios.get('/api/cars', { params: criteria });
      
      if (response.data && response.data.success) {
        // Format cars for display
        const cars = response.data.data.map(car => ({
          id: car._id,
          brand: car.brand?.name || 'Unknown',
          model: car.model,
          year: car.year,
          category: car.category?.name || 'Unknown',
          price: car.price,
          seats: car.seats,
          transmission: car.transmission?.name,
          fuelType: car.fuel?.name,
          features: car.features?.map(f => f.name) || [],
          imageUrl: car.images && car.images.length > 0 ? car.images[0] : null
        }));
        
        // Create bot message
        const botMessage = {
          id: Date.now(),
          text: `I found ${cars.length} cars matching your criteria.`,
          sender: 'bot',
          timestamp: new Date(),
          isAI: true,
          data: {
            type: 'car_search_results',
            cars: cars
          }
        };
        
        // Add bot message to the list
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Invalid search results');
      }
    } catch (error) {
      console.error('Error searching for cars:', error);
      
      // Fallback response if search encounters an error
      const fallbackMessage = {
        id: Date.now(),
        text: "Sorry, I'm having trouble searching for cars. Please try again later or ask a different question.",
        sender: 'bot',
        timestamp: new Date(),
        isAI: true
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  
  // Function to scroll to the latest message with force scroll
  const scrollToBottom = (behavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior,
        block: 'end',
        inline: 'nearest'
      });
    }
  };
  

  
  // Display last message with typing effect or as is
  const renderLastMessage = () => {
    // Only show typing indicator when isTyping is true
    if (!isTyping) {
      return null;
    }
    
    return (
      <div className="mb-4">
        <div className="inline-block px-4 py-2 text-gray-800 bg-gray-200 rounded-lg">
          <div className="flex space-x-1">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        </div>
      </div>
    );
  };
  
  // Fetch FAQs from websiteInfo
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await websiteAPI.getInfo();
        if (response?.data?.success && response.data.data) {
          setWebsiteInfo(response.data.data);
          setFaqs(response.data.data.faqs || []);
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        // Set default FAQs if fetch fails
        setFaqs([
          {
            question: "How do I book a car?",
            answer: "Browse the list of cars, select one that meets your needs. Choose your pickup and return dates, then follow the checkout process. You'll receive a confirmation email once your booking is complete."
          },
          {
            question: "Can I cancel my booking?",
            answer: "Yes, you can cancel your booking up to 24 hours before the scheduled pickup time for a full refund. Cancellations within 24 hours may be subject to a cancellation fee."
          },
          {
            question: "What payment methods are accepted?",
            answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and digital wallets including Apple Pay and Google Pay. Cash payments are not accepted."
          },
          {
            question: "Is insurance included?",
            answer: "Basic insurance is included in all rentals. This covers liability and collision damage. Additional coverage options are available during the booking process for extra peace of mind."
          },
          {
            question: "What if I return the car late?",
            answer: "Late returns are charged at an hourly rate of the daily rental price, up to one full day. Returns more than 24 hours late may incur additional penalties. Please contact us if you expect to be late."
          },
          {
            question: "Do I need to refill the fuel tank?",
            answer: "Yes, all vehicles should be returned with the same fuel level as when they were picked up. If returned with less fuel, you'll be charged for refueling plus a service fee."
          },
          {
            question: "What documents do I need to rent a car?",
            answer: "You'll need a valid driver's license, a credit card in your name, and a valid ID or passport. International customers may also need an International Driving Permit depending on their country of origin."
          }
        ]);
      }
    };

    fetchFAQs();
  }, []);
  
  return (
    <>
      <style jsx>{`
        .chatbot-messages {
          scroll-behavior: smooth;
          scroll-padding-bottom: 20px;
        }
        
        @media (prefers-reduced-motion: no-preference) {
          .chatbot-messages {
            scroll-behavior: smooth;
          }
        }
        
        /* Faster scroll animation */
        .chatbot-messages::-webkit-scrollbar {
          width: 6px;
        }
        
        .chatbot-messages::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .chatbot-messages::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        
        .chatbot-messages::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
      <div className="fixed z-50 bottom-6 right-6 chatbot-container">
      {/* Chatbot button */}
      <button
        onClick={toggleChat}
        className={`bg-primary w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors focus:outline-none ${unreadCount > 0 ? 'chat-button-pulse' : ''}`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <FaTimes className="text-xl text-white" />
        ) : (
          <>
            <FaCommentDots className="text-xl text-white" />
            {unreadCount > 0 && (
              <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                {unreadCount}
              </span>
            )}
          </>
        )}
      </button>
      
      {/* Chatbot interface */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col transition-all duration-300 h-[750px] chatbox-container">
          {/* Header - Fixed */}
          <div className="sticky top-0 z-10 flex items-center p-4 text-white bg-primary">
            <FaRobot className="mr-2 text-xl" />
            <div className="flex-1">
              <h3 className="font-semibold">CarRental Assistant</h3>
              <p className="text-xs opacity-80">Automated support 24/7</p>
            </div>
            <button 
              onClick={toggleChat}
              className="text-white hover:text-gray-200 focus:outline-none"
              aria-label="Close chat"
            >
              <FaTimes />
            </button>
          </div>
          
          {/* Tabs - Fixed */}
          <div className="bg-gray-100 border-b border-gray-200 flex sticky top-[68px] z-10">
            <button 
              onClick={() => handleTabChange('search')}
              className={`flex-1 py-2 text-sm font-medium ${activeTab === 'search' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            >
              Find Car
            </button>
            <button 
              onClick={() => handleTabChange('chat')}
              className={`flex-1 py-2 text-sm font-medium ${activeTab === 'chat' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            >
              Chat
            </button>
            <button 
              onClick={() => handleTabChange('help')}
              className={`flex-1 py-2 text-sm font-medium ${activeTab === 'help' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            >
              Help
            </button>
          </div>
          
          {/* Main content area with flex-1 to take remaining space */}
          <div className="flex-1 flex flex-col overflow-hidden h-[600px]">
            {/* Chat Tab */}
            <div className={`${activeTab === 'chat' ? 'flex' : 'hidden'} flex-col h-full`}>
              {/* Messages - Scrollable area */}
              <div ref={chatTabRef} className="flex-1 p-4 overflow-y-auto chatbot-messages" style={{ height: '600px' }}>
                {Object.keys(groupedMessages).map(date => (
                  <div key={date}>
                    <div className="my-3 text-center">
                      <span className="px-2 py-1 text-xs text-gray-600 bg-gray-200 rounded-full">
                        <span suppressHydrationWarning>{getFormattedDate(date)}</span>
                      </span>
                    </div>
                    
                    {groupedMessages[date].map((message) => (
                      <div 
                        key={message.id} 
                        className={`mb-4 ${message.sender === 'user' ? 'text-right' : ''}`}
                      >
                        <div 
                          className={`inline-block rounded-lg px-4 py-2 max-w-[80%] break-words ${getMessageClass(message)}`}
                        >
                          {message.sender === 'bot' && !message.isSystem && (
                            <div className="flex items-center mb-1">
                              <div className="flex items-center">
                                <FaRobot className="mr-1 text-xs" />
                                <span className="text-xs font-medium">Assistant</span>
                              </div>
                            </div>
                          )}
                          <p className="text-sm">{renderMessageContent(message.text)}</p>
                          
                          {/* Booking calendar - if message contains booking calendar data */}
                          {message.data && 
                            message.data.type === 'booking_calendar' && 
                            message.data.car && (
                            <div className="mt-3">
                              <div className="flex items-center mb-2 font-medium text-gray-100">
                                <FaCar className="mr-2" /> Booking Calendar for {message.data.car.brand} {message.data.car.model}
                              </div>
                              
                              <div className="p-4 text-gray-800 bg-white rounded-lg shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <h4 className="text-lg font-semibold text-primary">
                                      {message.data.car.brand} {message.data.car.model}
                                      {message.data.car.year && <span className="ml-1 text-gray-500">({message.data.car.year})</span>}
                                    </h4>
                                    <div className="text-xl font-bold text-green-600">
                                      ${message.data.car.price?.toLocaleString()}/day
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Show current bookings */}
                                {message.data.bookings && message.data.bookings.length > 0 && (
                                  <div className="mb-4">
                                    <h5 className="mb-2 font-medium text-gray-700">🚫 Booked Periods:</h5>
                                    <div className="space-y-2">
                                      {message.data.bookings.map((booking, idx) => (
                                        <div key={idx} className="p-2 text-sm border border-red-200 rounded-md bg-red-50">
                                          <div className="flex items-center justify-between">
                                            <span className="text-red-700">
                                              {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                              booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                              booking.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                                              'bg-gray-100 text-gray-700'
                                            }`}>
                                              {booking.status}
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Show available periods */}
                                {message.data.availablePeriods && message.data.availablePeriods.length > 0 && (
                                  <div className="mb-4">
                                    <h5 className="mb-2 font-medium text-gray-700">✅ Available Periods:</h5>
                                    <div className="space-y-2">
                                      {message.data.availablePeriods.map((period, idx) => {
                                        const startDate = new Date(period.startDate);
                                        const endDate = new Date(period.endDate);
                                        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
                                        
                                        return (
                                          <div key={idx} className="p-2 text-sm border border-green-200 rounded-md bg-green-50">
                                            <div className="flex items-center justify-between">
                                              <span className="text-green-700">
                                                {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                                              </span>
                                              <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                                                {daysDiff} days available
                                              </span>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Show message if no availability */}
                                {(!message.data.availablePeriods || message.data.availablePeriods.length === 0) && 
                                 message.data.bookings && message.data.bookings.length > 0 && (
                                  <div className="mb-4">
                                    <div className="p-3 text-sm border border-yellow-200 rounded-md bg-yellow-50">
                                      <div className="text-yellow-700">
                                        ⚠️ This car is fully booked for the next 30 days. Please check back later or choose another car.
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {/* View detail button */}
                                <div className="text-center">
                                  <Link 
                                    href={`/cars/${message.data.car.id}`} 
                                    className="inline-block px-6 py-2 text-sm font-medium text-white transition-colors rounded-full bg-primary hover:bg-primary-dark"
                                  >
                                    View Detail
                                  </Link>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Car search result cards - if message contains car data */}
                          {message.data && 
                            (message.data.type === 'car_search_results' || message.data.type === 'car_search') && 
                            message.data.cars && 
                            message.data.cars.length > 0 && (
                            <div className="mt-3 space-y-3">
                              <div className="flex items-center justify-between mb-2 font-medium text-gray-100">
                                <div className="flex items-center">
                                  <FaCar className="mr-2" /> Found {message.data.cars.length} matching cars:
                                </div>
                                {message.data.cars.length > 1 && (
                                  <button 
                                    onClick={toggleViewMode} 
                                    className="flex items-center px-2 py-1 text-xs text-white transition-colors bg-gray-700 rounded-full hover:bg-gray-600"
                                  >
                                    {viewMode === 'carousel' ? <><FaList className="mr-1" /> List view</> : <><FaImages className="mr-1" /> Card view</>}
                                  </button>
                                )}
                              </div>
                              
                              {/* Carousel Mode */}
                              {viewMode === 'carousel' && message.data.cars.length > 0 && (
                                <div className="relative overflow-hidden bg-white rounded-lg shadow-sm">
                                  {/* Current Car Card */}
                                  <div className="p-4 text-gray-800">
                                    {/* Ensure current car exists */}
                                    {(() => {
                                      // Safe check and ensure activeCarIndex is valid
                                      const safeIndex = Math.min(activeCarIndex, message.data.cars.length - 1);
                                      const currentCar = message.data.cars[safeIndex];
                                      
                                      if (!currentCar) return null;
                                      
                                      return (
                                        <>
                                          {/* Car Content */}
                                          <div className="flex items-center justify-between mb-2">
                                            <div>
                                              <h4 className="text-lg font-semibold text-primary">
                                                {currentCar.make || currentCar.brand} {currentCar.model}
                                                {currentCar.year && <span className="ml-1 text-gray-500">({currentCar.year})</span>}
                                              </h4>
                                            </div>
                                            <span className="px-3 py-1 text-xs text-white rounded-full bg-primary">
                                              {currentCar.category || 'Car'}
                                            </span>
                                          </div>
                                          
                                          {/* Car Price */}
                                          <div className="mb-3 text-xl font-bold text-green-600">
                                            ${currentCar.price?.toLocaleString()}/day
                                          </div>
                                          
                                          {/* Car Details */}
                                          <div className="mb-3 space-y-2">
                                            {currentCar.transmission && (
                                              <div className="px-3 py-1 text-sm text-blue-600 rounded-md bg-blue-50">
                                                <span className="font-medium">Transmission:</span> {currentCar.transmission}
                                              </div>
                                            )}
                                            {currentCar.seats && (
                                              <div className="px-3 py-1 text-sm text-blue-600 rounded-md bg-blue-50">
                                                <span className="font-medium">Seats:</span> {currentCar.seats} seats
                                              </div>
                                            )}
                                            {currentCar.fuelType && (
                                              <div className="px-3 py-1 text-sm text-blue-600 rounded-md bg-blue-50">
                                                <span className="font-medium">Fuel:</span> {currentCar.fuelType}
                                              </div>
                                            )}
                                          </div>
                                          
                                          {/* Features */}
                                          {currentCar.features && currentCar.features.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-4">
                                              {currentCar.features.slice(0, 3).map((feature, i) => (
                                                <span key={i} className="px-2 py-1 text-xs text-purple-700 bg-purple-100 rounded">
                                                  {feature}
                                                </span>
                                              ))}
                                              {currentCar.features.length > 3 && (
                                                <span className="px-2 py-1 text-xs text-purple-700 bg-purple-100 rounded">
                                                  +{currentCar.features.length - 3} more
                                                </span>
                                              )}
                                            </div>
                                          )}
                                          
                                                                                      {/* Action buttons */}
                                            <div className="mt-3 text-center space-y-2">
                                              <div className="flex gap-2 justify-center">
                                                <Link href={`/cars/${currentCar.id}`} className="inline-block text-xs bg-primary text-white px-4 py-1.5 rounded-full hover:bg-primary-dark transition-colors font-medium">
                                                  View Detail
                                                </Link>
                                                <button 
                                                  onClick={() => handleViewCalendar(currentCar.id, currentCar.make || currentCar.brand, currentCar.model)}
                                                  className="inline-block text-xs bg-green-600 text-white px-4 py-1.5 rounded-full hover:bg-green-700 transition-colors font-medium"
                                                >
                                                  View Calendar
                                                </button>
                                              </div>
                                            </div>
                                        </>
                                      );
                                    })()}
                                    
                                    {/* Carousel Navigation & Pagination */}
                                    {message.data.cars.length > 1 && (
                                      <>
                                        {/* Pagination Indicators */}
                                        <div className="flex justify-center gap-2 mt-4 mb-3">
                                          {message.data.cars.map((_, idx) => (
                                            <button
                                              key={idx}
                                              onClick={() => setActiveCarIndex(idx)}
                                              className={`rounded-full transition-all ${
                                                idx === activeCarIndex 
                                                ? 'bg-primary w-3 h-3' 
                                                : 'bg-blue-200 w-3 h-3 opacity-80 hover:opacity-100'
                                              }`}
                                              aria-label={`Go to car ${idx + 1}`}
                                            />
                                          ))}
                                        </div>
                                        
                                        {/* Left/Right Navigation Buttons */}
                                        <div className="absolute transform -translate-y-1/2 left-2 top-1/2">
                                          <button 
                                            onClick={() => prevCar(message.data.cars.length)} 
                                            className="flex items-center justify-center w-8 h-8 transition-colors bg-white rounded-full shadow-md text-primary hover:bg-gray-50"
                                            aria-label="Previous car"
                                          >
                                            <FaChevronLeft />
                                          </button>
                                        </div>
                                        <div className="absolute transform -translate-y-1/2 right-2 top-1/2">
                                          <button 
                                            onClick={() => nextCar(message.data.cars.length)} 
                                            className="flex items-center justify-center w-8 h-8 transition-colors bg-white rounded-full shadow-md text-primary hover:bg-gray-50"
                                            aria-label="Next car"
                                          >
                                            <FaChevronRight />
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {/* List Mode */}
                              {viewMode === 'list' && (
                                <div className="space-y-3">
                                  {message.data.cars.map((car, index) => (
                                    <div key={index} className="p-4 text-gray-800 bg-white rounded-lg shadow-sm">
                                      {/* Header with car name and type */}
                                      <div className="flex items-center justify-between mb-2">
                                        <div>
                                          <h4 className="text-lg font-semibold text-primary">
                                            {car.make || car.brand} {car.model}
                                            {car.year && <span className="ml-1 text-gray-500">({car.year})</span>}
                                          </h4>
                                        </div>
                                        <span className="px-3 py-1 text-xs text-white rounded-full bg-primary">{car.category || 'Car'}</span>
                                      </div>
                                      
                                      {/* Display price with highlight color */}
                                      <div className="mb-3 text-xl font-bold text-green-600">
                                        ${car.price?.toLocaleString()}/day
                                      </div>
                                      
                                      {/* Car Details */}
                                      <div className="flex flex-wrap gap-2 mb-3">
                                        {car.transmission && (
                                          <div className="px-3 py-1 text-sm text-blue-600 rounded-md bg-blue-50">
                                            <span className="font-medium">Transmission:</span> {car.transmission}
                                          </div>
                                        )}
                                        {car.seats && (
                                          <div className="px-3 py-1 text-sm text-blue-600 rounded-md bg-blue-50">
                                            <span className="font-medium">Seats:</span> {car.seats} seats
                                          </div>
                                        )}
                                        {car.fuelType && (
                                          <div className="px-3 py-1 text-sm text-blue-600 rounded-md bg-blue-50">
                                            <span className="font-medium">Fuel:</span> {car.fuelType}
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* Features */}
                                      {car.features && car.features.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-3">
                                          {car.features.slice(0, 3).map((feature, i) => (
                                            <span key={i} className="px-2 py-1 text-xs text-purple-700 bg-purple-100 rounded">
                                              {feature}
                                            </span>
                                          ))}
                                          {car.features.length > 3 && (
                                            <span className="px-2 py-1 text-xs text-purple-700 bg-purple-100 rounded">
                                              +{car.features.length - 3} more
                                            </span>
                                          )}
                                        </div>
                                      )}
                                      
                                                                              {/* Action buttons */}
                                        <div className="text-right">
                                          <div className="flex gap-2 justify-end">
                                            <Link href={`/cars/${car.id}`} className="inline-block px-3 py-1 text-xs text-white transition-colors rounded-full bg-primary hover:bg-primary-dark">
                                              View Detail
                                            </Link>
                                            <button 
                                              onClick={() => handleViewCalendar(car.id, car.make || car.brand, car.model)}
                                              className="inline-block px-3 py-1 text-xs text-white transition-colors rounded-full bg-green-600 hover:bg-green-700"
                                            >
                                              View Calendar
                                            </button>
                                          </div>
                                        </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {message.data.cars.length > 3 && viewMode === 'list' && (
                                <div className="mt-2 text-center">
                                  <Link href="/cars" className="inline-flex items-center text-primary hover:underline">
                                    <span>View all {message.data.cars.length} cars</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </Link>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          <span suppressHydrationWarning>{formatTime(message.timestamp)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                
                {renderLastMessage()}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input form - Fixed */}
              <form id="chatbot-form" onSubmit={handleSubmit} className="border-t border-gray-200 p-4 flex sticky bottom-[36px] bg-white z-10">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="px-4 text-white transition-colors bg-indigo-600 rounded-r-lg hover:bg-opacity-90 focus:outline-none disabled:opacity-50"
                  disabled={!inputValue.trim() || isTyping}
                >
                  <FaArrowUp />
                </button>
              </form>
              
              {/* AI mode status indicator - Fixed at bottom for Chat tab only */}
              <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between px-3 py-1">
                  <div className="flex items-center">
                    <div className="w-2 h-2 mr-2 bg-indigo-600 rounded-full"></div>
                    <span className="text-xs text-gray-500">
                      AI mode: On - Using Gemini
                    </span>
                  </div>
                  <button 
                    onClick={handleClearChat}
                    className="text-xs text-gray-500 hover:text-primary"
                  >
                    <FaHistory className="inline mr-1" /> Clear chat history
                  </button>
                </div>
              </div>
            </div>
            
            {/* Help Tab */}
            <div ref={helpTabRef} className={`${activeTab === 'help' ? 'block' : 'hidden'} flex-1 overflow-y-auto p-4`} style={{ minHeight: '600px' }}>
              {/* Search bar */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Search help topics..."
                />
              </div>
              
              <h3 className="mb-4 text-xl font-medium text-gray-800">Frequently Asked Questions</h3>
              
              <div className="mb-6 space-y-3">
                {faqs.length > 0 ? (
                  faqs.map((faq, index) => (
                    <div key={index} className="overflow-hidden border border-gray-200 rounded-lg">
                      <div className="p-4 bg-white cursor-pointer hover:bg-gray-50">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-primary">{faq.question}</h4>
                          </div>
                          <div className="ml-2 text-green-500">
                            <FaCircle className="text-xs" />
                          </div>
                        </div>
                        <p className="mt-2 text-gray-600">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Loading FAQs...
                  </div>
                )}
              </div>
              
              {/* Need more help section */}
              <div className="pt-4 mt-6 border-t border-gray-200">
                <h3 className="mb-3 text-xl font-medium text-gray-800">Need more help?</h3>
                <p className="mb-3 text-gray-600">
                  If you couldn't find the answer to your question, please contact our support team:
                </p>
                <div className="mt-2">
                  {websiteInfo?.contactInfo?.email && (
                    <a href={`mailto:${websiteInfo.contactInfo.email}`} className="block mb-2 text-primary hover:underline">
                      {websiteInfo.contactInfo.email}
                    </a>
                  )}
                  {websiteInfo?.contactInfo?.phone && (
                    <a href={`tel:${websiteInfo.contactInfo.phone}`} className="block text-primary hover:underline">
                      {websiteInfo.contactInfo.phone}
                    </a>
                  )}
                  {(!websiteInfo?.contactInfo?.email && !websiteInfo?.contactInfo?.phone) && (
                    <>
                      <a href="mailto:support@carrental.com" className="block mb-2 text-primary hover:underline">
                        support@carrental.com
                      </a>
                      <a href="tel:+84123456789" className="block text-primary hover:underline">
                        +84 123 456 789
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Search Tab */}
            <div ref={searchTabRef} className={`${activeTab === 'search' ? 'block' : 'hidden'} flex-1 overflow-y-auto p-4`} style={{ minHeight: '600px' }}>
              <h3 className="mb-4 font-medium text-gray-800">Find the Right Car</h3>
              
              <div className="p-4 mb-6 rounded-lg bg-indigo-50">
                <div className="flex items-start">
                  <FaInfoCircle className="mt-1 mr-3 text-indigo-600" />
                  <div>
                    <p className="mb-2 text-gray-700">
                      Chat with our AI assistant to find the perfect car for your needs.
                      The assistant can help you find cars based on:
                    </p>
                    <ul className="pl-5 space-y-1 text-sm text-gray-600 list-disc">
                      <li>Car type (sedan, SUV, luxury...)</li>
                      <li>Brand (Toyota, Honda, BMW...)</li>
                      <li>Number of seats</li>
                      <li>Rental price</li>
                      <li>And many other criteria</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Quick search buttons */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button 
                  onClick={() => {
                    setActiveTab('chat');
                    setTimeout(() => {
                      handleQuickQuestion("I need a sedan");
                    }, 100);
                  }}
                  className="flex flex-col items-center justify-center p-3 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="p-2 mb-2 text-blue-600 bg-blue-100 rounded-full">
                    <FaCar />
                  </div>
                  <span className="text-sm font-medium">Sedan</span>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveTab('chat');
                    setTimeout(() => {
                      handleQuickQuestion("I need an SUV");
                    }, 100);
                  }}
                  className="flex flex-col items-center justify-center p-3 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="p-2 mb-2 text-green-600 bg-green-100 rounded-full">
                    <FaCar />
                  </div>
                  <span className="text-sm font-medium">SUV</span>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveTab('chat');
                    setTimeout(() => {
                      handleQuickQuestion("I need a luxury car");
                    }, 100);
                  }}
                  className="flex flex-col items-center justify-center p-3 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="p-2 mb-2 text-purple-600 bg-purple-100 rounded-full">
                    <FaCar />
                  </div>
                  <span className="text-sm font-medium">Luxury</span>
                </button>
              </div>
              
              <div className="mb-6 text-center">
                <button 
                  onClick={() => {
                    setActiveTab('chat');
                    setTimeout(() => {
                      const form = document.getElementById('chatbot-form');
                      const input = form.querySelector('input');
                      if (input) input.focus();
                    }, 100);
                  }}
                  className="px-6 py-2 text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  <FaCommentDots className="inline mr-2" /> Start chatting
                </button>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h4 className="mb-3 font-medium text-gray-700">Suggested questions:</h4>
                <div className="space-y-2">
                  {[
                    "I need to find a sedan under $100 per day",
                    "Do you have any 7-seater SUVs?",
                    "I want to rent a BMW",
                    "Which car is suitable for a family of 5?",
                    "Are there any luxury cars available?",
                    "I need a fuel-efficient car"
                  ].map((question, index) => (
                    <div key={index} 
                      className="flex items-center p-2 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      onClick={() => {
                        setActiveTab('chat');
                        setTimeout(() => {
                          handleQuickQuestion(question);
                        }, 100);
                      }}
                    >
                      <div className="flex-shrink-0 p-1 mr-2 text-white rounded-full bg-primary">
                        <FaCommentDots className="text-xs" />
                      </div>
                      <p className="text-sm text-gray-700">"{question}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
} 