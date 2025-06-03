/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    fontLoaders: [
      {
        loader: '@next/font/google',
        options: { timeout: 30000 }, // Increased timeout to 30 seconds
      },
    ],
  },
  webpack: (config, { isServer }) => {
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;