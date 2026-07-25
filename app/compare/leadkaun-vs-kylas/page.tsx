import type { Metadata } from "next"
import { ComparePageLayout } from "@/app/components/compare-layout"

export const metadata: Metadata = {
  title: "Leadkaun vs Kylas (2026) — Flat-price CRM comparison for India",
  description:
    "Honest side-by-side of Leadkaun vs Kylas for Indian B2B SMBs — both flat-priced, but different categories. Lead scoring, WhatsApp, cost at small vs large teams.",
  alternates: { canonical: "/compare/leadkaun-vs-kylas" },
}

export default function VsKylas() {
  return (
    <ComparePageLayout
      competitor="Kylas"
      competitorShort="Kylas"
      tldr="Kylas is an India-first CRM with a real hook: unlimited users at a flat monthly rate. Leadkaun is also flat-priced, but it's a Sales Behaviour OS — it grades and ranks leads for you rather than just storing them. For small teams, Leadkaun's Growth tier also costs less than Kylas's flat rate."
      positioning="Kylas is built for Indian SMBs that want to add reps without per-seat cost — its flagship is unlimited users on every paid plan, with guided onboarding. It covers solid CRM fundamentals: lead capture, routing, pipelines, workflow automation, and native WhatsApp on paid tiers. Where it stops short of a behaviour OS is real-time A–F grading with intent decay, an auto-ranked queue, and a ₹-denominated missed-opportunity view."
      strengths={[
        "Unlimited users on every paid plan — no per-seat scaling",
        "India-first, with guided onboarding and training included",
        "Lead capture from web forms, ads, and trade portals + auto-routing",
        "Native WhatsApp Business integration on paid tiers",
      ]}
      weaknesses={[
        "Flat rate is pricey for small teams (5–30 seats)",
        "Lead scoring is rule-based, not a real-time intent-graded engine",
        "Some users report initial setup can be time-consuming",
        "Record/storage caps per tier; add-ons needed to expand",
        "No auto-ranked Priority Queue or ₹-at-risk Missed Opportunity Engine",
      ]}
      features={[
        { label: "3-dimensional lead scoring (Fit × Intent × Quality)", leadkaun: true,           competitor: "Rule-based" },
        { label: "Intent decay over time",                              leadkaun: true,           competitor: false },
        { label: "Priority Queue (auto-ranked, real-time)",             leadkaun: true,           competitor: false },
        { label: "Missed Opportunity Engine (₹-denominated)",           leadkaun: true,           competitor: false },
        { label: "Morning Brief at 8:30 AM IST",                        leadkaun: true,           competitor: false },
        { label: "WhatsApp handling",                                   leadkaun: "3-tap signal", competitor: "Native (paid)" },
        { label: "Unlimited users at flat price",                       leadkaun: "neutral",      competitor: true  },
        { label: "Cost for a small team (5–15 reps)",                   leadkaun: "Lower",        competitor: "Higher" },
        { label: "India-specific behaviour layer",                      leadkaun: true,           competitor: false },
        { label: "Setup time",                                          leadkaun: "same day",       competitor: "Guided" },
      ]}
      pricing={{
        leadkaun:   { tier: "Growth",  price: "₹7,999 / mo", note: "Flat per account, all 12 modules, 14-day free trial" },
        competitor: { tier: "Elevate", price: "~₹12,999 / mo", note: "Flat, unlimited users. Figure from aggregators — verify on kylas.io. Cheaper per-seat at large headcount, but more than Leadkaun Growth for small teams. As of 2026." },
      }}
      switching={[
        { title: "Export from Kylas",  body: "Export leads, contacts, and pipeline data as CSV." },
        { title: "Onboard Leadkaun",   body: "Same-day wizard with a pre-configured ICP for your industry. Import the CSVs." },
        { title: "Run parallel for 30 days", body: "Reps work Leadkaun's Priority Queue while Kylas stays as an archive. Compare how the two rank the same day's leads." },
        { title: "Decide at day 60",   body: "If A–F grading and ₹-at-risk change rep behaviour — and the flat cost is lower for your team size — consolidate. If you need Kylas's unlimited-user economics at large scale, keep it." },
      ]}
      faqs={[
        { q: "Both are flat-priced — so what's different?", a: "The pricing model is similar; the product category isn't. Kylas is a full-featured CRM that stores and routes leads. Leadkaun is a Sales Behaviour OS that grades every lead A–F in real time, auto-ranks each rep's queue, and surfaces ₹-at-risk. One records; the other decides priority." },
        { q: "Is Kylas cheaper?", a: "It depends on team size. Kylas's unlimited-user flat rate wins at large headcount. For a small team, Leadkaun's Growth tier (₹7,999) is typically less than Kylas's flat rate — and Leadkaun has a Free tier to start." },
        { q: "Does Kylas have lead scoring?", a: "Yes, but it's rule-based — you configure scoring rules on fields. Leadkaun grades on Fit × Intent × Quality in real time with intent decay, which is a different mechanism, not a rules checklist." },
        { q: "Does Kylas support WhatsApp?", a: "Yes, natively on paid tiers. The difference is that Leadkaun turns a logged WhatsApp reply into a ranked Intent signal, not just a synced message." },
        { q: "Is pricing INR with GST?", a: "Yes — both are Indian, INR, GST-compliant. Leadkaun bills flat per account." },
      ]}
    />
  )
}
