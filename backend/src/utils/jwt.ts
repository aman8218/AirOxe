import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRE = process.env.JWT_EXPIRE;

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};