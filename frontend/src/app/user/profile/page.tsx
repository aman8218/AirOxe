'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { User, Phone, MapPin, Loader2 } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';

function ProfileContent() {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pin: '',
      landmark: '',
    },
  });

  // ✅ Fetch user ONLY once on page load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/user/profile');
        const userData = data.data.user;

        setFormData({
          fullName: userData.fullName || '',
          phone: userData.phone || '',
          address: {
            street: userData.address?.street || '',
            city: userData.address?.city || '',
            state: userData.address?.state || '',
            pin: userData.address?.pin || '',
            landmark: userData.address?.landmark || '',
          },
        });
      } catch {
        toast.error('Failed to load profile data');
      } finally {
        setFetching(false);
      }
    };

    fetchUser();
  }, []);

  // ✅ Update profile (NO refetch)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.patch('/user/update', formData);

      // update auth context safely
      const token = localStorage.getItem('token');
      if (token) {
        login(data.data.user, token);
      }

      // update UI immediately
      setFormData({
        fullName: data.data.user.fullName || '',
        phone: data.data.user.phone || '',
        address: {
          street: data.data.user.address?.street || '',
          city: data.data.user.address?.city || '',
          state: data.data.user.address?.state || '',
          pin: data.data.user.address?.pin || '',
          landmark: data.data.user.address?.landmark || '',
        },
      });

      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-0 lg:px-4 py-8 md:py-12">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8 px-4 lg:px-0">My Profile</h1>

          <div className="bg-white rounded-xl shadow-md mx-4 lg:mx-0">
            <div className="p-4 md:p-6 lg:p-8">
              {/* Profile Header */}
              <div className="flex items-center space-x-3 md:space-x-4 mb-6 md:mb-8 pb-6 md:pb-8 border-b">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl md:text-2xl font-bold flex-shrink-0 shadow-lg">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg md:text-2xl font-bold text-gray-900 truncate">
                    {user?.fullName}
                  </h2>
                  <p className="text-sm md:text-base text-gray-600 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 md:px-3 py-0.5 md:py-1 bg-blue-100 text-blue-700 text-xs md:text-sm rounded-full">
                    {user?.role === 'admin' ? 'Admin' : 'Customer'}
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2.5 md:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2.5 md:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="border-t pt-5 md:pt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <h3 className="text-base md:text-lg font-semibold">
                      Address Information
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={formData.address.street}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: {
                            ...formData.address,
                            street: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2.5 md:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={formData.address.city}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              city: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2.5 md:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                      />

                      <input
                        type="text"
                        placeholder="State"
                        value={formData.address.state}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              state: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2.5 md:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="PIN Code"
                        maxLength={6}
                        value={formData.address.pin}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              pin: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2.5 md:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                      />

                      <input
                        type="text"
                        placeholder="Landmark"
                        value={formData.address.landmark}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              landmark: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2.5 md:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-5 md:pt-6 border-t">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 text-sm md:text-base"
                  >
                    {loading && <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}