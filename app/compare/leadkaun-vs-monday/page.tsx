import type { Metadata } from "next"
import { ComparePageLayout } from "@/app/components/compare-layout"

export const metadata: Metadata = {
  title: "Leadkaun vs monday CRM (2026), Which fits Indian sales teams?",
  description:
    "Honest side-by-side of Leadkaun vs monday CRM for Indian B2B, INR vs USD per-seat pricing, native WhatsApp, built-in lead scoring vs build-your-own.",
  alternates: { canonical: "/compare/leadkaun-vs-monday" },
}

export default function VsMonday() {
  return (
    <ComparePageLayout
      competitor="monday CRM"
      competitorShort="monday"
      tldr="monday CRM is a flexible, no-code CRM on the monday.com Work OS, great if you want to design your own pipeline and automations. But it's a blank canvas priced per seat in USD (3-seat minimum), with no native WhatsApp and no built-in lead grading. Leadkaun is opinionated: it grades and ranks leads for you, native WhatsApp, flat INR."
      positioning="monday CRM is a horizontal, highly customisable CRM built on monday.com's Work OS. Its strength is no-code flexibility. You shape the pipeline, automations, and dashboards. The gaps for Indian B2B show up in pricing (USD per-seat with a 3-seat minimum), WhatsApp (integration only), and lead intelligence (you build scoring yourself; there's no A–F grading engine)."
      strengths={[
        "No-code, highly customisable boards and automations",
        "Clean visual pipeline and dashboards",
        "Broad integration marketplace",
        "Scales beyond CRM into general work management",
      ]}
      weaknesses={[
        "USD per-seat with a 3-seat minimum, awkward and pricey for small INR teams",
        "No native WhatsApp, only via third-party connectors",
        "No built-in A–F lead grading or intent decay. You build scoring by hand",
        "Not India-first (no lakh/crore UI, no Indian phone normalisation)",
        "Flexibility means setup burden, a blank canvas, not a ready priority queue",
      ]}
      features={[
        { group: "Lead intelligence", rows: [
          { label: "3-dimensional lead scoring (Fit × Intent × Quality)",leadkaun: true, competitor: false },
          { label: "Intent decay over time",                             leadkaun: true, competitor: false },
          { label: "Priority Queue (auto-ranked, real-time)",            leadkaun: true, competitor: false },
          { label: "Missed Opportunity Engine (₹-denominated)",          leadkaun: true, competitor: false },
          { label: "Morning Brief at 8:30 AM IST",                       leadkaun: true, competitor: false },
        ] },
        { group: "Rep workflow", rows: [
          { label: "WhatsApp as first-class signal (3-tap)",             leadkaun: true, competitor: "Integration" },
        ] },
        { group: "Platform & breadth", rows: [
          { label: "No-code custom workflows / work management",         leadkaun: "neutral", competitor: true },
        ] },
        { group: "Cost, setup & India fit", rows: [
          { label: "Pricing model",                                      leadkaun: "Flat/account", competitor: "Per seat (USD), 3-seat min" },
          { label: "India-specific UX",                                  leadkaun: true, competitor: false },
          { label: "Setup time",                                         leadkaun: "same day", competitor: "DIY / days" },
        ] },
      ]}
      verdictLine="monday hands you a canvas. Leadkaun hands you an opinion: graded leads, a ranked queue and ₹ at risk, with no build project in front of it."
      glance={{
        category:     "No-code work platform with a CRM board on top",
        pricingModel: "USD per seat, annual, three-seat minimum, sold in seat buckets",
        bestFor:      "Teams that want to shape their own workflows visually",
        indiaFit:     "USD billing and seat buckets, no India-specific lead behaviour",
        setup:        "Days to build, longer to standardise",
      }}
      chooseCompetitor={[
        "You want to design your own process rather than adopt one",
        "The same tool has to run marketing, ops and delivery boards",
        "Visual workflow building is a genuine team strength",
      ]}
      chooseLeadkaun={[
        "You want the sales opinion built in, not assembled",
        "Seat buckets and USD make budgeting awkward",
        "Reps need a queue on day one, not a board to configure",
      ]}
      cost={{ perSeat: 17, currency: "USD" }}
      reviewedOn="13 Aug 2026"
      sources={[
        { label: "monday CRM pricing", url: "https://monday.com/pricing/crm" },
      ]}
      pricing={{
        leadkaun:   { tier: "Growth",   price: "₹7,999 / mo", note: "Flat per account, all 12 modules, free forever tier" },
        competitor: { tier: "Standard", price: "~$17 / seat / mo", note: "USD, per seat (annual), 3-seat minimum + bucket pricing. As of 2026, verify current rate." },
      }}
      switching={[
        { title: "Export from monday", body: "Export leads, contacts, and deals as CSV from your monday boards." },
        { title: "Onboard Leadkaun",   body: "Same-day wizard with a pre-configured ICP; Indian phones normalise on import." },
        { title: "Run parallel",       body: "Keep monday for any non-sales work management. Reps work Leadkaun's Priority Queue for the sales motion." },
        { title: "Decide",             body: "If ready-made grading + queue beats a self-built pipeline for your team, consolidate sales into Leadkaun." },
      ]}
      faqs={[
        { q: "Is monday CRM expensive for an Indian team?", a: "It can be, it's billed per seat in USD with a 3-seat minimum, so a small team's real floor is higher than the headline price. Leadkaun is one flat INR price per account regardless of team size." },
        { q: "Does monday CRM have lead scoring?", a: "Not as a built-in engine. You construct scoring with formula columns and automations. Leadkaun grades every lead A–F on Fit × Intent × Quality in real time with intent decay, out of the box." },
        { q: "Does monday CRM support WhatsApp?", a: "Only through third-party connectors. Leadkaun treats a logged WhatsApp reply as a ranked Intent signal that can change a lead's grade." },
        { q: "When is monday the better choice?", a: "If you want one flexible tool for both CRM and general work management and are happy to build your own workflows, monday's no-code canvas is a genuine strength." },
      ]}
      verdict={{
        competitorWins: "monday CRM is genuinely more flexible. Its no-code Work OS lets you shape pipelines, automations, and dashboards exactly how you want, and it stretches well beyond sales into general work management. If your team wants one customisable canvas and has the appetite to build its own workflows, that openness is a real advantage Leadkaun deliberately does not offer.",
        leadkaunWins: "Leadkaun is opinionated where monday is a blank canvas. For a lean Indian B2B team it grades every lead A–F on Fit, Intent, and Quality and hands each rep a ready Priority Queue on day one, with no formula columns to build first. Flat INR pricing per account and 3-tap WhatsApp logging fit smaller teams better than USD per-seat billing with a 3-seat minimum.",
        bottomLine: "Pick monday if you want a flexible tool spanning CRM and wider work management and will invest in configuring it. Pick Leadkaun if you want lead grading and prioritisation working out of the box on Indian pricing. Many teams keep monday for work management and run Leadkaun alongside it as the sales behaviour layer.",
      }}
    />
  )
}
