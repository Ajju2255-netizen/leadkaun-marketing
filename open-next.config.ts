// OpenNext for Cloudflare config — bridges Next.js 16 ISR onto Workers + R2 + KV.
// Bindings consumed: NEXT_INC_CACHE_R2_BUCKET, NEXT_TAG_CACHE_KV — declared in wrangler.toml.
// See vault: 08 - Website/Architecture/Cloudflare-R2-ISR-Migration.md

import { defineCloudflareConfig } from "@opennextjs/cloudflare"
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache"
import kvTagCache from "@opennextjs/cloudflare/overrides/tag-cache/kv-next-tag-cache"
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue"

export default defineCloudflareConfig({
  // Page bodies + fetch-cache responses live in R2.
  // Long-tail PSEO URLs (~74k) cache here on first hit.
  incrementalCache: r2IncrementalCache,

  // Tag/path index for revalidateTag() and revalidatePath() — KV.
  // KV is eventually consistent (~60s); fine for 24h revalidate windows.
  tagCache: kvTagCache,

  // ISR revalidation queue — SQLite-backed Durable Object (works on the free
  // plan). Without this OpenNext used a "Dummy queue" that threw on every
  // stale revalidation, blowing the Worker CPU budget and 503-ing cold PSEO
  // renders. Bound as NEXT_CACHE_DO_QUEUE + WORKER_SELF_REFERENCE in wrangler.
  queue: doQueue,
})
