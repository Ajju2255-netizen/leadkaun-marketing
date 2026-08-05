#!/usr/bin/env node
/**
 * Regenerates the metrics in CONTENT-REBUILD-TRACKER.md from actual repo state.
 *
 *   npm run tracker
 *
 * Hand-maintained status docs rot — EXECUTION-ROADMAP.md and WEBSITE-STATUS.md in
 * this repo are both months stale, and the Brain manual described a Sheets sync as
 * unshipped a day after it shipped. So the numbers here are measured, not typed:
 * gate errors, blueprint count, sitemap totals and capability coverage all come
 * from running the real checks. Phase status stays hand-set, because "is this
 * phase done" is a judgement; the evidence under it is not.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const START = "<!-- BEGIN generated:metrics -->";
const END = "<!-- END generated:metrics -->";

const sh = (cmd) => { try { return execSync(cmd, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }); } catch (e) { return (e.stdout ?? "") + (e.stderr ?? ""); } };

// ── gate ────────────────────────────────────────────────────────────────────
const gate = sh("node scripts/content-gate.mjs --warn");
const gm = /Result: (\d+) error\(s\), (\d+) warning\(s\)/.exec(gate) ?? [, "?", "?"];

// ── truth coverage ──────────────────────────────────────────────────────────
const truth = sh("node scripts/truth-report.mjs");
const unmarketed = (/(\d+) shipped capabilit(?:y has|ies have) zero marketing coverage/.exec(truth) ?? [, "?"])[1];
const unmarketedList = (/→ (.+)/.exec(truth) ?? [, "—"])[1].trim();

// ── data-layer counts ───────────────────────────────────────────────────────
const j = (f) => JSON.parse(readFileSync(join(ROOT, "data", f), "utf8"));
const ledger = j("product-truth.json");
const blueprints = j("blueprints.json");
const shipped = ledger.capabilities.filter((c) => c.status === "shipped").length;
const notShipped = ledger.capabilities.filter((c) => ["dark", "not-shipped", "DISPUTED", "never-market"].includes(c.status)).length;
const partial = ledger.capabilities.filter((c) => c.status === "partial").length;

const pseo = (f) => JSON.parse(readFileSync(join(ROOT, "data", "pseo", f), "utf8"));
const counts = {
  pillars: pseo("pillars.json").length,
  best: pseo("best.json").length,
  glossary: pseo("glossary.json").length,
  cities: pseo("cities.json").length,
};

// ── sitemap ─────────────────────────────────────────────────────────────────
let urls = 0, geo = 0;
const pub = join(ROOT, "public");
const citySlugs = new Set(pseo("cities.json").map((c) => c.slug));
if (existsSync(pub)) {
  for (const f of readdirSync(pub).filter((f) => /^sitemap-.*\.xml$/.test(f))) {
    for (const m of readFileSync(join(pub, f), "utf8").matchAll(/<loc>https:\/\/leadkaun\.com([^<]*)<\/loc>/g)) {
      urls++;
      if (m[1].split("/").some((s) => citySlugs.has(s))) geo++;
    }
  }
}
const geoPct = urls ? ((geo / urls) * 100).toFixed(1) : "?";

const rows = [
  ["Gate errors", `**${gm[1]}**`, "`npm run gate` — must be 0 to ship"],
  ["Gate warnings", gm[2], "advisory; comparative-copy reviews + city notes"],
  ["Ledger capabilities", `${ledger.capabilities.length}`, `${shipped} shipped · ${partial} partial · ${notShipped} not-shipped/dark`],
  ["Shipped but unmarketed", `**${unmarketed}**`, unmarketedList],
  ["Page-type blueprints", `${blueprints.pageTypes.length}`, "each with a unique thesis, enforced"],
  ["Indexable URLs", urls.toLocaleString(), "sum of sitemap shards"],
  ["…of which city-scoped", `${geo.toLocaleString()} (${geoPct}%)`, "the concentration Phase 3 is reducing"],
  ["Pillars / guides / glossary", `${counts.pillars} / ${counts.best} / ${counts.glossary}`, "the non-geo corpus"],
];

const block = [
  START,
  "",
  `_Measured ${new Date().toISOString().slice(0, 10)} by \`npm run tracker\`. Do not hand-edit this block._`,
  "",
  "| Metric | Value | Notes |",
  "|---|---|---|",
  ...rows.map(([a, b, c]) => `| ${a} | ${b} | ${c} |`),
  "",
  END,
].join("\n");

const p = join(ROOT, "CONTENT-REBUILD-TRACKER.md");
let txt = existsSync(p) ? readFileSync(p, "utf8") : "";
const i = txt.indexOf(START), k = txt.indexOf(END);
if (i !== -1 && k !== -1) txt = txt.slice(0, i) + block + txt.slice(k + END.length);
else txt = txt.replace(/\s*$/, "\n\n") + block + "\n";
writeFileSync(p, txt);
console.log(`tracker updated — ${gm[1]} gate errors, ${unmarketed} unmarketed capabilities, ${urls} URLs (${geoPct}% geo)`);
