import { z } from 'zod';

export const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to terms and privacy policy',
  }),
  subscribeToUpdates: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pin: z.string().optional(),
    landmark: z.string().optional(),
  }).optional(),
});

export const createOrderSchema = z.object({
  products: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    qty: z.number().min(1),
    price: z.number().min(0),
  })),
  totalAmount: z.number().min(0),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(10),
    address: z.string().min(5),
    landmark: z.string().optional(),
    pin: z.string().min(6).max(6),
  }),
});

export const createLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
});