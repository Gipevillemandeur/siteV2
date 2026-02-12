import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'out',
  basePath: '/siteV2',
  assetPrefix: '/siteV2',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
