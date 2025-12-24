import { Response } from 'express';
import { AuthRequest } from '../types';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { createOrderSchema } from '../utils/validation';
import { 
  sendOrderConfirmationEmail, 
  sendOrderNotificationToSeller,
  sendOrderCancellationEmail,
  sendCancellationNotificationToSeller,
  sendReturnRequestEmail,
  sendReturnNotificationToSeller 
} from '../utils/email';

export const createOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const validatedData = createOrderSchema.parse(req.body);

    const order = await Order.create({
      userId: req.user?.id,
      ...validatedData,
      status: 'pending',
    });

    // Get user details for email
    const user = await User.findById(req.user?.id);
    
    if (user) {
      // Convert order to plain object for email
      const orderData = order.toObject();
      
      // Send emails asynchronously (don't wait for them)
      Promise.all([
        sendOrderConfirmationEmail(orderData, user.email, user.fullName),
        sendOrderNotificationToSeller(orderData, user.fullName, user.email)
      ])
      .then(() => console.log('Order confirmation emails sent successfully'))
      .catch(err => console.error('Email sending failed:', err));
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: { order },
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    res.status(400).json({
      success: false,
      message: error.errors?.[0]?.message || 'Order creation failed',
    });
  }
};

export const getUserOrders = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const orders = await Order.find({ userId: req.user?.id })
      .sort({ createdAt: -1 })
      .populate('products.productId', 'name imageUrl');

    res.json({
      success: true,
      data: { orders },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
    });
  }
};

export const getOrderById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user?.id,
    }).populate('products.productId', 'name imageUrl');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    res.json({
      success: true,
      data: { order },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
    });
  }
};

export const getAllOrders = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter: any = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('userId', 'fullName email')
      .populate('products.productId', 'name');

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
    });
  }
};

export const updateOrderStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status, trackingNumber } = req.body;

    const updateData: any = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: { order },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
    });
  }
};

// Cancel Order
export const cancelOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { reason } = req.body;

    if (!reason || reason.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: 'Cancellation reason is required',
      });
      return;
    }

    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user?.id,
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    // Check if order can be cancelled
    if (order.status !== 'pending' && order.status !== 'processing') {
      res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage',
      });
      return;
    }

    // Update order status
    order.status = 'cancelled';
    order.cancellationReason = reason;
    order.cancelledAt = new Date();
    await order.save();

    // Get user details for email
    const user = await User.findById(req.user?.id);
    
    if (user) {
      // Send cancellation emails
      Promise.all([
        sendOrderCancellationEmail(order, user.email, user.fullName),
        sendCancellationNotificationToSeller(order, user.fullName)
      ]).catch(err => console.error('Email sending failed:', err));
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully. Refund will be processed within 5-7 business days.',
      data: { order },
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
    });
  }
};

// Request Return
export const requestReturn = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { reason } = req.body;

    if (!reason || reason.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: 'Return reason is required',
      });
      return;
    }

    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user?.id,
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    // Check if order is delivered
    if (order.status !== 'delivered') {
      res.status(400).json({
        success: false,
        message: 'Only delivered orders can be returned',
      });
      return;
    }

    // Check if within 7 days
    const daysSinceDelivery = Math.floor(
      (Date.now() - new Date(order.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceDelivery > 7) {
      res.status(400).json({
        success: false,
        message: 'Return window has expired. Returns are only accepted within 7 days of delivery.',
      });
      return;
    }

    // Update order status
    order.status = 'return-requested';
    order.returnReason = reason;
    order.returnRequestedAt = new Date();
    await order.save();

    // Get user details for email
    const user = await User.findById(req.user?.id);
    
    if (user) {
      // Send return request emails
      Promise.all([
        sendReturnRequestEmail(order, user.email, user.fullName),
        sendReturnNotificationToSeller(order, user.fullName, user.email)
      ]).catch(err => console.error('Email sending failed:', err));
    }

    res.json({
      success: true,
      message: 'Return request submitted successfully. Our team will review and contact you within 24-48 hours.',
      data: { order },
    });
  } catch (error) {
    console.error('Return request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit return request',
    });
  }
};