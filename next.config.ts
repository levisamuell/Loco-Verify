import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["prisma", "bcrypt"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "t4.ftcdn.net",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  transpilePackages: [],
};

export default nextConfig;
