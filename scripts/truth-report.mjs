#!/usr/bin/env node
/**
 * Marketing coverage of shipped product capabilities.
 *
 *   npm run truth
 *
 * The content gate answers "are we claiming more than we ship?". This answers the
 * opposite and equally expensive question: "are we shipping more than we claim?".
 * A product audit found four fully-shipped, genuinely differentiated capabilities
 * with ZERO marketing mentions — Intake Intelligence, Import Readiness, Score
 * Evolution and recommendation-adoption measurement. This makes that visible on
 * demand instead of once, in an audit, by accident.
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadLedger, checkStaleness } from "./lib/truth-ledger.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKIP_DIR = new Set(["node_modules", ".next", ".open-next", ".git", "out"]);
const EXT = /\.(tsx?|jsx?|json|md|mdx|txt)$/;

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const d of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIR.has(d.name)) continue;
    const p = join(dir, d.name);
    if (d.isDirectory()) walk(p, acc);
    else if (EXT.test(d.name)) acc.push(p);
  }
  return acc;
}

/** Search terms per capability — the words copy would actually use. */
const TERMS = {
  "intake-intelligence": ["intake intelligence", "intake report", "before you import", "what's in your list"],
  "import-readiness": ["import readiness", "readiness band", "data readiness"],
  "score-evolution": ["score evolution", "score timeline", "why the grade changed", "why a grade changed"],
  "recommendation-measurement": ["recommendation adoption", "acceptance rate", "queue rank", "did the rep follow"],
  confidence: ["confidence score", "how much we know", "confidence band"],
  freshness: ["data freshness", "freshness band", "stale list", "how old the lead"],
  "execution-score": ["execution score"],
  "offline-logging": ["offline", "patchy", "without a connection"],
  "win-loss-attribution": ["loss analysis", "won or lost", "why deals died", "frozen"],
  "google-sheets-sync": ["google sheets"],
  "lead-scoring": ["lead scoring", "a–f", "a-f grade"],
  "priority-queue": ["priority queue"],
  "learning-engine": ["learning engine"],
  "lead-assignment": ["assign"],
  "whatsapp-logging": ["whatsapp"],
};

const ledger = loadLedger(ROOT);
const files = [
  ...walk(join(ROOT, "app")),
  ...walk(join(ROOT, "components")),
  ...walk(join(ROOT, "data")),
  ...walk(join(ROOT, "content")),
].filter((f) => !f.endsWith("product-truth.json") && statSync(f).size < 4_000_000);

const corpus = files.map((f) => ({ f: f.slice(ROOT.length + 1), text: readFileSync(f, "utf8").toLowerCase() }));

const rows = [];
for (const cap of ledger.capabilities) {
  const terms = TERMS[cap.id] ?? [cap.label.toLowerCase()];
  const hits = new Set();
  for (const { f, text } of corpus) if (terms.some((t) => text.includes(t))) hits.add(f);
  rows.push({ id: cap.id, status: cap.status, files: hits.size });
}

const line = "─".repeat(72);
console.log(line);
console.log(`Product truth coverage — ledger reviewed ${ledger.reviewed} (${ledger.capabilities.length} capabilities)`);
console.log(line);

const stale = checkStaleness(ledger);
if (stale.level !== "ok") console.log(`\n⚠️  ${stale.msg}\n`);

const shipped = rows.filter((r) => r.status === "shipped").sort((a, b) => a.files - b.files);
const other = rows.filter((r) => r.status !== "shipped").sort((a, b) => a.files - b.files);

console.log("\nSHIPPED — these are the moat. Zero coverage is a missed opportunity, not a bug:");
for (const r of shipped) {
  const flag = r.files === 0 ? "  ← UNMARKETED" : r.files < 5 ? "  ← thin" : "";
  console.log(`  ${String(r.files).padStart(4)} files  ${r.id.padEnd(30)}${flag}`);
}

console.log("\nNOT FULLY SHIPPED — coverage here is a risk, not a win:");
for (const r of other) {
  console.log(`  ${String(r.files).padStart(4)} files  ${r.id.padEnd(30)}  [${r.status}]`);
}

const unmarketed = shipped.filter((r) => r.files === 0);
console.log("\n" + line);
console.log(`${unmarketed.length} shipped capabilit${unmarketed.length === 1 ? "y has" : "ies have"} zero marketing coverage.`);
if (unmarketed.length) console.log("  → " + unmarketed.map((r) => r.id).join(", "));
