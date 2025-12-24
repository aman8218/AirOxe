import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/airoxe';

let isConnected = false;

export const connectDatabase = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;

    console.log('✅ MongoDB connected successfully');

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
      isConnected = false;
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};
