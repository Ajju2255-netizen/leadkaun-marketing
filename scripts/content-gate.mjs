#!/usr/bin/env node
/**
 * Content quality gate (Phase 3.3).
 *
 * Offline auditor for the pSEO corpus + blog. Enforces the honesty/uniqueness
 * rules the ranking strategy depends on, so thin or AI-slop pages never get
 * promoted to `index`. Run it in CI or before a deploy:
 *
 *   node scripts/content-gate.mjs           # full report, exit 1 on ERROR
 *   node scripts/content-gate.mjs --warn     # never fail the build (report only)
 *
 * Checks:
 *  1. Banned AI-slop phrases (ChatGPT tells) anywhere in content strings.
 *  2. Fabricated-precision stat patterns ("studies show N×", bare "N% of ...").
 *  3. Fact completeness — every industry carries the economics the templates read.
 *  4. Near-duplicate bodies (Jaccard over word-shingles) across industries + blog.
 *  5. P0 honesty lint over app/ + components/ + machine surfaces (llms.txt,
 *     ai-context.json): banned strings + quarantined-as-fact stats. Escape a
 *     legit line (e.g. a competitor's per-seat price) with `lk-gate-ignore`.
 *
 * ERRORs fail the gate; WARNs are advisory.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = join(ROOT, "data", "pseo");
const BLOG = join(ROOT, "content", "blog");
const WARN_ONLY = process.argv.includes("--warn");

const errors = [];
const warns = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warns.push(`${where}: ${msg}`);

// ---- 1. banned AI-slop phrases ---------------------------------------------
const BANNED = [
  "in today's fast-paced", "in the ever-evolving", "in the ever-changing",
  "unlock the power", "unlock the potential", "harness the power",
  "seamlessly integrat", "game-changer", "game changer", "revolutioniz",
  "elevate your", "take your .* to the next level", "when it comes to",
  "in conclusion", "it's worth noting", "needless to say", "look no further",
  "the world of", "navigating the", "dive into the world", "delve into",
  "a testament to", "in the realm of", "at the end of the day",
  "leverage the power", "cutting-edge solution", "robust solution",
  "tapestry of", "embark on a journey", "paradigm shift",
];
const bannedRe = new RegExp("\\b(" + BANNED.map((b) => b.replace(/[.*+?^${}()|[\]\\]/g, (m) => (m === ".*" ? ".*" : "\\" + m))).join("|") + ")", "i");

// fabricated-precision external-stat tells (first-party "in Leadkaun's data" is allowed)
const FAKE_STAT = [
  /studies show[^.]*\d+\s*[×x]/i,
  /research shows[^.]*\d+\s*%/i,
  /\b\d{2,3}%\s+of\s+(indian|b2b|sales|leads|companies|teams)\b/i,
  /\bconvert\s+\d+\s*[×x]\b/i,
];

// Honesty patterns with NO legitimate use in Leadkaun's own copy — enforced as
// ERRORs across BOTH data files and source (spread into QUARANTINE below). The
// 47-min pattern excludes hyphen-continuation so it never flags the kept slug
// `47-minute-response-tracker`. See vault "Leadkaun Brain" 00 §4/§5.
const DATA_HONESTY = [
  { re: /india(?:'|’|&(?:apos|#39|rsquo|#8217);)?s?\s+first/i, name: 'unverifiable superlative "India\'s first" (incl. HTML-entity apostrophe)' },
  { re: /built-in crm/i,               name: 'banned framing "Built-in CRM" (runs alongside a CRM)' },
  { re: /cloudflare pages/i,           name: 'wrong infra "Cloudflare Pages" (it is Workers via OpenNext)' },
  { re: /under 500\s?ms/i,             name: 'unverified latency "under 500ms" (use "real time")' },
  { re: /\b500\s?ms\b/i,               name: 'unverified latency "500ms" (use "real time")' },
  { re: /under a second/i,             name: 'unverified latency "under a second" (use "real time")' },
  { re: /47[-\s]?min(ute)?s?\b(?!-)/i, name: 'quarantined fabricated stat "47 min(ute)" (de-specify)' },
  // Over-claims (weight_overrides not wired; BSP is roadmap). "audit/transparent
  // weights" and "BSP … on the roadmap" phrasings do NOT match these.
  { re: /customis(e|able)[^.\n]{0,25}weights|tune[^.\n]{0,15}(the\s+)?weights|custom\s+(icp\s+)?weights/i, name: 'over-claim: customisable scoring weights (weight_overrides is not wired — weights are fixed/transparent)' },
  { re: /BSP integrations?[^.\n]{0,30}\bavailable/i, name: 'over-claim: BSP integrations "available" (Gupshup/AiSensy/Interakt are roadmap)' },
];

// Over-claims that historically hid in DATA files because the strict QUARANTINE
// set below only scans SOURCE. Enforced as ERRORs across data too (wired into the
// data loop). FP-safe: ₹-scoped per-rep pricing won't flag competitor USD per-user
// copy or "cost doesn't grow per seat"; the multiplier check is attribution-aware
// so a cited "HBR … 7× more likely" is allowed.
const DATA_OVERCLAIM = [
  // Leadkaun's own copy says "rep"; Indian competitors legitimately price ₹ "per
  // user" — so this is scoped to rep/seat to avoid flagging competitor pricing.
  { re: /₹\s?[\d,]+(?:\s*[–-]\s*₹?\s?[\d,]+)?\s*(?:\/|per )\s*(reps?|seats?)\b/i, name: 'per-rep/seat pricing of Leadkaun (pricing is flat per account, not per seat)' },
  { re: /\bper\s+rep\s+per\s+(month|mo)\b/i, name: 'per-rep pricing model (Leadkaun is flat per account)' },
  { re: /\b(most\s+teams|teams|customers|users|clients)\s+(see|recover|save|gain|earn)\s+₹/i, name: 'promised-outcome ₹ claim (frame as illustrative/modelled, not a result)' },
];
// A performance multiplier ("3–5× higher", "~4× the rate") is only allowed when a
// source is named in the same string. HBR/InsideSales/etc citations pass.
const MULTIPLIER = /\b\d+(?:[.,]\d+)?(?:\s*[–-]\s*\d+)?\s*[×x]\s+(?:the\s+)?(?:rate|faster|better|more\s+likely|conversion|higher)/i;
const ATTRIBUTION = /\b(hbr|harvard|insidesales|forbes|kantar|salesforce|gartner|mckinsey|nasscom|ibef|irdai|anarock|redseer|dentsu|meta|source|study|studies|research (?:by|from|found|reported)|according to)\b/i;

// ---- helpers ---------------------------------------------------------------
function* strings(node, path = "") {
  if (typeof node === "string") { yield [path, node]; return; }
  if (Array.isArray(node)) { for (let i = 0; i < node.length; i++) yield* strings(node[i], `${path}[${i}]`); return; }
  if (node && typeof node === "object") { for (const k of Object.keys(node)) yield* strings(node[k], path ? `${path}.${k}` : k); }
}
const loadJson = (f) => JSON.parse(readFileSync(join(DATA, f), "utf8"));
const words = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
function shingles(s, n = 3) {
  const w = words(s); const out = new Set();
  for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(" "));
  return out;
}
function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0; for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

// ---- scan every JSON data file for banned phrases + fake stats -------------
// research.json is exempt from the fabricated-precision check: it is a sourced
// data report where every percentage carries an outbound citation — that check
// targets UNCITED marketing copy. Banned-phrase linting still applies.
const FAKE_STAT_EXEMPT = new Set(["research.json"]);
const jsonFiles = readdirSync(DATA).filter((f) => f.endsWith(".json"));
for (const f of jsonFiles) {
  let data; try { data = loadJson(f); } catch (e) { err(f, `invalid JSON: ${e.message}`); continue; }
  for (const [path, text] of strings(data)) {
    if (text.length < 12) continue;
    const b = text.match(bannedRe);
    if (b) warn(`${f}:${path}`, `AI-slop phrase "${b[0]}"`);
    for (const q of DATA_HONESTY) if (q.re.test(text)) err(`${f}:${path}`, q.name);
    if (FAKE_STAT_EXEMPT.has(f)) continue;
    for (const q of DATA_OVERCLAIM) if (q.re.test(text)) err(`${f}:${path}`, q.name);
    if (MULTIPLIER.test(text) && !ATTRIBUTION.test(text)) err(`${f}:${path}`, `uncited performance multiplier "${text.match(MULTIPLIER)[0].trim()}" — cite a source or soften`);
    for (const re of FAKE_STAT) {
      const m = text.match(re);
      if (m) err(`${f}:${path}`, `fabricated-precision stat "${m[0].trim().slice(0, 60)}"`);
    }
  }
}

// ---- 3. industry fact completeness ----------------------------------------
const industries = loadJson("industries.json");
for (const ind of industries) {
  const missing = [];
  if (!ind.ticketBand) missing.push("ticketBand");
  if (!ind.salesCycle) missing.push("salesCycle");
  if (!Array.isArray(ind.channels) || ind.channels.length < 3) missing.push("channels(>=3)");
  if (!Array.isArray(ind.painPoints) || ind.painPoints.length < 2) missing.push("painPoints(>=2)");
  if (missing.length) err(`industries.json:${ind.slug}`, `thin — missing ${missing.join(", ")}`);
}

// ---- city fact coverage (advisory) ----------------------------------------
const cities = loadJson("cities.json");
const noNotes = cities.filter((c) => !c.notes || c.notes.length < 20);
if (noNotes.length) warn("cities.json", `${noNotes.length}/${cities.length} cities have no per-city context note (leaf pages stay noindex)`);

// ---- collect blog bodies ---------------------------------------------------
const blogBodies = [];
if (existsSync(BLOG)) {
  for (const f of readdirSync(BLOG).filter((f) => f.endsWith(".md"))) {
    const raw = readFileSync(join(BLOG, f), "utf8");
    const body = raw.replace(/^---[\s\S]*?---/, "");
    const b = body.match(bannedRe);
    if (b) warn(`blog/${f}`, `AI-slop phrase "${b[0]}"`);
    blogBodies.push({ id: `blog/${f}`, sh: shingles(body.slice(0, 1500)) });
  }
}

// ---- 4. near-duplicate detection (industry hero + blog intros) -------------
const corpus = [
  ...industries.map((i) => ({ id: `industry/${i.slug}`, sh: shingles(`${i.heroSub || ""} ${(i.painPoints || []).map((p) => p.body).join(" ")}`) })),
  ...blogBodies,
];
const DUP = 0.55;
for (let i = 0; i < corpus.length; i++) {
  for (let j = i + 1; j < corpus.length; j++) {
    const sim = jaccard(corpus[i].sh, corpus[j].sh);
    if (sim >= DUP) warn("dedup", `${corpus[i].id} ~ ${corpus[j].id} (Jaccard ${sim.toFixed(2)})`);
  }
}

// ---- 5. P0 honesty lint: source + machine surfaces -------------------------
// Guards against banned strings + quarantined-as-fact stats resurfacing in
// page/component copy and the AI machine surfaces (llms.txt, ai-context.json).
// See vault "Leadkaun Brain" 00 — Canonical Facts & Corrections §2/§4/§5.
// Escape hatch: put `lk-gate-ignore` on a line to allow a legit mention
// (e.g. quoting a COMPETITOR's per-seat pricing on a /compare page).
const QUARANTINE = [
  ...DATA_HONESTY, // shared unambiguous set (india's-first, 500ms, built-in-crm, 47-min, …)
  { re: /(set ?up|go live) in (about )?an hour|in about an hour/i, name: 'unverified "~an hour" setup claim (soften to non-numeric)' },
  { re: /\b60[-\s]?minutes?\b/i,      name: 'unverified "60 minute" setup claim (soften to non-numeric)' },
  { re: /\b60[-\s]?min\b/i,           name: 'unverified "60 min" setup claim (soften to non-numeric)' },
  { re: /trusted by 50\+/i,           name: 'unverified customer count "Trusted by 50+"' },
  { re: /50\+\s*(indian\s*b2b|b2b)\s*teams/i, name: 'unverified customer count "50+ teams"' },
  { re: /₹\s?4\.2\s?cr/i,             name: 'quarantined aggregate outcome "₹4.2 Cr"' },
  { re: /per rep\.\s*in rupees/i,     name: 'banned pricing model "Per rep. In rupees." (flat per account)' },
  { re: /(starter|growth|scale)\s*[·:—-]?\s*₹\s?999\b/i, name: 'stale plan price "₹999" (Starter is ₹2,999)' },
  { re: /\b\d{2,3}\s?%\s+of\s+(indian|b2b|sales|leads|companies|teams|smbs?|businesses|reps)\b/i, name: 'uncited "N% of <population>" stat — cite a primary source or soften to "most"' },
  // NOTE: we intentionally do NOT blanket-ban "per rep/seat/user" — /compare
  // pages legitimately quote competitors' per-seat pricing. Leadkaun's own
  // flat-per-account model is guarded by the "Per rep. In rupees." phrase above
  // and by the pricing-page copy review.
];
const SRC_EXT = /\.(tsx?|jsx?)$/;
const SKIP_DIR = new Set(["node_modules", ".next", ".open-next", ".git"]);
function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const d of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIR.has(d.name)) continue;
    const p = join(dir, d.name);
    if (d.isDirectory()) walk(p, acc);
    else if (SRC_EXT.test(d.name)) acc.push(p);
  }
  return acc;
}
const DOWNLOADS = join(ROOT, "public", "downloads");
const honestyTargets = [
  ...walk(join(ROOT, "app")),
  ...walk(join(ROOT, "components")),
  ...walk(join(ROOT, "lib")), // content generators (variation.ts etc.) live here too
  join(ROOT, "public", "llms.txt"),
  join(ROOT, "public", "ai-context.json"),
  // lead-magnet downloads carry Leadkaun copy too
  ...(existsSync(DOWNLOADS) ? readdirSync(DOWNLOADS).filter((f) => /\.(csv|txt|md)$/i.test(f)).map((f) => join(DOWNLOADS, f)) : []),
].filter(existsSync);
for (const file of honestyTargets) {
  const rel = file.slice(ROOT.length + 1);
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((ln, i) => {
    if (ln.includes("lk-gate-ignore")) return;
    for (const q of QUARANTINE) {
      if (q.re.test(ln)) err(`${rel}:${i + 1}`, q.name);
    }
  });
}

// ---- report ----------------------------------------------------------------
const line = "─".repeat(64);
console.log(line);
console.log(`Content gate — ${jsonFiles.length} data files, ${industries.length} industries, ${cities.length} cities, ${blogBodies.length} blog posts`);
console.log(line);
if (errors.length) { console.log(`\n❌ ${errors.length} ERROR(s):`); errors.forEach((e) => console.log("  • " + e)); }
if (warns.length) { console.log(`\n⚠️  ${warns.length} WARNING(s):`); warns.forEach((w) => console.log("  • " + w)); }
if (!errors.length && !warns.length) console.log("\n✅ clean — no violations.");
console.log("\n" + line);
console.log(`Result: ${errors.length} error(s), ${warns.length} warning(s).`);

if (errors.length && !WARN_ONLY) process.exit(1);
