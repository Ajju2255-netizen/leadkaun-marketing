import type { Metadata } from "next"
import { ComparePageLayout } from "@/app/components/compare-layout"

export const metadata: Metadata = {
  title: "Leadkaun vs Kylas (2026), Flat-price CRM comparison for India",
  description:
    "Honest side-by-side of Leadkaun vs Kylas for Indian B2B SMBs, both flat-priced, but different categories. Lead scoring, WhatsApp, cost at small vs large teams.",
  alternates: { canonical: "/compare/leadkaun-vs-kylas" },
}

export default function VsKylas() {
  return (
    <ComparePageLayout
      competitor="Kylas"
      competitorShort="Kylas"
      tldr="Kylas is an India-first CRM with a real hook: unlimited users at a flat monthly rate. Leadkaun is also flat-priced, but it's a Sales Behaviour OS. It grades and ranks leads for you rather than just storing them. For small teams, Leadkaun's Growth tier also costs less than Kylas's flat rate."
      positioning="Kylas is built for Indian SMBs that want to add reps without per-seat cost. Its flagship is unlimited users on every paid plan, with guided onboarding. It covers solid CRM fundamentals: lead capture, routing, pipelines, workflow automation, and native WhatsApp on paid tiers. Where it stops short of a behaviour OS is real-time A–F grading with intent decay, an auto-ranked queue, and a ₹-denominated missed-opportunity view."
      strengths={[
        "Unlimited users on every paid plan, no per-seat scaling",
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
        { group: "Lead intelligence", rows: [
          { label: "3-dimensional lead scoring (Fit × Intent × Quality)",leadkaun: true, competitor: "Rule-based" },
          { label: "Intent decay over time",                             leadkaun: true, competitor: false },
          { label: "Priority Queue (auto-ranked, real-time)",            leadkaun: true, competitor: false },
          { label: "Missed Opportunity Engine (₹-denominated)",          leadkaun: true, competitor: false },
          { label: "Morning Brief at 8:30 AM IST",                       leadkaun: true, competitor: false },
        ] },
        { group: "Rep workflow", rows: [
          { label: "WhatsApp handling",                                  leadkaun: "3-tap signal", competitor: "Native (paid)" },
        ] },
        { group: "Cost, setup & India fit", rows: [
          { label: "Unlimited users at flat price",                      leadkaun: "neutral", competitor: true },
          { label: "Cost for a small team (5–15 reps)",                  leadkaun: "Lower", competitor: "Higher" },
          { label: "India-specific behaviour layer",                     leadkaun: true, competitor: false },
          { label: "Setup time",                                         leadkaun: "same day", competitor: "Guided" },
        ] },
      ]}
      verdictLine="Kylas wins the headcount maths at scale. Leadkaun wins on what a rep sees when they open the app, and costs less until you are past roughly forty seats."
      glance={{
        category:     "Indian CRM sold with unlimited users at a flat price",
        pricingModel: "INR flat per organisation, unlimited users",
        bestFor:      "Large Indian teams where per-seat pricing hurts most",
        indiaFit:     "Indian company, INR billing, India-based support",
        setup:        "Days to weeks",
      }}
      chooseCompetitor={[
        "You have 40+ users and unlimited seats is the deciding factor",
        "You want a conventional full CRM rather than a working layer",
        "Your team needs a single India-based vendor for everything",
      ]}
      chooseLeadkaun={[
        "You have 5 to 30 reps, where Growth costs less than Elevate",
        "Ranked leads and ₹ at risk matter more than seat count",
        "You want the daily discipline layer, not another record store",
      ]}
      cost={{ flat: 12999, currency: "INR" }}
      reviewedOn="13 Aug 2026"
      sources={[
        { label: "Kylas pricing", url: "https://kylas.io/pricing" },
      ]}
      pricing={{
        leadkaun:   { tier: "Growth",  price: "₹7,999 / mo", note: "Flat per account, all 12 modules, free forever tier" },
        competitor: { tier: "Elevate", price: "~₹12,999 / mo", note: "Flat, unlimited users. Figure from aggregators, verify on kylas.io. Cheaper per-seat at large headcount, but more than Leadkaun Growth for small teams. As of 2026." },
      }}
      switching={[
        { title: "Export from Kylas",  body: "Export leads, contacts, and pipeline data as CSV." },
        { title: "Onboard Leadkaun",   body: "Same-day wizard with a pre-configured ICP for your industry. Import the CSVs." },
        { title: "Run parallel for 30 days", body: "Reps work Leadkaun's Priority Queue while Kylas stays as an archive. Compare how the two rank the same day's leads." },
        { title: "Decide at day 60",   body: "If A–F grading and ₹-at-risk change rep behaviour, and the flat cost is lower for your team size, consolidate. If you need Kylas's unlimited-user economics at large scale, keep it." },
      ]}
      faqs={[
        { q: "Both are flat-priced, so what's different?", a: "The pricing model is similar; the product category isn't. Kylas is a full-featured CRM that stores and routes leads. Leadkaun is a Sales Behaviour OS that grades every lead A–F in real time, auto-ranks each rep's queue, and surfaces ₹-at-risk. One records; the other decides priority." },
        { q: "Is Kylas cheaper?", a: "It depends on team size. Kylas's unlimited-user flat rate wins at large headcount. For a small team, Leadkaun's Growth tier (₹7,999) is typically less than Kylas's flat rate, and Leadkaun has a Free tier to start." },
        { q: "Does Kylas have lead scoring?", a: "Yes, but it's rule-based. You configure scoring rules on fields. Leadkaun grades on Fit × Intent × Quality in real time with intent decay, which is a different mechanism, not a rules checklist." },
        { q: "Does Kylas support WhatsApp?", a: "Yes, natively on paid tiers. The difference is that Leadkaun turns a logged WhatsApp reply into a ranked Intent signal, not just a synced message." },
        { q: "Is pricing INR with GST?", a: "Yes. Both are Indian, INR, GST-compliant. Leadkaun bills flat per account." },
      ]}
      verdict={{
        competitorWins: "Kylas has a real, honest hook: unlimited users at a flat monthly rate, so you can add reps without per-seat cost. It is India-first, with guided onboarding and training included, and it covers CRM fundamentals well, lead capture and routing, pipelines, workflow automation, and native WhatsApp on paid tiers. At large headcount, those economics are genuinely hard to beat.",
        leadkaunWins: "Leadkaun is also flat-priced, but it is a Sales Behaviour OS rather than a system of record. It grades every lead A–F in real time with intent decay, auto-ranks each rep's Priority Queue, and surfaces ₹ at risk, decisions that Kylas's rule-based scoring does not make for you. For a small team, Growth also lands below Kylas's flat rate.",
        bottomLine: "For a large team that mainly needs a full CRM without per-seat cost, Kylas's unlimited-user model is the economical pick. For a smaller team that wants leads graded and prioritised daily, Leadkaun Growth costs less and adds the behaviour layer. Because Leadkaun runs alongside a CRM, some teams keep both.",
      }}
    />
  )
}
