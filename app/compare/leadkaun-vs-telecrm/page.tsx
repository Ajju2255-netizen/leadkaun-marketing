import type { Metadata } from "next"
import { ComparePageLayout } from "@/app/components/compare-layout"

export const metadata: Metadata = {
  title: "Leadkaun vs TeleCRM (2026), Telecalling CRM vs Sales Behaviour OS",
  description:
    "Honest side-by-side of Leadkaun vs TeleCRM for Indian sales teams, dialer-first vs behaviour-first, WhatsApp, lead scoring, per-user cost and add-ons.",
  alternates: { canonical: "/compare/leadkaun-vs-telecrm" },
}

export default function VsTeleCRM() {
  return (
    <ComparePageLayout
      competitor="TeleCRM"
      competitorShort="TeleCRM"
      tldr="TeleCRM is an India-first telecalling and WhatsApp CRM built for high-volume dialing teams, fast, cheap per seat, strong on follow-up automation. Leadkaun is behaviour-first: it grades and ranks leads by intent so reps call the right lead, not just the next one in the list."
      positioning="TeleCRM is optimised for telecalling volume, one-click dialer, call recording, follow-up reminders, leaderboards, and strong WhatsApp automation. It's a great fit for inside-sales and calling-heavy teams. It's less about considered B2B pipeline management, and it doesn't ship an intent-graded scoring engine or an auto-ranked priority queue."
      strengths={[
        "Purpose-built for telecalling, 1-click dialer, recording, reminders",
        "Strong, affordable WhatsApp automation and multi-platform lead capture",
        "Low per-user price; fast to get a calling team running",
        "Mobile-first for field and tele reps",
      ]}
      weaknesses={[
        "Per-user pricing plus add-ons (Chat Sync, WhatsApp API) creeps up",
        "No sophisticated lead scoring it's dialer/follow-up driven, not intent-graded",
        "Geared to calling volume rather than B2B deal/pipeline nuance",
        "No A–F grading, intent decay, or auto-ranked Priority Queue",
        "No ₹-denominated Missed Opportunity Engine",
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
          { label: "WhatsApp handling",                                  leadkaun: "3-tap signal", competitor: "Native (core)" },
          { label: "Built-in dialer / telecalling",                      leadkaun: false, competitor: true },
        ] },
        { group: "Cost, setup & India fit", rows: [
          { label: "Pricing model",                                      leadkaun: "Flat/account", competitor: "Per user + add-ons" },
          { label: "India-specific behaviour layer",                     leadkaun: true, competitor: "neutral" },
          { label: "Setup time",                                         leadkaun: "same day", competitor: "Self-serve" },
        ] },
      ]}
      verdictLine="TeleCRM is the cheapest way to run a dialling floor. Leadkaun costs more per seat at small scale and tells you which of those calls was worth making."
      glance={{
        category:     "Telecalling CRM for high-volume outbound",
        pricingModel: "INR per user, annual, plus add-ons",
        bestFor:      "Call-centre-style teams dialling hundreds of leads a day",
        indiaFit:     "Indian company, INR billing, WhatsApp available as an add-on",
        setup:        "Same week",
      }}
      chooseCompetitor={[
        "Raw dialling volume is the metric that matters",
        "You need an autodialer and call recording as the core product",
        "Cost per seat is the binding constraint",
      ]}
      chooseLeadkaun={[
        "You want fewer, better calls rather than more of them",
        "Add-on pricing for WhatsApp and chat sync erodes the headline rate",
        "Nobody can currently say which leads went cold and what that cost",
      ]}
      cost={{ perSeat: 799, currency: "INR", plus: "Chat Sync at ₹200/user/mo and WhatsApp API setup at ₹1,999 plus Meta charges" }}
      reviewedOn="13 Aug 2026"
      sources={[
        { label: "TeleCRM pricing", url: "https://telecrm.in/pricing" },
      ]}
      pricing={{
        leadkaun:   { tier: "Growth",  price: "₹7,999 / mo", note: "Flat per account, all 12 modules, free forever tier" },
        competitor: { tier: "Annual",  price: "₹799 / user / mo", note: "Per user (annual) + add-ons: Chat Sync ₹200/user/mo, WhatsApp API ₹1,999 setup + Meta charges. Scales with headcount. As of 2026." },
      }}
      switching={[
        { title: "Export from TeleCRM", body: "Export leads and call/activity history as CSV." },
        { title: "Onboard Leadkaun",    body: "Same-day wizard with a pre-configured ICP. Import the CSVs; Indian phones normalise automatically." },
        { title: "Run both if you dial heavily", body: "Many teams keep a dialer for raw call volume and add Leadkaun for grading and prioritisation, so reps dial the highest-intent lead first." },
        { title: "Decide",              body: "If grading + queue + ₹-at-risk lift conversion on the same call volume, Leadkaun earns its place. If you purely need a dialer, TeleCRM is the cheaper single tool." },
      ]}
      faqs={[
        { q: "Is TeleCRM a direct replacement for Leadkaun?", a: "Not really. They solve different problems. TeleCRM maximises calling and follow-up throughput. Leadkaun decides which lead deserves the next call by grading intent and auto-ranking the queue. Calling teams often run both." },
        { q: "Does Leadkaun have a dialer?", a: "No built-in dialer today that's genuinely TeleCRM's strength. Leadkaun logs call outcomes in 3 taps and feeds them into scoring and the queue." },
        { q: "Which is cheaper?", a: "TeleCRM's base per-user rate is low, but add-ons (Chat Sync, WhatsApp API) and headcount raise the real cost. Leadkaun is one flat account price regardless of team size." },
        { q: "Does TeleCRM score leads?", a: "It captures, assigns, and automates follow-ups, but doesn't ship a documented intent-graded scoring engine. Leadkaun grades A–F on Fit × Intent × Quality in real time." },
        { q: "Is pricing INR with GST?", a: "Yes. Both are Indian, INR, GST-compliant. Leadkaun bills flat per account." },
      ]}
      verdict={{
        competitorWins: "TeleCRM is genuinely the better tool when the day is defined by call volume. Its one-click dialer, call recording, follow-up reminders and native WhatsApp automation are purpose-built for inside-sales and tele-calling teams, and the low per-user entry price gets a calling floor running quickly.",
        leadkaunWins: "Leadkaun wins when the problem is not dialing faster but calling the right lead first. It grades every lead A–F on Fit × Intent × Quality, auto-ranks each rep's Priority Queue, and surfaces the ₹ at risk from stale leads, the behaviour layer a dialer-first CRM leaves out, tuned for how Indian SMB reps actually work.",
        bottomLine: "Pick TeleCRM if you purely need a fast, affordable dialer for high-volume calling. Pick Leadkaun if grading and prioritisation matter more than raw call throughput. Many calling teams run both, a dialer for volume, Leadkaun alongside it so reps dial the highest-intent lead first.",
      }}
    />
  )
}
