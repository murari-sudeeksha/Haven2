const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { optionalAuth } = require('../middleware/auth.middleware');
const { chatLimiter } = require('../middleware/rateLimiter.middleware');

router.post('/chat', chatLimiter, optionalAuth, aiController.sendMessage);
router.get('/conversation/:sessionId', aiController.getConversation);
router.put('/conversation/:sessionId/preferences', optionalAuth, aiController.updatePreferences);
router.delete('/conversation/:sessionId', aiController.clearConversation);

module.exports = router;