import mongoose, { Schema, Document } from 'mongoose';
import { IOrder } from '../types';

interface IOrderDocument extends Omit<IOrder, '_id'>, Document {}

const orderSchema = new Schema<IOrderDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
      required: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId as any,
          ref: 'Product',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'return-requested'],
      default: 'pending',
    },
    trackingNumber: {
      type: String,
      default: null,
    },
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      landmark: String,
      pin: {
        type: String,
        required: true,
      },
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'online'],
      default: 'cod',
    },
    paymentDetails: {
      razorpay_order_id: String,
      razorpay_payment_id: String,
      razorpay_signature: String,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

export const Order = mongoose.model<IOrderDocument>('Order', orderSchema);