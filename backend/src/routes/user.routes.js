const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.use(authenticateToken);

router.post('/saved', userController.toggleSaveProperty);
router.get('/saved', userController.getSavedProperties);
router.post('/compare', userController.toggleCompareProperty);
router.get('/conversations', userController.getUserConversations);
router.get('/recommendations', userController.getPersonalizedRecommendations);

module.exports = router;
