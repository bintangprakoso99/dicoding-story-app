/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['story-api.dicoding.dev'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'story-api.dicoding.dev',
        port: '',
        pathname: '/images/**',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
