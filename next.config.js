/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: {}, // Corrected to an object
    },
    serverExternalPackages: ['mongoose'], // Moved to the root level
    images: {
      domains: ['m.media-amazon.com'],
    },
  };
  
  module.exports = nextConfig;