import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ISR mode — NOT static export. Cloudflare Pages handles revalidation via edge cache.
  // Removed: output: 'export'
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    unoptimized: true, // Cloudflare handles image optimization at the CDN layer
  },
  // Canonicalise www → apex (avoids duplicate-content; both are Worker custom domains).
  // Two rules: explicit root + ":path+" (one-or-more) — avoids the empty-catch-all
  // bug where "/:path*" leaves a literal ":path*" in the root redirect target.
  async redirects() {
    const hasWww = [{ type: "host" as const, value: "www.leadkaun.com" }]
    return [
      { source: "/", has: hasWww, destination: "https://leadkaun.com/", permanent: true },
      { source: "/:path+", has: hasWww, destination: "https://leadkaun.com/:path+", permanent: true },
    ]
  },
};

export default nextConfig;
