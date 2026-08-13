import type { Metadata } from "next"
import { ComparePageLayout } from "@/app/components/compare-layout"

export const metadata: Metadata = {
  title: "Leadkaun vs Freshsales (2026), Transparent scoring vs 'AI'",
  description:
    "Freshsales has clean UI and Freddy AI scoring. Leadkaun has transparent 3-dimensional scoring. See the feature matrix, pricing comparison, switching guide.",
  alternates: { canonical: "/compare/leadkaun-vs-freshsales" },
}

export default function VsFreshsales() {
  return (
    <ComparePageLayout
      competitor="Freshsales"
      tldr="Freshsales has a great UI and 'Freddy AI' scoring. The scoring is a black box. Leadkaun's three independent scores (Fit × Intent × Quality) are transparent and auditable. Where the decisions happen matters more than where the UI is prettier."
      positioning="Freshsales (by Freshworks, India-origin) lands in the shortlist for Indian SMBs with a modern UI and an AI-branded pitch. Its weakness is decision transparency. You can't see why Freddy AI gave a lead a particular score. For managers who coach reps on why a lead matters, that opacity becomes a real problem over time."
      strengths={[
        "Clean, modern UI (best-in-class CRM UX)",
        "Unified Freshworks suite (Freshdesk, Freshchat)",
        "Built-in email + phone",
        "Reasonable pricing vs global peers",
      ]}
      weaknesses={[
        "Freddy AI scoring is opaque (black box)",
        "Not India-calibrated (generic B2B defaults)",
        "No ₹-at-risk Missed Opportunity Engine",
        "WhatsApp requires Freshchat (paid add-on)",
        "No Morning Brief equivalent",
      ]}
      features={[
        { group: "Lead intelligence", rows: [
          { label: "Transparent 3-dim scoring (weights visible)",leadkaun: true, competitor: "Freddy (opaque)" },
          { label: "Intent decay over time",                     leadkaun: true, competitor: false },
          { label: "Priority Queue (auto-ranked, real-time)",    leadkaun: true, competitor: "Filter views" },
          { label: "Missed Opportunity Engine (₹ at risk)",      leadkaun: true, competitor: false },
          { label: "Morning Brief at 8:30 AM IST",               leadkaun: true, competitor: false },
          { label: "India-first scoring defaults",               leadkaun: true, competitor: false },
        ] },
        { group: "Rep workflow", rows: [
          { label: "WhatsApp native (3-tap)",                    leadkaun: true, competitor: "Via Freshchat" },
        ] },
        { group: "Platform & breadth", rows: [
          { label: "Clean UI / modern design",                   leadkaun: "neutral", competitor: true },
          { label: "Freshworks suite (Desk, Chat) integrations", leadkaun: false, competitor: true },
        ] },
        { group: "Cost, setup & India fit", rows: [
          { label: "INR pricing with GST",                       leadkaun: true, competitor: true },
        ] },
      ]}
      verdictLine="Freshsales is a clean, fairly priced Indian CRM. Leadkaun is the behaviour layer on top of one: published scoring weights, a real queue, and ₹ at risk."
      glance={{
        category:     "Sales CRM inside the Freshworks suite",
        pricingModel: "INR per rep, per month",
        bestFor:      "Teams already standardised on Freshworks Desk and Chat",
        indiaFit:     "Indian company billing in INR, but scoring weights stay opaque",
        setup:        "Days to weeks",
      }}
      chooseCompetitor={[
        "You already run Freshdesk or Freshchat and want one vendor",
        "You want a broad, conventional CRM with a modern UI",
        "Suite-wide reporting matters more than lead behaviour",
      ]}
      chooseLeadkaun={[
        "You want to see why a lead is graded A, not just that it is",
        "WhatsApp is a first-class channel, not an add-on subscription",
        "Flat per-account pricing beats per-rep as the team grows",
      ]}
      cost={{ perSeat: 3500, currency: "INR", plus: "Freddy AI Pro and WhatsApp via Freshchat, both billed separately" }}
      reviewedOn="13 Aug 2026"
      sources={[
        { label: "Freshsales pricing", url: "https://www.freshworks.com/crm/sales/pricing/" },
      ]}
      pricing={{
        leadkaun:   { tier: "Growth",  price: "₹7,999 / mo", note: "All 12 modules. 14-day trial. No credit card." },
        competitor: { tier: "Pro",     price: "₹3,500 / rep / mo", note: "Freddy AI Pro + WhatsApp (Freshchat) extra" },
      }}
      switching={[
        { title: "Export from Freshsales",       body: "Contacts, deals, activity CSV. Standard Freshworks export path, no surprises." },
        { title: "Keep Freshworks suite if needed", body: "Freshdesk + Freshchat deliver real value for support teams. Keep them. Swap Freshsales for Leadkaun." },
        { title: "Onboard Leadkaun",             body: "Same-day wizard; pre-built ICPs for Indian B2B SMBs. Import your data." },
        { title: "Audit the scoring",            body: "Open Leadkaun's Grade A queue on day 7. Ask: does this match your gut? Transparent weights make the answer always 'yes' that's the point." },
      ]}
      faqs={[
        { q: "Freddy AI is 'AI'. Isn't that more sophisticated than rules?", a: "Not for this job. 'AI' that reps don't trust (because they can't explain it) gets ignored. Rule-based scoring with transparent weights (Fit 30/20/20/15/15, Intent decay at −3/day) gets adopted and coached against." },
        { q: "We use Freshchat for WhatsApp. Can Leadkaun replace that?", a: "Different jobs. Freshchat is a messaging platform. Leadkaun's WhatsApp tracking is signal capture for scoring. Keep Freshchat for the conversation; let Leadkaun score the intent." },
        { q: "Will switching feel like a downgrade in UI?", a: "Leadkaun's UI is deliberately minimal, data-first, no distractions. It's different, not worse. Reps adapt in a week; managers notice better decision-making within the month." },
        { q: "Freshsales has a mobile app. Does Leadkaun?", a: "Leadkaun is mobile-web first, works on any device, no app install. Performance on 3G is a design priority. Field reps prefer it." },
      ]}
      verdict={{
        competitorWins: "Freshsales is a genuinely polished product, a clean, modern UI, built-in email and phone, and tight ties into the wider Freshworks suite like Freshdesk and Freshchat. For a team that wants one vendor across sales and support, with familiar CRM UX and pricing that is reasonable against global peers, it is a strong and mature choice.",
        leadkaunWins: "Leadkaun wins where decisions get made rather than where the screen looks nicer. Its Fit, Intent and Quality scores are transparent and auditable, so managers can coach reps on why a lead ranks, something Freddy AI keeps opaque. Add the ₹-at-risk view, the auto-ranked Priority Queue and the morning brief, all calibrated for Indian B2B SMBs.",
        bottomLine: "Pick Freshsales if you want one well-designed CRM spanning sales and support. Pick Leadkaun if your reps need transparent prioritisation and a daily ₹-at-risk view your CRM does not surface. Many teams keep Freshdesk or Freshchat and run Leadkaun alongside as the sales-behaviour layer.",
      }}
    />
  )
}
