import type { Metadata } from "next"
import { ComparePageLayout } from "@/app/components/compare-layout"

export const metadata: Metadata = {
  title: "Leadkaun vs Pipedrive (2026) — Best CRM for Indian sales teams?",
  description:
    "Honest side-by-side of Leadkaun vs Pipedrive for Indian B2B SMBs — INR vs USD pricing, WhatsApp support, lead scoring, rep adoption. Plus a switching guide.",
  alternates: { canonical: "/compare/leadkaun-vs-pipedrive" },
}

export default function VsPipedrive() {
  return (
    <ComparePageLayout
      competitor="Pipedrive"
      competitorShort="Pipedrive"
      tldr="Pipedrive is a clean, global pipeline CRM that reps genuinely adopt — but it's priced per user in USD and has no India-first behaviour layer. Leadkaun is a Sales Behaviour OS built for Indian B2B: flat INR pricing, A–F lead grading, a live Priority Queue, and WhatsApp as a first-class signal."
      positioning="Pipedrive is a sales-first, visual-pipeline CRM popular worldwide with SMB and mid-market outbound teams. Its strength is a Kanban pipeline reps actually use. The gaps for Indian B2B show up in pricing model (per-user USD, FX exposure), WhatsApp (add-on only), and behaviour-level intelligence (native scoring and prioritisation are thin)."
      strengths={[
        "Visual drag-and-drop pipeline with a low learning curve",
        "Strong activity tracking, email sync, and automation on higher tiers",
        "Large integration marketplace and mature ecosystem",
        "Solid reporting and forecasting from Professional up",
      ]}
      weaknesses={[
        "Priced per user in USD — cost scales with headcount, plus FX",
        "No native WhatsApp — only via paid marketplace integrations",
        "No strong native lead-scoring / auto-prioritisation engine",
        "No India-specific UX (lakh/crore, Indian phone normalisation)",
        "Heavier automation gated behind higher-priced tiers",
      ]}
      features={[
        { label: "3-dimensional lead scoring (Fit × Intent × Quality)", leadkaun: true,          competitor: false },
        { label: "Intent decay over time",                              leadkaun: true,          competitor: false },
        { label: "Priority Queue (auto-ranked, real-time)",             leadkaun: true,          competitor: false },
        { label: "Missed Opportunity Engine (₹-denominated)",           leadkaun: true,          competitor: false },
        { label: "Morning Brief at 8:30 AM IST",                        leadkaun: true,          competitor: false },
        { label: "WhatsApp as first-class signal (3-tap)",              leadkaun: true,          competitor: "Add-on" },
        { label: "Visual pipeline (Kanban)",                            leadkaun: "neutral",     competitor: true  },
        { label: "Pricing model",                                       leadkaun: "Flat/account", competitor: "Per user (USD)" },
        { label: "India-specific UX",                                   leadkaun: true,          competitor: false },
        { label: "Setup time",                                          leadkaun: "same day",      competitor: "Days" },
      ]}
      pricing={{
        leadkaun:   { tier: "Growth",   price: "₹7,999 / mo", note: "Flat per account, all 12 modules, 14-day free trial" },
        competitor: { tier: "Advanced", price: "~$29 / user / mo", note: "USD, per user (annual) — roughly ₹2,400+/user/mo plus FX; scales with team size. Pricing as of 2026 — verify current rate." },
      }}
      switching={[
        { title: "Export from Pipedrive", body: "Export leads, deals, and activities as CSV. Keep the last 90 days of live data; archive the rest." },
        { title: "Onboard Leadkaun",      body: "Same-day wizard with a pre-configured ICP for your industry. Import the live CSVs." },
        { title: "Run parallel for 30 days", body: "Keep Pipedrive read-only as an archive. Reps work out of Leadkaun's Priority Queue. Measure ₹ recovered." },
        { title: "Decide at day 60",      body: "If the Missed Opportunity Engine recovers more than the combined subscription cost, consolidate. If you rely on Pipedrive's automation depth, keep both." },
      ]}
      faqs={[
        { q: "Is Pipedrive more expensive for an Indian team?", a: "Usually, at any real headcount — it's billed per user in USD, so cost grows with every rep and carries FX. Leadkaun is a single flat INR price per account regardless of team size." },
        { q: "Does Pipedrive support WhatsApp?", a: "Not natively. WhatsApp works through third-party marketplace apps, which add cost and setup. Leadkaun treats WhatsApp as a first-class 3-tap signal that feeds the Intent Score." },
        { q: "Can I keep Pipedrive for pipeline management?", a: "Yes. Many teams keep a familiar pipeline tool and add Leadkaun for the behaviour layer — grading, queueing, and ₹-at-risk. CSV export makes coexistence low-friction." },
        { q: "Which has better lead scoring?", a: "Leadkaun grades every lead A–F on Fit, Intent, and Quality in real time with intent decay. Pipedrive's native prioritisation is thin and typically leans on integrations." },
        { q: "Is the pricing really INR with GST?", a: "Yes. All Leadkaun invoices are INR, GST-compliant, no USD surcharge." },
      ]}
    />
  )
}
