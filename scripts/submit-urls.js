#!/usr/bin/env node

/**
 * URL submission to search engines.
 *
 * Submits URLs via:
 *   1. IndexNow — works for Bing, Yandex, Seznam, Naver. Fast, unlimited URLs/day.
 *   2. Google Indexing API — best-effort for general URLs (officially only
 *      JobPosting + BroadcastEvent; works for others with caveats).
 *
 * Usage:
 *   node scripts/submit-urls.js                         # submit top-priority URLs
 *   node scripts/submit-urls.js --all                   # submit every URL in sitemaps
 *   node scripts/submit-urls.js --urls=<url1,url2>      # submit specific URLs
 *   node scripts/submit-urls.js --protocol=indexnow     # only IndexNow (default)
 *   node scripts/submit-urls.js --protocol=all          # IndexNow + Google
 *
 * Setup:
 *   1. First run generates public/<INDEXNOW_KEY>.txt — commit + deploy so
 *      api.indexnow.org can validate your domain ownership.
 *   2. For Google Indexing API: set GOOGLE_APPLICATION_CREDENTIALS to a service
 *      account JSON key path. Service account must be added to your GSC
 *      property as Owner. Requires googleapis npm package (npm i googleapis).
 *
 * Env vars:
 *   NEXT_PUBLIC_SITE_URL              — defaults to https://leadkaun.com
 *   INDEXNOW_KEY                      — 32-char hex; auto-generated if missing
 *   GOOGLE_APPLICATION_CREDENTIALS    — path to service account JSON
 */

const fs = require("fs")
const path = require("path")
const crypto = require("crypto")
const https = require("https")

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://leadkaun.com").replace(/\/$/, "")
const HOST = new URL(SITE_URL).host
const PUBLIC_DIR = path.join(__dirname, "../public")

// ────────────────────────────────────────────────────────────────────────
// IndexNow key — single-use, lives in /public for api.indexnow.org validation
// ────────────────────────────────────────────────────────────────────────

function ensureIndexNowKey() {
  let key = process.env.INDEXNOW_KEY
  const keyMetaPath = path.join(PUBLIC_DIR, ".indexnow-key")

  // Read cached key if no env override
  if (!key && fs.existsSync(keyMetaPath)) {
    key = fs.readFileSync(keyMetaPath, "utf8").trim()
  }

  // Generate fresh 32-char hex key if still missing
  if (!key) {
    key = crypto.randomBytes(16).toString("hex")
    fs.writeFileSync(keyMetaPath, key, "utf8")
  }

  // Ensure the validation file lives at /public/<KEY>.txt
  const keyFilePath = path.join(PUBLIC_DIR, `${key}.txt`)
  if (!fs.existsSync(keyFilePath)) {
    fs.writeFileSync(keyFilePath, key, "utf8")
    console.log(`✓ Wrote IndexNow validation file: public/${key}.txt`)
    console.log(`   Deploy this file to ${SITE_URL}/${key}.txt before submitting.`)
  }

  return key
}

// ────────────────────────────────────────────────────────────────────────
// URL selection
// ────────────────────────────────────────────────────────────────────────

function readSitemapUrls(filename) {
  const p = path.join(PUBLIC_DIR, filename)
  if (!fs.existsSync(p)) return []
  const xml = fs.readFileSync(p, "utf8")
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
}

function topPriorityUrls() {
  // Curated starter set — submit these first, fastest index impact.
  return [
    // Core
    `${SITE_URL}/`,
    `${SITE_URL}/product`,
    `${SITE_URL}/pricing`,
    `${SITE_URL}/how-it-works`,
    `${SITE_URL}/demo`,
    `${SITE_URL}/about`,
    // Features (highest-intent)
    `${SITE_URL}/features/lead-scoring`,
    `${SITE_URL}/features/priority-queue`,
    `${SITE_URL}/features/missed-opportunity-engine`,
    `${SITE_URL}/features/morning-brief`,
    `${SITE_URL}/features/whatsapp-tracking`,
    `${SITE_URL}/features/sales-rep-tracking`,
    // Comparisons
    `${SITE_URL}/compare`,
    `${SITE_URL}/compare/leadkaun-vs-zoho-crm`,
    `${SITE_URL}/compare/leadkaun-vs-leadsquared`,
    `${SITE_URL}/compare/leadkaun-vs-hubspot`,
    `${SITE_URL}/compare/leadkaun-vs-salesforce`,
    `${SITE_URL}/compare/leadkaun-vs-freshsales`,
    // Use cases
    `${SITE_URL}/use-cases`,
    `${SITE_URL}/use-cases/real-estate`,
    `${SITE_URL}/use-cases/edtech`,
    `${SITE_URL}/use-cases/bfsi`,
    `${SITE_URL}/use-cases/saas`,
    `${SITE_URL}/use-cases/manufacturing`,
    `${SITE_URL}/use-cases/agencies`,
    `${SITE_URL}/use-cases/healthcare`,
    // Blog hub + 7 live posts
    `${SITE_URL}/blog`,
    ...readSitemapUrls("sitemap-blog.xml"),
    // Content hubs
    `${SITE_URL}/glossary`,
    `${SITE_URL}/questions`,
    `${SITE_URL}/how-to`,
    // Top PSEO: Tier-1 cities × top industries (10 × 4 = 40)
    ...["bengaluru", "mumbai", "delhi", "hyderabad", "chennai", "pune", "kolkata", "ahmedabad", "gurugram", "noida"].flatMap((city) =>
      ["real-estate", "edtech", "bfsi", "saas"].map((ind) => `${SITE_URL}/${ind}/${city}`)
    ),
  ]
}

function allSitemapUrls() {
  return [
    ...readSitemapUrls("sitemap-core.xml"),
    ...readSitemapUrls("sitemap-blog.xml"),
    ...readSitemapUrls("sitemap-questions.xml"),
    ...readSitemapUrls("sitemap-glossary.xml"),
    ...readSitemapUrls("sitemap-howto.xml"),
    ...readSitemapUrls("sitemap-pseo-city.xml"),
    ...readSitemapUrls("sitemap-pseo-1.xml"),
    ...readSitemapUrls("sitemap-pseo-2.xml"),
    ...readSitemapUrls("sitemap-pseo-3.xml"),
  ]
}

// ────────────────────────────────────────────────────────────────────────
// IndexNow submission
// ────────────────────────────────────────────────────────────────────────

function httpsPost(urlString, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlString)
    const req = https.request(
      {
        method: "POST",
        hostname: u.hostname,
        path: u.pathname + u.search,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
          ...headers,
        },
      },
      (res) => {
        let data = ""
        res.on("data", (chunk) => (data += chunk))
        res.on("end", () => resolve({ status: res.statusCode, body: data }))
      }
    )
    req.on("error", reject)
    req.write(body)
    req.end()
  })
}

async function submitIndexNow(urls, key) {
  if (urls.length === 0) return { submitted: 0, ok: true }
  const BATCH = 10000
  let submitted = 0
  for (let i = 0; i < urls.length; i += BATCH) {
    const batch = urls.slice(i, i + BATCH)
    const body = JSON.stringify({
      host: HOST,
      key,
      keyLocation: `${SITE_URL}/${key}.txt`,
      urlList: batch,
    })
    const res = await httpsPost("https://api.indexnow.org/indexnow", body)
    if (res.status === 200 || res.status === 202) {
      submitted += batch.length
      console.log(`   IndexNow: ${batch.length} URLs accepted (HTTP ${res.status})`)
    } else {
      console.error(`   IndexNow batch failed — HTTP ${res.status}: ${res.body.slice(0, 200)}`)
      return { submitted, ok: false }
    }
  }
  return { submitted, ok: true }
}

// ────────────────────────────────────────────────────────────────────────
// Google Indexing API (best-effort, requires googleapis npm package)
// ────────────────────────────────────────────────────────────────────────

async function submitGoogleIndexing(urls) {
  let googleapis
  try {
    googleapis = require("googleapis")
  } catch {
    console.warn("   ⚠ googleapis package not installed — skipping Google Indexing API.")
    console.warn("   Run: npm install googleapis  (then set GOOGLE_APPLICATION_CREDENTIALS)")
    return { submitted: 0, ok: false }
  }
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.warn("   ⚠ GOOGLE_APPLICATION_CREDENTIALS not set — skipping Google.")
    return { submitted: 0, ok: false }
  }

  const auth = new googleapis.google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/indexing"],
  })
  const authClient = await auth.getClient()
  const indexing = googleapis.google.indexing({ version: "v3", auth: authClient })

  let submitted = 0
  let failed = 0
  for (const url of urls) {
    try {
      await indexing.urlNotifications.publish({
        requestBody: { url, type: "URL_UPDATED" },
      })
      submitted++
    } catch (err) {
      failed++
      if (failed <= 3) {
        console.error(`   Google Indexing failed for ${url}: ${err.message}`)
      }
    }
  }
  console.log(`   Google: ${submitted} submitted, ${failed} failed`)
  return { submitted, ok: failed === 0 }
}

// ────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2)
  const out = { all: false, urls: null, protocol: "indexnow" }
  for (const a of args) {
    if (a === "--all") out.all = true
    else if (a.startsWith("--urls=")) out.urls = a.slice(7).split(",").map((s) => s.trim()).filter(Boolean)
    else if (a.startsWith("--protocol=")) out.protocol = a.slice(11)
  }
  return out
}

async function main() {
  const { all, urls, protocol } = parseArgs()
  const key = ensureIndexNowKey()

  let targets
  if (urls) {
    targets = urls
  } else if (all) {
    targets = allSitemapUrls()
  } else {
    targets = topPriorityUrls()
  }

  // Dedupe + keep only same-host
  targets = [...new Set(targets)].filter((u) => {
    try {
      return new URL(u).host === HOST
    } catch {
      return false
    }
  })

  console.log(`→ Submitting ${targets.length} URLs from ${HOST} via ${protocol}`)

  if (protocol === "indexnow" || protocol === "all") {
    console.log("→ IndexNow")
    await submitIndexNow(targets, key)
  }
  if (protocol === "google" || protocol === "all") {
    console.log("→ Google Indexing API")
    await submitGoogleIndexing(targets)
  }

  console.log("✓ Done")
}

main().catch((err) => {
  console.error("✗ Submission failed:", err.message)
  process.exit(1)
})
