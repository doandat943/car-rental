const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// Public routes (no authentication required)
// Get all FAQs
router.get('/faqs', chatbotController.getFAQs);

// Send a message to the chatbot
router.post('/message', chatbotController.processMessage);

// Send a message to be processed by AI
router.post('/ai-message', chatbotController.processAIMessage);

// Admin routes - temporarily without authentication for demo purposes
// Create new FAQ 
router.post('/faqs', chatbotController.createFAQ);

// Get FAQ by ID
router.get('/faqs/:id', chatbotController.getFAQById);

// Update FAQ
router.put('/faqs/:id', chatbotController.updateFAQ);

// Delete FAQ
router.delete('/faqs/:id', chatbotController.deleteFAQ);

module.exports = router; 