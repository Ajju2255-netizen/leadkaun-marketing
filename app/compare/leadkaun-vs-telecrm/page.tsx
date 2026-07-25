import type { Metadata } from "next"
import { ComparePageLayout } from "@/app/components/compare-layout"

export const metadata: Metadata = {
  title: "Leadkaun vs TeleCRM (2026) — Telecalling CRM vs Sales Behaviour OS",
  description:
    "Honest side-by-side of Leadkaun vs TeleCRM for Indian sales teams — dialer-first vs behaviour-first, WhatsApp, lead scoring, per-user cost and add-ons.",
  alternates: { canonical: "/compare/leadkaun-vs-telecrm" },
}

export default function VsTeleCRM() {
  return (
    <ComparePageLayout
      competitor="TeleCRM"
      competitorShort="TeleCRM"
      tldr="TeleCRM is an India-first telecalling and WhatsApp CRM built for high-volume dialing teams — fast, cheap per seat, strong on follow-up automation. Leadkaun is behaviour-first: it grades and ranks leads by intent so reps call the right lead, not just the next one in the list."
      positioning="TeleCRM is optimised for telecalling volume — one-click dialer, call recording, follow-up reminders, leaderboards, and strong WhatsApp automation. It's a great fit for inside-sales and calling-heavy teams. It's less about considered B2B pipeline management, and it doesn't ship an intent-graded scoring engine or an auto-ranked priority queue."
      strengths={[
        "Purpose-built for telecalling — 1-click dialer, recording, reminders",
        "Strong, affordable WhatsApp automation and multi-platform lead capture",
        "Low per-user price; fast to get a calling team running",
        "Mobile-first for field and tele reps",
      ]}
      weaknesses={[
        "Per-user pricing plus add-ons (Chat Sync, WhatsApp API) creeps up",
        "No sophisticated lead scoring — it's dialer/follow-up driven, not intent-graded",
        "Geared to calling volume rather than B2B deal/pipeline nuance",
        "No A–F grading, intent decay, or auto-ranked Priority Queue",
        "No ₹-denominated Missed Opportunity Engine",
      ]}
      features={[
        { label: "3-dimensional lead scoring (Fit × Intent × Quality)", leadkaun: true,           competitor: false },
        { label: "Intent decay over time",                              leadkaun: true,           competitor: false },
        { label: "Priority Queue (auto-ranked, real-time)",             leadkaun: true,           competitor: false },
        { label: "Missed Opportunity Engine (₹-denominated)",           leadkaun: true,           competitor: false },
        { label: "Morning Brief at 8:30 AM IST",                        leadkaun: true,           competitor: false },
        { label: "WhatsApp handling",                                   leadkaun: "3-tap signal", competitor: "Native (core)" },
        { label: "Built-in dialer / telecalling",                       leadkaun: false,          competitor: true  },
        { label: "Pricing model",                                       leadkaun: "Flat/account", competitor: "Per user + add-ons" },
        { label: "India-specific behaviour layer",                      leadkaun: true,           competitor: "neutral" },
        { label: "Setup time",                                          leadkaun: "same day",       competitor: "Self-serve" },
      ]}
      pricing={{
        leadkaun:   { tier: "Growth",  price: "₹7,999 / mo", note: "Flat per account, all 12 modules, 14-day free trial" },
        competitor: { tier: "Annual",  price: "₹799 / user / mo", note: "Per user (annual) + add-ons: Chat Sync ₹200/user/mo, WhatsApp API ₹1,999 setup + Meta charges. Scales with headcount. As of 2026." },
      }}
      switching={[
        { title: "Export from TeleCRM", body: "Export leads and call/activity history as CSV." },
        { title: "Onboard Leadkaun",    body: "Same-day wizard with a pre-configured ICP. Import the CSVs; Indian phones normalise automatically." },
        { title: "Run both if you dial heavily", body: "Many teams keep a dialer for raw call volume and add Leadkaun for grading and prioritisation — so reps dial the highest-intent lead first." },
        { title: "Decide",              body: "If grading + queue + ₹-at-risk lift conversion on the same call volume, Leadkaun earns its place. If you purely need a dialer, TeleCRM is the cheaper single tool." },
      ]}
      faqs={[
        { q: "Is TeleCRM a direct replacement for Leadkaun?", a: "Not really — they solve different problems. TeleCRM maximises calling and follow-up throughput. Leadkaun decides which lead deserves the next call by grading intent and auto-ranking the queue. Calling teams often run both." },
        { q: "Does Leadkaun have a dialer?", a: "No built-in dialer today — that's genuinely TeleCRM's strength. Leadkaun logs call outcomes in 3 taps and feeds them into scoring and the queue." },
        { q: "Which is cheaper?", a: "TeleCRM's base per-user rate is low, but add-ons (Chat Sync, WhatsApp API) and headcount raise the real cost. Leadkaun is one flat account price regardless of team size." },
        { q: "Does TeleCRM score leads?", a: "It captures, assigns, and automates follow-ups, but doesn't ship a documented intent-graded scoring engine. Leadkaun grades A–F on Fit × Intent × Quality in real time." },
        { q: "Is pricing INR with GST?", a: "Yes — both are Indian, INR, GST-compliant. Leadkaun bills flat per account." },
      ]}
    />
  )
}
