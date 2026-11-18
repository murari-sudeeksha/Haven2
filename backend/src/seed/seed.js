require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('../models/Property');
const User = require('../models/User');
const sampleProperties = require('./seedData');
const bcrypt = require('bcryptjs');

async function runSeed() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/haven_db';
  console.log(`🌱 Connecting to ${uri} to seed data...`);

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');

    // Clear existing sample properties
    await Property.deleteMany({ isDemo: true });
    console.log('Cleared existing demo properties.');

    // Insert new ones
    const inserted = await Property.insertMany(sampleProperties);
    console.log(`✅ Successfully seeded ${inserted.length} properties!`);

    // Ensure demo users exist
    let admin = await User.findOne({ email: 'admin@haven.ai' });
    if (!admin) {
      const passwordHash = await bcrypt.hash('Admin@1234', 10);
      admin = await User.create({
        name: 'HAVEN Admin',
        email: 'admin@haven.ai',
        passwordHash,
        role: 'admin'
      });
      console.log('✅ Admin user created: admin@haven.ai');
    }

    let demoUser = await User.findOne({ email: 'user@haven.ai' });
    if (!demoUser) {
      const passwordHash = await bcrypt.hash('User@1234', 10);
      demoUser = await User.create({
        name: 'Vikram Sharma',
        email: 'user@haven.ai',
        passwordHash,
        role: 'user'
      });
      console.log('✅ Demo user created: user@haven.ai');
    }

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  runSeed();
}

module.exports = runSeed;
