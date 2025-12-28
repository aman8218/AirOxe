import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from '../types';

interface IProductDocument extends Omit<IProduct, '_id'>, Document {}

const productSchema = new Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,  // This already creates an index
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    status: {
      type: String,
      enum: ['available', 'coming-soon'],
      default: 'available',
    },
    // Multiple images support
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          default: '',
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    // Keep imageUrl for backward compatibility (returns first/primary image)
    imageUrl: {
      type: String,
      default: '/images/product-placeholder.jpg',
    },
    features: [
      {
        type: String,
      },
    ],
    // Optional: Add more product fields
    price: {
      type: Number,
      min: 0,
    },
    compareAtPrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    specifications: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search and filtering
// productSchema.index({ slug: 1 });  ← REMOVE THIS LINE (duplicate!)
productSchema.index({ status: 1 });
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text' });

// Virtual to get primary image
productSchema.virtual('primaryImage').get(function () {
  if (this.images && this.images.length > 0) {
    const primary = this.images.find((img: any) => img.isPrimary);
    return primary || this.images[0];
  }
  return { url: this.imageUrl, alt: this.name };
});

// Pre-save hook to set imageUrl from primary image
productSchema.pre('save', function (next) {
  if (this.images && this.images.length > 0) {
    const primary = this.images.find((img: any) => img.isPrimary);
    this.imageUrl = primary ? primary.url : this.images[0].url;
  }
  next();
});

export const Product = mongoose.model<IProductDocument>('Product', productSchema);