'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  slug: string;
  status: string;
}

export default function Footer() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data.data.products);
    } catch (error) {
      console.error('Failed to load products for footer');
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {/* <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg" /> */}
              <span className="text-xl font-bold">AirOxe</span>
            </div>
            <p className="text-gray-400 text-sm">Clean Air. Smart Living.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {products.length > 0 ? (
                products.map((product) => (
                  <li key={product._id}>
                    <Link 
                      href={`/products/${product.slug}`} 
                      className="hover:text-white transition"
                    >
                      {product.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link href="/products" className="hover:text-white transition">View All Products</Link></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/refund" className="hover:text-white transition">Refund Policy</Link></li>
              <li><Link href="/shippingpolicy" className="hover:text-white transition">Shipping Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>© 2025-26 AirOxe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}