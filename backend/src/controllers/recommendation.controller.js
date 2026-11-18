const { getRecommendations, analyzePropertyComparison } = require('../services/recommendation.service');
const Property = require('../models/Property');

// POST /api/recommendations
async function getRecommendationsEndpoint(req, res, next) {
  try {
    const preferences = req.body.preferences || {};
    const options = {
      limit: parseInt(req.body.limit || 6, 10),
      strict: req.body.strict === true
    };

    const results = await getRecommendations(preferences, options);

    return res.json({
      success: true,
      ...results
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/recommendations/compare
async function comparePropertiesEndpoint(req, res, next) {
  try {
    const { propertyIds } = req.body;

    if (!propertyIds || !Array.isArray(propertyIds) || propertyIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of at least 2 property IDs to compare.'
      });
    }

    if (propertyIds.length > 4) {
      return res.status(400).json({
        success: false,
        message: 'Comparison is supported for a maximum of 4 properties.'
      });
    }

    const properties = await Property.find({ _id: { $in: propertyIds } }).lean();

    if (properties.length < 2) {
      return res.status(404).json({
        success: false,
        message: 'Could not find sufficient valid properties for comparison.'
      });
    }

    const comparisonAnalysis = analyzePropertyComparison(properties);

    return res.json({
      success: true,
      properties,
      analysis: comparisonAnalysis
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getRecommendationsEndpoint,
  comparePropertiesEndpoint
};
