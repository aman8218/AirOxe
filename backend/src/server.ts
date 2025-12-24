import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app = express();

/* =======================
   CORS CONFIG
======================= */

const allowedOrigins = [
  'http://localhost:3000',
  'https://airoxe.in',
  'https://www.airoxe.in',
  'https://air-oxe-9cfj.vercel.app', // ⚠️ removed trailing slash
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server / Postman / mobile apps
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

/* =======================
   MIDDLEWARES
======================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =======================
   ROUTES
======================= */

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'AirOxe API is running' });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

/* =======================
   EXPORT APP (NO listen)
======================= */

export default app;
