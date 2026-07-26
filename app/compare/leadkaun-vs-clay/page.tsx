import type { Metadata } from "next"
import { ComparePageLayout } from "@/app/components/compare-layout"

export const metadata: Metadata = {
  title: "Leadkaun vs Clay (2026) — Data Enrichment vs Lead Management",
  description:
    "Leadkaun vs Clay: different categories. Clay enriches and builds lead lists; Leadkaun grades and prioritises the leads you already have. Here's how they fit together.",
  alternates: { canonical: "/compare/leadkaun-vs-clay" },
}

export default function VsClay() {
  return (
    <ComparePageLayout
      competitor="Clay"
      competitorShort="Clay"
      tldr="Clay isn't a CRM, so this isn't a real 'vs'. Clay is a GTM data-enrichment and list-building tool — spreadsheet-style tables that pull from 100+ data providers and AI to build and enrich prospect lists. Leadkaun grades, prioritises, and works the leads you already have. They're complementary: Clay feeds data in; Leadkaun manages what you do with it."
      positioning="Clay is a data-orchestration platform for GTM and ops teams — waterfall enrichment, scraping, and AI research to build and clean prospect lists at scale. It has no pipeline, no rep queue, and no inbound lead management; it feeds a CRM rather than being one. Leadkaun is the opposite end: it doesn't source data, it grades and prioritises the leads already in your funnel."
      strengths={[
        "Waterfall enrichment across many data providers in one place",
        "Highly flexible tables plus AI (research agents, scraping, formatting)",
        "Automates list-building and data hygiene at scale",
        "Pushes enriched data into downstream CRMs and tools",
      ]}
      weaknesses={[
        "Different category — no inbound lead grading, Priority Queue, or rep workflow",
        "No WhatsApp, ₹ Missed Opportunity Engine, Morning Brief, or phone normalisation",
        "USD plus credit-based pricing — steep for Indian SMBs and easy to overspend",
        "Steep learning curve, built for GTM/ops power users, not a rep triaging inbound",
        "India data coverage depends on the underlying providers (variable)",
      ]}
      features={[
        { label: "Data enrichment / list-building",                    leadkaun: false,          competitor: true  },
        { label: "AI research / scraping tables",                      leadkaun: false,          competitor: true  },
        { label: "Inbound A–F lead grading (Fit × Intent × Quality)",  leadkaun: true,           competitor: false },
        { label: "Priority Queue (auto-ranked, real-time)",            leadkaun: true,           competitor: false },
        { label: "Pipeline / rep workflow",                            leadkaun: true,           competitor: false },
        { label: "Missed Opportunity Engine (₹-denominated)",          leadkaun: true,           competitor: false },
        { label: "WhatsApp as first-class signal (3-tap)",             leadkaun: true,           competitor: false },
        { label: "India-specific UX",                                  leadkaun: true,           competitor: false },
        { label: "Pricing model",                                      leadkaun: "Flat/account", competitor: "Plan + credits (USD)" },
      ]}
      pricing={{
        leadkaun:   { tier: "Growth",  price: "₹7,999 / mo", note: "Flat per account — manages and prioritises leads" },
        competitor: { tier: "Launch",  price: "~$149 / mo", note: "USD, plan + Data Credits/Actions — enriches lead lists. Prices vary by source post-2026 overhaul; verify on clay.com." },
      }}
      switchingLabel="Better together"
      switchingHeading="How Clay and Leadkaun work together."
      faqHeading="Clay + Leadkaun, explained."
      switching={[
        { title: "Clay enriches the list",  body: "Use Clay to build and enrich prospect lists from many data sources." },
        { title: "Push into your funnel",   body: "Send the enriched, clean leads into your CRM / Leadkaun (CSV today)." },
        { title: "Leadkaun grades & queues", body: "Leadkaun grades each lead A–F and auto-ranks who reps should work first." },
        { title: "Work and recover",         body: "Reps work the Priority Queue; the Missed Opportunity Engine catches leads going cold." },
      ]}
      faqs={[
        { q: "Is Clay a CRM or a Leadkaun alternative?", a: "Neither — Clay is a data-enrichment and list-building tool, not a CRM. It doesn't manage or prioritise inbound leads. Leadkaun does. They solve different problems and can be used together." },
        { q: "Does Leadkaun enrich data like Clay?", a: "No. Leadkaun validates and normalises the data on leads you capture (Indian phones, email, dedup), but it does not run waterfall enrichment or build prospect lists — that's Clay's job." },
        { q: "Do I need both?", a: "Only if you build and enrich outbound lists at scale. If you mainly work inbound and existing leads, Leadkaun alone covers grading, prioritisation, and follow-up." },
        { q: "Why compare them at all?", a: "Because teams researching GTM tooling often see both names and wonder how they relate. The honest answer: Clay gets and cleans data; Leadkaun decides what your reps do with the leads." },
      ]}
      verdict={{
        competitorWins: "Clay is genuinely strong at what it does: waterfall enrichment across many data providers, flexible spreadsheet-style tables, and AI research and scraping to build and clean prospect lists at scale, then push them into downstream tools. For a GTM or ops team that lives in data operations, nothing Leadkaun does replaces that sourcing-and-enrichment power.",
        leadkaunWins: "Leadkaun starts where Clay stops. It doesn’t source data; it grades the leads already in your funnel A–F, auto-ranks each rep’s Priority Queue, surfaces the ₹ going cold, and gives reps 3-tap WhatsApp logging and Indian phone normalisation. It is built for a rep triaging inbound, not a power user orchestrating data, and it bills flat in INR rather than USD plus credits.",
        bottomLine: "These are complementary, not competing. Use Clay to build and enrich your lists, then feed those leads into Leadkaun to grade, prioritise and work them. If you build outbound lists at scale, run both; if you mainly handle inbound and existing leads, Leadkaun alone covers grading, prioritisation and follow-up.",
      }}
    />
  )
}
