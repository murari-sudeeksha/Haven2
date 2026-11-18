const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ['user', 'haven', 'system'],
      required: true
    },
    text: {
      type: String,
      required: true
    },
    extractedDelta: {
      type: Object,
      default: {}
    },
    recommendedProperties: [
      {
        property: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Property'
        },
        matchScore: Number,
        matchReasons: [String]
      }
    ],
    clarificationPrompt: {
      type: String
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const conversationSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true
    },
    title: {
      type: String,
      default: 'Property Search Conversation'
    },
    messages: [messageSchema],
    extractedPreferences: {
      locality: { type: String, default: null },
      minBudget: { type: Number, default: null },
      maxBudget: { type: Number, default: null },
      bhk: [{ type: Number }],
      propertyType: [{ type: String }],
      amenities: [{ type: String }],
      nearbyFacilities: [{ type: String }],
      isGatedCommunity: { type: Boolean, default: null },
      furnishing: [{ type: String }],
      minArea: { type: Number, default: null },
      lifestyle: [{ type: String }]
    },
    lastActiveAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', conversationSchema);
