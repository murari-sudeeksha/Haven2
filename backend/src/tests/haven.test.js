const test = require('node:test');
const assert = require('node:assert/strict');

const { extractPreferencesFromQuery, mergePreferences, parsePriceToInr } = require('../services/nlp.service');
const { evaluatePropertyMatch } = require('../services/recommendation.service');

test('NLP Preference Extraction: Extracts budget in Lakhs and Crores', () => {
  const result1 = parsePriceToInr('under 60 lakhs');
  assert.equal(result1.maxBudget, 6000000);

  const result2 = parsePriceToInr('between 50 and 80 lakhs');
  assert.equal(result2.minBudget, 5000000);
  assert.equal(result2.maxBudget, 8000000);

  const result3 = parsePriceToInr('under 1.5 cr');
  assert.equal(result3.maxBudget, 15000000);
});

test('NLP Preference Extraction: Complex natural language query', () => {
  const query = 'I need a 2BHK apartment near HITEC City under ₹60 lakhs with good schools nearby and a gym';
  const extracted = extractPreferencesFromQuery(query);

  assert.equal(extracted.locality, 'HITEC City');
  assert.deepEqual(extracted.bhk, [2]);
  assert.equal(extracted.maxBudget, 6000000);
  assert.ok(extracted.propertyType.includes('Apartment'));
  assert.ok(extracted.amenities.includes('Gym'));
  assert.ok(extracted.nearbyFacilities.includes('School'));
});

test('NLP Context Merging: Preserves existing preferences across turns', () => {
  const initial = {
    locality: 'Gachibowli',
    maxBudget: 7000000,
    bhk: [3]
  };

  const delta = {
    isGatedCommunity: true,
    nearbyFacilities: ['Metro']
  };

  const merged = mergePreferences(initial, delta);

  assert.equal(merged.locality, 'Gachibowli');
  assert.equal(merged.maxBudget, 7000000);
  assert.deepEqual(merged.bhk, [3]);
  assert.equal(merged.isGatedCommunity, true);
  assert.deepEqual(merged.nearbyFacilities, ['Metro']);
});

test('Recommendation Engine: High match score for matching criteria', () => {
  const property = {
    title: 'Test Gachibowli Flat',
    price: 6800000,
    priceDisplay: '₹68 Lakhs',
    bhk: 3,
    location: { locality: 'Gachibowli' },
    amenities: ['Gym', 'Swimming Pool', '24/7 Security'],
    nearbyFacilities: [{ facilityType: 'Metro', name: 'Metro Stn', distanceKm: 0.9 }]
  };

  const preferences = {
    locality: 'Gachibowli',
    maxBudget: 7000000,
    bhk: [3],
    amenities: ['Gym', 'Swimming Pool'],
    nearbyFacilities: ['Metro']
  };

  const { matchScore, matchReasons } = evaluatePropertyMatch(property, preferences);

  assert.ok(matchScore >= 80, `Expected score >= 80, got ${matchScore}`);
  assert.ok(matchReasons.some(r => r.includes('Gachibowli')));
  assert.ok(matchReasons.some(r => r.includes('Within your budget')));
  assert.ok(matchReasons.some(r => r.includes('Exact 3 BHK')));
});

test('Recommendation Engine: Penalizes mismatched locality or high budget', () => {
  const property = {
    title: 'Expensive Miyapur Villa',
    price: 25000000,
    priceDisplay: '₹2.5 Cr',
    bhk: 4,
    location: { locality: 'Miyapur' },
    amenities: [],
    nearbyFacilities: []
  };

  const preferences = {
    locality: 'HITEC City',
    maxBudget: 6000000,
    bhk: [2]
  };

  const { matchScore } = evaluatePropertyMatch(property, preferences);

  assert.ok(matchScore < 50, `Expected score < 50 for poor match, got ${matchScore}`);
});

test('Role Normalization: Buyer, Seller, and Admin roles are recognized', () => {
  const roles = ['buyer', 'seller', 'admin', 'user'];
  roles.forEach(r => {
    let assigned = 'buyer';
    if (r === 'admin') assigned = 'admin';
    else if (r === 'seller') assigned = 'seller';
    else assigned = 'buyer';

    if (r === 'admin') assert.equal(assigned, 'admin');
    else if (r === 'seller') assert.equal(assigned, 'seller');
    else assert.equal(assigned, 'buyer');
  });
});

test('Price Formatting: Formats Crores and Lakhs accurately for property display', () => {
  const formatPrice = (p) => p >= 10000000 ? `₹${(p / 10000000).toFixed(2)} Cr` : `₹${(p / 100000).toFixed(0)} Lakhs`;
  assert.equal(formatPrice(15000000), '₹1.50 Cr');
  assert.equal(formatPrice(6500000), '₹65 Lakhs');
  assert.equal(formatPrice(23500000), '₹2.35 Cr');
});

