import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'user20359.na.imgto.link',
        port: '',
        pathname: '/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Add localhost for development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
    // Configure image formats
    formats: ['image/avif', 'image/webp'],
    // Set device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Important for Vercel
    unoptimized: true,  // ← Add this for Vercel
  },
  
  // Important for Vercel deployment
  output: 'standalone',  // ← Add this
  trailingSlash: false,
  reactStrictMode: true,
  swcMinify: true,
  
  /* config options here */
  experimental: {
    // If you're using Turbopack
  },
};

export default nextConfig;