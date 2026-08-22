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
      // Add more hosts if needed
      // {
      //   protocol: 'https',
      //   hostname: 'your-other-image-host.com',
      //   port: '',
      //   pathname: '/**',
      // },
    ],
    // Optional: Configure image formats
    formats: ['image/avif', 'image/webp'],
    // Optional: Set device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  /* config options here */
  experimental: {
    // If you're using Turbopack
  },
};

export default nextConfig;