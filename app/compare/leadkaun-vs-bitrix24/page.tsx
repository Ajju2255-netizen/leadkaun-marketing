import type { Metadata } from "next"
import { ComparePageLayout } from "@/app/components/compare-layout"

export const metadata: Metadata = {
  title: "Leadkaun vs Bitrix24 (2026) — All-in-one suite vs Sales Behaviour OS",
  description:
    "Honest side-by-side of Leadkaun vs Bitrix24 for Indian B2B SMBs — breadth vs focus, rep adoption, USD pricing, WhatsApp, and lead scoring.",
  alternates: { canonical: "/compare/leadkaun-vs-bitrix24" },
}

export default function VsBitrix24() {
  return (
    <ComparePageLayout
      competitor="Bitrix24"
      competitorShort="Bitrix24"
      tldr="Bitrix24 is a broad, all-in-one business suite — CRM plus projects, telephony, contact center, and intranet — priced flat per organisation in USD. That breadth is also its cost: it's complex, adoption is a real risk, and it's not India-first. Leadkaun does one job deeply: reshape what your reps do next."
      positioning="Bitrix24 bundles a huge feature surface into one platform at a flat per-organisation price. For teams that want everything in one tool, that's appealing. For an Indian B2B sales team, the trade-offs are steep learning curve and low rep adoption, USD pricing with FX exposure, and the absence of an India-first behaviour layer (A–F grading, ₹-at-risk, WhatsApp as a ranked signal, lakh/crore UI)."
      strengths={[
        "Very broad feature set for the price — CRM, projects, telephony, intranet",
        "Flat per-organisation pricing with high user allowances",
        "Free tier supports unlimited users",
        "Contact-center model routes WhatsApp/Telegram/web into the CRM",
      ]}
      weaknesses={[
        "Notoriously complex — steep learning curve, real rep-adoption risk",
        "Long, involved setup; often needs an admin or partner",
        "USD pricing with FX exposure; sales intelligence gated on higher tiers",
        "WhatsApp is via Open Channels / apps, not a first-class 3-tap signal",
        "Lead scoring is emerging, not a real-time A–F intent-graded engine",
      ]}
      features={[
        { label: "3-dimensional lead scoring (Fit × Intent × Quality)", leadkaun: true,           competitor: "Emerging AI" },
        { label: "Intent decay over time",                              leadkaun: true,           competitor: false },
        { label: "Priority Queue (auto-ranked, real-time)",             leadkaun: true,           competitor: false },
        { label: "Missed Opportunity Engine (₹-denominated)",           leadkaun: true,           competitor: false },
        { label: "Morning Brief at 8:30 AM IST",                        leadkaun: true,           competitor: false },
        { label: "WhatsApp handling",                                   leadkaun: "3-tap signal", competitor: "Open Channels" },
        { label: "All-in-one breadth (projects, intranet, telephony)",  leadkaun: false,          competitor: true  },
        { label: "Rep adoption / simplicity",                           leadkaun: true,           competitor: "neutral" },
        { label: "India-specific UX",                                   leadkaun: true,           competitor: false },
        { label: "Setup time",                                          leadkaun: "same day",       competitor: "Weeks" },
      ]}
      pricing={{
        leadkaun:   { tier: "Growth",   price: "₹7,999 / mo", note: "Flat per account, all 12 modules, 14-day free trial" },
        competitor: { tier: "Standard", price: "~$99 / mo", note: "USD, flat per org (up to ~50 users, annual) — FX exposure; higher tiers for more users/automation. As of 2026 — verify current rate." },
      }}
      switching={[
        { title: "Export from Bitrix24", body: "Export leads, contacts, and deals as CSV. Bitrix24's breadth means you'll only migrate the sales-relevant data." },
        { title: "Onboard Leadkaun",     body: "Same-day wizard with a pre-configured ICP. Import the sales CSVs; Indian phones normalise on import." },
        { title: "Keep Bitrix24 for non-sales", body: "If you rely on Bitrix24 for projects or intranet, keep it there. Move only the sales motion to Leadkaun for grading and prioritisation." },
        { title: "Decide",               body: "If focused behaviour tooling lifts rep adoption and ₹ recovered versus the all-in-one, consolidate the sales layer into Leadkaun." },
      ]}
      faqs={[
        { q: "Bitrix24 does everything — why add Leadkaun?", a: "Breadth is Bitrix24's pitch and its problem: reps often disengage from a tool that does ten jobs. Leadkaun does one — grade every lead A–F, auto-rank the queue, surface ₹-at-risk — with 3-tap logging built for adoption." },
        { q: "Is Bitrix24 cheaper?", a: "Its flat per-org price looks low, but it's USD (FX), and the sales intelligence you'd want sits on higher tiers. Leadkaun is a flat INR account price with all 12 modules on every tier." },
        { q: "Does Bitrix24 handle WhatsApp?", a: "Yes, through Open Channels and marketplace apps — messages route into the CRM and can create leads. Leadkaun treats a logged WhatsApp reply as a ranked Intent signal rather than an inbound channel to manage." },
        { q: "How long does Bitrix24 take to set up?", a: "Longer than the others here — its breadth means real configuration effort, often with an admin or partner. Leadkaun's guided onboarding puts a graded lead in the queue the same day." },
        { q: "Is pricing INR with GST?", a: "Leadkaun is — flat INR, GST-compliant, per account. Bitrix24 bills in USD." },
      ]}
      verdict={{
        competitorWins: "Bitrix24 offers genuinely remarkable breadth for the price — CRM plus projects, telephony, an intranet and a contact center that routes WhatsApp, Telegram and web chat into one place, at a flat per-organisation rate with generous user allowances and a free tier for unlimited users. If you want one platform to run most of the business, that consolidation is real value.",
        leadkaunWins: "Leadkaun does one job deeply rather than ten broadly. It grades every lead A–F with intent decay, builds a real-time Priority Queue, surfaces ₹ at risk, and sends a morning brief — with 3-tap WhatsApp logging designed so reps actually adopt it. It bills flat in INR and GST-compliant instead of USD, and goes live the same day rather than needing a partner-led rollout.",
        bottomLine: "If you need an all-in-one suite and can invest in setup and an admin, Bitrix24 is a strong, economical pick. If your priority is rep adoption and turning leads into ₹ recovered, Leadkaun is the sharper fit — and you can keep Bitrix24 for projects and intranet while moving just the sales motion to Leadkaun.",
      }}
    />
  )
}
