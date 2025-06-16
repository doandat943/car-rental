const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_51Hs1234567890');
const { Booking } = require('../models');

/**
 * Create Stripe Payment Intent
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createStripePaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd', bookingId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      metadata: {
        bookingId: bookingId || 'unknown',
        userId: req.user?.id || 'unknown'
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Stripe payment intent creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message
    });
  }
};

/**
 * Confirm Stripe Payment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.confirmStripePayment = async (req, res) => {
  try {
    const { paymentIntentId, bookingId } = req.body;

    if (!paymentIntentId || !bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Payment Intent ID and Booking ID are required'
      });
    }

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update booking with payment information
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          paymentStatus: 'paid',
          paymentTransactionId: paymentIntentId,
          paymentMethod: 'credit_card'
        },
        { new: true }
      ).populate('car customer');

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Payment confirmed successfully',
        booking
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed',
        status: paymentIntent.status
      });
    }

  } catch (error) {
    console.error('Stripe payment confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment',
      error: error.message
    });
  }
};

/**
 * Create PayPal Order (Demo)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createPayPalOrder = async (req, res) => {
  try {
    const { amount, currency = 'USD', bookingId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    // This is a demo implementation
    // In production, you would use PayPal SDK to create actual orders
    const mockPayPalOrder = {
      id: `PAYPAL_ORDER_${Date.now()}`,
      status: 'CREATED',
      amount: {
        currency_code: currency,
        value: amount.toString()
      },
      metadata: {
        bookingId: bookingId || 'unknown',
        userId: req.user?.id || 'unknown'
      },
      // Demo approval URL
      links: [
        {
          href: `${process.env.FRONTEND_URL}/payment/paypal-return?orderID=PAYPAL_ORDER_${Date.now()}`,
          rel: 'approve',
          method: 'GET'
        }
      ]
    };

    res.status(200).json({
      success: true,
      order: mockPayPalOrder
    });

  } catch (error) {
    console.error('PayPal order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create PayPal order',
      error: error.message
    });
  }
};

/**
 * Capture PayPal Payment (Demo)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.capturePayPalPayment = async (req, res) => {
  try {
    const { orderId, bookingId } = req.body;

    if (!orderId || !bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and Booking ID are required'
      });
    }

    // This is a demo implementation
    // In production, you would use PayPal SDK to capture actual payments
    const mockCaptureResult = {
      id: orderId,
      status: 'COMPLETED',
      purchase_units: [
        {
          payments: {
            captures: [
              {
                id: `CAPTURE_${Date.now()}`,
                status: 'COMPLETED',
                amount: {
                  currency_code: 'USD',
                  value: '100.00'
                }
              }
            ]
          }
        }
      ]
    };

    // Update booking with payment information
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: 'paid',
        paymentTransactionId: orderId,
        paymentMethod: 'paypal'
      },
      { new: true }
    ).populate('car customer');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'PayPal payment captured successfully',
      captureResult: mockCaptureResult,
      booking
    });

  } catch (error) {
    console.error('PayPal payment capture error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to capture PayPal payment',
      error: error.message
    });
  }
};

/**
 * Process Demo Payment (for testing)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.processDemoPayment = async (req, res) => {
  try {
    const { bookingData, paymentMethod, amount } = req.body;

    if (!bookingData || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Booking data and payment method are required'
      });
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate 90% success rate
    const isSuccess = Math.random() > 0.1;

    if (!isSuccess) {
      return res.status(400).json({
        success: false,
        message: 'Demo payment failed (simulated failure)',
        errorCode: 'DEMO_PAYMENT_FAILED'
      });
    }

    // Calculate totalDays from startDate and endDate
    const startDate = new Date(bookingData.startDate);
    const endDate = new Date(bookingData.endDate);
    const timeDifference = endDate.getTime() - startDate.getTime();
    const totalDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

    console.log('Original bookingData:', bookingData);

    // Create the actual booking with payment information
    const finalBookingData = {
      ...bookingData,
      car: bookingData.carId, // Map carId to car field
      customer: req.user.id,
      paymentStatus: 'paid',
      paymentTransactionId: `DEMO_${paymentMethod.toUpperCase()}_${Date.now()}`,
      paymentMethod: paymentMethod,
      totalDays: totalDays,
      termsAccepted: true,
      termsAcceptedAt: new Date().toISOString()
    };

    // Remove carId since we've mapped it to car
    delete finalBookingData.carId;

    console.log('Final bookingData for DB:', finalBookingData);

    const booking = await Booking.create(finalBookingData);
    await booking.populate({
      path: 'car',
      populate: [
        { path: 'brand', select: 'name' },
        { path: 'category', select: 'name' },
        { path: 'transmission', select: 'name' },
        { path: 'fuel', select: 'name' }
      ]
    });
    await booking.populate('customer', 'name firstName lastName email phone phoneNumber');

    res.status(200).json({
      success: true,
      message: 'Demo payment processed successfully',
      transactionId: `DEMO_${paymentMethod.toUpperCase()}_${Date.now()}`,
      booking
    });

  } catch (error) {
    console.error('Demo payment processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process demo payment',
      error: error.message
    });
  }
};

/**
 * Get Payment Methods Configuration
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getPaymentConfig = async (req, res) => {
  try {
    const config = {
      stripe: {
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51Hs1234567890',
        enabled: true
      },
      paypal: {
        clientId: process.env.PAYPAL_CLIENT_ID || 'demo_paypal_client_id',
        enabled: !!process.env.PAYPAL_CLIENT_ID, // Enable if client ID is provided
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
      },
      demo: {
        enabled: true
      }
    };

    res.status(200).json({
      success: true,
      config
    });

  } catch (error) {
    console.error('Payment config error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment configuration',
      error: error.message
    });
  }
}; 