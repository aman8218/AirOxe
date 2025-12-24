import mongoose, { Schema, Document } from 'mongoose';
import { ILead } from '../types';

interface ILeadDocument extends Omit<ILead, '_id'>, Document {}

const leadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ email: 1 });
leadSchema.index({ createdAt: -1 });

export const Lead = mongoose.model<ILeadDocument>('Lead', leadSchema);