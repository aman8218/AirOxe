export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  address?: {
    street: string;
    city: string;
    state: string;
    pin: string;
    landmark?: string;
  };
}

// export interface Product {
//   _id: string;
//   name: string;
//   slug: string;
//   description: string;
//   status: 'available' | 'coming-soon';
//   imageUrl: string;
//   features: string[];
//   createdAt: string;
// }

export interface IProductImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface Product {
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

export interface OrderProduct {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  _id: string;
  userId: string;
  products: OrderProduct[];
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
  paymentMethod: 'cod' | 'online';
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}