"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { websiteAPI } from '@/lib/api';
import { 
  FaShieldAlt, 
  FaDatabase, 
  FaUserShield, 
  FaCookie, 
  FaLock, 
  FaGavel, 
  FaEnvelope, 
  FaSpinner 
} from 'react-icons/fa';

export default function Privacy() {
  const [pageContent, setPageContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrivacyContent = async () => {
      try {
        setLoading(true);
        const response = await websiteAPI.getContentPage('privacyPolicy');
        
        if (response?.data?.success) {
          setPageContent(response.data.data.content || '');
        } else {
          setError('Failed to load privacy policy content');
        }
      } catch (err) {
        console.error('Error fetching privacy content:', err);
        setError('Failed to load page content');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrivacyContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <FaSpinner className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading privacy policy...</p>
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
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white bg-opacity-20 rounded-full">
                <FaShieldAlt className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-green-200 mt-4">
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
                Privacy policy content is not available at the moment.
              </p>
            </div>
          )}

          {/* Privacy Highlights */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <FaDatabase className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Data Collection</h3>
              </div>
              <p className="text-gray-600 text-sm">
                We collect only necessary information to provide our car rental services and improve your experience.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <FaLock className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Data Security</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Your personal information is protected with industry-standard security measures and encryption.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <FaUserShield className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Your Rights</h3>
              </div>
              <p className="text-gray-600 text-sm">
                You have the right to access, correct, or delete your personal information at any time.
              </p>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Related Pages</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                href="/terms"
                className="flex items-center p-3 bg-white border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
              >
                <FaGavel className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-green-800 font-medium">Terms & Conditions</span>
              </Link>
              
              <Link 
                href="/about"
                className="flex items-center p-3 bg-white border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
              >
                <FaShieldAlt className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-green-800 font-medium">About Us</span>
              </Link>
              
              <Link 
                href="/contact"
                className="flex items-center p-3 bg-white border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
              >
                <FaEnvelope className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-green-800 font-medium">Contact Us</span>
              </Link>
            </div>
          </div>

          {/* Contact for Privacy Questions */}
          <div className="mt-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Privacy Questions?</h3>
            <p className="text-gray-600 mb-6">
              If you have any questions about our privacy practices, please don't hesitate to contact us.
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <FaEnvelope className="w-5 h-5 mr-2" />
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 