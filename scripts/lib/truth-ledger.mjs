/**
 * Product Truth Ledger — compiler + checker.
 *
 * Consumed by scripts/content-gate.mjs (copy linting) and scripts/truth-report.mjs
 * (coverage reporting). The ledger itself lives at data/product-truth.json.
 *
 * Why this exists: marketing copy claimed assignment rules, round-robin routing,
 * territory routing and an "unassigned queue" in 8+ places. None of it ships. The
 * existing gate could not catch it because it only knew about hardcoded phrases
 * someone had already thought of. This inverts that — the ledger enumerates what
 * the PRODUCT does, and any copy claiming more than that fails.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** Statuses whose deny[] patterns are always an ERROR, with no escape via context. */
const HARD_FAIL = new Set(["not-shipped", "dark", "DISPUTED", "never-market"]);
/** Statuses where nearby hedging language ("manual", "your CRM", "roadmap") rescues the line. */
const CONTEXT_SOFTENS = new Set(["partial"]);

export function loadLedger(root) {
  const p = join(root, "data", "product-truth.json");
  if (!existsSync(p)) throw new Error("product-truth.json missing — the truth ledger is required");
  return JSON.parse(readFileSync(p, "utf8"));
}

/**
 * Pre-compile every deny[] pattern once. Returns a flat rule list so the hot
 * per-string loop in the gate does no regex construction.
 */
export function compileLedger(ledger) {
  const rules = [];
  for (const cap of ledger.capabilities ?? []) {
    for (const src of cap.deny ?? []) {
      rules.push({
        capId: cap.id,
        label: cap.label ?? cap.id,
        status: cap.status,
        re: new RegExp(src, "i"),
        allowIfNear: (cap.allowIfNear ?? []).map((s) => new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")),
        allowFiles: new Set(cap.allowFiles ?? []),
        claimable: cap.claimable,
      });
    }
  }
  return rules;
}

/**
 * Lint one string. `file` is the basename for data files, or a repo-relative path
 * for source — allowFiles is matched against the basename either way.
 *
 * allowFiles handles genuinely comparative files (competitors.json, best.json,
 * alternatives.json) which MUST be able to describe a rival's real routing. To
 * stop a false Leadkaun claim hiding there, the exemption is withdrawn the moment
 * the same string mentions Leadkaun.
 */
/**
 * Structural fields carry identifiers, not claims. A slug or href of
 * "/learn/lead-routing" is an address; the page it points at is linted on its own
 * prose. Linting these produces noise that can never be fixed without renaming
 * URLs, which is a separate (and costlier) decision.
 */
const IDENTIFIER_PATH = /(^|\.)(slug|href|url|category|relatedFeature)$|(^|\.)(relatedTerms|relatedPillars|relatedCompares|relatedFeatures|aliases|industries|keywords)\[\d+\]$/;

export function ledgerCheck(text, file, rules, path = "") {
  const out = [];
  if (path && IDENTIFIER_PATH.test(path)) return out;
  const base = file.includes("/") ? file.slice(file.lastIndexOf("/") + 1) : file;
  const mentionsUs = /leadkaun/i.test(text);
  for (const r of rules) {
    const m = r.re.exec(text);
    if (!m) continue;
    // A negated mention is a disclaimer, not a claim: "no round-robin bot",
    // "we don't do territory routing". These are exactly the sentences the
    // corrected copy will be full of, so they must never fail.
    if (/\b(no|not|never|without|isn'?t|aren'?t|doesn'?t|don'?t|lacks?|unlike)\s+\S{0,12}$/i.test(text.slice(Math.max(0, m.index - 24), m.index))) continue;
    // allowFiles: a bare name matches the basename (data files); a trailing "/"
    // marks a path prefix, which lets whole comparative directories through.
    const exempt = r.allowFiles.has(base) || [...r.allowFiles].some((a) => a.endsWith("/") && file.replace(/\\/g, "/").includes(a));
    if (exempt && !mentionsUs) continue;
    if (CONTEXT_SOFTENS.has(r.status) && r.allowIfNear.some((a) => a.test(text))) continue;
    if (r.status === "roadmap" && /\b(roadmap|coming|not yet|planned)\b/i.test(text)) continue;
    if (!HARD_FAIL.has(r.status) && !CONTEXT_SOFTENS.has(r.status) && r.status !== "roadmap") continue;
    // On a comparative surface a sentence naming BOTH us and a rival is the norm
    // ("TeleCRM charges extra for WhatsApp API; Leadkaun is flat"). Attributing the
    // capability to the right party by regex is unreliable, and these pages are
    // hand-written and few. Surface for review instead of blocking; the
    // high-volume programmatic corpus still hard-fails.
    const severity = exempt ? "warn" : "error";
    out.push({
      capId: r.capId,
      severity,
      msg: `${severity === "warn" ? "review: comparative copy mentions" : "claims unshipped capability"} "${r.label}" [${r.status}] — matched /${r.re.source}/. Allowed for Leadkaun: ${r.claimable}`,
    });
  }
  return out;
}

/**
 * Scoped escape hatch. Bare `lk-gate-ignore` still silences the legacy QUARANTINE
 * rules, but ledger rules require `lk-gate-ignore:<capability-id>` so one broad
 * ignore cannot silence every future rule on a line.
 */
export function isLedgerIgnored(line, capId) {
  return line.includes(`lk-gate-ignore:${capId}`);
}

/**
 * Assert every evidence[] path still exists in the product repo. If nba.ts gains
 * call sites or assign/route.ts moves, this fires and forces a re-review instead
 * of letting a stale ledger silently bless drift.
 */
export function checkEvidencePaths(ledger, root) {
  const productPath = process.env.LEADKAUN_PRODUCT_PATH || join(root, ledger.productRepo || "../leadkaun");
  if (!existsSync(productPath)) {
    return { skipped: true, reason: `product repo not found at ${productPath} — set LEADKAUN_PRODUCT_PATH to enable`, missing: [] };
  }
  const missing = [];
  for (const cap of ledger.capabilities ?? []) {
    for (const rel of [...(cap.evidence ?? []), ...(cap.counterEvidence ?? [])]) {
      if (!existsSync(join(productPath, rel))) missing.push(`${cap.id} → ${rel}`);
    }
  }
  return { skipped: false, missing };
}

/** Ledger staleness — a frozen ledger is a ledger that lies. */
export function checkStaleness(ledger, today = new Date()) {
  if (!ledger.reviewed) return { level: "error", days: Infinity, msg: "ledger has no `reviewed` date" };
  const days = Math.floor((today - new Date(ledger.reviewed)) / 86400000);
  if (days > 180) return { level: "error", days, msg: `ledger last reviewed ${days} days ago (>180) — re-audit the product before shipping copy` };
  if (days > 90) return { level: "warn", days, msg: `ledger last reviewed ${days} days ago (>90) — schedule a re-audit` };
  return { level: "ok", days };
}
