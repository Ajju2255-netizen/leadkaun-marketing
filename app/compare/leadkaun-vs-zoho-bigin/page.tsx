import type { Metadata } from "next"
import { ComparePageLayout } from "@/app/components/compare-layout"

export const metadata: Metadata = {
  title: "Leadkaun vs Zoho Bigin (2026) — Which fits your Indian sales team?",
  description:
    "Honest side-by-side of Leadkaun vs Zoho Bigin for Indian B2B SMBs — pricing model, WhatsApp, lead scoring, and when a lightweight CRM stops being enough.",
  alternates: { canonical: "/compare/leadkaun-vs-zoho-bigin" },
}

export default function VsBigin() {
  return (
    <ComparePageLayout
      competitor="Zoho Bigin"
      competitorShort="Bigin"
      tldr="Bigin is Zoho's deliberately lightweight CRM for micro-teams — cheap, easy, and it even ships native WhatsApp. Leadkaun is a different category: a Sales Behaviour OS that grades and ranks leads for you. Bigin records the pipeline; Leadkaun decides who to call next."
      positioning="Zoho Bigin is a simple, pipeline-first CRM for solopreneurs and very small teams — a low-cost on-ramp before the full Zoho CRM. It's genuinely easy and includes WhatsApp Business from its entry tier. The ceiling appears as B2B sales get more complex: no real lead-scoring engine, basic automation, and per-user pricing that grows with the team."
      strengths={[
        "Very affordable entry point; among the cheapest paid CRMs",
        "Extremely easy to adopt — most users productive within a day",
        "Native WhatsApp Business integration from the entry tier",
        "Clean upgrade path into the wider Zoho ecosystem",
      ]}
      weaknesses={[
        "No real lead-scoring engine — leads sit until manually qualified",
        "Automation is basic; hits a ceiling on multi-step sequences",
        "Per-user pricing — cost grows with headcount",
        "Deliberately limited for complex/growing B2B sales motions",
        "No auto-ranked Priority Queue or ₹-at-risk framing",
      ]}
      features={[
        { label: "3-dimensional lead scoring (Fit × Intent × Quality)", leadkaun: true,           competitor: false },
        { label: "Intent decay over time",                              leadkaun: true,           competitor: false },
        { label: "Priority Queue (auto-ranked, real-time)",             leadkaun: true,           competitor: false },
        { label: "Missed Opportunity Engine (₹-denominated)",           leadkaun: true,           competitor: false },
        { label: "Morning Brief at 8:30 AM IST",                        leadkaun: true,           competitor: false },
        { label: "WhatsApp handling",                                   leadkaun: "3-tap signal", competitor: "Native" },
        { label: "Simplicity for a tiny team",                          leadkaun: "neutral",      competitor: true  },
        { label: "Pricing model",                                       leadkaun: "Flat/account", competitor: "Per user" },
        { label: "India-specific behaviour layer",                      leadkaun: true,           competitor: false },
        { label: "Setup time",                                          leadkaun: "same day",       competitor: "~1 day" },
      ]}
      pricing={{
        leadkaun:   { tier: "Starter/Growth", price: "₹2,999–₹7,999 / mo", note: "Flat per account, all 12 modules, 14-day free trial" },
        competitor: { tier: "Express",        price: "from ~₹400 / user / mo", note: "Per user (annual, India). Sources conflict on the India rate — verify current pricing. Grows with headcount." },
      }}
      switching={[
        { title: "Export from Bigin",   body: "Export contacts, pipelines, and activity as CSV from Bigin's data tools." },
        { title: "Onboard Leadkaun",    body: "Same-day wizard with a pre-configured ICP. Import the CSVs; Indian phones normalise on import." },
        { title: "Run parallel briefly", body: "Keep Bigin as a light record for 2–4 weeks. Reps work Leadkaun's Priority Queue. Watch how many hot leads surface that Bigin left flat." },
        { title: "Decide",              body: "If grading + queueing + ₹-at-risk change how the team spends its day, consolidate. If you only needed a light pipeline, Bigin is fine to keep." },
      ]}
      faqs={[
        { q: "Doesn't Bigin already have WhatsApp?", a: "Yes — Bigin includes native WhatsApp Business from its entry tier, so this isn't a 'they don't have it' comparison. The difference is how Leadkaun uses WhatsApp: a 3-tap logged reply becomes a ranked Intent signal that can move a lead's grade, not just a chat thread." },
        { q: "We're a 3-person team — is Leadkaun overkill?", a: "Not necessarily. Leadkaun has a Free tier and flat pricing, so a small team gets grading and a Priority Queue without per-seat cost. If you truly only need a contact list, Bigin is simpler." },
        { q: "What does Leadkaun do that Bigin can't?", a: "Grade every lead A–F in real time with intent decay, auto-rank each rep's queue in real time, and surface ₹-at-risk daily. Bigin records the pipeline; it doesn't decide priority for you." },
        { q: "Is migration hard?", a: "No. Bigin exports clean CSVs and Leadkaun ingests arbitrary columns as custom fields. The same-day onboarding handles ICP setup." },
        { q: "Is pricing INR with GST?", a: "Yes — Leadkaun bills flat INR, GST-compliant, per account." },
      ]}
    />
  )
}
