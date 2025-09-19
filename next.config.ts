import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "notehub-api.goit.study",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com", 
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", 
      },
    ],
  },
};

export default nextConfig;

