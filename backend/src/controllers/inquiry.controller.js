const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

// Create a new property tour/site visit inquiry
async function createInquiry(req, res, next) {
  try {
    const { propertyId, name, email, phone, preferredDate, message } = req.body;

    if (!propertyId || !name || !email || !phone || !preferredDate) {
      return res.status(400).json({
        success: false,
        message: 'Property, name, email, phone, and preferred visit date are required.'
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'The requested property could not be found.'
      });
    }

    const buyerId = req.user._id;
    const sellerId = property.createdBy || null;

    const inquiry = await Inquiry.create({
      property: property._id,
      buyer: buyerId,
      seller: sellerId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      preferredDate,
      message: message ? message.trim() : '',
      status: 'Pending'
    });

    const populated = await Inquiry.findById(inquiry._id).populate('property');

    return res.status(201).json({
      success: true,
      message: 'Your site visit request has been successfully scheduled! The property owner will contact you.',
      data: populated
    });
  } catch (err) {
    next(err);
  }
}

// Get inquiries submitted by current buyer
async function getMyInquiries(req, res, next) {
  try {
    const inquiries = await Inquiry.find({ buyer: req.user._id })
      .populate('property')
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      data: inquiries
    });
  } catch (err) {
    next(err);
  }
}

// Get all platform inquiries (Admin)
async function getAllInquiries(req, res, next) {
  try {
    const inquiries = await Inquiry.find()
      .populate('property')
      .populate('buyer', 'name email role')
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      data: inquiries
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createInquiry,
  getMyInquiries,
  getAllInquiries
};
