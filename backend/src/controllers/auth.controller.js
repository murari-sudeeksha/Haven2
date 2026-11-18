const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'haven_jwt_ultra_secure_secret_key_2026_production_grade_9876543210';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// User Registration
async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Assign role based on registration intent (buyer, seller, or admin)
    let assignedRole = 'buyer';
    if (role === 'admin') {
      assignedRole = 'admin';
    } else if (role === 'seller') {
      assignedRole = 'seller';
    } else {
      assignedRole = 'buyer';
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: assignedRole
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to HAVEN.',
      token,
      user
    });
  } catch (err) {
    next(err);
  }
}

// User Login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user
    });
  } catch (err) {
    next(err);
  }
}

// Get current logged-in user profile
async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedProperties')
      .populate('comparedProperties');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({
      success: true,
      user
    });
  } catch (err) {
    next(err);
  }
}

// Update profile / lifestyle preferences
async function updateProfile(req, res, next) {
  try {
    const { name, lifestylePreferences } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name.trim();
    if (lifestylePreferences) {
      user.lifestylePreferences = {
        ...user.lifestylePreferences,
        ...lifestylePreferences
      };
    }

    await user.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};
