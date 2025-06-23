/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  output: 'export',
  basePath: isDev ? '' : '/ps-labs',
  assetPrefix: isDev ? '' : '/ps-labs',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig