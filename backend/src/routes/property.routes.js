const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/property.controller');

router.get('/', propertyController.getProperties);
router.get('/featured', propertyController.getFeaturedProperties);
router.get('/locality-stats', propertyController.getLocalityStats);
router.get('/:id', propertyController.getPropertyById);

module.exports = router;
