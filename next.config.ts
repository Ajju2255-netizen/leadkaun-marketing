import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ISR mode — NOT static export. Cloudflare Pages handles revalidation via edge cache.
  // Removed: output: 'export'
  // NOTE: `eslint: { ignoreDuringBuilds }` was removed — Next 16 dropped the key
  // and warned on every build. Linting is a separate step (`npm run lint`), which
  // now actually works; see eslint.config.mjs.
  typescript: { ignoreBuildErrors: true },
  images: {
    unoptimized: true, // Cloudflare handles image optimization at the CDN layer
  },
  // Canonicalise www → apex (avoids duplicate-content; both are Worker custom domains).
  // ":path+" is one-or-more — avoids the empty-catch-all bug where "/:path*" leaves a
  // literal ":path*" in the root redirect target.
  //
  // The www ROOT is deliberately NOT redirected. It used to 308 → apex, which meant
  // https://www.leadkaun.com returned a 0-byte body; any tool that inspects a URL
  // without following redirects saw no HTML at all. Meta's Event Setup Tool rejected
  // it outright ("URL is either invalid or missing the 'https' protocol") and its
  // pixel check reported no pixel, even though the apex has always carried one.
  //
  // Serving the homepage on www instead is safe here because every page emits an
  // absolute canonical to the apex (<link rel="canonical" href="https://leadkaun.com">),
  // so Google still consolidates onto leadkaun.com. Every other www path keeps its
  // redirect, now a 301 rather than a 308: 301 is the universally-followed permanent
  // redirect, while 308 is newer and some HTTP clients still do not follow it.
  async redirects() {
    const hasWww = [{ type: "host" as const, value: "www.leadkaun.com" }]
    return [
      { source: "/:path+", has: hasWww, destination: "https://leadkaun.com/:path+", statusCode: 301 },
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
