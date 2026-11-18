const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required']
    },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'admin', 'user'],
      default: 'buyer'
    },
    savedProperties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
      }
    ],
    recentSearches: [
      {
        query: { type: String, required: true },
        extractedPreferences: { type: Object, default: {} },
        resultsCount: { type: Number, default: 0 },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    comparedProperties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
      }
    ],
    lifestylePreferences: {
      preferredLocalities: [String],
      budgetMin: Number,
      budgetMax: Number,
      familySize: String,
      commuteDestination: String,
      mustHaveAmenities: [String]
    }
  },
  { timestamps: true }
);

// Password verification method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Exclude passwordHash from default JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.passwordHash;
  return user;
};

module.exports = mongoose.model('User', userSchema);
