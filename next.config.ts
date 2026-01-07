import type { NextConfig } from 'next';

// Define the base Next.js configuration
const baseConfig: NextConfig = {
  reactStrictMode: true,

  // Compiler optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn']
          }
        : false
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      }
    ]
  },

  // Experimental features for performance
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      '@clerk/nextjs',
      'recharts'
    ]
  },

  transpilePackages: ['geist'],

  // Production source maps (disable for faster builds)
  productionBrowserSourceMaps: false,

  // Reduce build output
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5
  }
};

let configWithPlugins = baseConfig;

// Disable Sentry for now - needs to be configured properly
const nextConfig = configWithPlugins;
export default nextConfig;
