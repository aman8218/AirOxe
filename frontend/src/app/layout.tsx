import type { Metadata } from 'next';
import './global.css';
import { AuthProvider } from '@/lib/authContext';
import { Toaster } from 'sonner';
import SessionProvider from '@/components/SessionProvider';

export const metadata = {
  title: "AirOxe | Clean Air. Smart Living.",
  description:
    "AirOxe offers premium reusable anti-pollution masks designed for Indian cities. Built for comfort, breathability, and everyday protection from urban air pollution.",
  keywords: [
    "AirOxe",
    "about AirOxe",
    "anti pollution mask India",
    "Delhi air pollution mask",
    "reusable pollution mask",
    "clean air startup India",
    "air quality protection",
    "best anti air pollution mask",
    "urban lifestyle mask",
    "eco friendly pollution mask",
    "stylish air pollution mask",
    "pollution mask for daily use"
  ],
icons: {
    icon: [
      { url: '/images/AirOxeLogo.png', sizes: '64x64', type: 'image/png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/icons/apple-touch-icon.png',
    other: [
      { rel: 'android-chrome', url: '/icons/android-chrome-192x192.png', sizes: '192x192' },
      { rel: 'android-chrome', url: '/icons/android-chrome-512x512.png', sizes: '512x512' },
    ],
  },
  openGraph: {
    title: "AirOxe | Clean Air for Modern Living",
    description:
      "AirOxe is an Indian D2C brand focused on stylish, reusable anti-pollution products designed for daily urban life.",
    url: "https://airoxe.in/",
    siteName: "AirOxe",
    images: [
      {
        url: "https://airoxe.in/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "About AirOxe"
      }
    ],
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body>
        <SessionProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}