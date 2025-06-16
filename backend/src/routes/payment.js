const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  createStripePaymentIntent,
  confirmStripePayment,
  createPayPalOrder,
  capturePayPalPayment,
  processDemoPayment,
  getPaymentConfig
} = require('../controllers/payment');

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentIntent:
 *       type: object
 *       properties:
 *         amount:
 *           type: number
 *           description: Payment amount
 *         currency:
 *           type: string
 *           description: Currency code (e.g., 'usd')
 *         bookingId:
 *           type: string
 *           description: Booking ID
 *     PaymentConfig:
 *       type: object
 *       properties:
 *         stripe:
 *           type: object
 *           properties:
 *             publishableKey:
 *               type: string
 *             enabled:
 *               type: boolean
 *         paypal:
 *           type: object
 *           properties:
 *             clientId:
 *               type: string
 *             enabled:
 *               type: boolean
 *             environment:
 *               type: string
 */

/**
 * @swagger
 * /api/payment/config:
 *   get:
 *     summary: Get payment configuration
 *     tags: [Payment]
 *     responses:
 *       200:
 *         description: Payment configuration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 config:
 *                   $ref: '#/components/schemas/PaymentConfig'
 */
router.get('/config', getPaymentConfig);

/**
 * @swagger
 * /api/payment/stripe/create-intent:
 *   post:
 *     summary: Create Stripe payment intent
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentIntent'
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post('/stripe/create-intent', protect, createStripePaymentIntent);

/**
 * @swagger
 * /api/payment/stripe/confirm:
 *   post:
 *     summary: Confirm Stripe payment
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentIntentId:
 *                 type: string
 *               bookingId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment confirmed successfully
 *       400:
 *         description: Payment not completed
 *       401:
 *         description: Unauthorized
 */
router.post('/stripe/confirm', protect, confirmStripePayment);

/**
 * @swagger
 * /api/payment/paypal/create-order:
 *   post:
 *     summary: Create PayPal order
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentIntent'
 *     responses:
 *       200:
 *         description: PayPal order created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post('/paypal/create-order', protect, createPayPalOrder);

/**
 * @swagger
 * /api/payment/paypal/capture:
 *   post:
 *     summary: Capture PayPal payment
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *               bookingId:
 *                 type: string
 *     responses:
 *       200:
 *         description: PayPal payment captured successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post('/paypal/capture', protect, capturePayPalPayment);

/**
 * @swagger
 * /api/payment/demo:
 *   post:
 *     summary: Process demo payment (for testing)
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Demo payment processed successfully
 *       400:
 *         description: Invalid request data or simulated failure
 *       401:
 *         description: Unauthorized
 */
router.post('/demo', protect, processDemoPayment);

module.exports = router; 