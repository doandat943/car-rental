"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { websiteAPI } from '@/lib/api';
import { 
  FaScroll, 
  FaShieldAlt, 
  FaCalendarAlt, 
  FaCreditCard, 
  FaCar, 
  FaIdCard, 
  FaGavel, 
  FaSpinner 
} from 'react-icons/fa';

export default function Terms() {
  const [pageContent, setPageContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTermsContent = async () => {
      try {
        setLoading(true);
        const response = await websiteAPI.getContentPage('termsAndConditions');
        
        if (response?.data?.success) {
          setPageContent(response.data.data.content || '');
        } else {
          setError('Failed to load terms content');
        }
      } catch (err) {
        console.error('Error fetching terms content:', err);
        setError('Failed to load page content');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTermsContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <FaSpinner className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading terms and conditions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16">
              <p className="text-red-600 mb-4">{error}</p>
              <Link 
                href="/"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white bg-opacity-20 rounded-full">
                <FaGavel className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Please read these terms and conditions carefully before using our car rental services
            </p>
            <p className="text-sm text-blue-200 mt-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Database Content */}
          {pageContent ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-8">
                <div 
                  className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700"
                  dangerouslySetInnerHTML={{ __html: pageContent }}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <p className="text-gray-500 text-center italic">
                Terms and conditions content is not available at the moment.
              </p>
            </div>
          )}

          {/* Quick Navigation */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Related Pages</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                href="/privacy"
                className="flex items-center p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <FaShieldAlt className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-blue-800 font-medium">Privacy Policy</span>
              </Link>
              
              <Link 
                href="/about"
                className="flex items-center p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <FaScroll className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-blue-800 font-medium">About Us</span>
              </Link>
              
              <Link 
                href="/contact"
                className="flex items-center p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <FaIdCard className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-blue-800 font-medium">Contact Us</span>
              </Link>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Questions About Our Terms?</h3>
            <p className="text-gray-600 mb-6">
              If you have any questions about these terms and conditions, please contact us.
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <FaIdCard className="w-5 h-5 mr-2" />
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 