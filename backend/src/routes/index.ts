import express from 'express';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import * as authController from '../controllers/authController';
import * as userController from '../controllers/userController';
import * as orderController from '../controllers/orderController';
import * as leadController from '../controllers/leadController';
import * as productController from '../controllers/productController';
import * as razorpayController from '../controllers/razorpayController';
import * as contactController from '../controllers/contactController';


const router = express.Router();

router.post('/contact/submit', contactController.submitContactForm);

// Auth routes
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.post('/auth/oauth', authController.oauthLogin);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password/:token', authController.resetPassword);

// User routes (protected)
router.get('/user/profile', authenticate, userController.getProfile);
router.patch('/user/update', authenticate, userController.updateProfile);

// Order routes
router.post('/orders/create', authenticate, orderController.createOrder);
router.post('/orders/create-razorpay', authenticate, razorpayController.createRazorpayOrder);
router.post('/orders/verify-payment', authenticate, razorpayController.verifyRazorpayPayment);
router.get('/orders/user', authenticate, orderController.getUserOrders);
router.get('/orders/:id', authenticate, orderController.getOrderById);

// NEW: Cancel and Return routes
router.post('/orders/:id/cancel', authenticate, orderController.cancelOrder);
router.post('/orders/:id/return', authenticate, orderController.requestReturn);

// Admin order routes
router.get('/orders', authenticate, authorizeAdmin, orderController.getAllOrders);
router.patch('/orders/:id/status', authenticate, authorizeAdmin, orderController.updateOrderStatus);

// Admin order routes
router.get(
  '/orders',
  authenticate,
  authorizeAdmin,
  orderController.getAllOrders
);
router.patch(
  '/orders/:id/status',
  authenticate,
  authorizeAdmin,
  orderController.updateOrderStatus
);

// Lead routes
router.post('/leads/create', leadController.createLead);
router.get('/leads', authenticate, authorizeAdmin, leadController.getAllLeads);

// Product routes (public)
router.get('/products', productController.getAllProducts);
router.get('/products/:slug', productController.getProductBySlug);

export default router;