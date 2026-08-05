/**
 * pSEO sibling-overlap measurement harness (P1 measurement).
 *
 * Gives a real, re-runnable baseline for the "74–80% sibling overlap" claim so we
 * can tell whether de-homogenisation work is actually moving the needle. It
 * reconstructs each keyword-leaf's crawler-visible text using the SAME variation
 * functions the route uses (imported from lib/pseo/variation.ts — no duplication)
 * plus the real pSEO data, then measures pairwise Jaccard similarity within
 * "sibling" groups along each axis.
 *
 * Run:  npm run measure:overlap
 *       (node --experimental-strip-types — Node ≥ 22.6)
 *
 * Faithfulness note: the boilerplate template strings below MIRROR the leaf route
 * (app/[industry]/[city]/[keyword]/page.tsx). The VARIABLE parts (intro framing,
 * FAQ subset) come from the real variation functions, so the *differentiation* is
 * measured exactly; only the static scaffold is mirrored. Keep in sync if the
 * route's copy changes materially.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { stableHash, pickN, keywordIntro } from "../lib/pseo/variation.ts";
import { SHARED_FAQS, SCORING_DIMENSIONS, GRADE_A_THRESHOLD, REFERENCES, FIT_WORKED_EXAMPLE } from "../lib/pseo/shared-content-data.ts";
import { MODULES, type SpineModule } from "../lib/pseo/spine-content.ts";
import gate from "../lib/pseo/gate.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (p: string) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));

type City = { slug: string; name: string; state: string; tier: number; population: number; notes?: string; districts?: string; localBiz?: string };
type Industry = { slug: string; name: string; channels: string[]; ticketBand: string; salesCycle: string; faqs: { q: string; a: string }[]; relatedFeatures?: string[] };
type Keyword = { slug: string; label: string; benefitBullets: string[]; body?: string[]; faqs?: { q: string; a: string }[]; featureLink?: string };

const cities: City[] = readJson("data/pseo/cities.json");
const industries: Industry[] = readJson("data/pseo/industries.json");
const keywords: Keyword[] = readJson("data/pseo/keywords.json");

// ── Reconstruct the crawler-visible text of one leaf (mirrors the route) ──────
// CORRECTED 2026-08: this previously measured only the hero, intro, benefit
// bullets, city context and 3 industry FAQs. It EXCLUDED the four SellSpine
// blocks, MethodologyCard, ReferencesBlock, the shared FAQ pool and kw.body —
// roughly 700-900 words that ship byte-identical on every leaf. The old ~52%
// baseline therefore understated duplication and, worse, excluded precisely the
// text the de-duplication work removes, so the number could not have moved.
//
// `includeSpine` lets us measure before/after the SellSpine removal on the same
// harness rather than comparing two different rulers.
function leafDoc(ind: Industry, city: City, kw: Keyword, includeSpine = true): string {
  const seed = stableHash(`${ind.slug}:${city.slug}:${kw.slug}`);
  // mirrors buildLeafFaqs() in lib/pseo/shared-content.ts
  const seen = new Set<string>();
  const faqs = [...pickN(ind.faqs, Math.min(3, ind.faqs.length), seed), ...(kw.faqs ?? []).slice(0, 2), ...pickN(SHARED_FAQS, 3, seed ^ 0x9e3779b9)]
    .filter((f) => { const k = f.q.trim().toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
  const indLower = ind.name.toLowerCase();
  const kwLower = kw.label.toLowerCase();
  const intro = keywordIntro(
    { industryName: ind.name, industryLower: indLower, cityName: city.name, keywordLabel: kw.label, keywordLower: kwLower },
    seed,
  );
  const parts: string[] = [
    `${kw.label} for ${ind.name} Teams in ${city.name}`,
    `Leadkaun's ${kwLower} is built for how ${city.name}-based ${indLower} teams actually sell — Indian phone handling, WhatsApp as a first-class lead signal, ₹ figures in Indian formatting throughout.`,
    intro,
    ...kw.benefitBullets,
    ...(kw.body ?? []),
    `In ${city.name}, ${indLower} teams typically work leads from ${ind.channels.slice(0, 3).join(", ")} — with deal sizes in the ${ind.ticketBand} range and sales cycles of ${ind.salesCycle}. Leadkaun's ${kwLower} is calibrated for those realities, not a generic US B2B default.`,
  ];
  if (city.notes) {
    parts.push(`In ${city.name}, ${city.state}, B2B demand concentrates in local sectors. ${city.notes.replace(/\.$/, "")}. Leadkaun scores every lead here on fit, intent and quality, so reps work the highest-probability enquiries first.`);
  }
  if (city.districts) {
    parts.push(`Commercial activity clusters around ${city.districts}${city.localBiz ? `, with the local economy built on ${city.localBiz}` : ""} — the areas a ${city.name} ${indLower} pipeline most often draws from. Leadkaun grades and queues those enquiries so the highest-intent ones surface first, wherever they land.`);
  }

  // MethodologyCard — identical on every leaf.
  for (const d of SCORING_DIMENSIONS) { parts.push(d.tag); parts.push(d.range); parts.push(d.body); }
  parts.push(GRADE_A_THRESHOLD);
  if (FIT_WORKED_EXAMPLE[ind.slug]) parts.push(FIT_WORKED_EXAMPLE[ind.slug]);

  if (includeSpine) {
    // Post-Phase-3 spine: ProductShowcase (already per-page) + a 3-module subset
    // selected by lib/pseo/spine.ts. WhyNotCRM and PricingCTA were removed from
    // pSEO entirely — 6 identical compare rows on ~25k pages under an eyebrow
    // that contradicted the positioning, plus a second CTA duplicating CTABanner.
    parts.push(`This is the screen ${city.name} ${indLower} teams work from: every lead graded A–F, a live Priority Queue per rep, and the ₹ at risk surfaced in real rupees.`);
    parts.push(`The modules behind ${kwLower}.`);
    const shown = mirrorSelectModules(ind, city, kw);
    for (const m of shown) { parts.push(m.tag); parts.push(m.title); parts.push(m.description); }
  }

  // ReferencesBlock — identical on every leaf.
  for (const r of REFERENCES) { parts.push(r.label); parts.push(r.note); }

  for (const f of faqs) { parts.push(f.q); parts.push(f.a); }
  return parts.join(" ");
}

/**
 * Mirrors selectModules() in lib/pseo/spine.ts.
 *
 * Duplicated rather than imported because spine.ts uses extensionless relative
 * imports, which `node --experimental-strip-types` cannot resolve, and adding
 * `.ts` extensions there would break `tsc`. Same standing contract as the route
 * template strings above: KEEP IN SYNC — this decides which modules a cell shows,
 * i.e. exactly the differentiation being measured.
 */
const SUBSET = 3;
function toKey(ref: string) { return ref.replace(/^\/features\//, "").replace(/^\//, "").trim(); }
function mirrorSelectModules(ind: Industry, city: City, kw: Keyword): SpineModule[] {
  const seedKey = `${ind.slug}:${city.slug}:${kw.slug}`;
  const byKey = new Map(MODULES.map((m) => [m.key, m]));
  const out: SpineModule[] = [];
  const take = (m?: SpineModule) => { if (m && !out.some((x) => x.key === m.key) && out.length < SUBSET) out.push(m); };
  if (kw.featureLink) take(byKey.get(toKey(kw.featureLink)));
  for (const r of ind.relatedFeatures ?? []) take(byKey.get(toKey(r)));
  if (out.length < SUBSET) {
    const affine = MODULES.filter((m) => m.affinity.includes(ind.slug));
    for (const m of pickN(affine, affine.length, stableHash(seedKey))) take(m);
  }
  if (out.length < SUBSET) for (const m of pickN(MODULES, MODULES.length, stableHash(seedKey + ":fill"))) take(m);
  return out;
}

// ── Shingling + Jaccard ───────────────────────────────────────────────────────
function shingles(text: string, n = 3): Set<string> {
  const w = text.toLowerCase().replace(/[^a-z0-9₹]+/g, " ").split(/\s+/).filter(Boolean);
  const out = new Set<string>();
  for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(" "));
  return out;
}
function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  const [small, big] = a.size < b.size ? [a, b] : [b, a];
  for (const x of small) if (big.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

// Deterministic even-spaced sample (reproducible run-to-run for trend tracking).
function sample<T>(arr: T[], n: number): T[] {
  if (arr.length <= n) return arr;
  const step = arr.length / n;
  return Array.from({ length: n }, (_, i) => arr[Math.floor(i * step)]);
}

function stats(vals: number[]) {
  if (!vals.length) return { n: 0, mean: 0, median: 0, p90: 0, dupPct: 0 };
  const s = [...vals].sort((x, y) => x - y);
  const at = (q: number) => s[Math.min(s.length - 1, Math.floor(q * s.length))];
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const dup = vals.filter((v) => v >= 0.7).length / vals.length;
  return { n: vals.length, mean, median: at(0.5), p90: at(0.9), dupPct: dup };
}

// Mean pairwise Jaccard across a set of docs, collecting every pair value.
function pairwise(docs: Set<string>[], sink: number[]) {
  for (let i = 0; i < docs.length; i++)
    for (let j = i + 1; j < docs.length; j++) sink.push(jaccard(docs[i], docs[j]));
}

// ── Sibling-group definitions ────────────────────────────────────────────────
const liveCities = cities.filter((c) => gate.leafIndexable(c.tier, !!c.districts));
const noindexCities = cities.filter((c) => !gate.leafIndexable(c.tier, !!c.districts));

const CITY_SAMPLE = 40;      // cities per city-sibling group
const IND_SAMPLE = 4;        // industries to sample for city-sibling groups
const PAIR_CTX_SAMPLE = 30;  // (ind,city) or (kw,city) contexts for kw/ind axes

const sampledInds = sample(industries, IND_SAMPLE);
const sampledCitiesAll = sample(cities, CITY_SAMPLE);
const sampledCitiesLive = sample(liveCities, CITY_SAMPLE);
const sampledCitiesNo = sample(noindexCities, CITY_SAMPLE);

// Axis 1–3: city-siblings (fix ind+kw, vary city) — split by gate.
function cityAxis(pool: City[], spine = true) {
  const vals: number[] = [];
  for (const ind of sampledInds)
    for (const kw of keywords) {
      const docs = pool.map((c) => shingles(leafDoc(ind, c, kw, spine)));
      pairwise(docs, vals);
    }
  return stats(vals);
}
const cityLiveStats = cityAxis(sampledCitiesLive);
const cityLiveNoSpine = cityAxis(sampledCitiesLive, false);
const cityAllStats = cityAxis(sampledCitiesAll);
const cityNoStats = cityAxis(sampledCitiesNo);

// Axis 4: keyword-siblings (fix ind+city, vary kw across all 4).
const kwVals: number[] = [];
for (const ind of sampledInds)
  for (const city of sample(liveCities, PAIR_CTX_SAMPLE)) {
    const docs = keywords.map((kw) => shingles(leafDoc(ind, city, kw)));
    pairwise(docs, kwVals);
  }
const kwStats = stats(kwVals);

// Axis 5: industry-siblings (fix kw+city, vary industry across all).
const indVals: number[] = [];
for (const kw of keywords)
  for (const city of sample(liveCities, PAIR_CTX_SAMPLE)) {
    const docs = industries.map((ind) => shingles(leafDoc(ind, city, kw)));
    pairwise(docs, indVals);
  }
const indStats = stats(indVals);

// ── Report ────────────────────────────────────────────────────────────────────
const pct = (x: number) => (x * 100).toFixed(1).padStart(5) + "%";
const line = "─".repeat(74);
const row = (label: string, s: ReturnType<typeof stats>) =>
  `  ${label.padEnd(34)} ${pct(s.mean)}   ${pct(s.median)}   ${pct(s.p90)}   ${pct(s.dupPct)}   ${String(s.n).padStart(7)}`;

console.log(line);
console.log(`pSEO sibling-overlap — leaf = /[industry]/[city]/[keyword]`);
console.log(`corpus: ${industries.length} industries × ${cities.length} cities × ${keywords.length} keywords`);
console.log(`leaf cities: ${liveCities.length} Live (indexable) · ${noindexCities.length} gated noindex`);
console.log(line);
console.log(`  ${"sibling axis".padEnd(34)} ${" mean"}   ${"  med"}   ${"  p90"}   ${" ≥0.70"}   ${"  pairs"}`);
console.log(line);
console.log(row("city-siblings · Live leaves", cityLiveStats));
console.log(row("  ↳ same, spine excluded", cityLiveNoSpine));
console.log(row("city-siblings · all leaves", cityAllStats));
console.log(row("city-siblings · gated (noindex)", cityNoStats));
console.log(row("keyword-siblings (same ind+city)", kwStats));
console.log(row("industry-siblings (same kw+city)", indStats));
console.log(line);
console.log(`mean = avg pairwise Jaccard over 3-word shingles · ≥0.70 = share of near-duplicate pairs`);
console.log(`Baseline for de-homogenisation (variation.ts). Re-run after changes to track the trend.`);
console.log(line);
