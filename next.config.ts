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
      // Dedup: `education` overlapped `edtech`. Consolidated onto `edtech`; 301 any
      // legacy /education/* + /use-cases/education so equity + indexed URLs move over.
      { source: "/education/:path*", destination: "/edtech/:path*", permanent: true },
      { source: "/use-cases/education", destination: "/use-cases/edtech", permanent: true },
      // Keyword consolidation: 6 near-synonym keyword slugs collapsed to 4 distinct
      // intents to kill keyword cannibalisation. 301 the retired slugs to their
      // canonical so any indexed URLs + link equity move over.
      { source: "/:industry/:city/crm-software", destination: "/:industry/:city/sales-crm", permanent: true },
      { source: "/:industry/:city/sales-software", destination: "/:industry/:city/sales-crm", permanent: true },
      { source: "/:industry/:city/lead-tracking", destination: "/:industry/:city/lead-management", permanent: true },
      { source: "/:industry/:city/lead-management-software", destination: "/:industry/:city/lead-management", permanent: true },
    ]
  },
};

export default nextConfig;
