'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Wind, CheckCircle, Bell, ArrowLeft, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ActiveMaskPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const product = {
    name: 'AirOxe ActiveMask',
    description: 'Next-generation electric air-assisted mask with built-in air purification system. Experience the future of respiratory protection with smart technology and superior comfort.',
    features: [
      'Electric air purification with active fan system',
      'HEPA H13 filtration technology (99.97% efficiency)',
      'USB-C rechargeable lithium battery (8-hour runtime)',
      'Real-time air quality monitoring with LED indicators',
      'Bluetooth 5.0 connectivity with mobile app',
      'Adjustable airflow settings (3 speed modes)',
      'Ultra-lightweight design with premium materials',
      'Washable and replaceable filter cartridges',
      'Smart sensors for breath detection',
      'Ergonomic fit with soft silicone seal'
    ],
    upcomingFeatures: {
      'Launch Date': 'Q2 2025 (Expected)',
      'Battery Life': '8 hours continuous use',
      'Charging Time': '2 hours (USB-C fast charging)',
      'Filter Life': '300 hours or 3 months',
      'App Features': 'Air quality tracking, filter life monitoring, usage statistics',
      'Warranty': '1 year manufacturer warranty'
    }
  };

  const handleNotifyMe = async () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await api.post('/leads/create', { 
        name: 'ActiveMask Interested', 
        email,
        phone: 'Notify for ActiveMask' 
      });
      toast.success('You will be notified when ActiveMask launches!');
      setEmail('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link href="/products" className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-8">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-6">
            <div className="aspect-square bg-gradient-to-br from-purple-100 to-purple-50 rounded-3xl flex items-center justify-center shadow-xl relative overflow-hidden">
              <Wind className="w-64 h-64 text-purple-600 animate-[float_3s_ease-in-out_infinite]" />
              <div className="absolute top-8 right-8 px-4 py-2 bg-purple-600 text-white font-bold rounded-full flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>Coming Soon</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="aspect-square bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center">
                  <Wind className="w-12 h-12 text-purple-600" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Launching Q2 2025</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {product.description}
              </p>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                Coming Soon
              </div>
              <p className="text-gray-500">Pricing will be announced at launch</p>
            </div>

            {/* Notify Me Form */}
            <div className="border-2 border-purple-200 rounded-2xl p-6 bg-gradient-to-br from-purple-50 to-white">
              <div className="flex items-center space-x-2 mb-4">
                <Bell className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900">Get Notified at Launch</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Be the first to know when ActiveMask becomes available. Get exclusive early bird offers!
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={handleNotifyMe}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 whitespace-nowrap"
                >
                  {loading ? 'Subscribing...' : 'Notify Me'}
                </button>
              </div>
            </div>

            {/* Revolutionary Features */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Revolutionary Features</h3>
              <ul className="space-y-3">
                {product.features.slice(0, 5).map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="mt-16 grid lg:grid-cols-2 gap-8">
          {/* All Features */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Feature Set</h2>
            <ul className="space-y-3">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Upcoming Specs */}
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 shadow-lg border-2 border-purple-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Expected Specifications</h2>
            <dl className="space-y-4">
              {Object.entries(product.upcomingFeatures).map(([key, value]) => (
                <div key={key} className="border-b border-purple-100 pb-3">
                  <dt className="text-sm font-semibold text-gray-900 mb-1">{key}</dt>
                  <dd className="text-gray-600">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-8 text-center">How ActiveMask Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Active Filtration',
                desc: 'Electric fan draws air through HEPA H13 filters, removing 99.97% of particles'
              },
              {
                step: '2',
                title: 'Smart Monitoring',
                desc: 'Real-time sensors detect air quality and automatically adjust fan speed'
              },
              {
                step: '3',
                title: 'Connected App',
                desc: 'Track your air quality exposure, filter life, and health metrics via smartphone'
              }
            ].map((item, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="w-16 h-16 bg-white text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-purple-100">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Wait for ActiveMask */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Wait for ActiveMask?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Advanced Tech', desc: 'First smart mask with AI-powered air monitoring' },
              { title: 'Superior Comfort', desc: 'Active airflow reduces breathing resistance' },
              { title: 'Long Battery', desc: '8-hour runtime for all-day protection' },
              { title: 'Eco-Friendly', desc: 'Replaceable filters reduce waste' }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition border-2 border-purple-100">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Be Among the First to Experience ActiveMask
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join our exclusive waitlist and get early access to pre-orders with special launch pricing.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/50"
            />
            <button
              onClick={handleNotifyMe}
              disabled={loading}
              className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? 'Subscribing...' : 'Join Waitlist'}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}