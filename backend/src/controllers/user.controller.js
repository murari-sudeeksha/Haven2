const User = require('../models/User');
const Conversation = require('../models/Conversation');
const { getRecommendations } = require('../services/recommendation.service');

// Toggle property in user's saved list
async function toggleSaveProperty(req, res, next) {
  try {
    const { propertyId } = req.body;
    if (!propertyId) {
      return res.status(400).json({ success: false, message: 'propertyId is required.' });
    }

    const user = await User.findById(req.user._id);
    const index = user.savedProperties.findIndex(id => id.toString() === propertyId);

    let isSaved = false;
    if (index > -1) {
      user.savedProperties.splice(index, 1);
      isSaved = false;
    } else {
      user.savedProperties.push(propertyId);
      isSaved = true;
    }

    await user.save();

    return res.json({
      success: true,
      isSaved,
      savedProperties: user.savedProperties,
      message: isSaved ? 'Property saved to favorites.' : 'Property removed from favorites.'
    });
  } catch (err) {
    next(err);
  }
}

// Get user's saved properties
async function getSavedProperties(req, res, next) {
  try {
    const user = await User.findById(req.user._id).populate('savedProperties');
    return res.json({
      success: true,
      data: user.savedProperties || []
    });
  } catch (err) {
    next(err);
  }
}

// Toggle property in compared list
async function toggleCompareProperty(req, res, next) {
  try {
    const { propertyId } = req.body;
    if (!propertyId) {
      return res.status(400).json({ success: false, message: 'propertyId is required.' });
    }

    const user = await User.findById(req.user._id);
    const index = user.comparedProperties.findIndex(id => id.toString() === propertyId);

    let isCompared = false;
    if (index > -1) {
      user.comparedProperties.splice(index, 1);
      isCompared = false;
    } else {
      if (user.comparedProperties.length >= 4) {
        return res.status(400).json({
          success: false,
          message: 'You can compare a maximum of 4 properties at once.'
        });
      }
      user.comparedProperties.push(propertyId);
      isCompared = true;
    }

    await user.save();

    return res.json({
      success: true,
      isCompared,
      comparedProperties: user.comparedProperties,
      message: isCompared ? 'Added to comparison list.' : 'Removed from comparison list.'
    });
  } catch (err) {
    next(err);
  }
}

// Get user conversation sessions
async function getUserConversations(req, res, next) {
  try {
    const conversations = await Conversation.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .select('sessionId title lastActiveAt extractedPreferences messages')
      .lean();

    return res.json({
      success: true,
      data: conversations
    });
  } catch (err) {
    next(err);
  }
}

// Get personalized recommendations for user dashboard
async function getPersonalizedRecommendations(req, res, next) {
  try {
    const user = await User.findById(req.user._id).populate('savedProperties');

    // Aggregate preferences from saved properties and user profile
    const localities = new Set();
    let maxPrice = user.lifestylePreferences?.budgetMax || 0;
    const bhks = new Set();

    (user.savedProperties || []).forEach(p => {
      if (p.location?.locality) localities.add(p.location.locality);
      if (p.price && p.price > maxPrice) maxPrice = p.price;
      if (p.bhk) bhks.add(p.bhk);
    });

    if (user.lifestylePreferences?.preferredLocalities) {
      user.lifestylePreferences.preferredLocalities.forEach(loc => localities.add(loc));
    }

    const preferredLocality = localities.size > 0 ? Array.from(localities)[0] : 'HITEC City';
    const targetBudget = maxPrice > 0 ? maxPrice : 8000000;

    const { recommendations } = await getRecommendations({
      locality: preferredLocality,
      maxBudget: targetBudget,
      bhk: bhks.size > 0 ? Array.from(bhks) : [2, 3]
    }, { limit: 4 });

    return res.json({
      success: true,
      recommendations,
      basis: {
        locality: preferredLocality,
        targetBudget,
        savedPropertiesCount: user.savedProperties.length
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  toggleSaveProperty,
  getSavedProperties,
  toggleCompareProperty,
  getUserConversations,
  getPersonalizedRecommendations
};
