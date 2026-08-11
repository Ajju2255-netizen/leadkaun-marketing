/**
 * Pure data for the shared pSEO enrichment blocks — NO imports, deliberately.
 *
 * scripts/measure-overlap.ts runs under `node --experimental-strip-types`, which
 * cannot resolve extensionless relative imports. Keeping this file import-free
 * lets the overlap harness measure the real strings instead of mirroring them,
 * which is how it came to be measuring the wrong corpus in the first place.
 *
 * Behaviour (buildLeafFaqs) stays in shared-content.ts, which re-exports all of
 * this so no existing import site changes.
 */

export type Faq = { q: string; a: string }

/** Sources / further-reading — internal links + named public benchmarks (E-E-A-T). */
export type Reference =
  | { kind: "internal"; label: string; href: string; note: string }
  | { kind: "external"; label: string; href: string; note: string }

/** Generic, product-level questions true on every pSEO page. Hash-sampled. */
export const SHARED_FAQS: readonly Faq[] = [
  {
    q: "Does Leadkaun replace my CRM?",
    a: "No. Leadkaun runs alongside your CRM. Your CRM stays the system of record for what happened; Leadkaun is the behaviour layer that decides what happens next, grading every lead A–F, ranking each rep's Priority Queue, and surfacing the ₹ at risk. Most teams import a CSV and run both in parallel to measure the difference first.",
  },
  {
    q: "How much does Leadkaun cost?",
    a: "Pricing is flat per account, not per seat: Free ₹0, Starter ₹2,999, Growth ₹7,999 and Scale ₹19,999 per month, plus a custom Enterprise tier. Adding more reps doesn't raise the bill within a tier, so the cost stays predictable as the team grows.",
  },
  {
    q: "How does the A–F grade get decided?",
    a: "Three transparent 0–100 scores, Fit (how well the lead matches the ICP you set), Intent (engagement and signal events), and Quality (data reliability), combine into a single A–F grade. Intent decays as a lead goes silent, and the weights are fixed and auditable for every account, so a rep can always see exactly why a lead is Grade A.",
  },
  {
    q: "Does it work with WhatsApp?",
    a: "Yes. WhatsApp is a first-class signal. Reps log each exchange in three taps (stage, intent, outcome) from any regular WhatsApp account, no Business API needed, and it feeds the Intent Score. Automated sending via a BSP is on the roadmap; today the logging is manual.",
  },
  {
    q: "How do leads get into Leadkaun?",
    a: "CSV import or manual entry today, plus a generic webhook. Indian phone formats are normalised and duplicates caught on insert. Native Google Sheets sync and IndiaMART / Facebook Lead Ads connectors are on the roadmap; for now those sources come in via CSV export. Every lead is graded A–F the moment it lands.",
  },
  {
    q: "How long does it take to get started?",
    a: "You can be set up the same day. A short onboarding wizard captures your ICP industries, states, business types, decision-maker roles and budget bands, then you import a CSV and every lead is graded A–F immediately. No implementation project, no dedicated admin.",
  },
  {
    q: "Do I pay extra for each sales rep?",
    a: "No. Pricing is flat per account, so a five-rep team and a fifteen-rep team on the same tier pay the same. That's deliberate: it means you can put every rep on Leadkaun without the per-seat maths that makes teams ration access.",
  },
  {
    q: "Can I try Leadkaun before paying?",
    a: "Yes. There's a Free ₹0 tier to start, and you can trial the paid features without committing. Because setup is same-day and leads grade on import, you can see your own pipeline ranked A–F before deciding anything.",
  },
]

/**
 * Build the ~8-FAQ set for a leaf: industry-specific + keyword-specific + a
 * hash-sampled slice of the shared pool. Seeded so neighbours differ, and the
 * industry/shared subsets rotate. Deduped by question text.
 */

/** How the A–F grade is computed — the methodology card content (static, honest). */
export const SCORING_DIMENSIONS: ReadonlyArray<{ tag: string; range: string; body: string }> = [
  {
    tag: "Fit",
    range: "0–100",
    body: "How closely the lead matches the ICP you set, industry, state, business type, decision-maker role and budget band. This is the part you shape: you configure who a good customer is, not the maths behind it.",
  },
  {
    tag: "Intent",
    range: "0–100",
    body: "Engagement and signal events, source strength, WhatsApp replies, pricing-page visits, callbacks. Intent decays as a lead goes silent, so a hot lead that stops responding cools automatically instead of sitting falsely high.",
  },
  {
    tag: "Quality",
    range: "0–100",
    body: "Data reliability, completeness, phone and email validity, junk and duplicate detection. If Quality is too low the lead is capped down the grades, so bad data can never masquerade as a good lead.",
  },
]

export const GRADE_A_THRESHOLD = "A lead is Grade A when Fit ≥ 65, Intent ≥ 60 and Quality ≥ 60, the rest step down through B–F on the same fixed cut-offs. Because the weights are identical for every account, the grade stays explainable and comparable: no per-customer tuning, no hidden model."

/** Sources / further-reading — internal links + named public benchmarks (E-E-A-T). */

export const REFERENCES: readonly Reference[] = [
  { kind: "internal", label: "Indian B2B sales lead benchmarks (2026)", href: "/research/indian-b2b-sales-lead-benchmarks-2026", note: "Our own benchmark on how fast Indian B2B teams respond and where revenue leaks." },
  { kind: "internal", label: "How lead scoring works", href: "/learn/lead-scoring", note: "The full A–F methodology, Fit, Intent and Quality explained." },
  { kind: "external", label: "Harvard Business Review, The Short Life of Online Sales Leads", href: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads", note: "Firms are far more likely to qualify a lead when they respond within the hour; average response times run much longer." },
  { kind: "external", label: "Salesforce, State of Sales", href: "https://www.salesforce.com/resources/research-reports/state-of-sales/", note: "Reps spend only a minority of the week actually selling; the rest goes to admin and triage." },
]


/**
 * Per-industry worked example of the SAME real mechanism.
 *
 * The methodology block previously rendered byte-identical prose on ~17k pages.
 * The mechanism is genuinely identical — that is the point of fixed weights — but
 * what a strong Fit score MEANS differs by sector, and saying so is both true and
 * differentiating. No new facts: each line restates the published ICP inputs in
 * the vocabulary of one industry.
 */
export const FIT_WORKED_EXAMPLE: Record<string, string> = {
  "real-estate": "For a real-estate desk, Fit is mostly budget band and locality against your project mix, a ₹2 crore enquiry for a project you don't sell scores low on Fit however keen the buyer sounds.",
  edtech: "For admissions, Fit is programme match and the decision-maker: a parent enquiring for a course you run scores differently from a student browsing three institutes.",
  bfsi: "In BFSI, Fit turns on product line and eligibility band, a motor enquiry reaching a health desk is a Fit problem, not an effort problem.",
  manufacturing: "In manufacturing, Fit is order size against your minimum run and whether the buyer's sector is one you already tool for.",
  healthcare: "For healthcare, Fit is procedure match and catchment, an out-of-area enquiry for a service you offer scores lower than a local one.",
  saas: "For SaaS, Fit is company size, sector and the seniority of whoever filled the form, a founder and an intern do not score the same.",
  agencies: "For an agency, Fit is retainer band and vertical: a monthly budget below your floor caps the grade regardless of enthusiasm.",
  retail: "In B2B retail, Fit is order volume and whether the buyer is a dealer, distributor or one-off, repeat-order potential is the signal.",
  logistics: "In logistics, Fit is lane match and shipment frequency; a one-off consignment on a lane you don't run scores low.",
  hospitality: "For hospitality, Fit is event size and date fit against inventory you actually have.",
  fintech: "In fintech, Fit is ticket size and regulatory segment, an enquiry outside the segment you're licensed for cannot convert regardless of intent.",
}
