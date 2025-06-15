'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaYoutube, FaTiktok } from 'react-icons/fa';
import { websiteAPI } from '@/lib/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [websiteInfo, setWebsiteInfo] = useState({
    siteName: 'CarRental',
    description: 'Premium car rental service offering a wide range of vehicles for all your needs.',
    contactInfo: {
      email: 'info@carrental.com',
      phone: '+1 (555) 123-4567',
      address: '123 Rental Street, Auto City, AC 12345',
      businessHours: 'Monday - Friday: 8am - 8pm, Saturday: 9am - 6pm, Sunday: 10am - 4pm'
    },
    socialLinks: {
      facebook: '#',
      twitter: '#',
      instagram: '#',
      linkedin: '#',
      youtube: '#',
      tiktok: '#'
    },
    contentPages: {
      aboutUs: '',
      termsAndConditions: '',
      privacyPolicy: '',
      cancellationPolicy: ''
    }
  });

  useEffect(() => {
    // Fetch website info
    async function fetchWebsiteInfo() {
      try {
        const response = await websiteAPI.getInfo();
        if (response.data && response.data.success) {
          setWebsiteInfo({
            ...websiteInfo,
            ...response.data.data,
          });
        }
      } catch (error) {
        console.error('Error fetching website info:', error);
      }
    }

    fetchWebsiteInfo();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with ${email}!`);
    setEmail('');
  };

  const formatBusinessHours = (hours) => {
    if (!hours) return '';
    // Convert from "Mon-Fri: 9AM-5PM, Sat: 10AM-2PM, Sun: Closed" format to individual lines
    return hours.split(',').map(day => day.trim());
  };

  const businessHoursArray = formatBusinessHours(websiteInfo.contactInfo?.businessHours);

  return (
    <footer className="bg-dark text-white pt-16 pb-6">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Company */}
          <div>
            <h3 className="text-xl font-bold mb-4">{websiteInfo.siteName}</h3>
            <p className="text-gray-300 mb-4">
              {websiteInfo.description}
            </p>
            <div className="flex space-x-4">
              {websiteInfo.socialLinks?.facebook && (
                <a href={websiteInfo.socialLinks.facebook} className="text-gray-300 hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                  <FaFacebook size={20} />
                </a>
              )}
              {websiteInfo.socialLinks?.twitter && (
                <a href={websiteInfo.socialLinks.twitter} className="text-gray-300 hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                  <FaTwitter size={20} />
                </a>
              )}
              {websiteInfo.socialLinks?.instagram && (
                <a href={websiteInfo.socialLinks.instagram} className="text-gray-300 hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                  <FaInstagram size={20} />
                </a>
              )}
              {websiteInfo.socialLinks?.linkedin && (
                <a href={websiteInfo.socialLinks.linkedin} className="text-gray-300 hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                  <FaLinkedin size={20} />
                </a>
              )}
              {websiteInfo.socialLinks?.youtube && (
                <a href={websiteInfo.socialLinks.youtube} className="text-gray-300 hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                  <FaYoutube size={20} />
                </a>
              )}
              {websiteInfo.socialLinks?.tiktok && (
                <a href={websiteInfo.socialLinks.tiktok} className="text-gray-300 hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                  <FaTiktok size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cars" className="text-gray-300 hover:text-primary transition-colors">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              {websiteInfo.contentPages?.termsAndConditions && (
                <li>
                  <Link href="/terms" className="text-gray-300 hover:text-primary transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
              )}
              {websiteInfo.contentPages?.privacyPolicy && (
                <li>
                  <Link href="/privacy" className="text-gray-300 hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              {websiteInfo.contactInfo?.address && (
                <li className="flex items-start">
                  <FaMapMarkerAlt className="text-primary mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">{websiteInfo.contactInfo.address}</span>
                </li>
              )}
              {websiteInfo.contactInfo?.phone && (
                <li className="flex items-center">
                  <FaPhoneAlt className="text-primary mr-3 flex-shrink-0" />
                  <span className="text-gray-300">{websiteInfo.contactInfo.phone}</span>
                </li>
              )}
              {websiteInfo.contactInfo?.email && (
                <li className="flex items-center">
                  <FaEnvelope className="text-primary mr-3 flex-shrink-0" />
                  <span className="text-gray-300">{websiteInfo.contactInfo.email}</span>
                </li>
              )}
            </ul>
            {businessHoursArray.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Hours of Operation</h4>
                {businessHoursArray.map((hours, index) => (
                  <p key={index} className="text-gray-300">{hours}</p>
                ))}
              </div>
            )}
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for updates, special offers, and more.
            </p>
            <form onSubmit={handleNewsletterSubmit}>
              <div className="flex flex-col space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button 
                  type="submit"
                  className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> {websiteInfo.siteName}. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                {websiteInfo.contentPages?.termsAndConditions && (
                  <li>
                    <Link href="/terms" className="text-gray-400 text-sm hover:text-primary transition-colors">
                      Terms
                    </Link>
                  </li>
                )}
                {websiteInfo.contentPages?.privacyPolicy && (
                  <li>
                    <Link href="/privacy" className="text-gray-400 text-sm hover:text-primary transition-colors">
                      Privacy
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 