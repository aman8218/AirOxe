import app from '../src/server';
import { connectDatabase } from '../src/config/database';

let isConnected = false;

const handler = async (req: any, res: any) => {
  try {
    if (!isConnected) {
      await connectDatabase();
      isConnected = true;
      console.log('✅ MongoDB connected');
    }

    return app(req, res);
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default handler;
