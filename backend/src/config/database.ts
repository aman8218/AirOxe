import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI is not defined');
}

export const connectDatabase = async (): Promise<void> => {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);

    console.log('✅ MongoDB connected');

  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error; // Let Vercel handle retries
  }
};
