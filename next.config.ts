import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // 1. Abaikan error TypeScript saat build
  typescript: {
    ignoreBuildErrors: true,
  },
  // 2. Abaikan error ESLint (any, unused vars, dll) saat build
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;