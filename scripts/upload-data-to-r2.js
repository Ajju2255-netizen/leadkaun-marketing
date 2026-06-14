#!/usr/bin/env node
/**
 * Upload all 10 PSEO JSON data files to the `leadkaun-pseo` R2 bucket.
 *
 * Idempotent — uses sha256 hash comparison to skip unchanged files.
 * Requires `wrangler` on PATH and prior `wrangler login`.
 *
 *   npm run cf:upload-data            # sync everything
 *   npm run cf:upload-data -- --force # bypass hash check
 */

const { spawnSync, execSync } = require("node:child_process")
const { readFileSync, statSync } = require("node:fs")
const { createHash } = require("node:crypto")
const { join } = require("node:path")

const BUCKET = "leadkaun-pseo"
const DATA_DIR = join(__dirname, "..", "data", "pseo")
const KEYS = [
  "cities.json",
  "industries.json",
  "keywords.json",
  "roles.json",
  "competitors.json",
  "glossary.json",
  "questions.json",
  "how-to.json",
  "integrations.json",
  "resources.json",
]

const FORCE = process.argv.includes("--force")

function sha256(buf) {
  return createHash("sha256").update(buf).digest("hex")
}

function remoteHash(key) {
  // `--remote` is critical — without it, wrangler 4.x reads/writes the local
  // `.wrangler/state/v3/r2/` miniflare simulation, NOT real R2.
  try {
    const out = execSync(
      `wrangler r2 object get ${BUCKET}/${key} --pipe --remote 2>/dev/null`,
      { stdio: ["ignore", "pipe", "ignore"] },
    )
    return sha256(out)
  } catch {
    return null
  }
}

function uploadOne(key) {
  const path = join(DATA_DIR, key)
  const stat = statSync(path)
  const buf = readFileSync(path)
  const localHash = sha256(buf)

  if (!FORCE) {
    const remote = remoteHash(key)
    if (remote === localHash) {
      console.log(`  · ${key.padEnd(22)} skip (unchanged)`)
      return { key, status: "skip" }
    }
  }

  const result = spawnSync(
    "wrangler",
    [
      "r2", "object", "put",
      `${BUCKET}/${key}`,
      "--file", path,
      "--content-type", "application/json",
      "--remote",
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  )

  if (result.status !== 0) {
    console.error(`  ✗ ${key.padEnd(22)} FAILED`)
    console.error(result.stderr.toString())
    return { key, status: "fail" }
  }
  const sizeKb = (stat.size / 1024).toFixed(1)
  console.log(`  ✓ ${key.padEnd(22)} ${sizeKb.padStart(7)} KB → r2://${BUCKET}/${key}`)
  return { key, status: "uploaded" }
}

function main() {
  console.log(`\nUploading ${KEYS.length} files → r2://${BUCKET}/${FORCE ? "  [FORCE]" : ""}\n`)

  const results = KEYS.map(uploadOne)
  const counts = { uploaded: 0, skip: 0, fail: 0 }
  for (const r of results) counts[r.status]++

  console.log(`\n${counts.uploaded} uploaded · ${counts.skip} unchanged · ${counts.fail} failed\n`)

  // Hint for tag invalidation if any files actually changed
  if (counts.uploaded > 0) {
    const tags = results
      .filter((r) => r.status === "uploaded")
      .map((r) => `pseo:${r.key.replace(".json", "")}`)
      .join(",")
    console.log(`Hint: invalidate ISR cache for changed slices —`)
    console.log(`  curl -X POST $SITE_URL/api/revalidate -H 'authorization: Bearer $REVALIDATE_TOKEN' -d '{"tags":["${tags}"]}'`)
  }

  process.exit(counts.fail > 0 ? 1 : 0)
}

main()
