const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');

// Get all properties listed by current seller
async function getSellerProperties(req, res, next) {
  try {
    const sellerId = req.user._id;

    // Retrieve properties created by this seller
    let properties = await Property.find({ createdBy: sellerId })
      .sort({ createdAt: -1 })
      .lean();

    // If seller is the demo seller and has 0 properties, assign the first 3 demo properties
    if (properties.length === 0 && (req.user.email === 'seller@haven.ai' || req.user.role === 'seller')) {
      const existingDemoProps = await Property.find({ isDemo: true }).limit(4);
      if (existingDemoProps.length > 0) {
        // Link demo properties to this seller so they can manage them immediately
        await Property.updateMany(
          { _id: { $in: existingDemoProps.map(p => p._id) } },
          { $set: { createdBy: sellerId } }
        );
        properties = await Property.find({ createdBy: sellerId }).sort({ createdAt: -1 }).lean();
      }
    }

    return res.json({
      success: true,
      data: properties
    });
  } catch (err) {
    next(err);
  }
}

// Create new seller listing
async function createSellerProperty(req, res, next) {
  try {
    const sellerId = req.user._id;
    const {
      title,
      description,
      location,
      price,
      priceDisplay,
      bhk,
      area,
      propertyType,
      furnishing,
      possessionStatus,
      isGatedCommunity,
      floor,
      facing,
      amenities,
      images,
      tags
    } = req.body;

    if (!title || !price || !area) {
      return res.status(400).json({
        success: false,
        message: 'Title, price, and area are required fields.'
      });
    }

    const numPrice = Number(price);
    const numArea = Number(area);

    const calculatedPriceDisplay =
      priceDisplay ||
      (numPrice >= 10000000
        ? `₹${(numPrice / 10000000).toFixed(2)} Cr`
        : `₹${(numPrice / 100000).toFixed(0)} Lakhs`);

    const property = await Property.create({
      title: title.trim(),
      description: description ? description.trim() : `${title} located in Hyderabad.`,
      location: {
        address: location?.address || (location?.locality ? `${location.locality}, Hyderabad` : 'Hyderabad'),
        locality: location?.locality || 'Gachibowli',
        city: location?.city || 'Hyderabad',
        pincode: location?.pincode || '500081',
        landmarks: location?.landmarks || []
      },
      price: numPrice,
      priceDisplay: calculatedPriceDisplay,
      pricePerSqFt: Math.round(numPrice / numArea),
      propertyType: propertyType || 'Apartment',
      bhk: Number(bhk) || 2,
      bathrooms: Number(req.body.bathrooms) || 2,
      balconies: Number(req.body.balconies) || 1,
      area: numArea,
      furnishing: furnishing || 'Semi-Furnished',
      possessionStatus: possessionStatus || 'Ready to Move',
      isGatedCommunity: isGatedCommunity !== undefined ? Boolean(isGatedCommunity) : true,
      floor: floor || '4th Floor',
      facing: facing || 'East',
      amenities: Array.isArray(amenities)
        ? amenities
        : typeof amenities === 'string'
        ? amenities.split(',').map(a => a.trim()).filter(Boolean)
        : ['Gym', 'Power Backup', '24/7 Security'],
      images: Array.isArray(images) && images.length > 0
        ? images
        : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'],
      tags: tags || ['Verified Seller Listing'],
      createdBy: sellerId,
      status: 'Available',
      isDemo: false
    });

    return res.status(201).json({
      success: true,
      message: 'Property listing created successfully and published to HAVEN catalog!',
      data: property
    });
  } catch (err) {
    next(err);
  }
}

// Update existing seller listing
async function updateSellerProperty(req, res, next) {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    // Permission check: must be creator or admin
    if (
      property.createdBy &&
      property.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify this property listing.'
      });
    }

    const updates = { ...req.body };

    if (updates.price || updates.area) {
      const price = updates.price !== undefined ? Number(updates.price) : property.price;
      const area = updates.area !== undefined ? Number(updates.area) : property.area;
      updates.pricePerSqFt = Math.round(price / area);
      if (!updates.priceDisplay) {
        updates.priceDisplay =
          price >= 10000000
            ? `₹${(price / 10000000).toFixed(2)} Cr`
            : `₹${(price / 100000).toFixed(0)} Lakhs`;
      }
    }

    if (typeof updates.amenities === 'string') {
      updates.amenities = updates.amenities.split(',').map(a => a.trim()).filter(Boolean);
    }

    const updated = await Property.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    return res.json({
      success: true,
      message: 'Property listing updated successfully.',
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

// Delete seller listing
async function deleteSellerProperty(req, res, next) {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    if (
      property.createdBy &&
      property.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this property listing.'
      });
    }

    await Property.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: 'Property listing deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
}

// Get inquiries on seller's properties
async function getSellerInquiries(req, res, next) {
  try {
    const sellerId = req.user._id;

    // Get properties created by seller
    const sellerProperties = await Property.find({ createdBy: sellerId }).select('_id');
    const propertyIds = sellerProperties.map(p => p._id);

    const inquiries = await Inquiry.find({
      $or: [
        { seller: sellerId },
        { property: { $in: propertyIds } }
      ]
    })
      .populate('property')
      .populate('buyer', 'name email')
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

// Update status of an inquiry (e.g. Confirm tour, Mark completed)
async function updateInquiryStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value.'
      });
    }

    const inquiry = await Inquiry.findById(id).populate('property');
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    }

    // Verify permission
    const isSeller =
      (inquiry.seller && inquiry.seller.toString() === req.user._id.toString()) ||
      (inquiry.property?.createdBy && inquiry.property.createdBy.toString() === req.user._id.toString()) ||
      req.user.role === 'admin' ||
      req.user.role === 'seller';

    if (!isSeller) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this inquiry.'
      });
    }

    inquiry.status = status;
    await inquiry.save();

    return res.json({
      success: true,
      message: `Inquiry status updated to ${status}.`,
      data: inquiry
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSellerProperties,
  createSellerProperty,
  updateSellerProperty,
  deleteSellerProperty,
  getSellerInquiries,
  updateInquiryStatus
};
