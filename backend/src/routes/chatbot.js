const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbot');

// Send a message to be processed by AI
router.post('/ai-message', chatbotController.processAIMessage);

module.exports = router; 