/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable Dynamic IO for improved performance
    dynamicIO: true,
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
