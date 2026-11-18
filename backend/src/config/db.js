const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Property = require('../models/Property');
const User = require('../models/User');
const sampleProperties = require('../seed/seedData');

let mongoMemoryServer = null;

async function autoSeedDatabase() {
  try {
    const propertyCount = await Property.countDocuments();
    if (propertyCount === 0) {
      console.log('🔄 Initializing database with HAVEN sample properties...');
      await Property.insertMany(sampleProperties);
      console.log(`✅ Seeded ${sampleProperties.length} realistic properties in Hyderabad!`);
    }

    // Ensure default demo users exist
    const adminUser = await User.findOne({ email: 'admin@haven.ai' });
    if (!adminUser) {
      const passwordHash = await bcrypt.hash('Admin@1234', 10);
      await User.create({
        name: 'HAVEN Admin',
        email: 'admin@haven.ai',
        passwordHash,
        role: 'admin',
        lifestylePreferences: {
          preferredLocalities: ['HITEC City', 'Gachibowli'],
          budgetMin: 5000000,
          budgetMax: 15000000
        }
      });
      console.log('✅ Demo Admin created: admin@haven.ai (Password: Admin@1234)');
    }

    const demoUser = await User.findOne({ email: 'user@haven.ai' });
    if (!demoUser) {
      const passwordHash = await bcrypt.hash('User@1234', 10);
      await User.create({
        name: 'Vikram Sharma',
        email: 'user@haven.ai',
        passwordHash,
        role: 'buyer',
        lifestylePreferences: {
          preferredLocalities: ['Gachibowli', 'Kondapur'],
          budgetMin: 4000000,
          budgetMax: 7500000,
          familySize: '3 Members',
          commuteDestination: 'HITEC City'
        }
      });
      console.log('✅ Demo Buyer created: user@haven.ai (Password: User@1234)');
    }

    let sellerUser = await User.findOne({ email: 'seller@haven.ai' });
    if (!sellerUser) {
      const passwordHash = await bcrypt.hash('Seller@1234', 10);
      sellerUser = await User.create({
        name: 'Aarav Properties & Builders',
        email: 'seller@haven.ai',
        passwordHash,
        role: 'seller',
        lifestylePreferences: {
          preferredLocalities: ['Financial District', 'Gachibowli']
        }
      });
      console.log('✅ Demo Seller created: seller@haven.ai (Password: Seller@1234)');
    }

    // Attach creator to demo properties if not assigned
    if (sellerUser) {
      await Property.updateMany(
        { createdBy: { $exists: false } },
        { $set: { createdBy: sellerUser._id, status: 'Available' } }
      );
    }
  } catch (err) {
    console.error('⚠️ Auto-seed notice:', err.message);
  }
}

async function connectDB() {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/haven_db';

  try {
    console.log(`📡 Connecting to primary MongoDB at ${primaryUri}...`);
    // Connect with a 3-second serverSelectionTimeout
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('✨ Connected to MongoDB server successfully.');
    await autoSeedDatabase();
    return;
  } catch (err) {
    console.warn(`⚠️ Primary MongoDB connection failed (${err.message}).`);
    console.log('🚀 Launching automated in-memory MongoDB instance for seamless standalone operation...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoMemoryServer.getUri();
      
      await mongoose.connect(inMemoryUri);
      console.log(`✨ Connected to HAVEN In-Memory MongoDB at ${inMemoryUri}`);
      await autoSeedDatabase();
    } catch (memErr) {
      console.error('❌ Failed to start in-memory MongoDB:', memErr.message);
      throw memErr;
    }
  }
}

async function disconnectDB() {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
}

module.exports = { connectDB, disconnectDB, autoSeedDatabase };
