'use client';

import { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { paymentAPI } from '@/lib/api';
import { 
  FaPaypal, 
  FaSpinner, 
  FaCheckCircle,
  FaExclamationTriangle 
} from 'react-icons/fa';

const PayPalButtonWrapper = ({ amount, bookingData, onSuccess, onError, currency = 'USD' }) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = async (data, actions) => {
    try {
      setProcessing(true);
      setError(null);

      // For demo purposes, we'll create a simple PayPal order
      // In production, you would call your backend to create the order
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount.toFixed(2),
            },
            description: `Car Rental Booking`,
          },
        ],
        intent: 'CAPTURE',
      });
    } catch (err) {
      console.error('Error creating PayPal order:', err);
      setError('Failed to create PayPal order');
      setProcessing(false);
      throw err;
    }
  };

  const onApprove = async (data, actions) => {
    try {
      setProcessing(true);
      
      // Capture the payment
      const details = await actions.order.capture();
      
      // For demo purposes, we'll simulate the capture
      // In production, you would call your backend to capture the payment
      const captureResponse = await paymentAPI.capturePayPalPayment({
        orderId: details.id,
        bookingData
      });

      if (captureResponse.data.success) {
        onSuccess({
          transactionId: details.id,
          booking: captureResponse.data.booking,
          paypalDetails: details
        });
      } else {
        setError('Payment captured but booking update failed');
      }
    } catch (err) {
      console.error('Error capturing PayPal payment:', err);
      setError('Payment failed. Please try again.');
      onError && onError(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleError = (err) => {
    console.error('PayPal error:', err);
    setError('PayPal payment failed');
    setProcessing(false);
    onError && onError(err);
  };

  const onCancel = (data) => {
    console.log('PayPal payment cancelled:', data);
    setProcessing(false);
    // You can handle cancellation here if needed
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <FaExclamationTriangle className="w-5 h-5 text-red-500 mr-3" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center mb-4">
          <FaPaypal className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">PayPal Payment</h3>
        </div>
        
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Amount to pay:</span>
            <span className="text-xl font-bold text-blue-600">${amount.toFixed(2)}</span>
          </div>
        </div>
        
        {processing && (
          <div className="flex items-center justify-center p-4 mb-4 bg-gray-50 rounded-lg">
            <FaSpinner className="w-5 h-5 animate-spin text-blue-500 mr-3" />
            <span className="text-gray-600">Processing payment...</span>
          </div>
        )}
        
        <PayPalButtons
          disabled={processing}
          forceReRender={[amount, currency]}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={handleError}
          onCancel={onCancel}
          style={{
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal',
            height: 50
          }}
        />
        
        <div className="text-center text-sm text-gray-500 mt-4">
          <div className="flex items-center justify-center">
            <FaCheckCircle className="w-4 h-4 text-green-500 mr-1" />
            Secured by PayPal
          </div>
          <p className="mt-1">Your payment information is encrypted and secure</p>
        </div>
      </div>
    </div>
  );
};

const PayPalPayment = ({ 
  amount, 
  bookingData, 
  onSuccess, 
  onError, 
  currency = 'USD',
  clientId,
  environment = 'sandbox'
}) => {
  const [loading, setLoading] = useState(true);
  const [scriptError, setScriptError] = useState(null);

  useEffect(() => {
    // Simulate loading delay to show proper loading state
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <FaSpinner className="w-6 h-6 animate-spin text-blue-500 mr-3" />
        <span className="text-gray-600">Loading PayPal...</span>
      </div>
    );
  }

  if (!clientId) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <FaExclamationTriangle className="w-5 h-5 text-red-500 mr-3" />
          <span className="text-red-700">PayPal is not available</span>
        </div>
      </div>
    );
  }

  const paypalOptions = {
    'client-id': clientId,
    currency: currency,
    intent: 'capture',
    environment: environment,
    components: 'buttons',
    'disable-funding': 'credit,card'
  };

  return (
    <PayPalScriptProvider 
      options={paypalOptions}
      onLoadStart={() => setLoading(true)}
      onLoad={() => setLoading(false)}
      onError={(err) => {
        console.error('PayPal script loading error:', err);
        setScriptError('Failed to load PayPal');
        setLoading(false);
      }}
    >
      {scriptError ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <FaExclamationTriangle className="w-5 h-5 text-red-500 mr-3" />
            <span className="text-red-700">{scriptError}</span>
          </div>
        </div>
      ) : (
        <PayPalButtonWrapper
          amount={amount}
          bookingData={bookingData}
          onSuccess={onSuccess}
          onError={onError}
          currency={currency}
        />
      )}
    </PayPalScriptProvider>
  );
};

export default PayPalPayment; 