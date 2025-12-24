'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Plus, Minus } from 'lucide-react';
import { Product } from '@/types';
import { ArrowLeft } from 'lucide-react';

// Skeleton Component
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <div className="h-5 bg-gray-200 rounded w-20" />
            <div className="h-4 bg-gray-200 rounded w-16" />
          </div>
          <div className="h-10 w-10 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartQuantities, setCartQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetchProducts();
    loadCartQuantities();

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCartQuantities();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data.data.products);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadCartQuantities = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const quantities: { [key: string]: number } = {};
    cart.forEach((item: any) => {
      quantities[item.productId] = item.qty;
    });
    setCartQuantities(quantities);
  };

  const addToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.productId === product._id);

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price || 0,
        qty: 1,
        image: product.images?.[0]?.url || product.imageUrl,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success('Added to cart!');
  };

  const updateQuantity = (product: Product, delta: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.productId === product._id);

    if (existingItem) {
      existingItem.qty += delta;

      if (existingItem.qty <= 0) {
        // Remove item from cart
        const updatedCart = cart.filter((item: any) => item.productId !== product._id);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        toast.success('Removed from cart');
      } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        toast.success(delta > 0 ? 'Quantity increased' : 'Quantity decreased');
      }

      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
          href="/" 
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Products
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Premium air-quality solutions designed for your wellbeing
            </p>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
                    <Image
                      src={product.images?.[0]?.url || product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      {product.status === 'available' ? (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                          Available
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition">
                      {product.name}
                    </h3>
                    
                    {product.category && (
                      <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                    )}

                    {/* Price and Add to Cart */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {product.price ? (
                          <>
                            <span className="text-xl font-bold text-gray-900">
                              ₹{product.price.toLocaleString()}
                            </span>
                            {product.compareAtPrice && (
                              <span className="text-sm text-gray-400 line-through">
                                ₹{product.compareAtPrice.toLocaleString()}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">Price on request</span>
                        )}
                      </div>

                      {product.status === 'available' && product.price && (
                        <>
                          {cartQuantities[product._id] ? (
                            <div className="flex items-center border-2 border-blue-500 bg-blue-500 rounded-lg overflow-hidden">
                              <button
                                onClick={(e) => updateQuantity(product, -1, e)}
                                className="p-2 text-white hover:bg-blue-600 transition-colors"
                                title="Decrease quantity"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-3 font-semibold text-white">
                                {cartQuantities[product._id]}
                              </span>
                              <button
                                onClick={(e) => updateQuantity(product, 1, e)}
                                className="p-2 text-white hover:bg-blue-600 transition-colors"
                                title="Increase quantity"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => addToCart(product, e)}
                              className="px-4 py-2.5 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-200 font-semibold"
                              title="Add to cart"
                            >
                              ADD
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">No products available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}