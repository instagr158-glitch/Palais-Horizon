import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Listing photos are hot-linked from source sites. Allow any https host.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async rewrites() {
    // The home page is the buy-shares page (the URL stays "/").
    return { beforeFiles: [{ source: "/", destination: "/parts" }] };
  },
  async redirects() {
    // The buy-shares page used to live at /invest-miami.
    return [{ source: "/invest-miami", destination: "/parts", permanent: true }];
  },
  eslint: {
    // Do not block production builds on lint issues.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
