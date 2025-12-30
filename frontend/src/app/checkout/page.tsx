'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, MapPin, Phone, User, CreditCard, ShoppingCart, FileText, Wallet, CheckCircle2 } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

declare global {
  interface Window {
    Razorpay: any;
  }
}

function CheckoutContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('online');
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: '',
    landmark: '',
    pin: '',
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cartData = JSON.parse(savedCart);
      setCart(cartData);
      if (cartData.length === 0) {
        router.push('/cart');
      }
    } else {
      router.push('/cart');
    }
  }, [router]);

  const mrpTotal = cart.reduce((sum, item) => sum + (item.compareAtPrice || item.price) * item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const savings = 799 - subtotal;
  const codCharges = paymentMethod === 'cod' ? 50 : 0;
  const shippingCharges = 0; // Free shipping
  const total = subtotal + codCharges + shippingCharges;

  const handlePayment = async () => {
    if (!formData.fullName || !formData.phone || !formData.address || !formData.pin) {
      toast.error('Please fill all required fields');
      return;
    }

    if (formData.pin.length !== 6) {
      toast.error('PIN code must be 6 digits');
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === 'cod') {
        await createCODOrder();
      } else {
        await initiateRazorpay();
      }
    } catch (error: any) {
      toast.error(error.message || 'Payment failed');
      setLoading(false);
    }
  };

  const createCODOrder = async () => {
    try {
      const orderData = {
        products: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          qty: item.qty,
          price: item.price,
        })),
        totalAmount: total,
        shippingAddress: formData,
        paymentMethod: 'cod',
      };

      const { data } = await api.post('/orders/create', orderData);
      localStorage.removeItem('cart');
      toast.success('Order placed successfully!');
      router.push(`/user/orders/${data.data.order._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Order failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const initiateRazorpay = async () => {
    try {
      const { data: orderData } = await api.post('/orders/create-razorpay', {
        amount: total,
        currency: 'INR',
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'AirOxe',
        description: 'Payment for AirOxe Products',
        order_id: orderData.data.id,
        handler: async (response: any) => {
          await verifyAndCreateOrder(response);
        },
        prefill: {
          name: formData.fullName,
          email: user?.email || '',
          contact: formData.phone,
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
    }
  };

  const verifyAndCreateOrder = async (paymentResponse: any) => {
    try {
      const verificationData = {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        products: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          qty: item.qty,
          price: item.price,
        })),
        totalAmount: total,
        shippingAddress: formData,
      };

      const { data } = await api.post('/orders/verify-payment', verificationData);
      localStorage.removeItem('cart');
      toast.success('Payment successful! Order placed.');
      router.push(`/user/orders/${data.data.order._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Payment verification failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { icon: ShoppingCart, label: 'Cart', status: 'completed' },
    { icon: FileText, label: 'Details', status: 'current' },
    { icon: Wallet, label: 'Payment', status: 'upcoming' },
    { icon: CheckCircle2, label: 'Done', status: 'upcoming' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 overflow-x-hidden">
      <Navbar />
      <div className="bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-1 py-8 md:py-12">
          {/* Progress Bar */}
          <div className="mb-8 md:mb-12 px-2">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center flex-1">
                  <div className="flex flex-col items-center relative">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${
                        step.status === 'completed'
                          ? 'bg-green-500 text-white'
                          : step.status === 'current'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <step.icon className="w-4 h-4 md:w-6 md:h-6" />
                    </div>
                    <span
                      className={`text-[10px] md:text-xs font-medium mt-1 md:mt-2 whitespace-nowrap ${
                        step.status === 'completed' || step.status === 'current'
                          ? 'text-gray-900'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-1 md:mx-4 transition-all ${
                        step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-8 shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Landmark
                      </label>
                      <input
                        type="text"
                        value={formData.landmark}
                        onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        value={formData.pin}
                        onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength={6}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md mt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <div
                    onClick={() => setPaymentMethod('online')}
                    className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                      paymentMethod === 'online'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      checked={paymentMethod === 'online'}
                      onChange={() => setPaymentMethod('online')}
                      className="w-5 h-5"
                    />
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Pay Online (Recommended)</p>
                      <p className="text-sm text-gray-600">UPI, Cards, Wallets, NetBanking</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                      paymentMethod === 'cod'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Cash on Delivery</p>
                      <p className="text-sm text-gray-600">Pay when you receive (₹50 extra charge)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-md sticky top-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {cart.map(item => (
                    <div key={item.productId} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                      <div className="relative w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        <Image
                          src={item.image || '/images/product-placeholder.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Qty: {item.qty}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          ₹{(item.price * item.qty).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="flex justify-between text-gray-600">
                      <span>COD Charges</span>
                      <span className="text-orange-600">₹{codCharges}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>{paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}