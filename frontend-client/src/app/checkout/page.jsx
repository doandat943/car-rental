"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { bookingsAPI, carsAPI, websiteAPI, paymentAPI } from '@/lib/api';
import StripePayment from '@/components/payments/StripePayment';
import PayPalPayment from '@/components/payments/PayPalPayment';
import DemoPayment from '@/components/payments/DemoPayment';
import { 
  FaCar, 
  FaCalendarAlt, 
  FaCreditCard, 
  FaPaypal, 
  FaMoneyBillWave,
  FaShieldAlt,
  FaCheckCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaArrowLeft,
  FaUser,
  FaMapMarkerAlt,
  FaClock
} from 'react-icons/fa';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get booking data from URL params or localStorage
  const [bookingData, setBookingData] = useState(null);
  const [car, setCar] = useState(null);
  const [websiteInfo, setWebsiteInfo] = useState(null);
  const [termsContent, setTermsContent] = useState('');
  const [paymentConfig, setPaymentConfig] = useState(null);
  
  // Form states
  const [paymentType, setPaymentType] = useState('full'); // 'full' or 'deposit'
  const [paymentMethod, setPaymentMethod] = useState('demo');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    initializeCheckout();
  }, []);

  const initializeCheckout = async () => {
    try {
      setLoading(true);
      
      // Get booking data from URL params or localStorage
      let finalBookingData = null;
      let carId = null;

      // Try URL params first
      const urlCarId = searchParams.get('carId');
      if (urlCarId) {
        finalBookingData = {
          carId: urlCarId,
          startDate: searchParams.get('startDate'),
          endDate: searchParams.get('endDate'),
          includeDriver: searchParams.get('includeDriver') === 'true',
          doorstepDelivery: searchParams.get('doorstepDelivery') === 'true',
          totalAmount: parseFloat(searchParams.get('totalAmount')) || 0
        };
        carId = urlCarId;
      } else {
        // Try localStorage
        const pendingBooking = localStorage.getItem('pendingBooking');
        if (pendingBooking) {
          try {
            const parsed = JSON.parse(pendingBooking);
            finalBookingData = parsed;
            carId = parsed.carId;
          } catch (e) {
            console.error('Error parsing pending booking:', e);
          }
        }
      }

      if (!finalBookingData || !carId) {
        setError('No booking data found. Please start from car selection.');
        return;
      }

      setBookingData(finalBookingData);

      // Fetch car details, website info, terms, and payment config in parallel
      const [carResponse, websiteResponse, termsResponse, paymentConfigResponse] = await Promise.all([
        carsAPI.getCarById(carId),
        websiteAPI.getInfo(),
        websiteAPI.getContentPage('termsAndConditions'),
        paymentAPI.getConfig()
      ]);

      if (carResponse?.data?.success) {
        setCar(carResponse.data.data);
      }

      if (websiteResponse?.data?.success) {
        setWebsiteInfo(websiteResponse.data.data);
      }

      if (termsResponse?.data?.success) {
        setTermsContent(termsResponse.data.data.content || '');
      }

      if (paymentConfigResponse?.data?.success) {
        setPaymentConfig(paymentConfigResponse.data.config);
      }

    } catch (err) {
      console.error('Error initializing checkout:', err);
      setError('Failed to load checkout information');
    } finally {
      setLoading(false);
    }
  };

  const calculateAmounts = () => {
    if (!bookingData || !websiteInfo) return { total: 0, deposit: 0, remaining: 0 };
    
    // Use totalAmount from bookingData if available, otherwise calculate from car price
    let total = Number(bookingData.totalAmount) || 0;
    
    // If totalAmount is 0 or not available, calculate from car price
    if (total === 0 && car && car.price) {
      const days = calculateDays();
      total = car.price * days;
      
      // Add driver fee if included
      if (bookingData.includeDriver) {
        total += 30 * days;
      }
      
      // Add delivery fee if included
      if (bookingData.doorstepDelivery) {
        total += 25;
      }
    }
    
    const depositPercentage = Number(websiteInfo.paymentSettings?.depositPercentage) || 20;
    const deposit = Math.round(total * (depositPercentage / 100));
    const remaining = total - deposit;
    
    return { total, deposit, remaining };
  };

  const formatCurrency = (amount) => {
    const symbol = websiteInfo?.paymentSettings?.currencySymbol || '$';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDays = () => {
    if (!bookingData) return 0;
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'paypal':
        return <FaPaypal className="w-5 h-5" />;
      case 'credit_card':
        return <FaCreditCard className="w-5 h-5" />;
      case 'cash':
        return <FaMoneyBillWave className="w-5 h-5" />;
      case 'demo':
        return <FaCheckCircle className="w-5 h-5" />;
      default:
        return <FaCreditCard className="w-5 h-5" />;
    }
  };

  const getPaymentMethodName = (method) => {
    switch (method) {
      case 'paypal':
        return 'PayPal';
      case 'credit_card':
        return 'Credit Card';
      case 'cash':
        return 'Cash on Pickup';
      case 'demo':
        return 'Demo Payment';
      default:
        return 'Credit Card';
    }
  };

  const getAvailablePaymentMethods = () => {
    if (!websiteInfo?.paymentSettings) return ['demo'];
    
    const methods = [];
    // Add demo payment for testing
    methods.push('demo');
    
    // Add real payment methods if enabled
    if (websiteInfo.paymentSettings.enablePaypal && paymentConfig?.paypal?.enabled) {
      methods.push('paypal');
    }
    if (websiteInfo.paymentSettings.enableCreditCard && paymentConfig?.stripe?.enabled) {
      methods.push('credit_card');
    }
    if (websiteInfo.paymentSettings.enableCash) {
      methods.push('cash');
    }
    
    return methods.length > 0 ? methods : ['demo'];
  };

  const handlePaymentSuccess = (result) => {
    console.log('Payment successful:', result);
    
    // Clear pending booking from localStorage
    localStorage.removeItem('pendingBooking');
    
    // Navigate to confirmation page
    if (result.booking && result.booking._id) {
      router.push(`/booking/confirmation/${result.booking._id}`);
    } else {
      setError('Payment successful but booking confirmation failed');
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    setError(error.message || 'Payment failed. Please try again.');
    setShowPaymentForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      setError('Please accept the terms and conditions to proceed');
      return;
    }

    // For cash payment, create booking directly
    if (paymentMethod === 'cash') {
      try {
        setProcessing(true);
        setError('');

        const amounts = calculateAmounts();
        const finalBookingData = {
          ...bookingData,
          paymentMethod: 'cash',
          paymentType,
          depositAmount: paymentType === 'deposit' ? amounts.deposit : 0,
          remainingAmount: paymentType === 'deposit' ? amounts.remaining : 0,
          termsAccepted: true,
          termsAcceptedAt: new Date().toISOString()
        };

        const response = await bookingsAPI.createBooking(finalBookingData);

        if (response?.data?.success) {
          localStorage.removeItem('pendingBooking');
          router.push(`/booking/confirmation/${response.data.data._id}`);
        } else {
          setError(response?.data?.message || 'Booking failed. Please try again.');
        }
      } catch (err) {
        console.error('Error creating booking:', err);
        setError(err.message || 'Booking failed. Please try again.');
      } finally {
        setProcessing(false);
      }
      return;
    }

    // For other payment methods, show payment form
    setShowPaymentForm(true);
  };

  const renderPaymentForm = () => {
    if (!showPaymentForm) return null;

    const amounts = calculateAmounts();
    const paymentAmount = paymentType === 'deposit' ? amounts.deposit : amounts.total;

    // Prepare booking data with payment information
    const finalBookingData = {
      ...bookingData,
      paymentMethod,
      paymentType,
      depositAmount: paymentType === 'deposit' ? amounts.deposit : 0,
      remainingAmount: paymentType === 'deposit' ? amounts.remaining : 0,
      termsAccepted: true,
      termsAcceptedAt: new Date().toISOString()
    };

    switch (paymentMethod) {
      case 'credit_card':
        return (
          <div className="mt-6">
            <StripePayment
              amount={paymentAmount}
              bookingData={finalBookingData}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              currency="usd"
              publishableKey={paymentConfig?.stripe?.publishableKey}
            />
          </div>
        );
      
      case 'paypal':
        return (
          <div className="mt-6">
            <PayPalPayment
              amount={paymentAmount}
              bookingData={finalBookingData}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              currency="USD"
              clientId={paymentConfig?.paypal?.clientId}
              environment={paymentConfig?.paypal?.environment}
            />
          </div>
        );
      
      case 'cash':
        return (
          <div className="mt-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <FaCalendarAlt className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Cash Payment</h3>
              </div>
              
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Amount to pay:</span>
                  <span className="text-xl font-bold text-blue-600">${paymentAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <FaExclamationTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800 mb-1">Important Instructions:</p>
                    <ul className="text-yellow-700 space-y-1">
                      <li>• Please pay the exact amount: ${paymentAmount.toFixed(2)}</li>
                      <li>• Your booking will be confirmed once payment is received</li>
                      <li>• Processing time: 1-3 business days</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <button
                onClick={async () => {
                  try {
                    setProcessing(true);
                    // Create booking with cash payment method
                    const response = await bookingsAPI.createBooking({
                      ...finalBookingData,
                      paymentStatus: 'pending',
                      paymentMethod: 'cash',
                      transactionId: `CASH_${Date.now()}`
                    });
                    
                    if (response?.data?.success) {
                      handlePaymentSuccess({
                        transactionId: `CASH_${Date.now()}`,
                        booking: response.data.data,
                        paymentMethod: 'cash'
                      });
                    } else {
                      handlePaymentError(new Error('Failed to create booking'));
                    }
                  } catch (error) {
                    handlePaymentError(error);
                  } finally {
                    setProcessing(false);
                  }
                }}
                disabled={processing}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {processing ? (
                  <div className="flex items-center justify-center">
                    <FaSpinner className="w-4 h-4 animate-spin mr-2" />
                    Creating Booking...
                  </div>
                ) : (
                  'Confirm Cash Payment Booking'
                )}
              </button>
              
              <div className="text-center text-sm text-gray-500 mt-4">
                <div className="flex items-center justify-center">
                  <FaShieldAlt className="w-4 h-4 text-green-500 mr-1" />
                  Secure Payment
                </div>
                <p className="mt-1">Your payment information is secure</p>
              </div>
            </div>
          </div>
        );
      
      case 'demo':
      default:
        return (
          <div className="mt-6">
            <DemoPayment
              amount={paymentAmount}
              bookingData={finalBookingData}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              paymentMethod={paymentMethod}
            />
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error && !bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Checkout Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            href="/cars"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Browse Cars
          </Link>
        </div>
      </div>
    );
  }

  const amounts = calculateAmounts();
  const days = calculateDays();
  const availablePaymentMethods = getAvailablePaymentMethods();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/cars/${bookingData?.carId}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back to Car Details
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Booking</h1>
          <p className="text-gray-600 mt-2">Review your booking details and complete payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
              
              {/* Car Info */}
              {car && (
                <div className="flex items-start mb-6 pb-6 border-b border-gray-200">
                  <div className="w-24 h-16 bg-gray-200 rounded-lg mr-4 overflow-hidden">
                    {car.images && car.images.length > 0 ? (
                      <img 
                        src={car.images[0]} 
                        alt={typeof car.name === 'string' ? car.name : (car.name?.name || 'Car')}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaCar className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {typeof car.name === 'string' ? car.name : (car.name?.name || 'Unknown Car')}
                    </h3>
                    <p className="text-gray-600">
                      {typeof car.brand === 'string' ? car.brand : (car.brand?.name || 'Unknown')} • {' '}
                      {typeof car.model === 'string' ? car.model : (car.model?.name || 'Unknown')} • {' '}
                      {car.year || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatCurrency(car.price || 0)} per day
                    </p>
                  </div>
                </div>
              )}

              {/* Rental Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <FaCalendarAlt className="w-5 h-5 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Pickup Date</p>
                    <p className="font-medium">{formatDate(bookingData?.startDate)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="w-5 h-5 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Return Date</p>
                    <p className="font-medium">{formatDate(bookingData?.endDate)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaClock className="w-5 h-5 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium">{days} days</p>
                  </div>
                </div>
              </div>

              {/* Additional Services */}
              {(bookingData?.includeDriver || bookingData?.doorstepDelivery) && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Additional Services</h4>
                  <div className="space-y-2">
                    {bookingData.includeDriver && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FaCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm">Professional Driver</span>
                        </div>
                        <span className="text-sm font-medium">{formatCurrency(30 * days)}</span>
                      </div>
                    )}
                    {bookingData.doorstepDelivery && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FaCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm">Doorstep Delivery</span>
                        </div>
                        <span className="text-sm font-medium">{formatCurrency(25)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Options */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Options</h2>
              
              <form onSubmit={handleSubmit}>
                {/* Payment Type */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer ${
                      paymentType === 'full' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <input
                        type="radio"
                        name="paymentType"
                        value="full"
                        checked={paymentType === 'full'}
                        onChange={(e) => setPaymentType(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Pay Full Amount</span>
                          <span className="text-lg font-bold text-green-600">
                            {formatCurrency(amounts.total)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Complete payment now
                        </p>
                      </div>
                      {paymentType === 'full' && (
                        <FaCheckCircle className="w-5 h-5 text-blue-500 ml-3" />
                      )}
                    </label>

                    <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer ${
                      paymentType === 'deposit' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <input
                        type="radio"
                        name="paymentType"
                        value="deposit"
                        checked={paymentType === 'deposit'}
                        onChange={(e) => setPaymentType(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Pay Deposit</span>
                          <span className="text-lg font-bold text-blue-600">
                            {formatCurrency(amounts.deposit)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {(websiteInfo?.paymentSettings?.depositPercentage || 20)}% now, rest on pickup
                        </p>
                      </div>
                      {paymentType === 'deposit' && (
                        <FaCheckCircle className="w-5 h-5 text-blue-500 ml-3" />
                      )}
                    </label>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availablePaymentMethods.map((method) => (
                      <label 
                        key={method}
                        className={`relative flex items-center p-4 border rounded-lg cursor-pointer ${
                          paymentMethod === method 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center">
                          <div className="mr-3 text-gray-600">
                            {getPaymentMethodIcon(method)}
                          </div>
                          <span className="font-medium">{getPaymentMethodName(method)}</span>
                        </div>
                        {paymentMethod === method && (
                          <FaCheckCircle className="w-5 h-5 text-blue-500 ml-auto" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="mb-6">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={() => setShowTermsModal(true)}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Terms and Conditions
                      </button>
                      {' '}and{' '}
                      <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <FaExclamationTriangle className="w-5 h-5 text-red-500 mr-3" />
                      <span className="text-red-700">{error}</span>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing || !termsAccepted}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {processing ? (
                    <>
                      <FaSpinner className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaShieldAlt className="w-5 h-5 mr-2" />
                      {paymentMethod === 'cash' ? 'Complete Booking' : 'Proceed to Payment'}
                    </>
                  )}
                </button>
              </form>
              {/* ===== MAIN FORM ENDS HERE ===== */}
              
              {/* ===== PAYMENT FORM STARTS HERE (SEPARATE FROM MAIN FORM) ===== */}
              {/* Payment Form - Moved outside of main form to avoid nesting */}
              {renderPaymentForm()}
            </div>
          </div>

          {/* Price Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base rental ({days} days)</span>
                  <span>{formatCurrency((car?.price || 0) * days)}</span>
                </div>
                
                {bookingData?.includeDriver && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Driver service</span>
                    <span>{formatCurrency(30 * days)}</span>
                  </div>
                )}
                
                {bookingData?.doorstepDelivery && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doorstep delivery</span>
                    <span>{formatCurrency(25)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Amount</span>
                    <span>{formatCurrency(amounts.total)}</span>
                  </div>
                </div>
                
                {paymentType === 'deposit' && (
                  <div className="bg-blue-50 p-3 rounded-lg mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Pay now (deposit)</span>
                      <span className="font-medium">{formatCurrency(amounts.deposit)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pay on pickup</span>
                      <span className="font-medium">{formatCurrency(amounts.remaining)}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <FaShieldAlt className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm text-green-800 font-medium">Secure Payment</span>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms Modal */}
        {showTermsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Terms and Conditions</h3>
                  <button
                    onClick={() => setShowTermsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-96">
                {termsContent ? (
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: termsContent }}
                  />
                ) : (
                  <p className="text-gray-600">Terms and conditions content is loading...</p>
                )}
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setTermsAccepted(true);
                    setShowTermsModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Accept Terms
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckoutPageLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <FaSpinner className="w-8 h-8 mx-auto text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading checkout...</p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutPageLoading />}>
      <CheckoutContent />
    </Suspense>
  );
} 