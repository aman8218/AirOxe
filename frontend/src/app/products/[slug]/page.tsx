'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Loader2, 
  ShoppingCart, 
  CheckCircle, 
  ArrowLeft,
  Package,
  Truck,
  Shield,
  Star,
  Plus,
  Minus
} from 'lucide-react';

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

// Skeleton Component
function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-8" />
      
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image Skeleton */}
        <div className="space-y-6">
          <div className="aspect-square bg-gray-200 rounded-3xl animate-pulse" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>

        {/* Info Skeleton */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="h-6 w-32 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-1/4 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-12 w-48 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="border-t border-b py-6 space-y-4">
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            <div className="flex gap-4">
              <div className="h-14 flex-1 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-14 flex-1 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>

          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 w-full bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [email, setEmail] = useState('');
  const [notifyLoading, setNotifyLoading] = useState(false);

  useEffect(() => {
    if (params.slug) {
      fetchProduct(params.slug as string);
    }
  }, [params.slug]);

  useEffect(() => {
    loadCartQuantity();

    const handleCartUpdate = () => {
      loadCartQuantity();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [product]);

  const fetchProduct = async (slug: string) => {
    try {
      const { data } = await api.get(`/products/${slug}`);
      setProduct(data.data.product);
    } catch (error: any) {
      toast.error('Product not found');
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const loadCartQuantity = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.productId === product._id);
    setCartQuantity(existingItem ? existingItem.qty : 0);
  };

  const addToCart = () => {
    if (!product) return;

    setAddingToCart(true);
    
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      const existingItemIndex = cart.findIndex(
        (item: any) => item.productId === product._id
      );

      if (existingItemIndex > -1) {
        cart[existingItemIndex].qty += quantity;
      } else {
        cart.push({
          productId: product._id,
          name: product.name,
          price: product.price || 0,
          qty: quantity,
          image: product.images?.[0]?.url || product.imageUrl,
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const updateCartQuantity = (delta: number) => {
    if (!product) return;

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

  const handleNotifyMe = async () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    
    setNotifyLoading(true);

    try {
      await api.post('/leads/create', { name: 'Product Notification', email });
      toast.success('Thanks! We\'ll notify you when this product is available.');
      setEmail('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setNotifyLoading(false);
    }
  };

  const handleBuyNow = () => {
    addToCart();
    setTimeout(() => router.push('/cart'), 500);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
          <ProductDetailSkeleton />
        </div>
      </>
    );
  }

  if (!product) {
    return null;
  }

  const displayImages = product.images && product.images.length > 0 
    ? product.images 
    : [{ url: product.imageUrl, alt: product.name, isPrimary: true }];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link 
          href="/products" 
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-xl">
              <Image
                src={displayImages[selectedImage].url}
                alt={displayImages[selectedImage].alt || product.name}
                width={600}
                height={600}
                className="object-contain w-full h-full p-8"
                priority
              />
            </div>

            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition border-2 ${
                      selectedImage === index
                        ? 'border-blue-500'
                        : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `${product.name} - ${index + 1}`}
                      width={150}
                      height={150}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                {product.status === 'available' ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                    In Stock
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                    Coming Soon
                  </span>
                )}
                {/* <div className="flex items-center space-x-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(0 reviews)</span>
                </div> */}
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              {product.category && (
                <p className="text-gray-500 mb-4">{product.category}</p>
              )}
              
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {product.description}
              </p>
              
              {product.price && (
                <div className="flex items-baseline space-x-3 mb-6">
                  <span className="text-4xl font-bold text-blue-600">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      ₹{product.compareAtPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Quantity & Actions - Available Product */}
            {product.status === 'available' && product.price && (
              <div className="border-t border-b py-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {cartQuantity > 0 ? (
                    <div className="flex-1 flex items-center border-2 border-blue-500 bg-blue-500 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateCartQuantity(-1)}
                        className="p-4 text-white hover:bg-blue-600 transition-colors"
                        title="Decrease quantity"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <div className="flex-1 text-center">
                        <div className="text-white font-semibold text-lg">{cartQuantity}</div>
                        <div className="text-white text-xs opacity-90">In Cart</div>
                      </div>
                      <button
                        onClick={() => updateCartQuantity(1)}
                        className="p-4 text-white hover:bg-blue-600 transition-colors"
                        title="Increase quantity"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={addToCart}
                      disabled={addingToCart}
                      className="flex-1 py-4 bg-white border-2 border-blue-500 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </button>
                  )}
                  <button
                    onClick={handleBuyNow}
                    disabled={addingToCart}
                    className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}

            {/* Notify Me Form - Coming Soon Product */}
            {product.status === 'coming-soon' && (
              <div className="border-t border-b py-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Notified When Available</h3>
                  <p className="text-sm text-gray-600 mb-4">Be the first to know when this product launches!</p>
                </div>
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
                    disabled={notifyLoading}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 whitespace-nowrap"
                  >
                    {notifyLoading ? 'Subscribing...' : 'Notify Me'}
                  </button>
                </div>
              </div>
            )}

            {/* Key Features Preview */}
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

            {/* Benefits Icons */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                <p className="text-xs text-gray-500">On all orders</p>
              </div>
              <div className="text-center">
                <Truck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Fast Delivery</p>
                <p className="text-xs text-gray-500">2-3 days</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Quality Assured</p>
                <p className="text-xs text-gray-500">Premium materials</p>
              </div>
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
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
              <dl className="space-y-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="border-b pb-3 last:border-0">
                    <dt className="text-sm font-semibold text-gray-900 mb-1">{key}</dt>
                    <dd className="text-gray-600">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {/* Customer Reviews - Only for Available Products */}
        {product.status === 'available' && (
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">What Our Customers Say</h2>
              <div className="flex items-center justify-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600">4.8 out of 5 (Based on 127 reviews)</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Priya Sharma",
                  location: "Delhi",
                  rating: 5,
                  date: "2 weeks ago",
                  review: "Absolutely love this mask! Perfect for my daily commute in Delhi. The air quality has been terrible lately and this mask really helps. Very comfortable even for long hours.",
                  verified: true
                },
                {
                  name: "Rahul Kumar",
                  location: "Gurgaon",
                  rating: 5,
                  date: "1 month ago",
                  review: "Best purchase for pollution protection! I ride a bike to office everyday and this mask is a game changer. Breathable and fits perfectly. Highly recommend for two-wheeler riders.",
                  verified: true
                },
                {
                  name: "Anjali Mehta",
                  location: "Noida",
                  rating: 4,
                  date: "3 weeks ago",
                  review: "Great quality mask. My husband and I both use it during our morning walks. The 5-layer protection gives us peace of mind. Only wish they had more color options!",
                  verified: true
                },
                {
                  name: "Vikram Singh",
                  location: "Mumbai",
                  rating: 5,
                  date: "2 weeks ago",
                  review: "Excellent product! Much better than disposable masks. Washable and reusable - good for the environment too. The fit is snug but comfortable. Worth every rupee.",
                  verified: true
                },
                {
                  name: "Sneha Patel",
                  location: "Bangalore",
                  rating: 5,
                  date: "1 week ago",
                  review: "Finally found a mask that doesn't fog up my glasses! Very impressed with the quality. I travel frequently for work and this has become my essential companion.",
                  verified: true
                },
                {
                  name: "Amit Verma",
                  location: "Delhi NCR",
                  rating: 4,
                  date: "4 weeks ago",
                  review: "Good mask for daily use. The adjustable straps are very helpful. Been using it for a month now and still in great condition. Delivery was quick too!",
                  verified: true
                }
              ].map((review, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{review.name}</p>
                        <p className="text-sm text-gray-500">{review.location}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    "{review.review}"
                  </p>

                  {review.verified && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">Verified Purchase</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}