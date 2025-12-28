'use client';

import { notFound } from 'next/navigation';
import DelhiPollutionBlog from './delhi-pollution-blog';

export default function BlogPost({ params }: { params: { slug: string } }) {
  // Map slugs to blog components
  const blogs: Record<string, React.ComponentType> = {
    'best-mask-for-delhi-pollution-2026': DelhiPollutionBlog,
    // Add more blogs here as you create them
  };

  const BlogComponent = blogs[params.slug];

  if (!BlogComponent) {
    notFound();
  }

  return <BlogComponent />;
}