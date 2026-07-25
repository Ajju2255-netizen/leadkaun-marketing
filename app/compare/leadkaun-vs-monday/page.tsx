import type { Metadata } from "next"
import { ComparePageLayout } from "@/app/components/compare-layout"

export const metadata: Metadata = {
  title: "Leadkaun vs monday CRM (2026) — Which fits Indian sales teams?",
  description:
    "Honest side-by-side of Leadkaun vs monday CRM for Indian B2B — INR vs USD per-seat pricing, native WhatsApp, built-in lead scoring vs build-your-own.",
  alternates: { canonical: "/compare/leadkaun-vs-monday" },
}

export default function VsMonday() {
  return (
    <ComparePageLayout
      competitor="monday CRM"
      competitorShort="monday"
      tldr="monday CRM is a flexible, no-code CRM on the monday.com Work OS — great if you want to design your own pipeline and automations. But it's a blank canvas priced per seat in USD (3-seat minimum), with no native WhatsApp and no built-in lead grading. Leadkaun is opinionated: it grades and ranks leads for you, native WhatsApp, flat INR."
      positioning="monday CRM is a horizontal, highly customisable CRM built on monday.com's Work OS. Its strength is no-code flexibility — you shape the pipeline, automations, and dashboards. The gaps for Indian B2B show up in pricing (USD per-seat with a 3-seat minimum), WhatsApp (integration only), and lead intelligence (you build scoring yourself; there's no A–F grading engine)."
      strengths={[
        "No-code, highly customisable boards and automations",
        "Clean visual pipeline and dashboards",
        "Broad integration marketplace",
        "Scales beyond CRM into general work management",
      ]}
      weaknesses={[
        "USD per-seat with a 3-seat minimum — awkward and pricey for small INR teams",
        "No native WhatsApp — only via third-party connectors",
        "No built-in A–F lead grading or intent decay — you build scoring by hand",
        "Not India-first (no lakh/crore UI, no Indian phone normalisation)",
        "Flexibility means setup burden — a blank canvas, not a ready priority queue",
      ]}
      features={[
        { label: "3-dimensional lead scoring (Fit × Intent × Quality)", leadkaun: true,           competitor: false },
        { label: "Intent decay over time",                              leadkaun: true,           competitor: false },
        { label: "Priority Queue (auto-ranked, real-time)",             leadkaun: true,           competitor: false },
        { label: "Missed Opportunity Engine (₹-denominated)",           leadkaun: true,           competitor: false },
        { label: "Morning Brief at 8:30 AM IST",                        leadkaun: true,           competitor: false },
        { label: "WhatsApp as first-class signal (3-tap)",              leadkaun: true,           competitor: "Integration" },
        { label: "No-code custom workflows / work management",          leadkaun: "neutral",      competitor: true  },
        { label: "Pricing model",                                       leadkaun: "Flat/account", competitor: "Per seat (USD), 3-seat min" },
        { label: "India-specific UX",                                   leadkaun: true,           competitor: false },
        { label: "Setup time",                                          leadkaun: "same day",       competitor: "DIY / days" },
      ]}
      pricing={{
        leadkaun:   { tier: "Growth",   price: "₹7,999 / mo", note: "Flat per account, all 12 modules, 14-day free trial" },
        competitor: { tier: "Standard", price: "~$17 / seat / mo", note: "USD, per seat (annual), 3-seat minimum + bucket pricing. As of 2026 — verify current rate." },
      }}
      switching={[
        { title: "Export from monday", body: "Export leads, contacts, and deals as CSV from your monday boards." },
        { title: "Onboard Leadkaun",   body: "Same-day wizard with a pre-configured ICP; Indian phones normalise on import." },
        { title: "Run parallel",       body: "Keep monday for any non-sales work management. Reps work Leadkaun's Priority Queue for the sales motion." },
        { title: "Decide",             body: "If ready-made grading + queue beats a self-built pipeline for your team, consolidate sales into Leadkaun." },
      ]}
      faqs={[
        { q: "Is monday CRM expensive for an Indian team?", a: "It can be — it's billed per seat in USD with a 3-seat minimum, so a small team's real floor is higher than the headline price. Leadkaun is one flat INR price per account regardless of team size." },
        { q: "Does monday CRM have lead scoring?", a: "Not as a built-in engine — you construct scoring with formula columns and automations. Leadkaun grades every lead A–F on Fit × Intent × Quality in real time with intent decay, out of the box." },
        { q: "Does monday CRM support WhatsApp?", a: "Only through third-party connectors. Leadkaun treats a logged WhatsApp reply as a ranked Intent signal that can change a lead's grade." },
        { q: "When is monday the better choice?", a: "If you want one flexible tool for both CRM and general work management and are happy to build your own workflows, monday's no-code canvas is a genuine strength." },
      ]}
    />
  )
}
