'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { Package, MapPin, Phone, User, Calendar, ArrowLeft } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';

function OrderDetailContent() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${params.id}`);
      setOrder(data.data.order);
    } catch (error) {
      console.error('Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
          <Link href="/user/orders" className="text-blue-600 hover:text-blue-700">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      processing: 'bg-blue-100 text-blue-700 border-blue-200',
      shipped: 'bg-purple-100 text-purple-700 border-purple-200',
      delivered: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Link href="/user/orders" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Orders</span>
        </Link>

        <div className="bg-white rounded-xl p-8 shadow-md mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-6 border-b">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Invoice #{order._id.slice(-8)}</h1>

              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-lg font-semibold border-2 ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
            {order.products.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.qty}</p>
                </div>
                <p className="text-lg font-bold text-gray-900">₹{item.price * item.qty}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total Amount</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>


        <p className="text-xs text-red-500 text-center mt-4">
          Do not accept delivery if package is opened or damaged.
        </p>
        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
            <div className="space-y-3 text-gray-600 uppercase">
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{order.shippingAddress.fullName}</span>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{order.shippingAddress.phone}</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p>{order.shippingAddress.address}</p>
                  {order.shippingAddress.landmark && <p>{order.shippingAddress.landmark}</p>}
                  <p>PIN: {order.shippingAddress.pin}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Status</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold text-gray-900">Payment Method</p>
                  <p className="text-gray-600">{order.paymentMethod}</p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Payment Status</p>
                <p className="text-gray-600">
                  {order.paymentMethod === 'online' ? 'Paid Online (No Cash to Collect)' : 'Cash on Delivery'} &nbsp;
                  Collect <b>{order.paymentMethod === 'cod' ? `₹${order.totalAmount}` : '₹0'}</b> Rupees.
                </p>
              </div>
              {order.trackingNumber && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                  <p className="font-semibold text-blue-900">{order.trackingNumber}</p>
                </div>
              )}
            </div>

          </div>

        </div>
        <div className="bg-white rounded-xl p-6 shadow-md mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Seller Details</h2>
          <p className="text-gray-700 font-semibold">AirOxe</p>
          <p className="text-gray-600 text-sm">
            Samathal, Pakbara, Moradabad, Uttar Pradesh, India
          </p>
          <p className="text-gray-600 text-sm">
            Email: support@airoxe.in
          </p>
          <p className="text-xs text-gray-500 mt-6 text-center">
            Returns accepted within 7 days as per AirOxe Refund Policy.
            Used or damaged masks are not eligible for return.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <ProtectedRoute>
      <OrderDetailContent />
    </ProtectedRoute>
  );
}