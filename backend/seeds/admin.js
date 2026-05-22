import User from '../models/User.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@codebattle.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Username: ${existingAdmin.username}`);
      console.log(`Is Admin: ${existingAdmin.isAdmin}`);
      
      // If not admin, make them admin
      if (!existingAdmin.isAdmin) {
        existingAdmin.isAdmin = true;
        await existingAdmin.save();
        console.log('✅ User promoted to admin!');
      }
    } else {
      // Create new admin user
      const adminUser = await User.create({
        username: 'admin',
        email: 'admin@codebattle.com',
        password: 'admin123456', // Will be hashed by pre-save hook
        rating: 0,
        isAdmin: true,
        wins: 0,
        losses: 0,
        draws: 0,
        totalMatches: 0,
        highestRating: 0,
        lowestRating: 0,
        isOnline: false
      });

      console.log('✅ Admin user created successfully!');
      console.log(`Email: ${adminUser.email}`);
      console.log(`Username: ${adminUser.username}`);
      console.log(`Is Admin: ${adminUser.isAdmin}`);
    }

    // Create additional test users for testing
    const testUsers = [
      {
        username: 'testuser1',
        email: 'testuser1@codebattle.com',
        password: 'test123456',
        isAdmin: false
      },
      {
        username: 'testuser2',
        email: 'testuser2@codebattle.com',
        password: 'test123456',
        isAdmin: false
      }
    ];

    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        await User.create(userData);
        console.log(`✅ Test user created: ${userData.username}`);
      } else {
        console.log(`⚠️  Test user already exists: ${userData.username}`);
      }
    }

    console.log('\n📋 SEEDING COMPLETE!\n');
    console.log('🔐 Admin Credentials:');
    console.log('   Email: admin@codebattle.com');
    console.log('   Password: admin123456');
    console.log('   Username: admin\n');
    console.log('👤 Test Users:');
    console.log('   testuser1@codebattle.com / test123456');
    console.log('   testuser2@codebattle.com / test123456\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedAdmin();

