import type { Metadata } from "next"
import { ComparePageLayout } from "@/app/components/compare-layout"

export const metadata: Metadata = {
  title: "Leadkaun vs LeadSquared (2026) — Activity vs behaviour",
  description:
    "LeadSquared tracks activity; Leadkaun tracks behaviour. Side-by-side feature matrix, INR pricing, switching guide for Indian B2B SMBs.",
  alternates: { canonical: "/compare/leadkaun-vs-leadsquared" },
}

export default function VsLeadSquared() {
  return (
    <ComparePageLayout
      competitor="LeadSquared"
      tldr="LeadSquared is India-built and strong in EdTech, BFSI, and healthcare workflow. Leadkaun is a different category — Sales Behaviour OS. Activity tracking (LeadSquared) versus behaviour tracking (Leadkaun). Run them alongside; consolidate on the behaviour layer once ROI is proven."
      positioning="LeadSquared shines at activity orchestration and mobile field-rep workflow. It falls short where Indian B2B has moved — WhatsApp as native signal, ₹-denominated accountability, priority queueing with intent decay. Consulting-heavy onboarding (2–8 weeks) makes it feel heavier than its feature set warrants for SMBs."
      strengths={[
        "India-built; knows Indian verticals deeply",
        "Strong in EdTech, BFSI, healthcare workflows",
        "Mobile-first for field reps",
        "Workflow automation builder",
      ]}
      weaknesses={[
        "Activity tracking ≠ behaviour tracking",
        "No rupee-first metrics (counts over ₹)",
        "Priority is filter-based, not auto-ranked",
        "No Morning Brief equivalent",
        "Quote-based pricing (opaque)",
        "Deploys through consultants (2–8 weeks)",
      ]}
      features={[
        { label: "3-dimensional scoring (Fit × Intent × Quality)", leadkaun: true,          competitor: "Points-based" },
        { label: "Intent decay over time",                          leadkaun: true,          competitor: false },
        { label: "Priority Queue (auto-ranked)",                    leadkaun: true,          competitor: "Filter views" },
        { label: "Missed Opportunity Engine (₹ at risk)",           leadkaun: true,          competitor: false },
        { label: "Morning Brief at 8:30 AM IST",                    leadkaun: true,          competitor: "Custom reports" },
        { label: "WhatsApp 3-tap logging (any account)",            leadkaun: true,          competitor: "BSP only" },
        { label: "Mobile field-rep UI",                             leadkaun: true,          competitor: true },
        { label: "Workflow automation builder",                     leadkaun: "neutral",     competitor: true },
        { label: "Setup time",                                      leadkaun: "60 min",      competitor: "2–8 wks" },
        { label: "Transparent pricing",                             leadkaun: true,          competitor: false },
      ]}
      pricing={{
        leadkaun:   { tier: "Growth",       price: "₹1,999 / rep / mo", note: "Published. 14-day trial. No credit card." },
        competitor: { tier: "Quote-based",  price: "₹2,500–5,000",       note: "Typical SMB after consulting + implementation" },
      }}
      switching={[
        { title: "Export from LeadSquared",      body: "Export leads, activities, stage history as CSV. Most mid-market accounts export in 2–3 hours." },
        { title: "Onboard Leadkaun",             body: "Industry-specific ICP templates for EdTech / BFSI / healthcare already configured. 60-minute setup." },
        { title: "Train reps on 3-tap logging",  body: "2-hour session per team. Reps log 5 real leads live. Within a week, adoption >70%." },
        { title: "Measure ₹ recovered for 60 days", body: "The behaviour-layer ROI shows up in Missed Opportunity recovery. If it beats the combined bill, consolidate." },
      ]}
      faqs={[
        { q: "We use LeadSquared's mobile app heavily. Does Leadkaun have one?", a: "Leadkaun works on mobile web — same features, no app install, patchy-3G tolerant. Field reps in manufacturing / real estate use Leadkaun exclusively from phones." },
        { q: "Our onboarding for LeadSquared took 6 weeks. Is Leadkaun really 60 minutes?", a: "Yes. Pre-configured ICP templates for 12 Indian B2B verticals mean most SMBs don't need to define ICP from scratch. First scored lead in the queue within the first hour." },
        { q: "LeadSquared is strong on marketing automation. Can Leadkaun replace that?", a: "Not in Phase 1. If marketing automation is core to your stack, keep LeadSquared / HubSpot for that layer; Leadkaun handles the sales-behaviour layer on top." },
        { q: "Can I keep LeadSquared for workflow and add Leadkaun for scoring?", a: "Yes — this is the most common pattern. Sync leads via CSV / Sheets; behaviour runs on Leadkaun; LeadSquared keeps the workflow depth." },
      ]}
    />
  )
}
