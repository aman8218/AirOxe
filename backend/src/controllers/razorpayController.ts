import { Response } from 'express';
import { AuthRequest } from '../types';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { 
  sendOrderConfirmationEmail, 
  sendOrderNotificationToSeller 
} from '../utils/email';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createRazorpayOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { amount, currency } = req.body;

    const options = {
      amount: amount * 100, // Amount in paise
      currency: currency || 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create Razorpay order',
    });
  }
};

export const verifyRazorpayPayment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      products,
      totalAmount,
      shippingAddress,
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
      return;
    }

    // Create order after successful payment verification
    const order = await Order.create({
      userId: req.user?.id,
      products,
      totalAmount,
      shippingAddress,
      status: 'pending',
      paymentMethod: 'online',
      paymentDetails: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      },
    });

    // Get user details for email
    const user = await User.findById(req.user?.id);
    
    if (user) {
      // Convert order to plain object for email
      const orderData = order.toObject();
      
      // Send emails asynchronously
      Promise.all([
        sendOrderConfirmationEmail(orderData, user.email, user.fullName),
        sendOrderNotificationToSeller(orderData, user.fullName, user.email)
      ])
      .then(() => console.log('Order confirmation emails sent successfully for online payment'))
      .catch(err => console.error('Email sending failed for online payment:', err));
    }

    res.json({
      success: true,
      message: 'Payment verified and order created successfully',
      data: { order },
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
    });
  }
};