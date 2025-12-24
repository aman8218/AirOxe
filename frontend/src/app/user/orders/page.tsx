'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Package, Calendar, MapPin, Eye, Loader2, XCircle, RotateCcw, AlertCircle } from 'lucide-react';
import { Order } from '@/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/user');
      setOrders(data.data.orders);
    } catch (error: any) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder || !cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    setActionLoading(true);
    try {
      await api.post(`/orders/${selectedOrder._id}/cancel`, { reason: cancelReason });
      toast.success('Order cancelled successfully');
      setShowCancelModal(false);
      setCancelReason('');
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturnRequest = async () => {
    if (!selectedOrder || !returnReason.trim()) {
      toast.error('Please provide a reason for return');
      return;
    }

    setActionLoading(true);
    try {
      await api.post(`/orders/${selectedOrder._id}/return`, { reason: returnReason });
      toast.success('Return request submitted successfully');
      setShowReturnModal(false);
      setReturnReason('');
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit return request');
    } finally {
      setActionLoading(false);
    }
  };

  const canCancelOrder = (order: Order) => {
    return order.status === 'pending' || order.status === 'processing';
  };

  const canReturnOrder = (order: Order) => {
    if (order.status !== 'delivered') return false;
    const deliveryDate = new Date(order.updatedAt);
    const daysSinceDelivery = Math.floor((Date.now() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceDelivery <= 7;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'return-requested':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-2">Track and manage your orders</p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
              <p className="text-gray-600 mb-6">Start shopping and your orders will appear here</p>
              <Link
                href="/products"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-mono text-gray-900 font-semibold">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>

                      <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 py-4 border-t border-gray-100">
                      <div className="flex items-start space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Order Date</p>
                          <p className="font-medium text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Package className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Items</p>
                          <p className="font-medium text-gray-900">
                            {order.products.reduce((sum, p) => sum + p.qty, 0)} item(s)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="font-bold text-gray-900">₹{order.totalAmount}</p>
                        </div>
                      </div>
                    </div>

                    {order.trackingNumber && (
                      <div className="py-3 px-4 bg-blue-50 rounded-lg border border-blue-100 mb-4">
                        <p className="text-sm text-blue-900">
                          <span className="font-semibold">Tracking Number:</span>{' '}
                          {order.trackingNumber}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        {order.products.map((product, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {product.name} × {product.qty}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        {canCancelOrder(order) && (
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowCancelModal(true);
                            }}
                            className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold transition text-sm"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                        )}

                        {canReturnOrder(order) && (
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowReturnModal(true);
                            }}
                            className="flex items-center space-x-1 px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-lg font-semibold transition text-sm"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>Return</span>
                          </button>
                        )}

                        <Link
                          href={`/user/orders/${order._id}`}
                          className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Cancel Order</h3>
                <p className="text-sm text-gray-500">Order #{selectedOrder?._id.slice(-8).toUpperCase()}</p>
              </div>
            </div>

            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation *
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please tell us why you're cancelling..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={3}
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
                disabled={actionLoading}
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={actionLoading}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center"
              >
                {actionLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Cancel Order'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Request Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Request Return</h3>
                <p className="text-sm text-gray-500">Order #{selectedOrder?._id.slice(-8).toUpperCase()}</p>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-orange-800">
                <strong>Return Policy:</strong> Returns accepted within 7 days of delivery. Product must be unused and in original packaging.
              </p>
              <Link href="/refund" target='_/' className='text-blue-600 underline text-sm'> For More Info Checkout Our Return Policy.</Link>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for return *
              </label>
              <textarea
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder="Please describe the issue with the product..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={3}
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReturnModal(false);
                  setReturnReason('');
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleReturnRequest}
                disabled={actionLoading}
                className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50 flex items-center justify-center"
              >
                {actionLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}