/**
 * HAVEN Content-Based Recommendation Engine
 * Real MongoDB retrieval, multi-attribute scoring, match explanation generation,
 * and alternative suggestions for property queries.
 */

const Property = require('../models/Property');

// Proximity/adjacency cluster for Hyderabad tech localities
const LOCALITY_CLUSTERS = {
  'HITEC City': ['Madhapur', 'Kondapur', 'Gachibowli'],
  Gachibowli: ['Financial District', 'HITEC City', 'Kondapur'],
  Kondapur: ['HITEC City', 'Gachibowli', 'Miyapur', 'Kukatpally'],
  Madhapur: ['HITEC City', 'Jubilee Hills', 'Kondapur'],
  Miyapur: ['Kukatpally', 'Kondapur'],
  Kukatpally: ['Miyapur', 'HITEC City'],
  'Financial District': ['Gachibowli', 'Nanakramguda', 'HITEC City'],
  'Jubilee Hills': ['Madhapur', 'Banjara Hills']
};

/**
 * Score a single property against user structured preferences
 * Returns score between 0 and 100, plus an array of match reasons.
 */
function evaluatePropertyMatch(property, preferences) {
  let score = 0;
  let maxScore = 0;
  const matchReasons = [];

  // 1. Locality Scoring (Weight: 35)
  maxScore += 35;
  if (preferences.locality) {
    if (property.location.locality.toLowerCase() === preferences.locality.toLowerCase()) {
      score += 35;
      matchReasons.push(`Located directly in ${property.location.locality}`);
    } else {
      const adjacentList = LOCALITY_CLUSTERS[preferences.locality] || [];
      const isAdjacent = adjacentList.some(
        adj => adj.toLowerCase() === property.location.locality.toLowerCase()
      );
      if (isAdjacent) {
        score += 20;
        matchReasons.push(`Close to ${preferences.locality} in nearby ${property.location.locality}`);
      } else {
        score += 5;
      }
    }
  } else {
    // If no locality specified, award baseline
    score += 25;
  }

  // 2. Budget Scoring (Weight: 25)
  maxScore += 25;
  if (preferences.maxBudget) {
    if (property.price <= preferences.maxBudget) {
      score += 25;
      const formattedBudget = preferences.maxBudget >= 10000000 
        ? `₹${(preferences.maxBudget / 10000000).toFixed(2)} Cr`
        : `₹${(preferences.maxBudget / 100000).toFixed(0)} Lakhs`;
      matchReasons.push(`Within your budget of ${formattedBudget} (Listed at ${property.priceDisplay})`);
    } else if (property.price <= preferences.maxBudget * 1.1) {
      score += 15;
      matchReasons.push(`Just slightly above budget at ${property.priceDisplay} (high value)`);
    } else {
      score += 2;
    }
  } else {
    score += 20;
  }

  // 3. BHK Scoring (Weight: 20)
  maxScore += 20;
  if (preferences.bhk && preferences.bhk.length > 0) {
    if (preferences.bhk.includes(property.bhk)) {
      score += 20;
      matchReasons.push(`Exact ${property.bhk} BHK layout`);
    } else {
      score += 0;
    }
  } else {
    score += 15;
  }

  // 4. Amenities Scoring (Weight: 10)
  maxScore += 10;
  if (preferences.amenities && preferences.amenities.length > 0) {
    const matchedAmenities = [];
    preferences.amenities.forEach(reqAmenity => {
      const hasAmenity = property.amenities.some(
        a => a.toLowerCase().includes(reqAmenity.toLowerCase()) || reqAmenity.toLowerCase().includes(a.toLowerCase())
      );
      if (hasAmenity) matchedAmenities.push(reqAmenity);
    });

    if (matchedAmenities.length > 0) {
      const amenityRatio = matchedAmenities.length / preferences.amenities.length;
      score += Math.round(10 * amenityRatio);
      matchReasons.push(`Features ${matchedAmenities.slice(0, 3).join(', ')}`);
    }
  } else {
    score += 8;
  }

  // 5. Nearby Facilities Scoring (Weight: 10)
  maxScore += 10;
  if (preferences.nearbyFacilities && preferences.nearbyFacilities.length > 0) {
    const matchedFacilities = [];
    preferences.nearbyFacilities.forEach(facilityType => {
      const match = (property.nearbyFacilities || []).find(
        f => f.facilityType.toLowerCase() === facilityType.toLowerCase() && f.distanceKm <= 2.5
      );
      if (match) {
        matchedFacilities.push(`${match.name} (${match.distanceKm} km)`);
      }
    });

    if (matchedFacilities.length > 0) {
      score += 10;
      matchReasons.push(`Close to ${matchedFacilities[0]}`);
    } else {
      score += 3;
    }
  } else {
    score += 8;
  }

  // Normalized final percentage score
  const finalPercentage = Math.min(100, Math.max(10, Math.round((score / maxScore) * 100)));

  return {
    matchScore: finalPercentage,
    matchReasons: matchReasons.length > 0 ? matchReasons : ['Matches high-level search parameters']
  };
}

/**
 * Main recommendation query pipeline
 */
async function getRecommendations(preferences = {}, options = {}) {
  const limit = options.limit || 6;
  const isStrict = options.strict !== undefined ? options.strict : false;

  // Build MongoDB query with hard constraints if strictly demanded
  const query = {};

  if (isStrict) {
    if (preferences.locality) {
      query['location.locality'] = preferences.locality;
    }
    if (preferences.maxBudget) {
      query.price = { $lte: preferences.maxBudget };
    }
    if (preferences.bhk && preferences.bhk.length > 0) {
      query.bhk = { $in: preferences.bhk };
    }
    if (preferences.propertyType && preferences.propertyType.length > 0) {
      query.propertyType = { $in: preferences.propertyType };
    }
  }

  // Fetch pool of candidate properties
  let candidates = await Property.find(query).lean();

  // If strict query yields 0 results, fall back to relaxed search
  let isAlternative = false;
  let alternativeNote = null;

  if (candidates.length === 0) {
    isAlternative = true;
    candidates = await Property.find({}).lean();
    alternativeNote = `No exact matches found for your strict criteria. Here are the closest alternative properties based on your preferences.`;
  }

  // Score each candidate
  const scoredProperties = candidates.map(property => {
    const { matchScore, matchReasons } = evaluatePropertyMatch(property, preferences);
    return {
      ...property,
      matchScore,
      matchReasons,
      matchExplanation: matchReasons.join(' • ')
    };
  });

  // Sort descending by matchScore, then ascending by price
  scoredProperties.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return a.price - b.price;
  });

  const recommendations = scoredProperties.slice(0, limit);

  return {
    totalFound: candidates.length,
    isAlternative,
    alternativeNote,
    recommendations
  };
}

/**
 * Generate side-by-side trade-off analysis for 2 to 4 properties
 */
function analyzePropertyComparison(properties) {
  if (!properties || properties.length < 2) {
    return {
      summary: 'Please select at least 2 properties to compare.',
      tradeOffs: []
    };
  }

  const tradeOffs = [];
  
  // Find price leader
  const sortedByPrice = [...properties].sort((a, b) => a.price - b.price);
  const lowestPrice = sortedByPrice[0];
  const highestPrice = sortedByPrice[sortedByPrice.length - 1];

  tradeOffs.push({
    factor: 'Pricing & Value',
    description: `"${lowestPrice.title}" offers the most economical entry point at ${lowestPrice.priceDisplay} (approx. ₹${lowestPrice.pricePerSqFt || Math.round(lowestPrice.price / lowestPrice.area)}/sq.ft), whereas "${highestPrice.title}" is positioned at ${highestPrice.priceDisplay} with a premium layout.`
  });

  // Find area leader
  const sortedByArea = [...properties].sort((a, b) => b.area - a.area);
  tradeOffs.push({
    factor: 'Living Space & Layout',
    description: `"${sortedByArea[0].title}" provides the most spacious layout with ${sortedByArea[0].area} sq.ft (${sortedByArea[0].bhk} BHK).`
  });

  // Amenity comparison
  const amenityCounts = properties.map(p => ({
    title: p.title,
    count: (p.amenities || []).length
  }));
  amenityCounts.sort((a, b) => b.count - a.count);

  tradeOffs.push({
    factor: 'Amenities & Facilities',
    description: `"${amenityCounts[0].title}" leads in society amenities with ${amenityCounts[0].count} community features including power backup, security, and club lifestyle.`
  });

  return {
    summary: `Compared ${properties.length} properties across price, area, location, and lifestyle amenities.`,
    tradeOffs
  };
}

module.exports = {
  getRecommendations,
  evaluatePropertyMatch,
  analyzePropertyComparison
};
