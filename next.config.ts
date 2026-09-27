import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Listing photos are hot-linked from source sites. Allow any https host.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    // Vercel's free image-optimization quota (a fixed number of distinct
    // source images per month) doesn't scale with a live, ever-changing
    // catalogue of hundreds of hot-linked photos — it was hit and every
    // photo on the site started failing with 402. Serve the source images
    // as-is instead of transforming them: no quota, no resizing/webp step.
    unoptimized: true,
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
