'use client';

import { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaArrowUp, FaCommentDots, FaSearch, FaHistory, FaCircle, FaInfoCircle, FaCar, FaMapMarkerAlt, FaCalendarAlt, FaBrain, FaRegLightbulb } from 'react-icons/fa';
import { useChatbot } from '@/lib/ChatbotContext';
import Link from 'next/link';

export default function AdvancedChatbot() {
  const { 
    isOpen, 
    setIsOpen, 
    messages, 
    sendMessage, 
    unreadCount, 
    faqs, 
    clearChat,
    isTyping,
    searchCars,
    aiMode,
    toggleAIMode
  } = useChatbot();
  
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [filteredFAQs, setFilteredFAQs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [carResults, setCarResults] = useState([]);
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, isOpen, activeTab]);
  
  // Filter FAQs based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFAQs(faqs);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredFAQs(
        faqs.filter(faq => 
          faq.question.toLowerCase().includes(query) || 
          (faq.answer && faq.answer.toLowerCase().includes(query))
        )
      );
    }
  }, [searchQuery, faqs]);
  
  // Check for car search results in messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.data && lastMessage.data.type === 'car_search_results') {
        setCarResults(lastMessage.data.cars);
        setShowSearchResults(true);
      }
    }
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setActiveTab('chat');
      setShowSearchResults(false);
    }
  };
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const text = inputValue;
    setInputValue('');
    setShowSearchResults(false);
    
    // Send message via context
    await sendMessage(text);
  };
  
  const handleQuickQuestion = (question) => {
    setInputValue(question);
    
    // Submit the form programmatically
    const form = document.getElementById('chatbot-form');
    if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
  };
  
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // If switching to help tab, reset search
    if (tab === 'help') {
      setSearchQuery('');
      setFilteredFAQs(faqs);
      setShowSearchResults(false);
    }
    
    // If switching to search tab, reset car results if empty
    if (tab === 'search' && carResults.length === 0) {
      // Show example search form
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleClearChat = () => {
    const confirmed = window.confirm('Are you sure you want to clear the chat history?');
    if (confirmed) {
      clearChat();
      setShowSearchResults(false);
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
  
  // Search for cars
  const handleCarSearch = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const criteria = {
      category: formData.get('category') || undefined,
      brand: formData.get('brand') || undefined,
      minPrice: formData.get('minPrice') ? parseInt(formData.get('minPrice')) * 1000 : undefined,
      maxPrice: formData.get('maxPrice') ? parseInt(formData.get('maxPrice')) * 1000 : undefined,
      seats: formData.get('seats') || undefined
    };
    
    // Filter out undefined values
    Object.keys(criteria).forEach(key => 
      criteria[key] === undefined && delete criteria[key]
    );
    
    if (Object.keys(criteria).length === 0) {
      alert('Please enter at least one search criteria');
      return;
    }
    
    await searchCars(criteria);
    setActiveTab('chat'); // Switch back to chat to show results
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
  
  // Add this function for rendering based on message type
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
        <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col transition-all duration-300 max-h-[600px] chatbox-container">
          {/* Header */}
          <div className="bg-primary text-white p-4 flex items-center">
            <FaRobot className="text-xl mr-2" />
            <div className="flex-1">
              <h3 className="font-semibold">CarRental Assistant</h3>
              <p className="text-xs opacity-80">Automated support 24/7</p>
            </div>
            {/* AI Mode Toggle Switch */}
            <div 
              onClick={toggleAIMode}
              className={`mr-3 w-12 h-6 rounded-full flex items-center transition-all cursor-pointer ${aiMode ? 'bg-indigo-600 justify-end' : 'bg-gray-300 justify-start'}`}
            >
              <div className="flex items-center justify-center w-6 h-6 bg-white rounded-full shadow-md">
                {aiMode ? (
                  <FaBrain className="text-xs text-indigo-600" />
                ) : (
                  <FaRegLightbulb className="text-xs text-gray-500" />
                )}
              </div>
            </div>
            <button 
              onClick={toggleChat}
              className="text-white hover:text-gray-200 focus:outline-none"
              aria-label="Close chat"
            >
              <FaTimes />
            </button>
          </div>
          
          {/* Tabs */}
          <div className="bg-gray-100 border-b border-gray-200 flex">
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
            <button 
              onClick={() => handleTabChange('search')}
              className={`flex-1 py-2 text-sm font-medium ${activeTab === 'search' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            >
              Find Car
            </button>
          </div>
          
          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <>
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto max-h-[400px]" style={{ minHeight: '320px' }}>
                {Object.keys(groupedMessages).map(date => (
                  <div key={date}>
                    <div className="text-center my-3">
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        {date === getMessageDate(new Date()) ? 'Today' : date}
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
                              {message.isAI ? (
                                <div className="flex items-center">
                                  <FaBrain className="text-xs mr-1" />
                                  <span className="text-xs font-medium">AI Assistant</span>
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <FaRobot className="text-xs mr-1" />
                                  <span className="text-xs font-medium">Assistant</span>
                                </div>
                              )}
                            </div>
                          )}
                          <p className="text-sm">{renderMessageContent(message.text)}</p>
                          
                          {/* Car search result cards - if message contains car data */}
                          {message.data && message.data.type === 'car_search_results' && (
                            <div className="mt-3 space-y-2">
                              {message.data.cars.slice(0, 3).map((car, index) => (
                                <div key={index} className="bg-white rounded-md p-2 text-gray-800 shadow-sm">
                                  <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-primary">{car.make} {car.model}</h4>
                                    <span className="text-xs bg-primary text-white rounded-full px-2 py-0.5">{car.category}</span>
                                  </div>
                                  <div className="mt-1 text-sm">
                                    <p>Price: <strong>${car.pricePerDay?.toLocaleString()}/day</strong></p>
                                  </div>
                                  <div className="mt-2 text-right">
                                    <Link href={`/car/${car.id}`} className="text-xs bg-primary text-white px-2 py-1 rounded-md hover:bg-primary-dark">
                                      View Details
                                    </Link>
                                  </div>
                                </div>
                              ))}
                              
                              {message.data.cars.length > 3 && (
                                <div className="text-center text-xs text-primary">
                                  <Link href="/cars" className="hover:underline">
                                    View all {message.data.cars.length} cars
                                  </Link>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="mb-4">
                    <div className="inline-block rounded-lg px-4 py-2 bg-gray-200 text-gray-800">
                      <div className="flex space-x-1">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* AI mode status indicator */}
              <div className="px-3 py-1 border-t border-gray-200 bg-gray-50 flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${aiMode ? 'bg-indigo-600' : 'bg-gray-400'}`}></div>
                <span className="text-xs text-gray-500">
                  {aiMode ? 'AI mode: On - Using Gemini' : 'Standard mode: On - Using predefined answers when possible'}
                </span>
              </div>
              
              {/* Quick questions or clear chat button */}
              {messages.length < 3 && faqs.length > 0 ? (
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2">Frequently asked questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {faqs.slice(0, 3).map((faq, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickQuestion(faq.question)}
                        className="bg-gray-100 text-gray-800 text-xs rounded-full px-3 py-1 hover:bg-gray-200 transition"
                      >
                        {faq.question}
                      </button>
                    ))}
                  </div>
                </div>
              ) : messages.length > 3 && (
                <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                  <button 
                    onClick={handleClearChat}
                    className="text-xs text-gray-500 hover:text-primary"
                  >
                    <FaHistory className="inline mr-1" /> Clear chat history
                  </button>
                </div>
              )}
              
              {/* Input */}
              <form id="chatbot-form" onSubmit={handleSubmit} className="border-t border-gray-200 p-4 flex">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className={`text-white rounded-r-lg px-4 hover:bg-opacity-90 transition-colors focus:outline-none disabled:opacity-50 ${aiMode ? 'bg-indigo-600' : 'bg-primary'}`}
                  disabled={!inputValue.trim() || isTyping}
                >
                  <FaArrowUp />
                </button>
              </form>
            </>
          )}
          
          {/* Help Tab */}
          {activeTab === 'help' && (
            <div className="flex-1 overflow-y-auto" style={{ minHeight: '320px' }}>
              {/* Search */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search help topics..."
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              
              {/* FAQ List */}
              <div className="p-4">
                <h3 className="font-medium text-gray-800 mb-3">Frequently Asked Questions</h3>
                
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-6">
                    <FaInfoCircle className="mx-auto text-gray-400 text-xl mb-2" />
                    <p className="text-gray-500">No results found for "{searchQuery}"</p>
                    <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredFAQs.map((faq, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition">
                        <button
                          onClick={() => handleQuickQuestion(faq.question)}
                          className="w-full text-left"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-primary">{faq.question}</h4>
                            <FaCircle className="text-green-500 text-xs" />
                          </div>
                          <p className="text-gray-600 text-sm mt-1">{faq.answer}</p>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* More help */}
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h3 className="font-medium text-gray-800 mb-3">Need more help?</h3>
                  <p className="text-gray-600 text-sm">
                    If you couldn't find the answer to your question, please contact our support team:
                  </p>
                  <div className="mt-2">
                    <a href="mailto:support@carrental.com" className="text-primary hover:underline block mt-1">
                      support@carrental.com
                    </a>
                    <a href="tel:+84123456789" className="text-primary hover:underline block mt-1">
                      +84 123 456 789
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Search Tab */}
          {activeTab === 'search' && (
            <div className="flex-1 overflow-y-auto p-4" style={{ minHeight: '320px' }}>
              <h3 className="font-medium text-gray-800 mb-4">Find the right car</h3>
              
              <form onSubmit={handleCarSearch} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Car Type</label>
                  <select name="category" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">-- Select car type --</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="sport">Sports</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <select name="brand" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">-- Select brand --</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Honda">Honda</option>
                    <option value="BMW">BMW</option>
                    <option value="Mercedes">Mercedes</option>
                    <option value="Audi">Audi</option>
                    <option value="Ford">Ford</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Price ($)</label>
                    <input 
                      type="number" 
                      name="minPrice" 
                      placeholder="e.g. 500" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Price ($)</label>
                    <input 
                      type="number" 
                      name="maxPrice" 
                      placeholder="e.g. 2000" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Seats</label>
                  <select name="seats" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">-- Select seats --</option>
                    <option value="2">2 seats</option>
                    <option value="4">4 seats</option>
                    <option value="5">5 seats</option>
                    <option value="7">7 seats</option>
                    <option value="9">9 seats</option>
                  </select>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors focus:outline-none"
                >
                  <FaCar className="inline mr-2" /> Find Cars
                </button>
              </form>
              
              <div className="text-center text-sm text-gray-500 mt-6">
                <p>Or chat with our virtual assistant for suggestions:</p>
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  <button 
                    onClick={() => {
                      handleQuickQuestion("I need to find a sedan under $1000 per day");
                      setActiveTab('chat');
                    }}
                    className="text-primary text-xs border border-primary rounded-full px-3 py-1 hover:bg-primary hover:text-white transition"
                  >
                    "Find sedan under $1000"
                  </button>
                  <button 
                    onClick={() => {
                      handleQuickQuestion("What 7-seater SUVs do you have?");
                      setActiveTab('chat');
                    }}
                    className="text-primary text-xs border border-primary rounded-full px-3 py-1 hover:bg-primary hover:text-white transition"
                  >
                    "What 7-seater SUVs do you have?"
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* CSS for typing animation is now in chatbot.css */}
    </div>
  );
} 