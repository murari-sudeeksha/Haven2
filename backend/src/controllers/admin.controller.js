const Property = require('../models/Property');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const sampleProperties = require('../seed/seedData');

// Get system analytics and metrics
async function getStats(req, res, next) {
  try {
    const [totalProperties, totalUsers, totalConversations, priceAgg] = await Promise.all([
      Property.countDocuments(),
      User.countDocuments(),
      Conversation.countDocuments(),
      Property.aggregate([
        {
          $group: {
            _id: null,
            avgPrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        }
      ])
    ]);

    const localityCounts = await Property.aggregate([
      { $group: { _id: '$location.locality', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const typeCounts = await Property.aggregate([
      { $group: { _id: '$propertyType', count: { $sum: 1 } } }
    ]);

    return res.json({
      success: true,
      stats: {
        totalProperties,
        totalUsers,
        totalConversations,
        avgPrice: priceAgg[0] ? Math.round(priceAgg[0].avgPrice) : 0,
        minPrice: priceAgg[0] ? priceAgg[0].minPrice : 0,
        maxPrice: priceAgg[0] ? priceAgg[0].maxPrice : 0,
        localityDistribution: localityCounts,
        typeDistribution: typeCounts
      }
    });
  } catch (err) {
    next(err);
  }
}

// Create new property listing
async function createProperty(req, res, next) {
  try {
    const propertyData = req.body;

    if (!propertyData.title || !propertyData.price || !propertyData.location?.locality) {
      return res.status(400).json({
        success: false,
        message: 'Title, price, and locality are required.'
      });
    }

    // Format priceDisplay if not provided
    if (!propertyData.priceDisplay) {
      propertyData.priceDisplay = propertyData.price >= 10000000
        ? `₹${(propertyData.price / 10000000).toFixed(2)} Cr`
        : `₹${(propertyData.price / 100000).toFixed(0)} Lakhs`;
    }

    if (!propertyData.images || propertyData.images.length === 0) {
      propertyData.images = [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'
      ];
    }

    propertyData.isDemo = false; // Real admin created entry

    const property = await Property.create(propertyData);

    return res.status(201).json({
      success: true,
      message: 'Property listing created successfully.',
      data: property
    });
  } catch (err) {
    next(err);
  }
}

// Update property listing
async function updateProperty(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.price && updates.area) {
      updates.pricePerSqFt = Math.round(updates.price / updates.area);
    }

    const updated = await Property.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    return res.json({
      success: true,
      message: 'Property updated successfully.',
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

// Delete property listing
async function deleteProperty(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await Property.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    return res.json({
      success: true,
      message: 'Property listing deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
}

// Get all registered users
async function getUsers(req, res, next) {
  try {
    const users = await User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      data: users
    });
  } catch (err) {
    next(err);
  }
}

// Update user role
async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['buyer', 'seller', 'admin', 'user'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified.' });
    }

    if (id === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot demote your own admin account.' });
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-passwordHash');

    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({
      success: true,
      message: `User role successfully updated to ${role}.`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

// Delete user account
async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own admin account.' });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({
      success: true,
      message: 'User account deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
}

// Reset sample seed data
async function resetSeedData(req, res, next) {
  try {
    await Property.deleteMany({});
    const inserted = await Property.insertMany(sampleProperties);

    return res.json({
      success: true,
      message: `Database successfully reseeded with ${inserted.length} demo properties.`,
      count: inserted.length
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getStats,
  createProperty,
  updateProperty,
  deleteProperty,
  getUsers,
  updateUserRole,
  deleteUser,
  resetSeedData
};
