'use client';

import { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaArrowUp, FaCommentDots, FaSearch, FaHistory, FaCircle, FaInfoCircle, FaCar, FaList, FaImages, FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';
import Link from 'next/link';
import axios from 'axios';

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
  const [typingText, setTypingText] = useState('');
  const [isTypingEffect, setIsTypingEffect] = useState(false);
  
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
      scrollToBottom();
    }
  }, [messages, isOpen, activeTab]);
  
  // Open/close chatbot
  const toggleChat = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    
    if (nextState && activeTab === 'chat') {
      // If chatbot is open and on chat tab, scroll down
      setTimeout(() => {
        scrollToBottom();
      }, 100);
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
        // Typing effect
        if (response.data.message && response.data.message.length > 0) {
          const aiMessage = response.data.message;
          setIsTypingEffect(true);
          setTypingText('');
          
          // Character-by-character effect
          let index = 0;
          const typingInterval = setInterval(() => {
            if (index < aiMessage.length) {
              setTypingText(prev => prev + aiMessage.charAt(index));
              index++;
            } else {
              clearInterval(typingInterval);
              setIsTypingEffect(false);
              
              // Create bot message after typing effect is complete
              const botMessage = {
                id: Date.now(),
                text: aiMessage,
                sender: 'bot',
                timestamp: new Date(),
                isAI: true,
                data: response.data.data
              };
              
              // Add bot message to the list
              setMessages(prev => [...prev, botMessage]);
            }
          }, 10); // Typing speed
        } else {
          // Fallback if no message
          const botMessage = {
            id: Date.now(),
            text: "I understand your request. Let me help you with that.",
            sender: 'bot',
            timestamp: new Date(),
            isAI: true,
            data: response.data.data
          };
          
          setMessages(prev => [...prev, botMessage]);
        }
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
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };
  
  // Set up typing animation
  useEffect(() => {
    if (isTypingEffect && typingText.length === 0 && messages.length > 0) {
      // Set up typing animation for last bot message
      const lastBotMessage = [...messages].reverse().find(msg => msg.sender === 'bot' && msg.isAI);
      
      if (lastBotMessage && lastBotMessage.text) {
        let i = 0;
        const text = lastBotMessage.text;
        
        const typingInterval = setInterval(() => {
          if (i <= text.length) {
            setTypingText(text.substring(0, i));
            i++;
          } else {
            clearInterval(typingInterval);
            setIsTypingEffect(false);
          }
        }, 20); // Adjust typing speed here
        
        return () => clearInterval(typingInterval);
      }
    }
  }, [isTypingEffect, messages, typingText]);
  
  // Display last message with typing effect or as is
  const renderLastMessage = () => {
    // Only show typing indicator when isTyping is true
    if (!isTyping) {
      return null;
    }
    
    return (
      <div className="mb-4">
        <div className="inline-block rounded-lg px-4 py-2 bg-gray-200 text-gray-800">
          <div className="flex space-x-1">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50 chatbot-container">
      {/* Chatbot button */}
      <button
        onClick={toggleChat}
        className={`bg-primary w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors focus:outline-none ${unreadCount > 0 ? 'chat-button-pulse' : ''}`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <FaTimes className="text-white text-xl" />
        ) : (
          <>
            <FaCommentDots className="text-white text-xl" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
          <div className="bg-primary text-white p-4 flex items-center sticky top-0 z-10">
            <FaRobot className="text-xl mr-2" />
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
                    <div className="text-center my-3">
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
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
                                <FaRobot className="text-xs mr-1" />
                                <span className="text-xs font-medium">Assistant</span>
                              </div>
                            </div>
                          )}
                          <p className="text-sm">{renderMessageContent(message.text)}</p>
                          
                          {/* Car search result cards - if message contains car data */}
                          {message.data && 
                            (message.data.type === 'car_search_results' || message.data.type === 'car_search') && 
                            message.data.cars && 
                            message.data.cars.length > 0 && (
                            <div className="mt-3 space-y-3">
                              <div className="text-gray-100 font-medium mb-2 flex items-center justify-between">
                                <div className="flex items-center">
                                  <FaCar className="mr-2" /> Found {message.data.cars.length} matching cars:
                                </div>
                                {message.data.cars.length > 1 && (
                                  <button 
                                    onClick={toggleViewMode} 
                                    className="text-xs bg-gray-700 text-white rounded-full px-2 py-1 flex items-center hover:bg-gray-600 transition-colors"
                                  >
                                    {viewMode === 'carousel' ? <><FaList className="mr-1" /> List view</> : <><FaImages className="mr-1" /> Card view</>}
                                  </button>
                                )}
                              </div>
                              
                              {/* Carousel Mode */}
                              {viewMode === 'carousel' && message.data.cars.length > 0 && (
                                <div className="relative bg-white rounded-lg overflow-hidden shadow-sm">
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
                                          <div className="flex justify-between items-center mb-2">
                                            <div>
                                              <h4 className="font-semibold text-primary text-lg">
                                                {currentCar.make || currentCar.brand} {currentCar.model}
                                                {currentCar.year && <span className="text-gray-500 ml-1">({currentCar.year})</span>}
                                              </h4>
                                            </div>
                                            <span className="text-xs bg-primary text-white rounded-full px-3 py-1">
                                              {currentCar.category || 'Car'}
                                            </span>
                                          </div>
                                          
                                          {/* Car Price */}
                                          <div className="text-green-600 font-bold text-xl mb-3">
                                            ${currentCar.price?.toLocaleString()}/day
                                          </div>
                                          
                                          {/* Car Details */}
                                          <div className="space-y-2 mb-3">
                                            {currentCar.transmission && (
                                              <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm">
                                                <span className="font-medium">Transmission:</span> {currentCar.transmission}
                                              </div>
                                            )}
                                            {currentCar.seats && (
                                              <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm">
                                                <span className="font-medium">Seats:</span> {currentCar.seats} seats
                                              </div>
                                            )}
                                            {currentCar.fuelType && (
                                              <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm">
                                                <span className="font-medium">Fuel:</span> {currentCar.fuelType}
                                              </div>
                                            )}
                                          </div>
                                          
                                          {/* Features */}
                                          {currentCar.features && currentCar.features.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-4">
                                              {currentCar.features.slice(0, 3).map((feature, i) => (
                                                <span key={i} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                                  {feature}
                                                </span>
                                              ))}
                                              {currentCar.features.length > 3 && (
                                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                                  +{currentCar.features.length - 3} more
                                                </span>
                                              )}
                                            </div>
                                          )}
                                          
                                          {/* View details button */}
                                          <div className="text-center mt-3">
                                            <Link href={`/car/${currentCar.id}`} className="inline-block text-sm bg-primary text-white px-6 py-1.5 rounded-full hover:bg-primary-dark transition-colors font-medium">
                                              View details
                                            </Link>
                                          </div>
                                        </>
                                      );
                                    })()}
                                    
                                    {/* Carousel Navigation & Pagination */}
                                    {message.data.cars.length > 1 && (
                                      <>
                                        {/* Pagination Indicators */}
                                        <div className="flex justify-center gap-2 mb-3 mt-4">
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
                                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                                          <button 
                                            onClick={() => prevCar(message.data.cars.length)} 
                                            className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md text-primary hover:bg-gray-50 transition-colors"
                                            aria-label="Previous car"
                                          >
                                            <FaChevronLeft />
                                          </button>
                                        </div>
                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                          <button 
                                            onClick={() => nextCar(message.data.cars.length)} 
                                            className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md text-primary hover:bg-gray-50 transition-colors"
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
                                    <div key={index} className="bg-white rounded-lg p-4 text-gray-800 shadow-sm">
                                      {/* Header with car name and type */}
                                      <div className="flex justify-between items-center mb-2">
                                        <div>
                                          <h4 className="font-semibold text-primary text-lg">
                                            {car.make || car.brand} {car.model}
                                            {car.year && <span className="text-gray-500 ml-1">({car.year})</span>}
                                          </h4>
                                        </div>
                                        <span className="text-xs bg-primary text-white rounded-full px-3 py-1">{car.category || 'Car'}</span>
                                      </div>
                                      
                                      {/* Display price with highlight color */}
                                      <div className="text-green-600 font-bold text-xl mb-3">
                                        ${car.price?.toLocaleString()}/day
                                      </div>
                                      
                                      {/* Car Details */}
                                      <div className="flex flex-wrap gap-2 mb-3">
                                        {car.transmission && (
                                          <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm">
                                            <span className="font-medium">Transmission:</span> {car.transmission}
                                          </div>
                                        )}
                                        {car.seats && (
                                          <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm">
                                            <span className="font-medium">Seats:</span> {car.seats} seats
                                          </div>
                                        )}
                                        {car.fuelType && (
                                          <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm">
                                            <span className="font-medium">Fuel:</span> {car.fuelType}
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* Features */}
                                      {car.features && car.features.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-3">
                                          {car.features.slice(0, 3).map((feature, i) => (
                                            <span key={i} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                              {feature}
                                            </span>
                                          ))}
                                          {car.features.length > 3 && (
                                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                              +{car.features.length - 3} more
                                            </span>
                                          )}
                                        </div>
                                      )}
                                      
                                      {/* View details button */}
                                      <div className="text-right">
                                        <Link href={`/car/${car.id}`} className="inline-block text-sm bg-primary text-white px-4 py-1 rounded-full hover:bg-primary-dark transition-colors">
                                          View details
                                        </Link>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {message.data.cars.length > 3 && viewMode === 'list' && (
                                <div className="text-center mt-2">
                                  <Link href="/cars" className="text-primary hover:underline inline-flex items-center">
                                    <span>View all {message.data.cars.length} cars</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </Link>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
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
                  className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white rounded-r-lg px-4 hover:bg-opacity-90 transition-colors focus:outline-none disabled:opacity-50"
                  disabled={!inputValue.trim() || isTyping}
                >
                  <FaArrowUp />
                </button>
              </form>
              
              {/* AI mode status indicator - Fixed at bottom for Chat tab only */}
              <div className="border-t border-gray-200 bg-gray-50 sticky bottom-0 z-10">
                <div className="px-3 py-1 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2 bg-indigo-600"></div>
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Search help topics..."
                />
              </div>
              
              {/* Rate our assistant */}
              <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-indigo-700 mb-2">How was your experience?</h4>
                <p className="text-sm text-indigo-600 mb-3">Your feedback helps us improve our assistant</p>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star}
                      className="text-2xl text-yellow-400 hover:scale-110 transition-transform"
                      aria-label={`Rate ${star} stars`}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
              </div>
              
              <h3 className="font-medium text-gray-800 mb-4 text-xl">Frequently Asked Questions</h3>
              
              <div className="space-y-3 mb-6">
                {/* FAQ Item 1 */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-white p-4 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <h4 className="font-medium text-primary text-lg">How do I book a car?</h4>
                      </div>
                      <div className="text-green-500 ml-2">
                        <FaCircle className="text-xs" />
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">
                      Browse the list of cars, select one that meets your needs. Choose your pickup and return dates, 
                      then follow the checkout process. You'll receive a confirmation email once your booking is complete.
                    </p>
                  </div>
                </div>
                
                {/* FAQ Item 2 */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-white p-4 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <h4 className="font-medium text-primary text-lg">Can I cancel my booking?</h4>
                      </div>
                      <div className="text-green-500 ml-2">
                        <FaCircle className="text-xs" />
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">
                      Yes, you can cancel your booking up to 24 hours before the scheduled pickup time for a full refund.
                      Cancellations within 24 hours may be subject to a cancellation fee.
                    </p>
                  </div>
                </div>
                
                {/* FAQ Item 3 */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-white p-4 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <h4 className="font-medium text-primary text-lg">What payment methods are accepted?</h4>
                      </div>
                      <div className="text-green-500 ml-2">
                        <FaCircle className="text-xs" />
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">
                      We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and digital wallets 
                      including Apple Pay and Google Pay. Cash payments are not accepted.
                    </p>
                  </div>
                </div>
                
                {/* FAQ Item 4 */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-white p-4 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <h4 className="font-medium text-primary text-lg">Is insurance included?</h4>
                      </div>
                      <div className="text-green-500 ml-2">
                        <FaCircle className="text-xs" />
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">
                      Basic insurance is included in all rentals. This covers liability and collision damage. 
                      Additional coverage options are available during the booking process for extra peace of mind.
                    </p>
                  </div>
                </div>
                
                {/* FAQ Item 5 */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-white p-4 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <h4 className="font-medium text-primary text-lg">What if I return the car late?</h4>
                      </div>
                      <div className="text-green-500 ml-2">
                        <FaCircle className="text-xs" />
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">
                      Late returns are charged at an hourly rate of the daily rental price, up to one full day.
                      Returns more than 24 hours late may incur additional penalties. Please contact us if you
                      expect to be late.
                    </p>
                  </div>
                </div>
                
                {/* FAQ Item 6 */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-white p-4 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <h4 className="font-medium text-primary text-lg">Do I need to refill the fuel tank?</h4>
                      </div>
                      <div className="text-green-500 ml-2">
                        <FaCircle className="text-xs" />
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">
                      Yes, all vehicles should be returned with the same fuel level as when they were picked up.
                      If returned with less fuel, you'll be charged for refueling plus a service fee.
                    </p>
                  </div>
                </div>
                
                {/* FAQ Item 7 */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-white p-4 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <h4 className="font-medium text-primary text-lg">What documents do I need to rent a car?</h4>
                      </div>
                      <div className="text-green-500 ml-2">
                        <FaCircle className="text-xs" />
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">
                      You'll need a valid driver's license, a credit card in your name, and a valid ID or passport.
                      International customers may also need an International Driving Permit depending on their country of origin.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Need more help section */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-800 mb-3 text-xl">Need more help?</h3>
                <p className="text-gray-600 mb-3">
                  If you couldn't find the answer to your question, please contact our support team:
                </p>
                <div className="mt-2">
                  <a href="mailto:support@carrental.com" className="text-primary hover:underline block mb-2">
                    support@carrental.com
                  </a>
                  <a href="tel:+84123456789" className="text-primary hover:underline block">
                    +84 123 456 789
                  </a>
                </div>
              </div>
            </div>
            
            {/* Search Tab */}
            <div ref={searchTabRef} className={`${activeTab === 'search' ? 'block' : 'hidden'} flex-1 overflow-y-auto p-4`} style={{ minHeight: '600px' }}>
              <h3 className="font-medium text-gray-800 mb-4">Find the Right Car</h3>
              
              <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <FaInfoCircle className="text-indigo-600 mt-1 mr-3" />
                  <div>
                    <p className="text-gray-700 mb-2">
                      Chat with our AI assistant to find the perfect car for your needs.
                      The assistant can help you find cars based on:
                    </p>
                    <ul className="text-gray-600 text-sm list-disc pl-5 space-y-1">
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
                  className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-full mb-2">
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
                  className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="bg-green-100 text-green-600 p-2 rounded-full mb-2">
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
                  className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="bg-purple-100 text-purple-600 p-2 rounded-full mb-2">
                    <FaCar />
                  </div>
                  <span className="text-sm font-medium">Luxury</span>
                </button>
              </div>
              
              <div className="text-center mb-6">
                <button 
                  onClick={() => {
                    setActiveTab('chat');
                    setTimeout(() => {
                      const form = document.getElementById('chatbot-form');
                      const input = form.querySelector('input');
                      if (input) input.focus();
                    }, 100);
                  }}
                  className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <FaCommentDots className="inline mr-2" /> Start chatting
                </button>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-700 mb-3">Suggested questions:</h4>
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
                      className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => {
                        setActiveTab('chat');
                        setTimeout(() => {
                          handleQuickQuestion(question);
                        }, 100);
                      }}
                    >
                      <div className="bg-primary text-white p-1 rounded-full mr-2 flex-shrink-0">
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
  );
} 