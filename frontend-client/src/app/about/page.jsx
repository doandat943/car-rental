"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { websiteAPI } from '@/lib/api';
import { 
  FaHome, 
  FaCar, 
  FaUsers, 
  FaAward, 
  FaShieldAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaPhone, 
  FaGlobe,
  FaCheckCircle,
  FaHandshake,
  FaStar,
  FaHeart,
  FaHeadset,
  FaCalendar,
  FaSpinner
} from 'react-icons/fa';

export default function About() {
  const [websiteInfo, setWebsiteInfo] = useState(null);
  const [pageContent, setPageContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch website info and about page content in parallel
        const [websiteResponse, aboutResponse] = await Promise.all([
          websiteAPI.getInfo(),
          websiteAPI.getContentPage('aboutUs')
        ]);
        
        if (websiteResponse?.data?.success) {
          setWebsiteInfo(websiteResponse.data.data);
        }
        
        if (aboutResponse?.data?.success) {
          setPageContent(aboutResponse.data.data.content || '');
        }
        
      } catch (err) {
        console.error('Error fetching about page data:', err);
        setError('Failed to load page content');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Statistics data
  const statistics = [
    { number: "5000+", label: "Happy Customers", icon: <FaUsers className="w-6 h-6" /> },
    { number: "200+", label: "Vehicles Available", icon: <FaCar className="w-6 h-6" /> },
    { number: "24/7", label: "Customer Support", icon: <FaHeadset className="w-6 h-6" /> },
    { number: "10+", label: "Years Experience", icon: <FaAward className="w-6 h-6" /> }
  ];

  // Features data
  const features = [
    {
      icon: <FaCar className="w-8 h-8 text-primary" />,
      title: "Wide Vehicle Selection",
      description: "Choose from our extensive fleet of well-maintained vehicles for every occasion."
    },
    {
      icon: <FaShieldAlt className="w-8 h-8 text-primary" />,
      title: "Comprehensive Insurance",
      description: "All our rentals come with comprehensive insurance coverage for your peace of mind."
    },
    {
      icon: <FaClock className="w-8 h-8 text-primary" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support and roadside assistance whenever you need it."
    },
    {
      icon: <FaAward className="w-8 h-8 text-primary" />,
      title: "Quality Guarantee",
      description: "We guarantee the quality and reliability of every vehicle in our fleet."
    },
    {
      icon: <FaGlobe className="w-8 h-8 text-primary" />,
      title: "Competitive Pricing",
      description: "Best rates in the market with transparent pricing and no hidden fees."
    },
    {
      icon: <FaCalendar className="w-8 h-8 text-primary" />,
      title: "Easy Booking",
      description: "Simple online booking process with instant confirmation and secure payments."
    }
  ];

  // Company values
  const values = [
    {
      icon: <FaHeart className="w-6 h-6 text-red-500" />,
      title: "Customer First",
      description: "Your satisfaction is our top priority in everything we do."
    },
    {
      icon: <FaShieldAlt className="w-6 h-6 text-blue-500" />,
      title: "Reliability",
      description: "Dependable service you can count on, every time."
    },
    {
      icon: <FaStar className="w-6 h-6 text-yellow-500" />,
      title: "Excellence",
      description: "We strive for excellence in every aspect of our service."
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <FaSpinner className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading page content...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About {websiteInfo?.siteName || 'Our Company'}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              {websiteInfo?.description || 'Your trusted partner for premium car rental services'}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Database Content Section */}
        {pageContent && (
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: pageContent }}
              />
            </div>
          </div>
        )}

        {/* Statistics Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Numbers Speak</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Trusted by thousands of customers worldwide, we continue to grow and serve better.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary-light rounded-full">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide exceptional car rental services with features designed for your convenience and peace of mind.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Company Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do and help us serve you better.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information Section */}
        {websiteInfo?.contactInfo && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get In Touch</h2>
              <p className="text-gray-600">
                Have questions? We're here to help. Contact us through any of the channels below.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {websiteInfo.contactInfo.address && (
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <FaMapMarkerAlt className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                  <p className="text-gray-600 text-sm">{websiteInfo.contactInfo.address}</p>
                </div>
              )}
              
              {websiteInfo.contactInfo.phone && (
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-green-100 rounded-full">
                      <FaPhone className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                  <p className="text-gray-600 text-sm">{websiteInfo.contactInfo.phone}</p>
                </div>
              )}
              
              {websiteInfo.contactInfo.email && (
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <FaEnvelope className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-600 text-sm">{websiteInfo.contactInfo.email}</p>
                </div>
              )}
              
              {websiteInfo.contactInfo.businessHours && (
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <FaClock className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
                  <p className="text-gray-600 text-sm whitespace-pre-line">
                    {websiteInfo.contactInfo.businessHours.replace(',', '\n')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse our extensive collection of vehicles and find the perfect car for your next adventure.
          </p>
          <Link 
            href="/cars"
            className="inline-flex items-center bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            <FaCar className="w-5 h-5 mr-2" />
            Browse Our Cars
          </Link>
        </div>
      </div>
    </div>
  );
} 