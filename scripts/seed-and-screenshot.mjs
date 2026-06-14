/**
 * seed-and-screenshot.mjs
 *
 * 1. Creates a test Supabase auth user (demo@leadkaun.com / Demo@1234)
 * 2. Seeds Account + User + realistic leads data via direct DB
 * 3. Logs in via Playwright and captures screenshots of every key page
 * 4. Saves PNGs to public/screenshots/
 *
 * Run: node scripts/seed-and-screenshot.mjs
 */

import { chromium } from "playwright"
import { existsSync, mkdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import pg from "pg"

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR   = join(__dirname, "../public/screenshots")
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

// ── Config (all secrets come from env — never hardcode) ─────────────────────
const SUPABASE_URL      = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const SERVICE_ROLE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const DATABASE_URL      = process.env.DATABASE_URL || ""
const APP_URL           = process.env.APP_URL || "http://localhost:3000"
const TEST_EMAIL        = process.env.SEED_TEST_EMAIL || "demo@leadkaun.com"
const TEST_PASSWORD     = process.env.SEED_TEST_PASSWORD || "Demo@1234"

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !DATABASE_URL) {
  console.error("Missing env. Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and DATABASE_URL before running this script.")
  process.exit(1)
}

// ── DB helpers ──────────────────────────────────────────────────────────────
const pool = new pg.Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } })
const q = (sql, params = []) => pool.query(sql, params)

function cuid() {
  return "c" + Math.random().toString(36).slice(2, 11) + Date.now().toString(36)
}

// ── Step 1: Create Supabase auth user ──────────────────────────────────────
async function ensureAuthUser() {
  console.log("👤 Creating auth user...")

  // Try to create via admin API
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      "apikey": SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { first_name: "Demo", last_name: "User" },
    }),
  })

  const data = await res.json()
  if (data.id) {
    console.log("  ✓ Auth user created:", data.id)
    return data.id
  }
  if (data.msg?.includes("already") || data.code === "email_exists") {
    // Fetch existing user
    const listRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(TEST_EMAIL)}`, {
      headers: { "apikey": SERVICE_ROLE_KEY, "Authorization": `Bearer ${SERVICE_ROLE_KEY}` },
    })
    const list = await listRes.json()
    const existing = list.users?.[0]
    if (existing?.id) {
      console.log("  ✓ Auth user already exists:", existing.id)
      return existing.id
    }
  }
  // Fallback: search all users
  const allRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?per_page=100`, {
    headers: { "apikey": SERVICE_ROLE_KEY, "Authorization": `Bearer ${SERVICE_ROLE_KEY}` },
  })
  const all = await allRes.json()
  const found = all.users?.find(u => u.email === TEST_EMAIL)
  if (found) { console.log("  ✓ Found existing auth user:", found.id); return found.id }

  throw new Error("Could not create or find auth user: " + JSON.stringify(data))
}

// ── Step 2: Seed DB ─────────────────────────────────────────────────────────
async function seedDatabase(authId) {
  console.log("🌱 Seeding database...")

  // Check if account already exists for this auth_id
  const existing = await q(`SELECT id FROM users WHERE auth_id = $1`, [authId])
  if (existing.rows.length > 0) {
    const userId = existing.rows[0].id
    const acct = await q(`SELECT account_id FROM users WHERE id = $1`, [userId])
    console.log("  ✓ Data already seeded, accountId:", acct.rows[0]?.account_id)
    return { accountId: acct.rows[0]?.account_id, userId }
  }

  // 1. Account
  const accountId = cuid()
  await q(`
    INSERT INTO accounts (id, name, industry, city, state, team_size, monthly_lead_vol, icp_configured,
      icp_industries, icp_states, icp_business_types, icp_roles,
      icp_budget_min, icp_budget_max, icp_sales_cycle,
      sql_fit_threshold, sql_intent_threshold, created_at, updated_at)
    VALUES ($1,'Growfast Realty Pvt Ltd','Real Estate','Mumbai','Maharashtra','SMALL','BETWEEN_50_200',
      true, ARRAY['Real Estate','PropTech'], ARRAY['Maharashtra','Karnataka','Delhi'],
      ARRAY['Developer','Broker','Agency'], ARRAY['Owner','Director','Sales Head'],
      500000, 5000000, 'FOUR_WEEKS', 55, 45, NOW(), NOW())
  `, [accountId])

  // 2. User (ADMIN)
  const userId = cuid()
  await q(`
    INSERT INTO users (id, account_id, auth_id, email, first_name, last_name, role, is_active, joined_at, created_at, updated_at)
    VALUES ($1,$2,$3,$4,'Rajesh','Sharma','ADMIN',true,NOW(),NOW(),NOW())
  `, [userId, accountId, authId, TEST_EMAIL])

  // 3. Pipeline stages
  const stages = [
    { id: cuid(), name: "New Inquiry",   key: "new_inquiry",   order: 1, terminal: false, won: false, lost: false },
    { id: cuid(), name: "Contacted",     key: "contacted",     order: 2, terminal: false, won: false, lost: false },
    { id: cuid(), name: "Qualified",     key: "qualified",     order: 3, terminal: false, won: false, lost: false },
    { id: cuid(), name: "Proposal Sent", key: "proposal_sent", order: 4, terminal: false, won: false, lost: false },
    { id: cuid(), name: "Negotiation",   key: "negotiation",   order: 5, terminal: false, won: false, lost: false },
    { id: cuid(), name: "Follow-up",     key: "follow_up",     order: 6, terminal: false, won: false, lost: false },
    { id: cuid(), name: "Won",           key: "won",           order: 7, terminal: true,  won: true,  lost: false },
    { id: cuid(), name: "Lost",          key: "lost",          order: 8, terminal: true,  won: false, lost: true  },
  ]
  for (const s of stages) {
    await q(`
      INSERT INTO pipeline_stages (id, account_id, name, key, display_order, is_terminal, is_won, is_lost)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `, [s.id, accountId, s.name, s.key, s.order, s.terminal, s.won, s.lost])
  }
  const stageMap = Object.fromEntries(stages.map(s => [s.key, s.id]))

  // 4. Lead sources
  const sources = [
    { id: cuid(), name: "Google Ads",           key: "google_ads",           intent: 55, rel: 90 },
    { id: cuid(), name: "JustDial",             key: "justdial",             intent: 50, rel: 80 },
    { id: cuid(), name: "IndiaMART",            key: "indiamart",            intent: 60, rel: 85 },
    { id: cuid(), name: "Website Contact Form", key: "website_contact_form", intent: 65, rel: 92 },
    { id: cuid(), name: "Referral",             key: "referral",             intent: 75, rel: 96 },
    { id: cuid(), name: "Facebook Ads",         key: "facebook_ads",         intent: 35, rel: 75 },
    { id: cuid(), name: "WhatsApp Business",    key: "whatsapp_business",    intent: 60, rel: 88 },
  ]
  for (const src of sources) {
    await q(`
      INSERT INTO lead_sources (id, account_id, name, key, intent_baseline, reliability_score, is_custom)
      VALUES ($1,$2,$3,$4,$5,$6,false)
    `, [src.id, accountId, src.name, src.key, src.intent, src.rel])
  }
  const srcMap = Object.fromEntries(sources.map(s => [s.key, s.id]))

  // 5. Follow-up configs per grade
  const fuConfigs = [
    { grade: "A", schedule: [{ day: 1, type: "CALL" }, { day: 2, type: "WHATSAPP" }, { day: 4, type: "CALL" }] },
    { grade: "B", schedule: [{ day: 1, type: "CALL" }, { day: 3, type: "WHATSAPP" }, { day: 7, type: "CALL" }] },
    { grade: "C", schedule: [{ day: 2, type: "WHATSAPP" }, { day: 5, type: "CALL" }] },
    { grade: "D", schedule: [{ day: 3, type: "WHATSAPP" }, { day: 7, type: "CALL" }] },
    { grade: "E", schedule: [{ day: 5, type: "WHATSAPP" }] },
    { grade: "F", schedule: [] },
  ]
  for (const fc of fuConfigs) {
    await q(`
      INSERT INTO follow_up_configs (id, account_id, grade, schedule, updated_at)
      VALUES ($1,$2,$3,$4,NOW())
    `, [cuid(), accountId, fc.grade, JSON.stringify(fc.schedule)])
  }

  // 6. Leads — realistic Indian sales data
  const leads = [
    // Grade A — hot leads
    { fn:"Suresh",  ln:"Kumar",  ph:"+919876543210", co:"BuildRight Properties",  src:"google_ads",           fit:85, intent:82, qual:78, grade:"A", stage:"new_inquiry",   val:1200000, city:"Mumbai",    state:"Maharashtra", inquiry:"Looking for 2BHK in Powai, budget 1.2Cr, ready to move" },
    { fn:"Meera",   ln:"Nair",   ph:"+919876543211", co:"Edvance Learning Pvt",   src:"website_contact_form", fit:82, intent:88, qual:75, grade:"A", stage:"contacted",     val:850000,  city:"Bangalore", state:"Karnataka",   inquiry:"Need commercial space 2000sqft for office expansion" },
    { fn:"Priya",   ln:"Gupta",  ph:"+919876543212", co:"Self",                   src:"referral",             fit:90, intent:85, qual:88, grade:"A", stage:"qualified",     val:2500000, city:"Delhi",     state:"Delhi",       inquiry:"3BHK villa in Gurgaon, referred by Arun Mehta" },
    { fn:"Rahul",   ln:"Joshi",  ph:"+919876543213", co:"TechScale Solutions",    src:"indiamart",            fit:78, intent:80, qual:72, grade:"A", stage:"new_inquiry",   val:650000,  city:"Pune",      state:"Maharashtra", inquiry:"Office space 1500sqft Hinjawadi IT park" },
    { fn:"Ananya",  ln:"Reddy",  ph:"+919876543214", co:"SkyHigh Developers",     src:"whatsapp_business",    fit:88, intent:90, qual:82, grade:"A", stage:"proposal_sent", val:3200000, city:"Hyderabad", state:"Telangana",   inquiry:"Luxury 4BHK penthouse, confirmed budget 3.2Cr" },
    { fn:"Vikram",  ln:"Singh",  ph:"+919876543215", co:"Pioneer Infra",          src:"google_ads",           fit:80, intent:78, qual:76, grade:"A", stage:"negotiation",   val:980000,  city:"Mumbai",    state:"Maharashtra", inquiry:"2BHK ready possession, pre-approved loan" },
    // Grade B
    { fn:"Rajan",   ln:"Mehta",  ph:"+919876543216", co:"FinTrust NBFC",          src:"justdial",             fit:72, intent:68, qual:70, grade:"B", stage:"contacted",     val:450000,  city:"Ahmedabad", state:"Gujarat",     inquiry:"1BHK investment property, want rental yield data" },
    { fn:"Sunita",  ln:"Patel",  ph:"+919876543217", co:"Green Homes",            src:"facebook_ads",         fit:68, intent:72, qual:65, grade:"B", stage:"new_inquiry",   val:750000,  city:"Surat",     state:"Gujarat",     inquiry:"2BHK for first home purchase" },
    { fn:"Deepak",  ln:"Verma",  ph:"+919876543218", co:"Verma Traders",          src:"google_ads",           fit:75, intent:65, qual:68, grade:"B", stage:"follow_up",     val:580000,  city:"Jaipur",    state:"Rajasthan",   inquiry:"Interested in new launch project" },
    { fn:"Kavita",  ln:"Shah",   ph:"+919876543219", co:"Shah Enterprises",       src:"indiamart",            fit:70, intent:70, qual:72, grade:"B", stage:"qualified",     val:620000,  city:"Mumbai",    state:"Maharashtra", inquiry:"2BHK resale flat Andheri West" },
    // Grade C
    { fn:"Anita",   ln:"Sharma", ph:"+919876543220", co:"Sprout EdTech",          src:"facebook_ads",         fit:55, intent:50, qual:58, grade:"C", stage:"new_inquiry",   val:380000,  city:"Chennai",   state:"Tamil Nadu",  inquiry:"Cheap 1BHK near IT corridor" },
    { fn:"Manoj",   ln:"Kumar",  ph:"+919876543221", co:"Self",                   src:"justdial",             fit:52, intent:55, qual:50, grade:"C", stage:"contacted",     val:320000,  city:"Nagpur",    state:"Maharashtra", inquiry:"Studio apartment under 35L" },
    { fn:"Ritu",    ln:"Agarwal",ph:"+919876543222", co:"Agarwal & Co",           src:"facebook_ads",         fit:58, intent:48, qual:55, grade:"C", stage:"new_inquiry",   val:280000,  city:"Indore",    state:"MP",          inquiry:"Shop space ground floor 200sqft" },
    // Grade D
    { fn:"Sanjay",  ln:"Das",    ph:"+919876543223", co:"Self",                   src:"facebook_ads",         fit:42, intent:38, qual:45, grade:"D", stage:"new_inquiry",   val:200000,  city:"Kolkata",   state:"West Bengal", inquiry:"Any affordable flat" },
    { fn:"Pooja",   ln:"Nath",   ph:"+919876543224", co:"Nath & Sons",            src:"facebook_ads",         fit:40, intent:42, qual:38, grade:"D", stage:"new_inquiry",   val:250000,  city:"Lucknow",   state:"UP",          inquiry:"Looking for property" },
    // Grade E — cold/junk
    { fn:"Ramesh",  ln:"Yadav",  ph:"+919876543225", co:"Self",                   src:"facebook_ads",         fit:28, intent:22, qual:30, grade:"E", stage:"new_inquiry",   val:null,    city:"Patna",     state:"Bihar",       inquiry:"Just browsing" },
    { fn:"Geeta",   ln:"Kumari", ph:"+919876543226", co:"Self",                   src:"facebook_ads",         fit:25, intent:18, qual:22, grade:"E", stage:"new_inquiry",   val:null,    city:"Bhopal",    state:"MP",          inquiry:"Info needed" },
    // Missed (stale leads)
    { fn:"Rajiv",   ln:"Chopra", ph:"+919876543227", co:"Chopra Industries",      src:"google_ads",           fit:75, intent:70, qual:68, grade:"B", stage:"follow_up",     val:720000,  city:"Delhi",     state:"Delhi",       inquiry:"Office space 3000sqft Connaught Place", missed: true, missedDaysAgo: 8  },
    { fn:"Shweta",  ln:"Bose",   ph:"+919876543228", co:"Bose Consultants",       src:"justdial",             fit:65, intent:60, qual:62, grade:"C", stage:"contacted",     val:480000,  city:"Kolkata",   state:"West Bengal", inquiry:"2BHK below 50L", missed: true, missedDaysAgo: 12 },
    { fn:"Nitin",   ln:"Aswale", ph:"+919876543229", co:"Aswale Builders",        src:"indiamart",            fit:80, intent:75, qual:72, grade:"B", stage:"new_inquiry",   val:950000,  city:"Nashik",    state:"Maharashtra", inquiry:"Residential plot 3000sqft", missed: true, missedDaysAgo: 5  },
    // Won leads
    { fn:"Arun",    ln:"Khanna", ph:"+919876543230", co:"Khanna Exports",         src:"referral",             fit:92, intent:95, qual:90, grade:"A", stage:"won",           val:2800000, city:"Mumbai",    state:"Maharashtra", inquiry:"Luxury 3BHK Worli sea view", won: true, wonVal: 2800000 },
    { fn:"Divya",   ln:"Nair",   ph:"+919876543231", co:"Nair Holdings",          src:"website_contact_form", fit:88, intent:85, qual:85, grade:"A", stage:"won",           val:1500000, city:"Bangalore", state:"Karnataka",   inquiry:"Commercial office 4th floor", won: true, wonVal: 1500000 },
  ]

  const now = new Date()
  function daysAgo(n) { const d = new Date(now); d.setDate(d.getDate() - n); return d }

  const insertedLeadIds = []
  for (const l of leads) {
    const leadId = cuid()
    insertedLeadIds.push(leadId)
    const srcId = srcMap[l.src]
    const stageId = stageMap[l.stage] || stageMap["new_inquiry"]
    const missedAt  = l.missed ? daysAgo(l.missedDaysAgo) : null
    const lastAction = l.missed ? daysAgo(l.missedDaysAgo + 1) : daysAgo(Math.floor(Math.random() * 3))
    const wonAt = l.won ? daysAgo(Math.floor(Math.random() * 10) + 1) : null

    await q(`
      INSERT INTO leads (
        id, account_id, assigned_rep_id,
        first_name, last_name, phone, phone_raw, email, company_name, city, state,
        source_id, inquiry_text, expected_value,
        fit_score, intent_score, quality_score, grade,
        stage_id, stage_entered_at,
        is_missed, missed_at, last_action_at,
        won_at, won_value,
        wa_conversation_stage,
        created_at, updated_at
      ) VALUES (
        $1,$2,$3,
        $4,$5,$6,$7,$8,$9,$10,$11,
        $12,$13,$14,
        $15,$16,$17,$18,
        $19,NOW(),
        $20,$21,$22,
        $23,$24,
        'INQUIRY',
        NOW() - INTERVAL '1 day' * $25, NOW()
      )
    `, [
      leadId, accountId, userId,
      l.fn, l.ln, l.ph, l.ph.replace("+91",""), l.fn.toLowerCase() + "@example.com", l.co, l.city, l.state,
      srcId, l.inquiry, l.val || null,
      l.fit, l.intent, l.qual, l.grade,
      stageId,
      l.missed ? 1 : 0, missedAt, lastAction,
      wonAt, l.won ? l.wonVal : null,
      Math.floor(Math.random() * 30) + 1,
    ])

    // Follow-up actions for A+B grade leads
    if (["A", "B"].includes(l.grade) && !l.won) {
      await q(`
        INSERT INTO follow_up_actions (id, account_id, lead_id, assigned_rep_id, day_number, action_type, due_date, status, created_at, updated_at)
        VALUES ($1,$2,$3,$4,1,'CALL',$5,$6,NOW(),NOW())
      `, [cuid(), accountId, leadId, userId,
          daysAgo(-1),  // due tomorrow
          l.missed ? "OVERDUE" : "PENDING"])
    }
  }

  // 7. Notifications
  const notifs = [
    { type: "AT_RISK",       title: "Suresh Kumar approaching missed window",   message: "Grade A lead (12L) — no contact in 20 hours. Call before 6 PM.", priority: "high",   leadIdx: 0 },
    { type: "AT_RISK",       title: "Ananya Reddy — proposal follow-up overdue", message: "Grade A lead (32L) — proposal sent 3 days ago, no response.",    priority: "high",   leadIdx: 4 },
    { type: "MISSED",        title: "Rajiv Chopra marked missed",               message: "Grade B lead (7.2L) went 8 days without contact.",                priority: "medium", leadIdx: 17 },
    { type: "RECOVERY",      title: "Shweta Bose — recovery opportunity",       message: "12 days cold but re-engaged via JustDial today.",                  priority: "medium", leadIdx: 18 },
    { type: "FOLLOW_UP_DUE", title: "4 follow-ups due today",                   message: "Meera Nair, Priya Gupta, Rahul Joshi, and Kavita Shah need action.",priority: "high",  leadIdx: 1 },
  ]
  for (const n of notifs) {
    await q(`
      INSERT INTO notifications (id, account_id, user_id, lead_id, type, title, message, priority, is_read, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,false,NOW() - INTERVAL '1 hour' * $9)
    `, [cuid(), accountId, userId, insertedLeadIds[n.leadIdx], n.type, n.title, n.message, n.priority, Math.floor(Math.random() * 5) + 1])
  }

  console.log("  ✓ Seeded:", leads.length, "leads, 5 notifications")
  return { accountId, userId }
}

// ── Step 3: Screenshots ─────────────────────────────────────────────────────
const PAGES = [
  { name: "queue",       path: "/queue",     wait: 3000 },
  { name: "dashboard",   path: "/dashboard", wait: 3000 },
  { name: "leads",       path: "/leads",     wait: 3000 },
  { name: "missed",      path: "/missed",    wait: 3000 },
  { name: "analytics",   path: "/analytics", wait: 3000 },
  { name: "pipeline",    path: "/pipeline",  wait: 3000 },
  { name: "follow-ups",  path: "/follow-ups",wait: 3000 },
]

async function getSupabaseToken() {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "apikey": "sb_publishable_eO1jrGg3FYtCD4jvHztjCA_iBjwMsm4", "Content-Type": "application/json" },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
  })
  const data = await res.json()
  if (!data.access_token) throw new Error("Auth failed: " + JSON.stringify(data))
  return data
}

async function takeScreenshots() {
  console.log("\n📸 Taking screenshots...")

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "light",
  })
  const page = await context.newPage()

  // Track 404/failed requests
  const failedRequests = []
  page.on("requestfailed", req => failedRequests.push({ url: req.url(), err: req.failure()?.errorText }))
  page.on("response", resp => { if (resp.status() >= 400) process.stdout.write(`  [${resp.status()}] ${resp.url().replace(APP_URL,'')}\n`) })

  // Warm up: first visit triggers chunk compilation, wait for it to finish
  console.log("  🔥 Warm-up pass 1 (compile login page chunks)...")
  await page.goto(`${APP_URL}/login`, { waitUntil: "networkidle", timeout: 45000 })
  await page.waitForTimeout(3000)
  console.log("  🔥 Warm-up pass 2 (reload with compiled chunks)...")
  await page.reload({ waitUntil: "networkidle", timeout: 30000 })
  await page.waitForTimeout(2000)
  console.log("  ✓ Warmed — title:", await page.title(), "| bodyLen:", (await page.evaluate(() => document.body.innerText)).length)

  // Log in via the actual login form
  console.log("  🔐 Logging in via form...")
  // Fill login form — try multiple selector strategies
  const emailInput = page.locator('input[type="email"], input[name="email"], #email, [placeholder*="mail"]').first()
  const passInput  = page.locator('input[type="password"], input[name="password"], #password').first()
  await emailInput.waitFor({ timeout: 20000 })
  await emailInput.fill(TEST_EMAIL)
  await passInput.fill(TEST_PASSWORD)
  await page.click('button[type="submit"]')

  // Wait for redirect away from /login
  await page.waitForURL(url => !url.toString().includes("/login"), { timeout: 20000 })
  await page.waitForTimeout(3000)
  console.log("  ✓ Logged in — at:", page.url())

  // Take debug screenshot of first page to verify auth
  await page.screenshot({ path: join(OUT_DIR, "_auth-check.png") })
  console.log("  ✓ Auth check screenshot saved (_auth-check.png)")

  if (page.url().includes("/login")) {
    await browser.close()
    throw new Error("Auth failed — still on login page after submit.")
  }

  // Screenshot each page
  for (const cap of PAGES) {
    try {
      console.log(`  → ${cap.name}`)
      await page.goto(`${APP_URL}${cap.path}`, { waitUntil: "networkidle", timeout: 20000 })
      await page.waitForTimeout(cap.wait)
      // Dismiss any open modals/dialogs
      await page.evaluate(() => {
        document.querySelectorAll('[role="dialog"],[data-radix-popper-content-wrapper]')
          .forEach(el => el.remove())
      })
      await page.screenshot({ path: join(OUT_DIR, `${cap.name}.png`), fullPage: false })
      console.log(`    ✓ saved ${cap.name}.png`)
    } catch (err) {
      console.error(`    ✗ ${cap.name}:`, err.message)
    }
  }

  // Lead detail — click first lead
  try {
    console.log("  → lead-detail")
    await page.goto(`${APP_URL}/leads`, { waitUntil: "networkidle" })
    await page.waitForTimeout(2000)
    const row = page.locator("table tbody tr, [data-lead-row]").first()
    if (await row.count()) {
      await row.click()
      await page.waitForTimeout(2500)
      await page.screenshot({ path: join(OUT_DIR, "lead-detail.png"), fullPage: false })
      console.log("    ✓ saved lead-detail.png")
    }
  } catch (err) {
    console.error("    ✗ lead-detail:", err.message)
  }

  await browser.close()
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  try {
    const authId = await ensureAuthUser()
    await seedDatabase(authId)
    await takeScreenshots()
    console.log("\n✅ Done! Screenshots in public/screenshots/")
    console.log("   Login: demo@leadkaun.com / Demo@1234")
  } catch (err) {
    console.error("\n❌ Error:", err.message)
    console.error(err.stack)
  } finally {
    await pool.end()
  }
}

main()
