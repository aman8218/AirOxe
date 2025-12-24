import { Request } from 'express';
import { Types } from 'mongoose';

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  passwordHash: string;
  resetPasswordToken: string | undefined;
  resetPasswordExpire: Date | undefined;
  role: 'user' | 'admin';
  address?: {
    street: string;
    city: string;
    state: string;
    pin: string;
    landmark?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  status: 'available' | 'coming-soon';
  images: IProductImage[];
  imageUrl: string; // Backward compatibility
  features: string[];
  price?: number;
  compareAtPrice?: number;
  category?: string;
  tags?: string[];
  specifications?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderProduct {
  productId: Types.ObjectId | string;
  name: string;
  qty: number;
  price: number;
}

export interface IOrder {
  _id: string;
  userId: Types.ObjectId | string;
  products: IOrderProduct[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | 'return-requested';
  trackingNumber?: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    landmark?: string;
    pin: string;
  };
  paymentDetails?: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };
  paymentMethod: 'cod' | 'online';
  // Cancel fields
  cancellationReason?: string;
  cancelledAt?: Date;
  // Return fields
  returnReason?: string;
  returnRequestedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'user' | 'admin';
  };
}

export interface JWTPayload {
  id: string;
  role: 'user' | 'admin';
}