'use client';

import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function BlogPage() {
  const blogs = [
    {
      id: 'best-mask-for-delhi-pollution-2026',
      title: 'Best Mask for Delhi Air Pollution in 2026',
      excerpt: 'A comprehensive guide to choosing the right pollution mask for Delhi winters. Compare disposable vs reusable masks and learn what features matter most.',
      image: '/images/delhi-pollution.png',
      category: 'Health & Wellness',
      date: 'December 27, 2025',
      readTime: '8 min read',
      tags: ['Delhi Pollution', 'N95 Masks', 'Air Quality']
    },
    // Add more blog posts here
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">AirOxe Blog</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Expert insights on air quality, pollution protection, and healthy living in Indian cities
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Blog Image */}
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
                <img src={blog.image} alt="Best Mask for Delhi Air Pollution in 2026" />
                  {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:scale-110 transition-transform duration-500" /> */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-semibold rounded-full">
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* Blog Content */}
                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition line-clamp-2">
                    {blog.title}
                  </h2>
                  
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {blog.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{blog.date}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{blog.readTime}</span>
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Read More */}
                  <div className="flex items-center space-x-2 text-blue-600 font-semibold group-hover:space-x-3 transition-all">
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}