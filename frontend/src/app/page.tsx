'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Wind, Shield, Heart, CheckCircle, ArrowRight, Sparkles, Leaf, Star, Plane, Users, Bike, Mountain, Activity, Droplets, Plus, Minus } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ProductImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  status: 'available' | 'coming-soon';
  price?: number;
  compareAtPrice?: number;
  category?: string;
  tags?: string[];
  images: ProductImage[];
  imageUrl: string;
  features: string[];
  specifications?: Record<string, string>;
}

// Product Card Skeleton
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
          <div className="h-10 w-10 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [cartQuantities, setCartQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetchProducts();
    loadCartQuantities();

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
      setProductsLoading(false);
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

  const handleWaitlist = async () => {
    if (!email) return;
    setLoading(true);

    try {
      await api.post('/leads/create', { name: 'Waitlist User', email });
      toast.success('Successfully joined the waitlist!');
      setEmail('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to join waitlist');
    } finally {
      setLoading(false);
    }
  };

  const useCases = [
    {
      icon: Plane,
      title: 'Travel',
      description: 'Stay protected during flights and journeys',
      color: 'from-sky-400 to-blue-500'
    },
    {
      icon: Droplets,
      title: 'Poor Air Quality',
      description: 'Combat pollution in high AQI areas',
      color: 'from-purple-400 to-violet-500'
    },
    {
      icon: Bike,
      title: '2 Wheelers',
      description: 'Essential protection for daily commuters',
      color: 'from-orange-400 to-red-500'
    },
    {
      icon: Mountain,
      title: 'Outdoor',
      description: 'Stay safe during outdoor activities',
      color: 'from-amber-400 to-yellow-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-blue-50 opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-[slideUp_0.8s_ease-out]">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Breathe Pure. Live Better.</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Clean Air.
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Smart Living.
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Introducing AirOxe — premium reusable anti-pollution masks designed for Indian cities.
                Built for comfort, style, and everyday protection.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-xl transition transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold border-2 border-gray-200 hover:border-blue-500 transition"
                >
                  Learn More
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Multi-Layer Protection</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                  <Leaf className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">Reusable & Eco-Friendly</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                  <CheckCircle className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">Made for India</span>
                </div>
              </div>
            </div>
            <div className="relative animate-[float_3s_ease-in-out_infinite]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-20" />
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                  <img src="./images/AirOxe_AirShield_Mask.png" alt="best anti pollution mask" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '5-Layer', label: 'Filtration System' },
              { value: '100%', label: 'Reusable Design' },
              { value: 'Urban Use', label: 'Designed For' },
              { value: 'All-Day', label: 'Comfort Fit' },
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-2 animate-[fadeIn_0.5s_ease-in] hover:scale-110 transition">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Needs AirOxe - Use Cases */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Perfect For Everyone
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you're traveling, commuting, or simply prioritizing your health
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
            {useCases.map((useCase, i) => (
              <div
                key={i}
                className="group flex flex-col items-center text-center space-y-3 p-4 rounded-xl hover:scale-110 transition cursor-pointer"
              >
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${useCase.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <useCase.icon className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm  transition">
                    {useCase.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {useCase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section - Now Dynamic */}
      <section id="products" className="py-12 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-4xl font-bold text-gray-900">Our Products</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Engineered for excellence. Designed for your wellbeing.
            </p>
          </div>

          {productsLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
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

          {!productsLoading && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Why AirOxe Section */}
      <section id="why" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-4xl font-bold text-gray-900">Why Choose AirOxe?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Technology meets trust. Your health, our priority.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Protection',
                desc: 'Thoughtfully designed masks focused on comfort, breathability, and urban air challenges',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: Leaf,
                title: 'Eco-Friendly',
                desc: 'Reusable design reducing environmental impact',
                color: 'from-green-500 to-green-600'
              },
              {
                icon: Heart,
                title: 'Health First',
                desc: 'Designed with your wellbeing as our top priority',
                color: 'from-red-500 to-red-600'
              }
            ].map((item, i) => (
              <div key={i} className="group bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Form */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Join the Clean Air Movement</h2>
          <p className="text-xl mb-12 opacity-90">
            Be the first to know about new products, exclusive offers, and air quality tips.
          </p>

          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/50"
              />
              <button
                onClick={handleWaitlist}
                disabled={loading}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? 'Joining...' : 'Join Waitlist'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12 text-gray-600 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Air Pollution Protection for Delhi & NCR
        </h2>
        <p>
          Delhi regularly records some of the highest AQI levels in the world.
          AirOxe masks are designed to help urban commuters, riders, travelers,
          and health-conscious users reduce daily exposure to dust, smoke,
          and polluted air.
        </p>

        <p className="text-xs text-gray-500 text-center mt-8">
          AirOxe products are designed for lifestyle and pollution protection.
          Not intended for medical or clinical use.
        </p>
      </section>

      <Footer />
    </div>
  );
}