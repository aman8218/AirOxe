import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://airoxe.in',
      lastModified: new Date(),
    },
  ];
}
