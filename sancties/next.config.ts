import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/index",
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
