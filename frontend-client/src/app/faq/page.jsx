"use client";

import { useState, useEffect } from 'react';
import { websiteAPI } from '../../lib/api';
import Link from 'next/link';
import { FaChevronDown, FaChevronUp, FaQuestionCircle, FaHome, FaEnvelope, FaPhone, FaTimes } from 'react-icons/fa';

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [websiteInfo, setWebsiteInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const response = await websiteAPI.getInfo();
        if (response?.data?.success && response.data.data) {
          setWebsiteInfo(response.data.data);
          setFaqs(response.data.data.faqs || []);
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggleExpanded = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Highlight search text in FAQ content
  const highlightText = (text, searchTerm) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark> : 
        part
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3 mb-8"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-6">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary">
                  <FaHome className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">FAQ</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary text-white rounded-full">
                <FaQuestionCircle className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our car rental services. 
              If you can't find what you're looking for, feel free to contact our support team.
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-lg mx-auto">
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Results count */}
          {searchTerm && (
            <div className="mb-4 text-center">
              <p className="text-sm text-gray-600">
                {filteredFaqs.length > 0 ? (
                  <>
                    Found <span className="font-semibold text-primary">{filteredFaqs.length}</span> result{filteredFaqs.length !== 1 ? 's' : ''} for "<span className="font-medium">{searchTerm}</span>"
                  </>
                ) : (
                  <>No results found for "<span className="font-medium">{searchTerm}</span>"</>
                )}
              </p>
            </div>
          )}

          {/* FAQ Items */}
          <div className="space-y-4 mb-8">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleExpanded(index)}
                    className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 pr-4">
                        {highlightText(faq.question, searchTerm)}
                      </h3>
                      <div className="flex-shrink-0">
                        {expandedItems.has(index) ? (
                          <FaChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <FaChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </button>
                  
                  {expandedItems.has(index) && (
                    <div className="px-6 pb-4 border-t border-gray-100">
                      <p className="text-gray-700 leading-relaxed pt-4">
                        {highlightText(faq.answer, searchTerm)}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">
                  {searchTerm ? `No FAQs found matching "${searchTerm}"` : 'No FAQs available.'}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                  >
                    <FaTimes className="w-4 h-4 mr-2" />
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Contact Support */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Still need help?
            </h2>
            <p className="text-gray-600 mb-4">
              If you couldn't find the answer to your question, our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {websiteInfo?.contactInfo?.email && (
                <a
                  href={`mailto:${websiteInfo.contactInfo.email}`}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-colors duration-200"
                >
                  <FaEnvelope className="w-4 h-4 mr-2" />
                  Email Support
                </a>
              )}
              {websiteInfo?.contactInfo?.phone && (
                <a
                  href={`tel:${websiteInfo.contactInfo.phone}`}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <FaPhone className="w-4 h-4 mr-2" />
                  Call Support
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 