const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController');
const { authenticateUser } = require('../middleware/auth'); // Assuming you have auth middleware

// All routes should be protected with authentication
router.use(authenticateUser);

// Create payment intent
router.post('/create-payment-intent', paymentController.createPaymentIntent);

// Handle successful payment
router.post('/payment-success', paymentController.handlePaymentSuccess);

// Get payment history
router.get('/history', paymentController.getPaymentHistory);

module.exports = router; 