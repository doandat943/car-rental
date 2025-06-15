"use client";

import { useState, useEffect } from 'react';
import { websiteAPI } from '../../lib/api';
import Link from 'next/link';
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
  FaHeart
} from 'react-icons/fa';

export default function AboutPage() {
  const [websiteInfo, setWebsiteInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebsiteInfo = async () => {
      try {
        setLoading(true);
        const response = await websiteAPI.getInfo();
        if (response?.data?.success && response.data.data) {
          setWebsiteInfo(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching website info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWebsiteInfo();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-2/3 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-6">
                    <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: <FaCar className="w-8 h-8 text-primary" />,
      title: "Wide Vehicle Selection",
      description: "Choose from our extensive fleet of well-maintained vehicles, from economy cars to luxury SUVs."
    },
    {
      icon: <FaShieldAlt className="w-8 h-8 text-primary" />,
      title: "Full Insurance Coverage",
      description: "All our rentals include comprehensive insurance coverage for your peace of mind."
    },
    {
      icon: <FaClock className="w-8 h-8 text-primary" />,
      title: "24/7 Support",
      description: "Our customer support team is available around the clock to assist you with any needs."
    },
    {
      icon: <FaAward className="w-8 h-8 text-primary" />,
      title: "Quality Guarantee",
      description: "We maintain the highest standards for vehicle cleanliness and mechanical condition."
    },
    {
      icon: <FaHandshake className="w-8 h-8 text-primary" />,
      title: "Transparent Pricing",
      description: "No hidden fees. What you see is what you pay, with clear and upfront pricing."
    },
    {
      icon: <FaMapMarkerAlt className="w-8 h-8 text-primary" />,
      title: "Multiple Locations",
      description: "Convenient pickup and drop-off locations throughout the city for your convenience."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Happy Customers", icon: <FaUsers className="w-6 h-6" /> },
    { number: "500+", label: "Vehicles Available", icon: <FaCar className="w-6 h-6" /> },
    { number: "50+", label: "Pickup Locations", icon: <FaMapMarkerAlt className="w-6 h-6" /> },
    { number: "5", label: "Years Experience", icon: <FaAward className="w-6 h-6" /> }
  ];

  const values = [
    {
      title: "Customer First",
      description: "We prioritize our customers' needs and satisfaction above everything else.",
      icon: <FaHeart className="w-6 h-6 text-red-500" />
    },
    {
      title: "Reliability",
      description: "Dependable service and well-maintained vehicles you can trust.",
      icon: <FaCheckCircle className="w-6 h-6 text-green-500" />
    },
    {
      title: "Excellence",
      description: "We strive for excellence in every aspect of our service delivery.",
      icon: <FaStar className="w-6 h-6 text-yellow-500" />
    }
  ];

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
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">About Us</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About {websiteInfo?.companyInfo?.name || 'CarRental'}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              {websiteInfo?.companyInfo?.description || 
                'Your trusted partner for reliable and affordable car rental services. We make mobility accessible to everyone with our premium fleet and exceptional customer service.'}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                {websiteInfo?.companyInfo?.mission || 
                  'To provide reliable, affordable, and convenient car rental services that exceed customer expectations. We believe everyone should have access to quality transportation solutions that fit their lifestyle and budget.'}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                {websiteInfo?.companyInfo?.vision || 
                  'To become the leading car rental service provider, recognized for our commitment to customer satisfaction, vehicle quality, and innovative solutions that make transportation seamless for everyone.'}
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Achievements</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3 text-primary">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center mb-4">
                    {feature.icon}
                    <h3 className="text-xl font-semibold text-gray-900 ml-3">{feature.title}</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Company Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          {websiteInfo?.contactInfo && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Get In Touch</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {websiteInfo.contactInfo.address && (
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <FaMapMarkerAlt className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
                    <p className="text-gray-700">{websiteInfo.contactInfo.address}</p>
                  </div>
                )}
                
                {websiteInfo.contactInfo.phone && (
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <FaPhone className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                    <a 
                      href={`tel:${websiteInfo.contactInfo.phone}`}
                      className="text-primary hover:text-primary-dark transition-colors duration-200"
                    >
                      {websiteInfo.contactInfo.phone}
                    </a>
                  </div>
                )}
                
                {websiteInfo.contactInfo.email && (
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <FaEnvelope className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                    <a 
                      href={`mailto:${websiteInfo.contactInfo.email}`}
                      className="text-primary hover:text-primary-dark transition-colors duration-200"
                    >
                      {websiteInfo.contactInfo.email}
                    </a>
                  </div>
                )}
              </div>

              {/* Business Hours */}
              {websiteInfo.operatingHours && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Business Hours</h3>
                  <div className="max-w-md mx-auto">
                    {Object.entries(websiteInfo.operatingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <span className="font-medium text-gray-900 capitalize">{day}</span>
                        <span className="text-gray-700">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Call to Action */}
              <div className="mt-8 text-center">
                <Link 
                  href="/cars"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-colors duration-200"
                >
                  <FaCar className="w-5 h-5 mr-2" />
                  Browse Our Fleet
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 