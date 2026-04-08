// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dcsiypscn/**",
      }, {
        protocol: "https",
        hostname: "example.com",
        pathname: "/**",
      },
       {
        protocol: "https",
        hostname: "google.comd",
        pathname: "/**",
      },
      {
          protocol: "https",
        hostname: "images.unsplash.com",
      }
    ],
  },
  // Suppress ECONNREFUSED errors during build when backend is not running
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  // Suppress specific warnings during build
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },

};

export default nextConfig;