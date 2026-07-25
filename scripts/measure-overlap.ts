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
import gate from "../lib/pseo/gate.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (p: string) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));

type City = { slug: string; name: string; state: string; tier: number; population: number; notes?: string; districts?: string; localBiz?: string };
type Industry = { slug: string; name: string; channels: string[]; ticketBand: string; salesCycle: string; faqs: { q: string; a: string }[] };
type Keyword = { slug: string; label: string; benefitBullets: string[] };

const cities: City[] = readJson("data/pseo/cities.json");
const industries: Industry[] = readJson("data/pseo/industries.json");
const keywords: Keyword[] = readJson("data/pseo/keywords.json");

// ── Reconstruct the crawler-visible text of one leaf (mirrors the route) ──────
function leafDoc(ind: Industry, city: City, kw: Keyword): string {
  const seed = stableHash(`${ind.slug}:${city.slug}:${kw.slug}`);
  const faqs = pickN(ind.faqs, Math.min(3, ind.faqs.length), seed);
  const indLower = ind.name.toLowerCase();
  const kwLower = kw.label.toLowerCase();
  const intro = keywordIntro(
    { industryName: ind.name, industryLower: indLower, cityName: city.name, keywordLabel: kw.label, keywordLower: kwLower },
    seed,
  );
  const parts: string[] = [
    `${kw.label} for ${ind.name} Teams in ${city.name}`,
    `Leadkaun's ${kwLower} is built for how ${city.name}-based ${indLower} teams actually sell — Indian phone handling, WhatsApp as a first-class signal, lakhs/crores throughout.`,
    intro,
    ...kw.benefitBullets,
    `In ${city.name}, ${indLower} teams typically work leads from ${ind.channels.slice(0, 3).join(", ")} — with deal sizes in the ${ind.ticketBand} range and sales cycles of ${ind.salesCycle}. Leadkaun's ${kwLower} is calibrated for those realities, not a generic US B2B default.`,
  ];
  if (city.notes) {
    parts.push(`${city.name} is a Tier-${city.tier} market in ${city.state}, home to roughly ${(city.population / 1e6).toFixed(1)} million people. ${city.notes.replace(/\.$/, "")}. Leadkaun scores every lead here on fit, intent and quality, so reps work the highest-probability enquiries first.`);
  }
  if (city.districts) {
    parts.push(`Commercial activity clusters around ${city.districts}${city.localBiz ? `, with the local economy built on ${city.localBiz}` : ""} — the areas a ${city.name} ${indLower} pipeline most often draws from. Leadkaun grades and queues those enquiries so the highest-intent ones surface first, wherever they land.`);
  }
  parts.push(`This is the screen ${city.name} ${indLower} teams work from: every lead graded A–F, a live Priority Queue per rep, and the ₹ at risk surfaced in real rupees.`);
  for (const f of faqs) { parts.push(f.q); parts.push(f.a); }
  return parts.join(" ");
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
function cityAxis(pool: City[]) {
  const vals: number[] = [];
  for (const ind of sampledInds)
    for (const kw of keywords) {
      const docs = pool.map((c) => shingles(leafDoc(ind, c, kw)));
      pairwise(docs, vals);
    }
  return stats(vals);
}
const cityLiveStats = cityAxis(sampledCitiesLive);
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
console.log(row("city-siblings · all leaves", cityAllStats));
console.log(row("city-siblings · gated (noindex)", cityNoStats));
console.log(row("keyword-siblings (same ind+city)", kwStats));
console.log(row("industry-siblings (same kw+city)", indStats));
console.log(line);
console.log(`mean = avg pairwise Jaccard over 3-word shingles · ≥0.70 = share of near-duplicate pairs`);
console.log(`Baseline for de-homogenisation (variation.ts). Re-run after changes to track the trend.`);
console.log(line);
