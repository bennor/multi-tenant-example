/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable useCache feature without requiring dynamicIO
    useCache: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
