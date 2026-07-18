import { getAllPosts } from "@/lib/blog"

const SITE = "https://leadkaun.com"

export const revalidate = 3600 // refresh hourly

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

/**
 * Blog RSS 2.0 feed at /feed.xml — a freshness/discovery signal the site lacked.
 * Referenced from the root layout <head> via alternates.
 */
export async function GET() {
  const posts = getAllPosts().slice(0, 50)

  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.updated ?? p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.description)}</description>
    </item>`,
    )
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Leadkaun Blog</title>
    <link>${SITE}/blog</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Sales-behaviour, lead management and rupee-first analytics for Indian B2B sales teams — from the Leadkaun team.</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date(posts[0]?.updated ?? posts[0]?.date ?? Date.now()).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
