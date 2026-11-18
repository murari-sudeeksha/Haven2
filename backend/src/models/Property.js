const mongoose = require('mongoose');

const nearbyFacilitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    facilityType: {
      type: String,
      enum: ['Metro', 'School', 'Hospital', 'IT Park', 'Shopping Mall', 'Supermarket', 'Airport', 'Highway', 'Park', 'Sports'],
      required: true
    },
    distanceKm: { type: Number, required: true }
  },
  { _id: false }
);

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Property description is required'],
      trim: true
    },
    location: {
      address: { type: String, required: true },
      locality: {
        type: String,
        required: true,
        trim: true,
        index: true
      },
      city: { type: String, default: 'Hyderabad' },
      pincode: { type: String, default: '500081' },
      landmarks: [{ type: String }]
    },
    price: {
      type: Number,
      required: [true, 'Price in INR is required'],
      index: true
    },
    priceDisplay: {
      type: String,
      required: true
    },
    pricePerSqFt: {
      type: Number
    },
    propertyType: {
      type: String,
      enum: ['Apartment', 'Villa', 'Penthouse', 'Independent House', 'Studio'],
      required: true,
      index: true
    },
    bhk: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
      index: true
    },
    bathrooms: {
      type: Number,
      default: 2
    },
    balconies: {
      type: Number,
      default: 1
    },
    area: {
      type: Number,
      required: [true, 'Area in sq.ft is required'],
      index: true
    },
    furnishing: {
      type: String,
      enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
      default: 'Semi-Furnished'
    },
    possessionStatus: {
      type: String,
      enum: ['Ready to Move', 'Under Construction', 'New Launch'],
      default: 'Ready to Move'
    },
    isGatedCommunity: {
      type: Boolean,
      default: true
    },
    floor: {
      type: String,
      default: '5th of 14 Floors'
    },
    facing: {
      type: String,
      enum: ['East', 'West', 'North', 'South', 'North-East', 'North-West'],
      default: 'East'
    },
    amenities: [
      {
        type: String,
        trim: true
      }
    ],
    nearbyFacilities: [nearbyFacilitySchema],
    images: [
      {
        type: String,
        required: true
      }
    ],
    tags: [
      {
        type: String
      }
    ],
    isFeatured: {
      type: Boolean,
      default: false
    },
    isDemo: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['Available', 'Sold', 'Pending'],
      default: 'Available'
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to calculate price per sq ft
propertySchema.pre('save', function (next) {
  if (this.price && this.area && this.area > 0) {
    this.pricePerSqFt = Math.round(this.price / this.area);
  }
  next();
});

// Text index for general search
propertySchema.index({
  title: 'text',
  description: 'text',
  'location.locality': 'text',
  'location.address': 'text',
  amenities: 'text'
});

module.exports = mongoose.model('Property', propertySchema);
