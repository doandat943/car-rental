"use client";

import Link from 'next/link';
import { 
  FaFileContract,
  FaCar,
  FaShieldAlt,
  FaExclamationTriangle,
  FaArrowLeft
} from 'react-icons/fa';

export default function TermsOfService() {
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
              <FaFileContract className="w-6 h-6 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
            </div>
          </div>
          <p className="text-gray-600 ml-12">Please read these terms carefully before using our car rental services</p>
          <p className="text-sm text-gray-500 ml-12 mt-2">Last updated: December 2024</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Important Notice */}
            <div className="bg-yellow-50 border-b border-yellow-200 p-6">
              <div className="flex items-start">
                <FaExclamationTriangle className="w-6 h-6 text-yellow-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Notice</h3>
                  <p className="text-yellow-700">
                    By using our car rental services, you agree to be bound by these Terms of Service. 
                    Please read them carefully as they contain important information about your rights and obligations.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="prose max-w-none">
                {/* 1. Acceptance of Terms */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                    Acceptance of Terms
                  </h2>
                  <div className="ml-11 text-gray-700 space-y-3">
                    <p>
                      Welcome to our car rental service. These Terms of Service ("Terms") govern your use of our website, 
                      mobile application, and car rental services provided by our company.
                    </p>
                    <p>
                      By accessing our website, creating an account, or renting a vehicle from us, you acknowledge that 
                      you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
                    </p>
                    <p>
                      If you do not agree with any part of these Terms, you may not use our services.
                    </p>
                  </div>
                </section>

                {/* 2. Eligibility */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                    Eligibility Requirements
                  </h2>
                  <div className="ml-11 text-gray-700 space-y-3">
                    <p>To rent a vehicle from us, you must:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Be at least 21 years old (25 for luxury vehicles)</li>
                      <li>Hold a valid driver's license for at least 1 year</li>
                      <li>Provide a valid credit card in your name</li>
                      <li>Meet our insurance requirements</li>
                      <li>Pass our driver verification process</li>
                    </ul>
                    <p>
                      We reserve the right to refuse service to anyone who does not meet these requirements 
                      or has a poor driving record.
                    </p>
                  </div>
                </section>

                {/* 3. Rental Agreement */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                    Rental Agreement
                  </h2>
                  <div className="ml-11 text-gray-700 space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Booking and Confirmation</h3>
                    <p>
                      All reservations are subject to vehicle availability. A booking is confirmed only when you 
                      receive our confirmation email and payment is processed successfully.
                    </p>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mt-4">Rental Period</h3>
                    <p>
                      The rental period begins at the scheduled pickup time and ends at the scheduled return time. 
                      Late returns may incur additional charges.
                    </p>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mt-4">Vehicle Condition</h3>
                    <p>
                      You are responsible for returning the vehicle in the same condition as received, 
                      normal wear and tear excepted. A pre-rental inspection will be conducted.
                    </p>
                  </div>
                </section>

                {/* 4. Payment and Pricing */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
                    Payment and Pricing
                  </h2>
                  <div className="ml-11 text-gray-700 space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Rental Fees</h3>
                    <p>
                      Rental fees are calculated based on the daily rate, rental duration, and any additional services selected. 
                      All prices are quoted in USD and include applicable taxes unless otherwise stated.
                    </p>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mt-4">Additional Charges</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Driver service: $30 per day</li>
                      <li>Doorstep delivery: $25 flat fee</li>
                      <li>Late return: $10 per hour</li>
                      <li>Cleaning fee: $50 (if vehicle returned excessively dirty)</li>
                      <li>Fuel charges: If not returned with same fuel level</li>
                      <li>Damage repair costs: As per actual repair bills</li>
                    </ul>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mt-4">Security Deposit</h3>
                    <p>
                      A security deposit may be held on your credit card during the rental period. 
                      This will be released upon satisfactory return of the vehicle.
                    </p>
                  </div>
                </section>

                {/* 5. Driver Responsibilities */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">5</span>
                    Driver Responsibilities
                  </h2>
                  <div className="ml-11 text-gray-700 space-y-3">
                    <p>As the renter, you agree to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Operate the vehicle safely and in accordance with all traffic laws</li>
                      <li>Not use the vehicle for illegal activities</li>
                      <li>Not allow unauthorized drivers to operate the vehicle</li>
                      <li>Not smoke or allow smoking in the vehicle</li>
                      <li>Report any accidents or damage immediately</li>
                      <li>Keep the vehicle locked and secure when unattended</li>
                      <li>Return the vehicle with the same fuel level as provided</li>
                    </ul>
                  </div>
                </section>

                {/* 6. Insurance and Liability */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">6</span>
                    Insurance and Liability
                  </h2>
                  <div className="ml-11 text-gray-700 space-y-3">
                    <p>
                      All vehicles come with basic insurance coverage. However, you remain liable for:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>The insurance deductible amount</li>
                      <li>Damage not covered by insurance</li>
                      <li>Personal belongings left in the vehicle</li>
                      <li>Traffic violations and fines</li>
                      <li>Towing and impound fees</li>
                    </ul>
                    <p>
                      We strongly recommend reviewing your personal auto insurance policy and considering 
                      additional coverage options we offer.
                    </p>
                  </div>
                </section>

                {/* 7. Cancellation Policy */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">7</span>
                    Cancellation Policy
                  </h2>
                  <div className="ml-11 text-gray-700 space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Customer Cancellation</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Free cancellation up to 24 hours before pickup</li>
                      <li>50% charge for cancellations within 24 hours</li>
                      <li>No refund for no-shows</li>
                    </ul>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mt-4">Our Cancellation Rights</h3>
                    <p>
                      We reserve the right to cancel your reservation due to vehicle unavailability, 
                      maintenance issues, or failure to meet rental requirements. In such cases, 
                      we will provide a full refund or alternative vehicle.
                    </p>
                  </div>
                </section>

                {/* 8. Prohibited Uses */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">8</span>
                    Prohibited Uses
                  </h2>
                  <div className="ml-11 text-gray-700 space-y-3">
                    <p>You may not use our vehicles for:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Racing, speed testing, or competitive driving</li>
                      <li>Driving instruction or driving tests</li>
                      <li>Transporting illegal substances</li>
                      <li>Off-road driving or on unpaved roads</li>
                      <li>Towing other vehicles or trailers</li>
                      <li>Commercial delivery or ride-sharing services</li>
                      <li>Transporting passengers for hire</li>
                    </ul>
                  </div>
                </section>

                {/* 9. Limitation of Liability */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">9</span>
                    Limitation of Liability
                  </h2>
                  <div className="ml-11 text-gray-700 space-y-3">
                    <p>
                      Our liability is limited to the maximum extent permitted by law. We are not liable for:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Indirect, consequential, or punitive damages</li>
                      <li>Loss of profits or business opportunities</li>
                      <li>Personal injury or property damage while using the vehicle</li>
                      <li>Delays or cancellations due to circumstances beyond our control</li>
                    </ul>
                  </div>
                </section>

                {/* 10. Changes to Terms */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">10</span>
                    Changes to Terms
                  </h2>
                  <div className="ml-11 text-gray-700 space-y-3">
                    <p>
                      We reserve the right to modify these Terms at any time. Changes will be effective 
                      immediately upon posting on our website. Your continued use of our services after 
                      changes constitutes acceptance of the new Terms.
                    </p>
                  </div>
                </section>

                {/* Contact Information */}
                <section className="mb-8 bg-gray-50 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
                  <p className="text-gray-700 mb-4">
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  <div className="text-gray-700 space-y-2">
                    <p><strong>Email:</strong> legal@carRental.com</p>
                    <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                    <p><strong>Address:</strong> 123 Business Street, City, State 12345</p>
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/privacy"
              className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
            >
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <FaShieldAlt className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Privacy Policy</h3>
                <p className="text-sm text-gray-600">Learn how we protect your data</p>
              </div>
            </Link>

            <Link
              href="/cars"
              className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
            >
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <FaCar className="w-5 h-5 text-blue-600" />
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