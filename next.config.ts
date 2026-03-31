// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dcsiypscn/**",
      },
      // অন্যান্য trusted host যেমন S3, আপনার server, ইত্যাদি
      // example.com বাদ দিন, SSL invalid হলে 500 error হবে
    ],
  },
};

export default nextConfig;