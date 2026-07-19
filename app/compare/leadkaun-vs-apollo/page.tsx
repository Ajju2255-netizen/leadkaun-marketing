import type { Metadata } from "next"
import { ComparePageLayout } from "@/app/components/compare-layout"

export const metadata: Metadata = {
  title: "Leadkaun vs Apollo.io (2026) — Different Tools, Used Together",
  description:
    "Leadkaun vs Apollo.io: they solve different problems. Apollo finds and reaches net-new leads; Leadkaun grades and prioritises the leads you already have. Here's how they fit.",
  alternates: { canonical: "/compare/leadkaun-vs-apollo" },
}

export default function VsApollo() {
  return (
    <ComparePageLayout
      competitor="Apollo.io"
      competitorShort="Apollo"
      tldr="This isn't really a 'vs' — Apollo and Leadkaun solve different problems and are often used together. Apollo is a prospecting database plus outreach: it finds and emails net-new leads. Leadkaun grades, prioritises, and works the leads you already have. Think 'Apollo + Leadkaun', not 'Apollo or Leadkaun'."
      positioning="Apollo.io is a sales-intelligence and prospecting platform — a 210M+ contact database with email sequencing and a dialer, built for outbound teams building pipeline from scratch. That's a different category from a lead-management CRM. Apollo fills the top of the funnel; Leadkaun triages and prioritises what arrives, with A–F grading and a Priority Queue."
      strengths={[
        "Very large global contact/company database with filters",
        "Built-in email sequencing, dialer, and engagement",
        "Enrichment plus intent/technographic signals for targeting",
        "Generous free tier for solo prospectors",
      ]}
      weaknesses={[
        "Different category — it doesn't grade or prioritise your inbound leads",
        "Data accuracy is contested, and non-US (incl. India) coverage is weaker",
        "USD per-seat plus credit overages — costly for INR budgets",
        "No native WhatsApp, lakh/crore UI, or Indian phone normalisation",
        "No ₹ Missed Opportunity Engine, Priority Queue, or Morning Brief",
      ]}
      features={[
        { label: "Net-new lead sourcing database",                     leadkaun: false,          competitor: true  },
        { label: "Outbound email sequencing / dialer",                 leadkaun: false,          competitor: true  },
        { label: "Inbound A–F lead grading (Fit × Intent × Quality)",  leadkaun: true,           competitor: false },
        { label: "Intent decay over time",                             leadkaun: true,           competitor: false },
        { label: "Priority Queue (auto-ranked, real-time)",            leadkaun: true,           competitor: false },
        { label: "Missed Opportunity Engine (₹-denominated)",          leadkaun: true,           competitor: false },
        { label: "WhatsApp as first-class signal (3-tap)",             leadkaun: true,           competitor: false },
        { label: "India-specific UX",                                  leadkaun: true,           competitor: false },
        { label: "Pricing model",                                      leadkaun: "Flat/account", competitor: "Per seat (USD) + credits" },
      ]}
      pricing={{
        leadkaun:   { tier: "Growth",       price: "₹7,999 / mo", note: "Flat per account — manages the leads you have" },
        competitor: { tier: "Professional", price: "~$79 / user / mo", note: "USD, per user (annual) + credit consumption — sources net-new leads. As of 2026 — verify." },
      }}
      switchingLabel="Better together"
      switchingHeading="How Apollo and Leadkaun work together."
      faqHeading="Apollo + Leadkaun, explained."
      switching={[
        { title: "Apollo builds the list",  body: "Use Apollo to find and enrich net-new prospects and run outbound sequences." },
        { title: "Export replies to Leadkaun", body: "When a prospect responds or an inbound lead arrives, bring it into Leadkaun (CSV today; connector on roadmap)." },
        { title: "Leadkaun grades & queues", body: "Every lead is graded A–F and auto-ranked, so reps work the highest-intent one first." },
        { title: "Recover the ₹ at risk",   body: "Leadkaun's Missed Opportunity Engine catches leads going cold — the part Apollo doesn't cover." },
      ]}
      faqs={[
        { q: "Is Apollo a replacement for Leadkaun?", a: "No — they do different jobs. Apollo sources and reaches net-new leads; Leadkaun grades, prioritises, and works the leads you already have. Many teams use both." },
        { q: "Does Leadkaun find new leads like Apollo?", a: "No. Leadkaun does not source or enrich net-new leads — it manages and prioritises inbound and existing leads. For prospecting databases, Apollo is the right tool." },
        { q: "Should I buy both?", a: "If you run outbound prospecting and also handle inbound leads, yes — Apollo for sourcing, Leadkaun for triage and prioritisation. If you only need to work the leads already coming in, Leadkaun alone is enough." },
        { q: "Which is better for Indian data?", a: "Apollo's database is US-centric and Indian coverage is weaker. Leadkaun doesn't source data — it works whatever leads you capture, with Indian phone normalisation and lakh/crore UI." },
      ]}
    />
  )
}
