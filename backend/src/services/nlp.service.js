/**
 * HAVEN NLP Service - Deterministic Natural Language Preference Extraction
 * Extracts structured real estate parameters from conversational text.
 */

const LOCALITIES = [
  'HITEC City',
  'Gachibowli',
  'Kondapur',
  'Madhapur',
  'Miyapur',
  'Kukatpally',
  'Financial District',
  'Jubilee Hills',
  'Banjara Hills',
  'Nanakramguda',
  'Manikonda',
  'Hafeezpet'
];

const AMENITY_MAPPINGS = {
  gym: 'Gym',
  fitness: 'Gym',
  workout: 'Gym',
  pool: 'Swimming Pool',
  'swimming pool': 'Swimming Pool',
  swim: 'Swimming Pool',
  club: 'Clubhouse',
  clubhouse: 'Clubhouse',
  'power backup': 'Power Backup',
  generator: 'Power Backup',
  backup: 'Power Backup',
  security: '24/7 Security',
  guard: '24/7 Security',
  cctv: '24/7 Security',
  lift: 'Lift',
  elevator: 'Lift',
  parking: 'Covered Parking',
  carpark: 'Covered Parking',
  play: 'Children Play Area',
  playground: 'Children Play Area',
  kids: 'Children Play Area',
  garden: 'Landscaped Garden',
  park: 'Landscaped Garden',
  tennis: 'Tennis Court',
  badminton: 'Badminton Court',
  ev: 'EV Charging Station',
  charging: 'EV Charging Station',
  rooftop: 'Rooftop Lounge',
  jogging: 'Jogging Track'
};

const FACILITY_MAPPINGS = {
  metro: 'Metro',
  subway: 'Metro',
  transit: 'Metro',
  train: 'Metro',
  school: 'School',
  schools: 'School',
  college: 'School',
  education: 'School',
  hospital: 'Hospital',
  hospitals: 'Hospital',
  clinic: 'Hospital',
  medical: 'Hospital',
  mall: 'Shopping Mall',
  malls: 'Shopping Mall',
  shopping: 'Shopping Mall',
  supermarket: 'Shopping Mall',
  it: 'IT Park',
  tech: 'IT Park',
  'tech park': 'IT Park',
  office: 'IT Park',
  airport: 'Airport'
};

function parsePriceToInr(text) {
  let minBudget = null;
  let maxBudget = null;

  const lower = text.toLowerCase();

  // Range pattern: between X and Y lakhs / X to Y cr
  const rangeLakhs = lower.match(/(?:between|from)?\s*₹?\s*(\d+(?:\.\d+)?)\s*(?:and|to|-)\s*₹?\s*(\d+(?:\.\d+)?)\s*(?:lakhs?|lacs?|l)/i);
  if (rangeLakhs) {
    minBudget = parseFloat(rangeLakhs[1]) * 100000;
    maxBudget = parseFloat(rangeLakhs[2]) * 100000;
    return { minBudget, maxBudget };
  }

  const rangeCrores = lower.match(/(?:between|from)?\s*₹?\s*(\d+(?:\.\d+)?)\s*(?:and|to|-)\s*₹?\s*(\d+(?:\.\d+)?)\s*(?:cr|crores?)/i);
  if (rangeCrores) {
    minBudget = parseFloat(rangeCrores[1]) * 10000000;
    maxBudget = parseFloat(rangeCrores[2]) * 10000000;
    return { minBudget, maxBudget };
  }

  // Under / below / maximum / up to
  const maxLakhMatch = lower.match(/(?:under|below|less than|max|maximum|within|up to|budget of|upto)\s*₹?\s*(\d+(?:\.\d+)?)\s*(?:lakhs?|lacs?|l\b)/i);
  if (maxLakhMatch) {
    maxBudget = parseFloat(maxLakhMatch[1]) * 100000;
  }

  const maxCrMatch = lower.match(/(?:under|below|less than|max|maximum|within|up to|budget of|upto)\s*₹?\s*(\d+(?:\.\d+)?)\s*(?:cr|crores?)/i);
  if (maxCrMatch) {
    maxBudget = parseFloat(maxCrMatch[1]) * 10000000;
  }

  // Minimum / above / at least
  const minLakhMatch = lower.match(/(?:above|more than|at least|minimum|min)\s*₹?\s*(\d+(?:\.\d+)?)\s*(?:lakhs?|lacs?|l\b)/i);
  if (minLakhMatch) {
    minBudget = parseFloat(minLakhMatch[1]) * 100000;
  }

  const minCrMatch = lower.match(/(?:above|more than|at least|minimum|min)\s*₹?\s*(\d+(?:\.\d+)?)\s*(?:cr|crores?)/i);
  if (minCrMatch) {
    minBudget = parseFloat(minCrMatch[1]) * 10000000;
  }

  // General "₹XX lakhs" without under/above keyword
  if (!maxBudget && !minBudget) {
    const singleLakh = lower.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lakhs?|lacs?|l\b)/i);
    if (singleLakh) {
      maxBudget = parseFloat(singleLakh[1]) * 100000;
    }
    const singleCr = lower.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:cr|crores?)/i);
    if (singleCr) {
      maxBudget = parseFloat(singleCr[1]) * 10000000;
    }
  }

  return { minBudget, maxBudget };
}

function extractPreferencesFromQuery(query) {
  const extracted = {};
  const lower = query.toLowerCase();

  // 1. Locality extraction
  for (const loc of LOCALITIES) {
    const regex = new RegExp(`\\b${loc}\\b`, 'i');
    if (regex.test(query)) {
      extracted.locality = loc;
      break;
    }
  }

  // Locality aliases / partials
  if (!extracted.locality) {
    if (/\bhitec\b/i.test(query) || /\bcyberabad\b/i.test(query)) {
      extracted.locality = 'HITEC City';
    } else if (/\bgachibowli\b/i.test(query)) {
      extracted.locality = 'Gachibowli';
    } else if (/\bfinancial\b/i.test(query) || /\bnanakramguda\b/i.test(query)) {
      extracted.locality = 'Financial District';
    } else if (/\bjubilee\b/i.test(query)) {
      extracted.locality = 'Jubilee Hills';
    }
  }

  // 2. Budget extraction
  const { minBudget, maxBudget } = parsePriceToInr(query);
  if (minBudget !== null) extracted.minBudget = minBudget;
  if (maxBudget !== null) extracted.maxBudget = maxBudget;

  // 3. BHK extraction
  const bhkMatches = [];
  const digitBhk = lower.match(/\b([1-5])\s*(?:bhk|bedroom|bed|room)\b/gi);
  if (digitBhk) {
    digitBhk.forEach(m => {
      const num = parseInt(m.match(/[1-5]/)[0], 10);
      if (!bhkMatches.includes(num)) bhkMatches.push(num);
    });
  }

  // Word representations: one, two, three, four
  if (/\b(?:one|1)\s*bed(?:room)?\b/i.test(lower)) bhkMatches.push(1);
  if (/\b(?:two|2)\s*bed(?:room)?\b/i.test(lower)) bhkMatches.push(2);
  if (/\b(?:three|3)\s*bed(?:room)?\b/i.test(lower)) bhkMatches.push(3);
  if (/\b(?:four|4)\s*bed(?:room)?\b/i.test(lower)) bhkMatches.push(4);

  if (bhkMatches.length > 0) {
    extracted.bhk = [...new Set(bhkMatches)];
  }

  // 4. Property Type
  const types = [];
  if (/\b(?:villa|villas|independent house|triplex|duplex)\b/i.test(lower)) {
    types.push('Villa');
  }
  if (/\b(?:penthouse|sky mansion|terrace flat)\b/i.test(lower)) {
    types.push('Penthouse');
  }
  if (/\b(?:apartment|flat|condo|gated community)\b/i.test(lower)) {
    types.push('Apartment');
  }
  if (/\b(?:studio|bachelor)\b/i.test(lower)) {
    types.push('Studio');
  }
  if (types.length > 0) {
    extracted.propertyType = [...new Set(types)];
  }

  // 5. Gated Community
  if (/\bgated\b|\bgated community\b|\bsociety\b/i.test(lower)) {
    extracted.isGatedCommunity = true;
  }

  // 6. Amenities
  const foundAmenities = [];
  Object.keys(AMENITY_MAPPINGS).forEach(key => {
    const reg = new RegExp(`\\b${key}\\b`, 'i');
    if (reg.test(lower)) {
      const canonical = AMENITY_MAPPINGS[key];
      if (!foundAmenities.includes(canonical)) {
        foundAmenities.push(canonical);
      }
    }
  });
  if (foundAmenities.length > 0) {
    extracted.amenities = foundAmenities;
  }

  // 7. Nearby Facilities
  const foundFacilities = [];
  Object.keys(FACILITY_MAPPINGS).forEach(key => {
    const reg = new RegExp(`\\b${key}\\b`, 'i');
    if (reg.test(lower)) {
      const canonical = FACILITY_MAPPINGS[key];
      if (!foundFacilities.includes(canonical)) {
        foundFacilities.push(canonical);
      }
    }
  });
  if (foundFacilities.length > 0) {
    extracted.nearbyFacilities = foundFacilities;
  }

  // 8. Furnishing
  if (/\bfully furnished|furnished\b/i.test(lower) && !/\bsemi|unfurnished\b/i.test(lower)) {
    extracted.furnishing = ['Furnished'];
  } else if (/\bsemi[- ]furnished\b/i.test(lower)) {
    extracted.furnishing = ['Semi-Furnished'];
  } else if (/\bunfurnished|raw\b/i.test(lower)) {
    extracted.furnishing = ['Unfurnished'];
  }

  return extracted;
}

/**
 * Merge existing conversation preferences with new updates.
 * Allows user to refine or override attributes cleanly.
 */
function mergePreferences(existing = {}, delta = {}) {
  const merged = { ...existing };

  if (delta.locality) merged.locality = delta.locality;
  if (delta.minBudget !== undefined && delta.minBudget !== null) merged.minBudget = delta.minBudget;
  if (delta.maxBudget !== undefined && delta.maxBudget !== null) merged.maxBudget = delta.maxBudget;

  if (delta.bhk && delta.bhk.length > 0) {
    merged.bhk = delta.bhk;
  }

  if (delta.propertyType && delta.propertyType.length > 0) {
    merged.propertyType = delta.propertyType;
  }

  if (delta.isGatedCommunity !== undefined && delta.isGatedCommunity !== null) {
    merged.isGatedCommunity = delta.isGatedCommunity;
  }

  if (delta.furnishing && delta.furnishing.length > 0) {
    merged.furnishing = delta.furnishing;
  }

  // Merge amenities without duplicates
  if (delta.amenities && delta.amenities.length > 0) {
    const currentAmenities = merged.amenities || [];
    merged.amenities = Array.from(new Set([...currentAmenities, ...delta.amenities]));
  }

  // Merge nearby facilities without duplicates
  if (delta.nearbyFacilities && delta.nearbyFacilities.length > 0) {
    const currentFacilities = merged.nearbyFacilities || [];
    merged.nearbyFacilities = Array.from(new Set([...currentFacilities, ...delta.nearbyFacilities]));
  }

  return merged;
}

/**
 * Formulate clarification or next conversational prompt based on missing key criteria
 */
function generateClarificationPrompt(preferences, resultCount) {
  if (!preferences.locality) {
    return 'Which locality in Hyderabad do you prefer? (Popular options: HITEC City, Gachibowli, Kondapur, Madhapur, Miyapur, Kukatpally)';
  }
  if (!preferences.maxBudget) {
    return 'What is your maximum target budget? (e.g., under ₹60 Lakhs, under ₹1.2 Cr)';
  }
  if (!preferences.bhk || preferences.bhk.length === 0) {
    return 'How many bedrooms (BHK) are you looking for? (e.g., 2BHK, 3BHK)';
  }
  if (preferences.isGatedCommunity === undefined || preferences.isGatedCommunity === null) {
    return 'Do you prefer a gated community with dedicated security and clubhouse amenities?';
  }
  if (!preferences.nearbyFacilities || preferences.nearbyFacilities.length === 0) {
    return 'Are there specific facilities you want nearby, such as Metro stations, top schools, or IT parks?';
  }
  if (resultCount > 3) {
    return 'Would you like to filter further by furnishing (Furnished / Semi-Furnished) or specific amenities like a Swimming Pool or Gym?';
  }
  return null;
}

module.exports = {
  extractPreferencesFromQuery,
  mergePreferences,
  generateClarificationPrompt,
  parsePriceToInr,
  LOCALITIES
};
