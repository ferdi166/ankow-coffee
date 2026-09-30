import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  devIndicators: false,
  images: {
    domains: ["https://hvuybhxdburaiytcisus.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hvuybhxdburaiytcisus.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
