'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  compareAtPrice?: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    
    // Dispatch custom event to update cart count in navbar
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const updateQuantity = (productId: string, change: number) => {
    const newCart = cart.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.qty + change);
        return { ...item, qty: newQty };
      }
      return item;
    });
    updateCart(newCart);
  };

  const removeItem = (productId: string) => {
    const newCart = cart.filter(item => item.productId !== productId);
    updateCart(newCart);
    toast.success('Item removed from cart');
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 overflow-x-hidden">
        <Navbar/>
        <div className="bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="text-center space-y-6">
              <ShoppingBag className="w-24 h-24 mx-auto text-gray-300" />
              <h1 className="text-3xl font-bold text-gray-900">Your Cart is Empty</h1>
              <p className="text-gray-600">Start shopping to add items to your cart</p>
              <Link
                href="/products"
                className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 overflow-x-hidden">
      <Navbar/>
      <div className="bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-0 lg:px-4 py-8 md:py-12">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8 px-4 lg:px-0">Shopping Cart</h1>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-4 px-0 lg:px-0">
              {cart.map(item => (
                <div key={item.productId} className="bg-white rounded-xl shadow-md mx-4 lg:mx-0">
                  <div className="p-4 md:p-6">
                    <div className="flex gap-3 md:gap-6">
                      <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        <Image
                          src={item.image || '/images/product-placeholder.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-xl font-bold text-gray-900 mb-1 md:mb-2 line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-lg md:text-2xl font-bold text-blue-600 mb-3 md:mb-4">
                          ₹{item.price.toLocaleString()}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-0">
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <button
                              onClick={() => updateQuantity(item.productId, -1)}
                              className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-base md:text-lg font-semibold w-8 text-center">{item.qty}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, 1)}
                              className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
                            <span className="text-base md:text-lg font-semibold text-gray-900">
                              ₹{(item.price * item.qty).toLocaleString()}
                            </span>
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="text-red-600 hover:text-red-700 transition"
                              title="Remove item"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1 px-0 lg:px-0">
              <div className="bg-white rounded-xl shadow-md sticky top-20 mx-4 lg:mx-0">
                <div className="p-4 md:p-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Order Summary</h2>
                  
                  <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                    {cart.map(item => (
                      <div key={item.productId} className="flex justify-between text-xs md:text-sm text-gray-600">
                        <span className="truncate mr-2">{item.name} x {item.qty}</span>
                        <span className="flex-shrink-0">₹{(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 md:pt-4 space-y-2 md:space-y-3 mb-4 md:mb-6">
                    <div className="flex justify-between text-sm md:text-base text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm md:text-base text-gray-600">
                      <span>Shipping</span>
                      <span className="text-green-600 font-semibold">Free</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg md:text-xl font-bold text-gray-900">
                        <span>Total</span>
                        <span>₹{total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="block w-full py-2.5 md:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition text-center text-sm md:text-base"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </span>
                  </Link>
                  
                  <Link
                    href="/products"
                    className="block text-center mt-3 md:mt-4 text-blue-600 hover:text-blue-700 font-medium transition text-sm md:text-base"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}