/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, 
  },
  ...(isDev ? {} : {
    output: 'export',
    basePath: '/ps-labs',
    assetPrefix: '/ps-labs',
  }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;