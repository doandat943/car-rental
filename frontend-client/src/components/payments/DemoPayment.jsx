'use client';

import { useState } from 'react';
import { paymentAPI } from '@/lib/api';
import { 
  FaMoneyBillWave, 
  FaSpinner, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaCreditCard,
  FaPaypal
} from 'react-icons/fa';

const DemoPayment = ({ 
  amount, 
  bookingData, 
  onSuccess, 
  onError, 
  paymentMethod = 'credit_card'
}) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('form');

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'paypal':
        return <FaPaypal className="w-6 h-6 text-blue-600" />;
      case 'credit_card':
        return <FaCreditCard className="w-6 h-6 text-blue-600" />;
      default:
        return <FaMoneyBillWave className="w-6 h-6 text-green-600" />;
    }
  };

  const getPaymentMethodName = (method) => {
    switch (method) {
      case 'paypal':
        return 'PayPal (Demo)';
      case 'credit_card':
        return 'Credit Card (Demo)';
      default:
        return 'Demo Payment';
    }
  };

  const getPaymentMethodDisplay = () => {
    switch (paymentMethod) {
      case 'demo':
        return {
          title: 'Demo Payment',
          subtitle: 'This is a demonstration payment system',
          icon: '🧪'
        };
      case 'credit_card':
        return {
          title: 'Demo Credit Card',
          subtitle: 'Simulated credit card payment',
          icon: '💳'
        };
      case 'paypal':
        return {
          title: 'Demo PayPal',
          subtitle: 'Simulated PayPal payment',
          icon: '🅿️'
        };
      case 'cash':
        return {
          title: 'Demo Cash Payment',
          subtitle: 'Simulated cash payment',
          icon: '💵'
        };
      default:
        return {
          title: 'Demo Payment',
          subtitle: 'Demonstration payment system',
          icon: '🧪'
        };
    }
  };

  const handleDemoPayment = async () => {
    try {
      setProcessing(true);
      setError(null);
      setStep('processing');

      const response = await paymentAPI.processDemoPayment({
        bookingData,
        paymentMethod,
        amount
      });

      if (response.data.success) {
        setStep('success');
        setTimeout(() => {
          onSuccess({
            transactionId: response.data.transactionId,
            booking: response.data.booking
          });
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Demo payment failed');
      }
    } catch (err) {
      console.error('Demo payment error:', err);
      setError(err.response?.data?.message || err.message || 'Payment failed');
      setStep('error');
      onError && onError(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleRetry = () => {
    setStep('form');
    setError(null);
  };

  if (step === 'processing') {
    return (
      <div className="bg-white p-8 rounded-lg border border-gray-200">
        <div className="text-center">
          <div className="mb-4">
            <FaSpinner className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment</h3>
          <p className="text-gray-600 mb-4">Please wait while we process your demo payment...</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Amount:</span>
              <span className="text-xl font-bold text-blue-600">${amount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-gray-700">Method:</span>
              <span className="text-gray-900">{getPaymentMethodName(paymentMethod)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="bg-white p-8 rounded-lg border border-green-200">
        <div className="text-center">
          <div className="mb-4">
            <FaCheckCircle className="w-12 h-12 text-green-500 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-green-900 mb-2">Payment Successful!</h3>
          <p className="text-green-700 mb-4">Your demo payment has been processed successfully.</p>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Amount Paid:</span>
              <span className="text-xl font-bold text-green-600">${amount.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Redirecting to confirmation page...</p>
        </div>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="bg-white p-8 rounded-lg border border-red-200">
        <div className="text-center">
          <div className="mb-4">
            <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-red-900 mb-2">Payment Failed</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="bg-red-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-red-600">
              This is a demo environment. Some payments are randomly failed to simulate real-world scenarios.
            </p>
          </div>
          <button
            onClick={handleRetry}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <div className="flex items-start">
          <FaExclamationTriangle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Demo Mode</h4>
            <p className="text-sm text-yellow-700 mt-1">
              This is a demonstration payment system. No real money will be charged. 
              The system simulates a 90% success rate to demonstrate both success and failure scenarios.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center mb-4">
          {getPaymentMethodIcon(paymentMethod)}
          <h3 className="text-lg font-medium text-gray-900 ml-3">
            {getPaymentMethodName(paymentMethod)}
          </h3>
        </div>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700">Amount to pay:</span>
            <span className="text-2xl font-bold text-blue-600">${amount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Payment Method:</span>
            <span className="text-gray-900">{getPaymentMethodName(paymentMethod)}</span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Demo Card Number
            </label>
            <input
              type="text"
              value="4242 4242 4242 4242"
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                value="12/25"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVC
              </label>
              <input
                type="text"
                value="123"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <FaExclamationTriangle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}
        
        <button
          onClick={handleDemoPayment}
          disabled={processing}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {processing ? (
            <>
              <FaSpinner className="w-5 h-5 mr-2 animate-spin" />
              Processing Demo Payment...
            </>
          ) : (
            <>
              <FaMoneyBillWave className="w-5 h-5 mr-2" />
              Process Demo Payment
            </>
          )}
        </button>
        
        <div className="text-center text-sm text-gray-500 mt-4">
          <div className="flex items-center justify-center">
            <FaCheckCircle className="w-4 h-4 text-green-500 mr-1" />
            Demo Environment - Safe to Test
          </div>
          <p className="mt-1">No real payment will be processed</p>
        </div>
      </div>
    </div>
  );
};

export default DemoPayment;
 