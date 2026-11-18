const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiry.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');

router.use(authenticateToken);

// Buyer submits new inquiry
router.post('/', inquiryController.createInquiry);

// Buyer views their own submitted inquiries
router.get('/my', inquiryController.getMyInquiries);

// Admin views all platform inquiries
router.get('/all', requireAdmin, inquiryController.getAllInquiries);

module.exports = router;
