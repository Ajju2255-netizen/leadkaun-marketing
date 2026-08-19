"use client"

import { useEffect } from "react"

/**
 * First-touch acquisition capture — client side.
 *
 * This was originally a `proxy.ts` (Next 16's rename of middleware), which is
 * the natural home for it. That does not work on this stack, and the
 * incompatibility is hard on both ends: Next 16 compiles proxy to the Node.js
 * runtime and REFUSES `runtime: "edge"` ("Proxy does not support Edge
 * runtime"), while @opennextjs/cloudflare rejects Node middleware outright
 * ("Node.js middleware is not currently supported"). There is no runtime both
 * accept, so the capture runs in the browser instead.
 *
 * The tradeoff is that these cookies cannot be httpOnly — they are written by
 * document.cookie. They carry no personal data (a source name and a landing
 * path), and the product still reads them server-side at signup, so the
 * attribution chain is unchanged. See leadkaun/app/(auth)/register/actions.ts.
 *
 * First touch wins: once lk_first_seen exists nothing is overwritten.
 */

const MAX_AGE = 60 * 60 * 24 * 90

const SEARCH: [string, string][] = [
  ["google.", "google"], ["bing.com", "bing"], ["duckduckgo.com", "duckduckgo"],
  ["search.yahoo.", "yahoo"], ["yandex.", "yandex"], ["ecosia.org", "ecosia"],
  ["search.brave.com", "brave"], ["baidu.com", "baidu"], ["naver.com", "naver"],
]
const AI: [string, string][] = [
  ["chatgpt.com", "chatgpt"], ["chat.openai.com", "chatgpt"], ["perplexity.ai", "perplexity"],
  ["claude.ai", "claude"], ["gemini.google.com", "gemini"], ["copilot.microsoft.com", "copilot"],
]

function classify(): { source: string; medium: string; campaign: string } {
  const qp = new URLSearchParams(window.location.search)
  const landing = window.location.pathname

  const utm = qp.get("utm_source")?.trim()
  if (utm) {
    return {
      source: utm,
      medium: qp.get("utm_medium")?.trim() || "unknown",
      campaign: qp.get("utm_campaign")?.trim() || landing,
    }
  }
  if (qp.get("gclid")) return { source: "google", medium: "cpc", campaign: landing }
  if (qp.get("fbclid")) return { source: "facebook", medium: "paid-social", campaign: landing }
  if (qp.get("msclkid")) return { source: "bing", medium: "cpc", campaign: landing }

  const ref = document.referrer
  if (ref) {
    let host = ""
    try { host = new URL(ref).hostname.toLowerCase() } catch { host = "" }
    if (host && !host.endsWith("leadkaun.com") && host !== "localhost") {
      for (const [f, n] of AI) if (host.includes(f)) return { source: n, medium: "ai", campaign: landing }
      for (const [f, n] of SEARCH) if (host.includes(f)) return { source: n, medium: "organic", campaign: landing }
      return { source: host, medium: "referral", campaign: landing }
    }
  }
  return { source: "direct", medium: "none", campaign: landing }
}

export function Attribution() {
  useEffect(() => {
    try {
      if (document.cookie.includes("lk_first_seen=")) return

      const host = window.location.hostname
      const isLocal = host === "localhost" || host === "127.0.0.1"
      // Root domain so app.leadkaun.com can read it at signup.
      const domain = isLocal ? "" : "; domain=.leadkaun.com"
      const secure = isLocal ? "" : "; secure"
      const set = (k: string, v: string) => {
        document.cookie = `${k}=${encodeURIComponent(v)}; max-age=${MAX_AGE}; path=/; samesite=lax${domain}${secure}`
      }

      const { source, medium, campaign } = classify()
      // Read by the product at signup — do not rename without changing
      // leadkaun/app/(auth)/register/actions.ts.
      set("utm_source", source)
      set("utm_campaign", campaign)
      set("lk_medium", medium)
      set("lk_landing", window.location.pathname)
      set("lk_referrer", document.referrer.slice(0, 512))
      set("lk_first_seen", new Date().toISOString())
    } catch {
      /* attribution must never break the page */
    }
  }, [])

  return null
}
