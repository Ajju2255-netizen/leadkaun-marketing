/**
 * capture-screenshots.mjs
 * Usage: node scripts/capture-screenshots.mjs <email> <password>
 *
 * Logs into the Leadkaun app at localhost:3000, navigates to key pages,
 * and saves screenshots to public/screenshots/
 */

import { chromium } from "playwright"
import { existsSync, mkdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, "../public/screenshots")

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

const [,, EMAIL, PASSWORD] = process.argv
if (!EMAIL || !PASSWORD) {
  console.error("Usage: node scripts/capture-screenshots.mjs <email> <password>")
  process.exit(1)
}

const APP_URL = "http://localhost:3000"

/* Pages to capture — [name, path, viewport, waitFor] */
const CAPTURES = [
  { name: "queue",     path: "/queue",     viewport: { width: 1440, height: 900 },  clip: null },
  { name: "dashboard", path: "/dashboard", viewport: { width: 1440, height: 900 },  clip: null },
  { name: "leads",     path: "/leads",     viewport: { width: 1440, height: 900 },  clip: null },
  { name: "missed",    path: "/missed",    viewport: { width: 1440, height: 900 },  clip: null },
  { name: "analytics", path: "/analytics", viewport: { width: 1440, height: 900 },  clip: null },
  { name: "pipeline",  path: "/pipeline",  viewport: { width: 1440, height: 900 },  clip: null },
]

async function run() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "light",
  })
  const page = await context.newPage()

  /* ── Login ── */
  console.log("🔐 Logging in...")
  await page.goto(`${APP_URL}/login`, { waitUntil: "networkidle" })
  await page.fill('input[type="email"]', EMAIL)
  await page.fill('input[type="password"]', PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForURL(`${APP_URL}/**`, { timeout: 15000 })
  console.log("✓ Logged in — at:", page.url())

  /* ── Capture each page ── */
  for (const cap of CAPTURES) {
    console.log(`📸 Capturing ${cap.name}...`)
    try {
      await page.setViewportSize(cap.viewport)
      await page.goto(`${APP_URL}${cap.path}`, { waitUntil: "networkidle", timeout: 20000 })

      /* Wait for any loading spinners to clear */
      await page.waitForTimeout(1500)

      /* Hide any cookie banners or modals that could appear */
      await page.evaluate(() => {
        const selectors = ["[role='dialog']", ".modal-backdrop", "[data-radix-popper-content-wrapper]"]
        selectors.forEach(s => document.querySelectorAll(s).forEach(el => (el as HTMLElement).style.display = "none"))
      })

      const outPath = join(OUT_DIR, `${cap.name}.png`)
      await page.screenshot({
        path: outPath,
        fullPage: false,
        ...(cap.clip ? { clip: cap.clip } : {}),
      })
      console.log(`  ✓ Saved → public/screenshots/${cap.name}.png`)
    } catch (err) {
      console.error(`  ✗ Failed ${cap.name}:`, (err as Error).message)
    }
  }

  /* ── Also capture a lead detail — navigate to first lead ── */
  console.log("📸 Capturing lead detail...")
  try {
    await page.goto(`${APP_URL}/leads`, { waitUntil: "networkidle" })
    await page.waitForTimeout(1000)
    /* Click the first lead row */
    const firstRow = page.locator("tr[data-href], tbody tr a, tbody tr[onclick], table tbody tr").first()
    if (await firstRow.count() > 0) {
      await firstRow.click()
      await page.waitForURL(`${APP_URL}/leads/**`, { timeout: 8000 }).catch(() => {})
      await page.waitForTimeout(1500)
      const outPath = join(OUT_DIR, "lead-detail.png")
      await page.screenshot({ path: outPath, fullPage: false })
      console.log("  ✓ Saved → public/screenshots/lead-detail.png")
    } else {
      console.log("  ℹ No lead rows found, skipping detail")
    }
  } catch (err) {
    console.error("  ✗ Failed lead-detail:", (err as Error).message)
  }

  await browser.close()
  console.log("\n✅ All screenshots captured in public/screenshots/")
}

run().catch((err) => {
  console.error("Fatal:", err)
  process.exit(1)
})
