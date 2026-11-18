const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendation.controller');

router.post('/', recommendationController.getRecommendationsEndpoint);
router.post('/compare', recommendationController.comparePropertiesEndpoint);

module.exports = router;
