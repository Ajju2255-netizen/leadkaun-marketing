// OpenNext for Cloudflare config — bridges Next.js 16 ISR onto Workers + R2 + KV.
// Bindings consumed: NEXT_INC_CACHE_R2_BUCKET, NEXT_TAG_CACHE_KV — declared in wrangler.toml.
// See vault: 08 - Website/Architecture/Cloudflare-R2-ISR-Migration.md

import { defineCloudflareConfig } from "@opennextjs/cloudflare"
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache"
import kvTagCache from "@opennextjs/cloudflare/overrides/tag-cache/kv-next-tag-cache"

export default defineCloudflareConfig({
  // Page bodies + fetch-cache responses live in R2.
  // Long-tail PSEO URLs (~74k) cache here on first hit.
  incrementalCache: r2IncrementalCache,

  // Tag/path index for revalidateTag() and revalidatePath() — KV.
  // KV is eventually consistent (~60s); fine for 24h revalidate windows.
  tagCache: kvTagCache,

  // NOTE: tried the DO revalidation queue (doQueue) — its binding 503'd the
  // serve path on stale-revalidation reads (DO class not wired at runtime),
  // taking down core pages. Reverted to the default queue, which logs a benign
  // "revalidate failed" but serves pages stale-200 within the 24h window.
  // The real cold-render blocker is the Free-plan CPU cap, not the queue.
})
