import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  images: {
    qualities: [75, 85, 95],
    formats: ["image/avif", "image/webp"],
    localPatterns: [{ pathname: "/images/**" }],
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com", pathname: "/s/files/**" }],
  },
  async redirects() {
    return [{ source: "/wishlist", destination: "/shop", permanent: true }];
  },
};

export default nextConfig;
