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
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true,
  },
  
  // Remove swcMinify - it's no longer needed in Next.js 16+
  // swcMinify is now enabled by default
  output: 'standalone',
  trailingSlash: false,
  reactStrictMode: true,
  
  /* config options here */
  experimental: {
    // If you're using Turbopack
  },
};

export default nextConfig;