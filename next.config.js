/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/PS_Labs',
  assetPrefix: '/PS_Labs/',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig