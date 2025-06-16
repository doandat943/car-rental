'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { paymentAPI } from '@/lib/api';
import { 
  FaCreditCard, 
  FaSpinner, 
  FaCheckCircle,
  FaExclamationTriangle 
} from 'react-icons/fa';

// Initialize Stripe
let stripePromise = null;

const getStripe = (publishableKey) => {
  if (!stripePromise && publishableKey) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

const CheckoutForm = ({ amount, bookingData, onSuccess, onError, currency = 'usd' }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');

  useEffect(() => {
    createPaymentIntent();
  }, [amount, bookingData]);

  const createPaymentIntent = async () => {
    try {
      const response = await paymentAPI.createStripeIntent({
        amount,
        currency,
        bookingData
      });

      if (response.data.success) {
        setClientSecret(response.data.clientSecret);
        setPaymentIntentId(response.data.paymentIntentId);
      } else {
        setError('Failed to initialize payment');
      }
    } catch (err) {
      console.error('Error creating payment intent:', err);
      setError(err.response?.data?.message || 'Failed to initialize payment');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);
    setError(null);

    const card = elements.getElement(CardElement);

    try {
      // Confirm the payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
        }
      });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm payment on server
        try {
          const confirmResponse = await paymentAPI.confirmStripePayment({
            paymentIntentId: paymentIntent.id,
            bookingData
          });

          if (confirmResponse.data.success) {
            onSuccess({
              transactionId: paymentIntent.id,
              booking: confirmResponse.data.booking
            });
          } else {
            setError('Payment confirmed but booking update failed');
          }
        } catch (confirmError) {
          console.error('Error confirming payment:', confirmError);
          setError('Payment successful but confirmation failed');
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding: '12px',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: false,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center mb-4">
          <FaCreditCard className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Credit Card Information</h3>
        </div>
        
        <div className="border border-gray-300 rounded-lg p-4 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <CardElement options={cardElementOptions} />
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <FaExclamationTriangle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}
      </div>
      
      <button
        type="submit"
        disabled={!stripe || processing || !clientSecret}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        {processing ? (
          <>
            <FaSpinner className="w-5 h-5 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <FaCreditCard className="w-5 h-5 mr-2" />
            Pay ${amount.toFixed(2)}
          </>
        )}
      </button>
      
      <div className="text-center text-sm text-gray-500">
        <div className="flex items-center justify-center">
          <FaCheckCircle className="w-4 h-4 text-green-500 mr-1" />
          Secured by Stripe
        </div>
        <p className="mt-1">Your payment information is encrypted and secure</p>
      </div>
    </form>
  );
};

const StripePayment = ({ 
  amount, 
  bookingData, 
  onSuccess, 
  onError, 
  currency = 'usd',
  publishableKey 
}) => {
  const [stripe, setStripe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeStripe = async () => {
      if (publishableKey) {
        const stripeInstance = await getStripe(publishableKey);
        setStripe(stripeInstance);
      }
      setLoading(false);
    };

    initializeStripe();
  }, [publishableKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <FaSpinner className="w-6 h-6 animate-spin text-blue-500 mr-3" />
        <span className="text-gray-600">Loading payment form...</span>
      </div>
    );
  }

  if (!stripe || !publishableKey) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <FaExclamationTriangle className="w-5 h-5 text-red-500 mr-3" />
          <span className="text-red-700">Payment system is not available</span>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripe}>
      <CheckoutForm
        amount={amount}
        bookingData={bookingData}
        onSuccess={onSuccess}
        onError={onError}
        currency={currency}
      />
    </Elements>
  );
};

export default StripePayment; 