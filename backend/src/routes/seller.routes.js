const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/seller.controller');
const { authenticateToken, requireSellerOrAdmin } = require('../middleware/auth.middleware');

// Protect all seller routes with authentication and seller/admin check
router.use(authenticateToken);
router.use(requireSellerOrAdmin);

router.get('/properties', sellerController.getSellerProperties);
router.post('/properties', sellerController.createSellerProperty);
router.put('/properties/:id', sellerController.updateSellerProperty);
router.delete('/properties/:id', sellerController.deleteSellerProperty);

router.get('/inquiries', sellerController.getSellerInquiries);
router.put('/inquiries/:id/status', sellerController.updateInquiryStatus);

module.exports = router;
