import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ISR mode — NOT static export. Cloudflare Pages handles revalidation via edge cache.
  // Removed: output: 'export'
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    unoptimized: true, // Cloudflare handles image optimization at the CDN layer
  },
};

export default nextConfig;
