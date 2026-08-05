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
      // Keyword-set discipline (Wave 4, doc 20 §8.2): the permutable leaf keyword set is
      // now just lead-management + lead-scoring. sales-crm is DEMOTED and sales-automation
      // PRUNED (both junk-prone commodity terms); their leaves + the near-synonyms 301 to
      // the industry×city HUB, which carries the CRM/automation angle as H2 variants.
      // lead-tracking / lead-management-software fold into lead-management. Moves indexed
      // URLs + link equity over with no redirect chains.
      { source: "/:industry/:city/sales-crm", destination: "/:industry/:city", permanent: true },
      { source: "/:industry/:city/sales-automation", destination: "/:industry/:city", permanent: true },
      { source: "/:industry/:city/crm-software", destination: "/:industry/:city", permanent: true },
      { source: "/:industry/:city/sales-software", destination: "/:industry/:city", permanent: true },
      { source: "/:industry/:city/lead-tracking", destination: "/:industry/:city/lead-management", permanent: true },
      { source: "/:industry/:city/lead-management-software", destination: "/:industry/:city/lead-management", permanent: true },
      // Retired: /glossary/unassigned-queue described a product surface that does
      // not exist (a manager dashboard with one-click bulk assign). The concept it
      // gestured at belongs under assignment rules, which is now honest about
      // Leadkaun not implementing them.
      { source: "/glossary/unassigned-queue", destination: "/glossary/assignment-rules", permanent: true },
    ]
  },
};

export default nextConfig;
