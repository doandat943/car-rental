"use client";

import Link from 'next/link';
import { 
  FaShieldAlt,
  FaCar,
  FaFileContract,
  FaExclamationTriangle,
  FaArrowLeft,
  FaDatabase,
  FaLock,
  FaUserShield
} from 'react-icons/fa';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link 
              href="/"
              className="mr-4 p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FaArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center">
              <FaShieldAlt className="w-6 h-6 text-green-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
          </div>
          <p className="text-gray-600 ml-12">Your privacy is important to us. Learn how we collect, use, and protect your information</p>
          <p className="text-sm text-gray-500 ml-12 mt-2">Last updated: December 2024</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Important Notice */}
            <div className="bg-green-50 border-b border-green-200 p-6">
              <div className="flex items-start">
                <FaUserShield className="w-6 h-6 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Your Privacy Matters</h3>
                  <p className="text-green-700">
                    We are committed to protecting your personal information and your right to privacy. 
                    This policy explains how we collect, use, and safeguard your data when you use our car rental services.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="prose max-w-none">
                {/* 1. Information We Collect */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                    Information We Collect
                  </h2>
                  <div className="ml-11 text-gray-700 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    <p>When you use our services, we may collect the following personal information:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Account Information:</strong> Name, email address, phone number, date of birth</li>
                      <li><strong>Driver Information:</strong> Driver's license number, driving history</li>
                      <li><strong>Payment Information:</strong> Credit card details, billing address</li>
                      <li><strong>Contact Information:</strong> Mailing address, emergency contact details</li>
                    </ul>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mt-6">Rental Information</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Booking details and rental history</li>
                      <li>Vehicle usage data and mileage</li>
                      <li>GPS location data during rental period</li>
                      <li>Vehicle condition reports and inspection photos</li>
                      <li>Insurance claims and incident reports</li>
                    </ul>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mt-6">Technical Information</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>IP address and device information</li>
                      <li>Browser type and operating system</li>
                      <li>Website usage patterns and cookies</li>
                      <li>Mobile app usage and device identifiers</li>
                    </ul>
                  </div>
                </section>

                {/* 2. How We Use Your Information */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                    How We Use Your Information
                  </h2>
                  <div className="ml-11 text-gray-700 space-y-3">
                    <p>We use your personal information for the following purposes:</p>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mt-4">Service Provision</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Processing and managing your car rental bookings</li>
                      <li>Verifying your identity and driver eligibility</li>
                      <li>Processing payments and managing billing</li>
                      <li>Providing customer support and assistance</li>
                      <li>Improving our services and user experience</li>
                    </ul>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mt-4">Safety and Security</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Monitoring vehicle location for theft prevention</li>
                      <li>Investigating accidents or damage claims</li>
                      <li>Preventing fraud and unauthorized use</li>
                      <li>Ensuring compliance with traffic and safety regulations</li>
                    </ul>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mt-4">Business Operations</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Sending important service notifications</li>
                      <li>Conducting market research and analytics</li>
                      <li>Marketing communications (with your consent)</li>
                    </ul>
                  </div>
                </section>

                {/* 3. Information Sharing */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                    Information Sharing
                  </h2>
                  <div className="ml-11 text-gray-700 space-y-3">
                    <p>We may share your information in the following circumstances:</p>
                    
                    <h3 className="text-lg font-semibold text-gray-900">Service Providers</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Payment processors for transaction handling</li>
                      <li>Insurance companies for coverage verification</li>
                      <li>Background check services for driver verification</li>
                      <li>GPS and telematics service providers</li>
                      <li>Customer support and call center services</li>
                    </ul>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mt-4">Legal Requirements</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Law enforcement agencies when required by law</li>
                      <li>Courts and legal proceedings</li>
                      <li>Government agencies for regulatory compliance</li>
                      <li>Emergency services in case of accidents</li>
                    </ul>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mt-4">Business Transfers</h3>
                    <p>
                      In the event of a merger, acquisition, or sale of assets, your information may be 
                      transferred to the new entity, subject to the same privacy protections.
                    </p>
                  </div>
                </section>

                {/* 4. Data Security */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
                    Data Security
                  </h2>
                  <div className="ml-11 text-gray-700 space-y-3">
                    <p>We implement comprehensive security measures to protect your personal information:</p>
                    
                    <div className="bg-blue-50 rounded-lg p-4 my-4">
                      <div className="flex items-center mb-2">
                        <FaLock className="w-5 h-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-blue-800">Security Measures</h3>
                      </div>
                      <ul className="list-disc pl-6 space-y-2 text-blue-700">
                        <li>SSL encryption for all data transmissions</li>
                        <li>Secure data centers with 24/7 monitoring</li>
                        <li>Regular security audits and penetration testing</li>
                        <li>Employee background checks and training</li>
                        <li>Multi-factor authentication for account access</li>
                        <li>Regular software updates and security patches</li>
                      </ul>
                    </div>
                    
                    <p>
                      Despite our best efforts, no method of transmission over the internet or electronic storage 
                      is 100% secure. We cannot guarantee absolute security but continuously work to improve our 
                      security measures.
                    </p>
                  </div>
                </section>

                {/* 5. Your Rights */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">5</span>
                    Your Privacy Rights
                  </h2>
                  <div className="ml-11 text-gray-700 space-y-3">
                    <p>You have the following rights regarding your personal information:</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Access & Portability</h3>
                        <p className="text-sm">Request a copy of your personal data</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Correction</h3>
                        <p className="text-sm">Update or correct inaccurate information</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Deletion</h3>
                        <p className="text-sm">Request deletion of your personal data</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Opt-out</h3>
                        <p className="text-sm">Unsubscribe from marketing communications</p>
                      </div>
                    </div>
                    
                    <p>
                      To exercise any of these rights, please contact us using the information provided below. 
                      We will respond to your request within 30 days.
                    </p>
                  </div>
                </section>

                {/* 6. Cookies and Tracking */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">6</span>
                    Cookies and Tracking
                  </h2>
                  <div className="ml-11 text-gray-700 space-y-3">
                    <p>We use cookies and similar technologies to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Remember your preferences and settings</li>
                      <li>Analyze website traffic and user behavior</li>
                      <li>Provide personalized content and recommendations</li>
                      <li>Improve website functionality and performance</li>
                      <li>Prevent fraud and enhance security</li>
                    </ul>
                    
                    <p>
                      You can control cookie settings through your browser preferences. However, disabling 
                      certain cookies may limit website functionality.
                    </p>
                  </div>
                </section>

                {/* 7. Data Retention */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">7</span>
                    Data Retention
                  </h2>
                  <div className="ml-11 text-gray-700 space-y-3">
                    <p>We retain your personal information for different periods depending on the type of data:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Account Information:</strong> While your account is active plus 3 years</li>
                      <li><strong>Rental Records:</strong> 7 years for business and legal purposes</li>
                      <li><strong>Payment Information:</strong> As required by financial regulations</li>
                      <li><strong>Marketing Data:</strong> Until you opt-out or withdraw consent</li>
                      <li><strong>Security Logs:</strong> 2 years for fraud prevention</li>
                    </ul>
                  </div>
                </section>

                {/* 8. Changes to Privacy Policy */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">8</span>
                    Changes to This Policy
                  </h2>
                  <div className="ml-11 text-gray-700 space-y-3">
                    <p>
                      We may update this Privacy Policy from time to time to reflect changes in our practices 
                      or legal requirements. We will notify you of any material changes by:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Posting the updated policy on our website</li>
                      <li>Sending an email notification to registered users</li>
                      <li>Displaying a prominent notice on our platform</li>
                    </ul>
                    <p>
                      Your continued use of our services after the effective date of the updated policy 
                      constitutes acceptance of the changes.
                    </p>
                  </div>
                </section>

                {/* Contact Information */}
                <section className="mb-8 bg-green-50 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <FaDatabase className="w-6 h-6 text-green-600 mr-3" />
                    Privacy Contact Information
                  </h2>
                  <p className="text-gray-700 mb-4">
                    If you have any questions about this Privacy Policy or our data practices, please contact our 
                    Data Protection Officer:
                  </p>
                  <div className="text-gray-700 space-y-2">
                    <p><strong>Email:</strong> privacy@carRental.com</p>
                    <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                    <p><strong>Address:</strong> 123 Business Street, City, State 12345</p>
                    <p><strong>Response Time:</strong> We will respond to privacy inquiries within 5 business days</p>
                  </div>
                  
                  <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2">Data Protection Rights</h3>
                    <p className="text-sm text-green-700">
                      You have the right to lodge a complaint with your local data protection authority 
                      if you believe we have not handled your personal information appropriately.
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/terms"
              className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
            >
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <FaFileContract className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Terms of Service</h3>
                <p className="text-sm text-gray-600">Read our terms and conditions</p>
              </div>
            </Link>

            <Link
              href="/cars"
              className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
            >
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <FaCar className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Browse Cars</h3>
                <p className="text-sm text-gray-600">Find your perfect rental</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 