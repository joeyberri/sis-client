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

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*'
      },
      {
        source: '/me',
        destination: 'http://localhost:3001/me'
      },
      {
        source: '/notifications/:path*',
        destination: 'http://localhost:3001/notifications/:path*'
      },
      {
        source: '/students/:path*',
        destination: 'http://localhost:3001/students/:path*'
      },
      {
        source: '/teachers/:path*',
        destination: 'http://localhost:3001/teachers/:path*'
      },
      {
        source: '/classes/:path*',
        destination: 'http://localhost:3001/classes/:path*'
      },
      {
        source: '/users/:path*',
        destination: 'http://localhost:3001/users/:path*'
      },
      {
        source: '/tenants/:path*',
        destination: 'http://localhost:3001/tenants/:path*'
      },
      {
        source: '/assessments/:path*',
        destination: 'http://localhost:3001/assessments/:path*'
      },
      {
        source: '/attendance/:path*',
        destination: 'http://localhost:3001/attendance/:path*'
      },
      {
        source: '/grading/:path*',
        destination: 'http://localhost:3001/grading/:path*'
      },
      {
        source: '/fees/:path*',
        destination: 'http://localhost:3001/fees/:path*'
      },
      {
        source: '/reports/:path*',
        destination: 'http://localhost:3001/reports/:path*'
      },
      {
        source: '/analytics/:path*',
        destination: 'http://localhost:3001/analytics/:path*'
      },
      {
        source: '/calendar/:path*',
        destination: 'http://localhost:3001/calendar/:path*'
      },
      {
        source: '/events/:path*',
        destination: 'http://localhost:3001/events/:path*'
      },
      {
        source: '/messaging/:path*',
        destination: 'http://localhost:3001/messaging/:path*'
      },
      {
        source: '/storage/:path*',
        destination: 'http://localhost:3001/storage/:path*'
      },
      {
        source: '/onboarding/:path*',
        destination: 'http://localhost:3001/onboarding/:path*'
      }
    ];
  },

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
