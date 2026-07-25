import type { Metadata } from "next"
import { ComparePageLayout } from "@/app/components/compare-layout"

export const metadata: Metadata = {
  title: "Leadkaun vs Close (2026) — Inside-sales CRM vs Sales Behaviour OS",
  description:
    "Honest side-by-side of Leadkaun vs Close for Indian B2B — built-in calling vs behaviour grading, WhatsApp, INR vs USD per-seat + usage pricing.",
  alternates: { canonical: "/compare/leadkaun-vs-close" },
}

export default function VsClose() {
  return (
    <ComparePageLayout
      competitor="Close"
      competitorShort="Close"
      tldr="Close is an inside-sales CRM with calling, SMS, and email baked in — excellent for outbound teams that live on the phone. But it's USD per-seat plus usage-based call/SMS costs, WhatsApp isn't native, and lead grading isn't its model. Leadkaun grades and ranks inbound leads, treats WhatsApp as a first-class signal, and bills flat INR."
      positioning="Close is built for inside-sales SMBs doing high-volume outreach — communication (call/SMS/email) is native, not bolted on. The gaps for Indian B2B: USD per-seat plus usage-based telephony, WhatsApp only via integration, US-centric calling infrastructure, and no opinionated A–F grading engine."
      strengths={[
        "Built-in calling, SMS, and email (power/predictive dialer on higher tiers)",
        "Fast, rep-friendly UI focused on activity throughput",
        "Good workflow automation and sequences",
        "Transparent published per-seat pricing",
      ]}
      weaknesses={[
        "USD per-seat plus usage-based call/SMS costs — expensive for INR budgets",
        "WhatsApp is not native — only via third-party integrations",
        "No opinionated A–F Fit × Intent × Quality grading with intent decay",
        "US/telephony-centric — no lakh/crore UI or Indian phone normalisation",
        "No ₹-denominated Missed Opportunity Engine or Morning Brief",
      ]}
      features={[
        { label: "3-dimensional lead scoring (Fit × Intent × Quality)", leadkaun: true,           competitor: false },
        { label: "Intent decay over time",                              leadkaun: true,           competitor: false },
        { label: "Priority Queue (auto-ranked, real-time)",             leadkaun: true,           competitor: false },
        { label: "Missed Opportunity Engine (₹-denominated)",           leadkaun: true,           competitor: false },
        { label: "Built-in dialer / SMS",                               leadkaun: false,          competitor: true  },
        { label: "WhatsApp as first-class signal (3-tap)",              leadkaun: true,           competitor: "Integration" },
        { label: "Morning Brief at 8:30 AM IST",                        leadkaun: true,           competitor: false },
        { label: "Pricing model",                                       leadkaun: "Flat/account", competitor: "Per seat (USD) + usage" },
        { label: "India-specific UX",                                   leadkaun: true,           competitor: false },
        { label: "Setup time",                                          leadkaun: "same day",       competitor: "Self-serve" },
      ]}
      pricing={{
        leadkaun:   { tier: "Growth",  price: "₹7,999 / mo", note: "Flat per account, all 12 modules, 14-day free trial" },
        competitor: { tier: "Growth",  price: "~$99 / user / mo", note: "USD, per user (annual) + usage-based call/SMS (~$0.02/min + number fees). As of 2026 — verify." },
      }}
      switching={[
        { title: "Export from Close",  body: "Export leads, contacts, and activity as CSV." },
        { title: "Onboard Leadkaun",   body: "Same-day wizard; Indian phones normalise on import." },
        { title: "Keep a dialer if needed", body: "If raw calling volume is core, keep a dialer and add Leadkaun for grading and prioritisation." },
        { title: "Decide",             body: "If knowing which lead to call first lifts conversion on the same effort, Leadkaun earns its place." },
      ]}
      faqs={[
        { q: "Does Leadkaun have a built-in dialer like Close?", a: "No — that's genuinely Close's strength. Leadkaun logs call outcomes in 3 taps and feeds them into scoring and the queue. Calling-heavy teams sometimes run both." },
        { q: "Is Close cheaper?", a: "Its per-seat price is transparent, but it's USD and calls/SMS are usage-based extras. Leadkaun is one flat INR account price with no per-minute costs." },
        { q: "Does Close support WhatsApp?", a: "Not natively — only via third-party integrations. Leadkaun treats WhatsApp as a first-class 3-tap signal that feeds the Intent Score." },
        { q: "When is Close the better choice?", a: "If your team sells mostly by phone at high volume and wants native calling/SMS built in, Close is purpose-built for that." },
      ]}
    />
  )
}
