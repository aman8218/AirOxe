'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { signOut } from 'next-auth/react';
import { User, ShoppingCart, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const handleLogout = async () => {
    logout();
    await signOut({ redirect: false });
    window.location.href = '/';
  };

  // Update cart count
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalItems = cart.reduce((sum: number, item: any) => sum + item.qty, 0);
      setCartCount(totalItems);
    };

    // Initial load
    updateCartCount();

    // Listen for cart updates
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img src="/images/AirOxeLogo.png" className="h-32 md:h-32 w-auto object-contain"/>
          </Link>

          {/* Center Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Products
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Contact
            </Link>
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart - Always visible */}
            {cartCount > 0 ? (
              <Link 
                href="/cart" 
                className="relative p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5">
                  {cartCount}
                </span>
              </Link>
            ) : (
              <div className="relative p-2 cursor-not-allowed opacity-40">
                <ShoppingCart className="w-5 h-5 text-gray-400" />
              </div>
            )}

            {user ? (
              /* Logged In User */
              <div className="relative group">
                <button className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user.fullName}</span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  
                  {user.role === 'admin' && (
                    <Link 
                      href="/admin/dashboard" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      <span className="mr-2">⚙️</span>
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <Link 
                    href="/user/profile" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Link>
                  
                  <Link 
                    href="/user/orders" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    <span className="mr-2">📦</span>
                    My Orders
                  </Link>
                  
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <span className="mr-2">🚪</span>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Guest User - Sign In/Sign Up */
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition transform"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-200">
            <Link 
              href="/" 
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link 
              href="/contact" 
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            <div className="border-t border-gray-200 pt-2 mt-2">
              {user ? (
                <>
                  <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mb-2">
                    <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>

                  {user.role === 'admin' && (
                    <Link 
                      href="/admin/dashboard" 
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="mr-2">⚙️</span>
                      Admin Dashboard
                    </Link>
                  )}

                  <Link 
                    href="/user/profile" 
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Link>

                  <Link 
                    href="/user/orders" 
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-2">📦</span>
                    My Orders
                  </Link>

                  {cartCount > 0 ? (
                    <Link 
                      href="/cart" 
                      className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="flex items-center">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Cart
                      </span>
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                        {cartCount}
                      </span>
                    </Link>
                  ) : (
                    <div className="flex items-center px-4 py-2 text-gray-400 opacity-40 cursor-not-allowed">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      <span>Cart (Empty)</span>
                    </div>
                  )}

                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition mt-2"
                  >
                    <span className="mr-2">🚪</span>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {cartCount > 0 ? (
                    <Link 
                      href="/cart" 
                      className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition mb-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="flex items-center">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Cart
                      </span>
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                        {cartCount}
                      </span>
                    </Link>
                  ) : (
                    <div className="flex items-center px-4 py-2 text-gray-400 opacity-40 cursor-not-allowed mb-2">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      <span>Cart (Empty)</span>
                    </div>
                  )}

                  <Link 
                    href="/auth/login" 
                    className="block px-4 py-2 text-center text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300 rounded-lg transition mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="block px-4 py-2 text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}