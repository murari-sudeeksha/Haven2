const { processChatMessage } = require('../services/llm.service');
const { getRecommendations } = require('../services/recommendation.service');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// Send conversational message
async function sendMessage(req, res, next) {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'sessionId and message text are required.'
      });
    }

    const userId = req.user ? req.user._id : null;

    const result = await processChatMessage({
      sessionId,
      userId,
      message: message.trim()
    });

    // If user is authenticated, save search to recent searches
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $push: {
          recentSearches: {
            $each: [
              {
                query: message.trim(),
                extractedPreferences: result.extractedPreferences,
                resultsCount: result.recommendations.length,
                timestamp: new Date()
              }
            ],
            $slice: -10 // Keep last 10 searches
          }
        }
      });
    }

    return res.json({
      success: true,
      ...result
    });
  } catch (err) {
    next(err);
  }
}

// Get conversation history and current extracted preferences
async function getConversation(req, res, next) {
  try {
    const { sessionId } = req.params;

    const conversation = await Conversation.findOne({ sessionId })
      .populate('messages.recommendedProperties.property')
      .lean();

    if (!conversation) {
      return res.json({
        success: true,
        conversation: null,
        messages: [],
        extractedPreferences: {}
      });
    }

    return res.json({
      success: true,
      conversation
    });
  } catch (err) {
    next(err);
  }
}

// Directly update or remove extracted preferences (e.g., removing a chip or changing budget)
async function updatePreferences(req, res, next) {
  try {
    const { sessionId } = req.params;
    const { preferences } = req.body;

    let conversation = await Conversation.findOne({ sessionId });
    if (!conversation) {
      conversation = new Conversation({
        sessionId,
        userId: req.user ? req.user._id : null,
        messages: [],
        extractedPreferences: preferences || {}
      });
    } else {
      conversation.extractedPreferences = preferences || {};
    }

    await conversation.save();

    // Re-evaluate recommendations with new preferences
    const { recommendations, isAlternative, alternativeNote } = await getRecommendations(
      conversation.extractedPreferences,
      { limit: 4 }
    );

    return res.json({
      success: true,
      extractedPreferences: conversation.extractedPreferences,
      recommendations,
      isAlternative,
      alternativeNote
    });
  } catch (err) {
    next(err);
  }
}

// Reset/clear conversation
async function clearConversation(req, res, next) {
  try {
    const { sessionId } = req.params;
    await Conversation.findOneAndDelete({ sessionId });

    return res.json({
      success: true,
      message: 'Conversation cleared.'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  sendMessage,
  getConversation,
  updatePreferences,
  clearConversation
};
