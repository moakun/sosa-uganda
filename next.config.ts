import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d21ulo4r1z07kx.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;