import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Product } from '../models/Product';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/airoxe');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    await User.create({
      fullName: 'Admin User',
      email: 'admin@airoxe.com',
      passwordHash: adminPassword,
      role: 'admin',
    });
    console.log('👤 Admin user created');

    // Create products
    await Product.insertMany([
      {
        name: 'AirOxe AirShield',
        slug: 'airoxe-airshield',
        description: 'Premium N95 mask with advanced filtration technology for maximum protection against air pollution.',
        status: 'available',
        imageUrl: '/images/airshield.jpg',
        features: [
          '5-layer filtration system',
          'N95 certified protection',
          'Comfortable adjustable straps',
          'Reusable and washable',
          'Anti-fog design',
        ],
      },
      {
        name: 'AirOxe ActiveMask',
        slug: 'active-mask',
        description: 'Next-generation electric air-assisted mask with built-in air purification system.',
        status: 'coming-soon',
        imageUrl: '/images/activemask.jpg',
        features: [
          'Electric air purification',
          'HEPA filtration technology',
          'USB rechargeable battery',
          'Smart air quality monitoring',
          'Bluetooth connectivity',
        ],
      },
    ]);
    console.log('📦 Products created');

    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();