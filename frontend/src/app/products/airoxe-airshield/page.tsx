'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, CheckCircle, ShoppingCart, ArrowLeft, Star } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AirShieldPage() {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const product = {
    id: 'airshield-001',
    name: 'AirOxe AirShield',
    price: 499,
    description: 'Premium N95 mask with advanced 5-layer filtration system designed for maximum protection against air pollution and harmful particles.',
    features: [
      'N95 certified protection (95% filtration efficiency)',
      '5-layer advanced filtration system',
      'Comfortable adjustable ear loops and nose clip',
      'Reusable and washable design',
      'Anti-fog technology for clear vision',
      'Lightweight breathable material',
      'Suitable for daily use in polluted environments',
      'One size fits most adults'
    ],
    specifications: {
      'Filtration Efficiency': '≥95% (0.3 micron particles)',
      'Material': 'Non-woven fabric, Melt-blown fabric',
      'Layers': '5-layer protection',
      'Certification': 'N95 Standard',
      'Reusability': 'Up to 20 washes',
      'Package Contents': '1 mask per pack'
    }
  };

  const handleAddToCart = () => {
    setLoading(true);
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.productId === product.id);

    if (existingItem) {
      existingItem.qty += quantity;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        qty: quantity,
        imageUrl: '/images/airshield.jpg'
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Dispatch custom event to update cart count in navbar
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast.success('Added to cart!');
    setLoading(false);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => router.push('/checkout'), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link href="/products" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-6">
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl flex items-center justify-center shadow-xl">
              <Shield className="w-64 h-64 text-blue-600" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="aspect-square bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 transition">
                  <Shield className="w-12 h-12 text-blue-600" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                  In Stock
                </span>
                <div className="flex items-center space-x-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  <span className="text-sm text-gray-600 ml-2">(128 reviews)</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {product.description}
              </p>
              <div className="text-4xl font-bold text-blue-600 mb-6">
                ₹{product.price}
                <span className="text-lg text-gray-500 font-normal ml-2">per mask</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="border-t border-b py-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 transition font-semibold"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 transition font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={loading}
                  className="flex-1 py-4 bg-white border-2 border-blue-500 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={loading}
                  className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features</h3>
              <ul className="space-y-3">
                {product.features.slice(0, 5).map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
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
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Features</h2>
            <ul className="space-y-3">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
            <dl className="space-y-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="border-b pb-3">
                  <dt className="text-sm font-semibold text-gray-900 mb-1">{key}</dt>
                  <dd className="text-gray-600">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Care Instructions */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Care Instructions</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-3">Washing:</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Hand wash with mild detergent</li>
                <li>Do not use bleach or harsh chemicals</li>
                <li>Rinse thoroughly with clean water</li>
                <li>Air dry completely before next use</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Storage:</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Store in a clean, dry place</li>
                <li>Keep away from direct sunlight</li>
                <li>Avoid extreme temperatures</li>
                <li>Replace after 20 washes or if damaged</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
          <div className="space-y-6">
            {[
              { name: 'Rahul S.', rating: 5, comment: 'Excellent quality mask! Very comfortable for daily use and provides great protection.' },
              { name: 'Priya M.', rating: 5, comment: 'Worth every penny. The fit is perfect and it doesn\'t fog up my glasses.' },
              { name: 'Amit K.', rating: 4, comment: 'Good product. Using it for my daily commute. Feels secure and breathable.' }
            ].map((review, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{review.name}</h4>
                  <div className="flex items-center space-x-1">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}