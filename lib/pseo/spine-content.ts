/**
 * Text for the shared "spine" blocks, extracted from app/components/sell/blocks.tsx.
 *
 * Three consumers now read this one source: the rendered component, the overlap
 * harness (scripts/measure-overlap.ts), and the per-page module selector
 * (lib/pseo/spine.ts). Previously the text lived only inside the component, which
 * meant the harness could not see it — and it is roughly 700 words that shipped
 * byte-identical on ~17k pages, i.e. exactly the duplication we needed to measure.
 *
 * Icons and accent colours stay in the component; this file is text only, so it
 * can be imported from plain Node scripts.
 */

export type SpineModule = {
  key: string
  tag: string
  title: string
  description: string
  href: string
  /** Which industries this module lands hardest for; used to pick a per-page subset. */
  affinity: string[]
}

export const MODULES: readonly SpineModule[] = [
  {
    key: "lead-scoring", tag: "Scoring", title: "Lead Scoring Engine",
    description: "Grade A–F in real time. Fit + Intent + Quality, transparent weights, decay baked in.",
    href: "/features/lead-scoring",
    affinity: ["saas", "fintech", "bfsi", "manufacturing", "logistics"],
  },
  {
    key: "priority-queue", tag: "Queue", title: "Priority Queue",
    description: "One ranked list per rep. Re-ranks live as signals arrive — so the rep just works top-down.",
    href: "/features/priority-queue",
    affinity: ["real-estate", "edtech", "bfsi", "healthcare", "retail"],
  },
  {
    key: "missed-opportunity-engine", tag: "Revenue", title: "Missed Opportunity Engine",
    description: "Every stale lead gets a rupee value. Aggregate ₹ at risk surfaced daily to every manager.",
    href: "/features/missed-opportunity-engine",
    affinity: ["real-estate", "manufacturing", "logistics", "hospitality"],
  },
  {
    key: "morning-brief", tag: "Digest", title: "Morning Brief",
    description: "8:30 AM IST email. Top Grade A leads, overdue follow-ups, ₹ at risk today. Sets the day.",
    href: "/features/morning-brief",
    affinity: ["bfsi", "edtech", "agencies", "healthcare"],
  },
  {
    key: "whatsapp-tracking", tag: "Signal", title: "WhatsApp Tracking",
    description: "Most Indian B2B first-contact happens on WhatsApp. 3-tap logging feeds the Intent Score.",
    href: "/features/whatsapp-tracking",
    affinity: ["retail", "real-estate", "hospitality", "healthcare", "edtech"],
  },
  {
    key: "sales-rep-tracking", tag: "Team", title: "Sales Rep Tracking",
    description: "Per-rep ₹ recovered, Grade A response time, follow-up completion — without micromanagement.",
    href: "/features/sales-rep-tracking",
    affinity: ["agencies", "saas", "logistics", "manufacturing", "fintech"],
  },
]

/**
 * Rows for the "what a CRM does vs what Leadkaun adds" table.
 *
 * Renamed in intent from the old WhyNotCRM framing: Brain 02 locks the hybrid
 * wedge ("alongside, not instead-of"), and the previous eyebrow "This is not a
 * CRM" both contradicted that and actively repelled the sales-crm queries the
 * site is trying to win.
 */
export const ALONGSIDE_ROWS: readonly { left: string; right: string }[] = [
  { left: "Records the number of calls your reps made this week.", right: "Surfaces ₹ at risk per rep, per week — money, not activity." },
  { left: "Lead scoring is a single black-box number.", right: "Three transparent scores: Fit, Intent, Quality — auditable weights." },
  { left: "Grade A leads age out silently. Nobody notices.", right: "Intent decay auto-drops stale leads. The queue stays honest." },
  { left: "Priority decided by rep gut feel or recency.", right: "Priority Queue re-ranks live — rep works top-down, no triage." },
  { left: "First contact happens on WhatsApp and never gets recorded.", right: "WhatsApp is a first-class signal. 3-tap logging feeds scoring." },
  { left: "Monday reviews are activity debates.", right: "Monday reviews open with ₹ at risk per rep. Coaching is specific." },
]
