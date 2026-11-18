const Property = require('../models/Property');

// Get all properties with filters, search, sorting, and pagination
async function getProperties(req, res, next) {
  try {
    const {
      search,
      locality,
      propertyType,
      minPrice,
      maxPrice,
      bhk,
      furnishing,
      isGatedCommunity,
      amenities,
      sortBy = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // 1. Text or keyword search
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { 'location.locality': searchRegex },
        { 'location.address': searchRegex },
        { amenities: searchRegex }
      ];
    }

    // 2. Locality filter (supports multiple comma-separated)
    if (locality) {
      const localities = locality.split(',').map(l => l.trim());
      query['location.locality'] = { $in: localities.map(l => new RegExp(`^${l}$`, 'i')) };
    }

    // 3. Property Type filter
    if (propertyType) {
      const types = propertyType.split(',').map(t => t.trim());
      query.propertyType = { $in: types };
    }

    // 4. Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 5. BHK filter (supports multiple e.g. 2,3)
    if (bhk) {
      const bhkList = bhk.split(',').map(b => Number(b.trim())).filter(n => !isNaN(n));
      if (bhkList.length > 0) {
        query.bhk = { $in: bhkList };
      }
    }

    // 6. Furnishing filter
    if (furnishing) {
      const furnishingList = furnishing.split(',').map(f => f.trim());
      query.furnishing = { $in: furnishingList };
    }

    // 7. Gated Community
    if (isGatedCommunity !== undefined && isGatedCommunity !== '') {
      query.isGatedCommunity = isGatedCommunity === 'true';
    }

    // 8. Amenities filter (all matching)
    if (amenities) {
      const amenityList = amenities.split(',').map(a => a.trim());
      query.amenities = { $all: amenityList };
    }

    // Sorting options
    let sortOptions = { createdAt: -1 };
    if (sortBy === 'price_asc') sortOptions = { price: 1 };
    else if (sortBy === 'price_desc') sortOptions = { price: -1 };
    else if (sortBy === 'area_desc') sortOptions = { area: -1 };
    else if (sortBy === 'area_asc') sortOptions = { area: 1 };
    else if (sortBy === 'bhk_desc') sortOptions = { bhk: -1 };

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, Math.min(50, parseInt(limit, 10)));
    const skip = (pageNumber - 1) * pageSize;

    const [properties, totalCount] = await Promise.all([
      Property.find(query).sort(sortOptions).skip(skip).limit(pageSize).lean(),
      Property.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return res.json({
      success: true,
      data: properties,
      pagination: {
        total: totalCount,
        page: pageNumber,
        pageSize,
        totalPages,
        hasMore: pageNumber < totalPages
      }
    });
  } catch (err) {
    next(err);
  }
}

// Get single property by ID + similar properties
async function getPropertyById(req, res, next) {
  try {
    const { id } = req.params;
    const property = await Property.findById(id).lean();

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    // Find 3 similar properties in same locality or same BHK
    const similar = await Property.find({
      _id: { $ne: property._id },
      $or: [
        { 'location.locality': property.location.locality },
        { bhk: property.bhk }
      ]
    })
      .limit(3)
      .lean();

    return res.json({
      success: true,
      data: property,
      similar
    });
  } catch (err) {
    next(err);
  }
}

// Get featured properties for home page
async function getFeaturedProperties(req, res, next) {
  try {
    const featured = await Property.find({ isFeatured: true }).limit(6).lean();
    return res.json({
      success: true,
      data: featured
    });
  } catch (err) {
    next(err);
  }
}

// Get locality statistics for insights & decision support
async function getLocalityStats(req, res, next) {
  try {
    const stats = await Property.aggregate([
      {
        $group: {
          _id: '$location.locality',
          totalListings: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          avgArea: { $avg: '$area' },
          sampleImage: { $first: { $arrayElemAt: ['$images', 0] } }
        }
      },
      {
        $project: {
          locality: '$_id',
          totalListings: 1,
          avgPrice: { $round: ['$avgPrice', 0] },
          minPrice: 1,
          maxPrice: 1,
          avgArea: { $round: ['$avgArea', 0] },
          sampleImage: 1,
          avgPricePerSqFt: {
            $round: [{ $divide: ['$avgPrice', '$avgArea'] }, 0]
          }
        }
      },
      { $sort: { totalListings: -1 } }
    ]);

    return res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProperties,
  getPropertyById,
  getFeaturedProperties,
  getLocalityStats
};
