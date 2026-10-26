import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },
  async redirects() {
    return [{ source: "/wishlist", destination: "/shop", permanent: true }];
  },
};

export default nextConfig;
