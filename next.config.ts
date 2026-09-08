import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Listing photos are hot-linked from source sites. Allow any https host.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  eslint: {
    // Do not block production builds on lint issues.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
