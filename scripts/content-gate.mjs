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
const jsonFiles = readdirSync(DATA).filter((f) => f.endsWith(".json"));
for (const f of jsonFiles) {
  let data; try { data = loadJson(f); } catch (e) { err(f, `invalid JSON: ${e.message}`); continue; }
  for (const [path, text] of strings(data)) {
    if (text.length < 12) continue;
    const b = text.match(bannedRe);
    if (b) warn(`${f}:${path}`, `AI-slop phrase "${b[0]}"`);
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
