
/**
 * HAVEN LLM & Conversational Response Service
 * Uses Google Gemini API with deterministic fallback.
 */

const {
  extractPreferencesFromQuery,
  mergePreferences,
  generateClarificationPrompt
} = require('./nlp.service');

const { getRecommendations } = require('./recommendation.service');
const Conversation = require('../models/Conversation');

// Initialize Gemini client
let geminiClientPromise = null;

async function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    return null;
  }

  if (!geminiClientPromise) {
    geminiClientPromise = import('@google/genai')
      .then(({ GoogleGenAI }) => {
        return new GoogleGenAI({ apiKey });
      })
      .catch((error) => {
        geminiClientPromise = null;
        throw error;
      });
  }

  return geminiClientPromise;
}

/**
 * Generate deterministic response if Gemini is unavailable.
 */
function generateDeterministicAssistantReply(
  preferences,
  recommendations,
  clarificationPrompt,
  isAlternative
) {
  const parts = [];

  const localityStr = preferences.locality
    ? ` in ${preferences.locality}`
    : '';

  const bhkStr = preferences.bhk?.length
    ? ` ${preferences.bhk.join('/')} BHK`
    : '';

  const budgetStr = preferences.maxBudget
    ? ` within ₹${(preferences.maxBudget / 100000).toFixed(0)} Lakhs`
    : '';

  if (isAlternative) {
    parts.push(
      `I couldn't find an exact match${localityStr}${bhkStr}${budgetStr}. However, here are the closest alternatives from our listings:`
    );
  } else if (recommendations.length > 0) {
    parts.push(
      `I found ${recommendations.length} matching${bhkStr} properties${localityStr}${budgetStr}.`
    );
  } else {
    parts.push(
      `I searched our database for properties${localityStr}${bhkStr}${budgetStr}.`
    );
  }

  if (recommendations.length > 0) {
    const top = recommendations[0];

    parts.push(
      `Top match: "${top.title}" in ${
        top.location?.locality || 'the selected area'
      } at ${top.priceDisplay || 'the listed price'}.`
    );

    if (top.matchReasons?.length) {
      parts.push(top.matchReasons.slice(0, 2).join('. ') + '.');
    }
  }

  if (clarificationPrompt) {
    parts.push(clarificationPrompt);
  } else {
    parts.push(
      'You can refine your search by mentioning amenities or nearby facilities.'
    );
  }

  return parts.join(' ');
}

/**
 * Generate a response using Gemini.
 */
async function generateGeminiResponse(
  message,
  preferences,
  recommendations,
  clarificationPrompt,
  isAlternative
) {
  const ai = await getGeminiClient();

  if (!ai) {
    return null;
  }

  const propertyDetails = recommendations.map((property) => ({
    title: property.title,
    locality: property.location?.locality,
    price: property.priceDisplay,
    bhk: property.bhk,
    matchScore: property.matchScore,
    matchReasons: property.matchReasons
  }));

  const prompt = `
You are HAVEN, a professional and friendly real estate consultant
helping users find properties in Hyderabad.

USER MESSAGE:
${message}

CURRENT USER PREFERENCES:
${JSON.stringify(preferences)}

ACTUAL PROPERTIES FROM OUR DATABASE:
${JSON.stringify(propertyDetails)}

ARE THESE ALTERNATIVES?
${isAlternative ? 'Yes, these are alternative recommendations.' : 'No.'}

CLARIFICATION QUESTION:
${clarificationPrompt || 'No clarification required currently.'}

INSTRUCTIONS:
1. Respond naturally and professionally.
2. Recommend only properties provided in the database results.
3. Never invent property names, prices, locations or facilities.
4. Explain why the recommended properties match the user's preferences.
5. If no properties are found, explain this politely.
6. Ask the clarification question when provided.
7. Keep your response concise and easy to understand.
8. Do not use markdown headings.
`;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    contents: prompt
  });

  return response.text?.trim() || null;
}

/**
 * Process a conversational message from the user.
 */
async function processChatMessage({ sessionId, userId, message }) {

  // 1. Find or create conversation
  let conversation = await Conversation.findOne({ sessionId });

  if (!conversation) {
    conversation = new Conversation({
      sessionId,
      userId: userId || null,
      messages: [],
      extractedPreferences: {}
    });
  }

  // 2. Extract preferences from current message
  const delta = extractPreferencesFromQuery(message);

  // 3. Merge with existing preferences
  const existingPrefs =
    conversation.extractedPreferences?.toObject
      ? conversation.extractedPreferences.toObject()
      : (conversation.extractedPreferences || {});

  const updatedPreferences = mergePreferences(
    existingPrefs,
    delta
  );

  // 4. Get recommendations from MongoDB
  const {
    recommendations,
    isAlternative,
    alternativeNote
  } = await getRecommendations(
    updatedPreferences,
    { limit: 4 }
  );

  // 5. Generate clarification prompt
  const clarificationPrompt = generateClarificationPrompt(
    updatedPreferences,
    recommendations.length
  );

  // 6. Generate fallback response first
  let assistantReplyText = generateDeterministicAssistantReply(
    updatedPreferences,
    recommendations,
    clarificationPrompt,
    isAlternative
  );

  let engineMode = 'Deterministic NLP (Fallback Mode)';

  // 7. Try Gemini AI
  try {
    if (process.env.GEMINI_API_KEY) {
      const geminiReply = await generateGeminiResponse(
        message,
        updatedPreferences,
        recommendations,
        clarificationPrompt,
        isAlternative
      );

      if (geminiReply) {
        assistantReplyText = geminiReply;
        engineMode = 'Google Gemini AI';
      }
    }
  } catch (error) {
    console.error(
      'Gemini API error. Using fallback response:',
      error.message
    );
  }

  // 8. Save user message
  conversation.messages.push({
    sender: 'user',
    text: message,
    extractedDelta: delta,
    timestamp: new Date()
  });

  // 9. Prepare recommended property references
  const propertyRefs = recommendations.map((property) => ({
    property: property._id,
    matchScore: property.matchScore,
    matchReasons: property.matchReasons
  }));

  // 10. Save assistant response
  conversation.messages.push({
    sender: 'haven',
    text: assistantReplyText,
    extractedDelta: delta,
    recommendedProperties: propertyRefs,
    clarificationPrompt,
    timestamp: new Date()
  });

  // 11. Update conversation preferences
  conversation.extractedPreferences = updatedPreferences;
  conversation.lastActiveAt = new Date();

  if (userId && !conversation.userId) {
    conversation.userId = userId;
  }

  // 12. Save conversation in MongoDB
  await conversation.save();

  // 13. Return response to frontend
  return {
    sessionId,
    reply: assistantReplyText,
    extractedDelta: delta,
    extractedPreferences: updatedPreferences,
    clarificationPrompt,
    recommendations,
    isAlternative,
    alternativeNote,
    engineMode
  };
}

module.exports = {
  processChatMessage,
  generateDeterministicAssistantReply
};
