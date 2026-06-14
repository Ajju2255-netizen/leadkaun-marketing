import type { Metadata } from "next"
import { ComparePageLayout } from "@/app/components/compare-layout"

export const metadata: Metadata = {
  title: "Leadkaun vs Zoho CRM (2026) — Which is better for Indian sales teams?",
  description:
    "Honest side-by-side of Leadkaun vs Zoho CRM for Indian B2B SMBs — feature matrix, INR pricing, rep adoption, WhatsApp support. Plus a switching guide.",
  alternates: { canonical: "/compare/leadkaun-vs-zoho-crm" },
}

export default function VsZoho() {
  return (
    <ComparePageLayout
      competitor="Zoho CRM"
      competitorShort="Zoho"
      tldr="Zoho CRM is the default Indian SMB CRM — recognised brand, huge feature surface. Leadkaun is a different category: a Sales Behaviour OS that reshapes what reps do next. Most teams run both for 60–90 days, then consolidate."
      positioning="Zoho CRM has been the #1 CRM for Indian SMBs for a decade. It excels at recording activity and accommodating deep customisation. The seams appear where Indian sales reality pushes hardest: rep adoption (UI complexity), WhatsApp as a first-class channel, and behaviour-level tracking (grading, queueing, ₹-at-risk)."
      strengths={[
        "Recognised brand; easy internal buy-in",
        "60+ native Zoho Suite integrations",
        "Deep customisation via Deluge + custom modules",
        "Long-tail scales from tiny teams to 500+ reps",
      ]}
      weaknesses={[
        "Logging a call takes 4–6 clicks; reps disengage",
        "WhatsApp is an add-on integration, not native",
        "Lead scoring is points-based with no decay",
        "No Priority Queue auto-ranking",
        "No ₹-at-risk Missed Opportunity Engine",
      ]}
      features={[
        { label: "3-dimensional lead scoring (Fit × Intent × Quality)", leadkaun: true,            competitor: false },
        { label: "Intent decay over time",                              leadkaun: true,            competitor: false },
        { label: "Priority Queue (auto-ranked, real-time)",             leadkaun: true,            competitor: false },
        { label: "Missed Opportunity Engine (₹-denominated)",           leadkaun: true,            competitor: false },
        { label: "Morning Brief at 8:30 AM IST",                        leadkaun: true,            competitor: false },
        { label: "WhatsApp as first-class signal (3-tap)",              leadkaun: true,            competitor: "Integration" },
        { label: "Workflow customisation (Deluge-style)",               leadkaun: "neutral",       competitor: true  },
        { label: "Zoho Suite integrations (Books, Desk, Projects)",     leadkaun: false,           competitor: true  },
        { label: "Setup time",                                          leadkaun: "60 min",        competitor: "1–4 wks" },
        { label: "Rep adoption (typical Indian SMB)",                   leadkaun: "80%+",          competitor: "30–40%" },
      ]}
      pricing={{
        leadkaun:   { tier: "Growth",        price: "₹1,999 / rep / mo", note: "All 12 modules, 14-day free trial, no credit card" },
        competitor: { tier: "Professional",  price: "₹2,400 / rep / mo", note: "Plus implementation + admin overhead (₹50k–₹1.5L/month)" },
      }}
      switching={[
        { title: "Export from Zoho",             body: "Export leads, contacts, deals, activity history as CSV. Keep only the last 90 days of live data; archive the rest." },
        { title: "Onboard Leadkaun",             body: "60-minute wizard with pre-configured ICP for your industry. Import the live CSVs." },
        { title: "Run parallel for 30 days",     body: "Keep Zoho in read-only mode as an archive. Reps work out of Leadkaun. Measure ₹ recovered." },
        { title: "Decide at day 60",             body: "If the Missed Opportunity Engine recovers more than the combined subscription cost, consolidate. If Zoho's workflow depth still justifies it, keep both." },
      ]}
      faqs={[
        { q: "Can I keep using Zoho for some things?", a: "Absolutely. Many teams run Zoho for long-tail customisation and Leadkaun for the behaviour layer. The CSV export path and webhook ingestion make coexistence low-friction." },
        { q: "How do we handle our existing Zoho workflows?", a: "Map each workflow to a Leadkaun equivalent (Priority Queue, Follow-up Engine, Morning Brief). Most cover 80%+ of Zoho workflow use cases natively." },
        { q: "We've customised Zoho heavily. Is migration painful?", a: "The custom fields export cleanly as CSV columns. Leadkaun ingests arbitrary columns as custom fields. The hardest part is psychological, not technical." },
        { q: "Will my reps find Leadkaun easier?", a: "Yes — the 3-tap logging is the design constraint. Typical rep adoption on Leadkaun reaches 80%+ within two weeks. On Zoho, mid-market Indian SMBs average 30–40%." },
        { q: "Is the pricing really INR with GST?", a: "Yes. All Leadkaun invoices are INR, GST-compliant, no USD surcharge." },
      ]}
    />
  )
}
