import type { Metadata } from "next"
import { Landmark } from "lucide-react"
import { UseCaseLayout } from "@/app/components/use-case-layout"

export const metadata: Metadata = {
  title: "BFSI Lead Management India — Insurance, NBFC & Wealth Sales Tracker",
  description:
    "Leadkaun helps Indian BFSI teams grade leads A–F, enforce compliance audit trails, and surface missed premium in ₹. Built for insurance, NBFC, and wealth sales.",
  alternates: { canonical: "/use-cases/bfsi" },
}

export default function BFSIPage() {
  return (
    <UseCaseLayout
      industryLabel="BFSI & Insurance"
      icon={Landmark}
      h1="Audit trail. Assignment. Accountability in ₹."
      subhead="Branch managers, NBFC sales heads, and wealth RMs run regulated sales with compliance pressure and agent-network complexity. Leadkaun delivers grading, assignment, audit trail, and ₹ at risk — all in 60 minutes."
      ticketBand="₹8k – ₹2L premium / ₹1L – ₹25L disbursement"
      salesCycle="1 day to 60 days"
      channels={["PolicyBazaar", "BankBazaar", "Paisabazaar", "Google Ads", "DSA network"]}
      pains={[
        { title: "Compliance trail gaps at audit.", body: "A rep saying 'I called them last week' doesn't show up in the system. At renewal or claim time, that gap becomes a regulator-visible audit risk." },
        { title: "Same lead, two agents, one dispute.", body: "Aggregator-sourced leads often get assigned twice across product lines (term + health). Commission conflicts eat 10–15% of an agent's month." },
        { title: "Renewals slip unnoticed.", body: "Existing policyholders due for renewal or cross-sell aren't flagged until after they lapse. Every lapsed policy is ₹8k–₹1L of premium walking out." },
      ]}
      helps={[
        "Per-product ICP templates — term, health, motor, loans — score each lead by the right criteria for its product line.",
        "Assignment rules by product × geography keep health leads out of a motor agent's queue, eliminating attribution disputes.",
        "Every call, WhatsApp, and email is timestamp-logged and exported on demand for IRDAI / RBI audit preparation.",
        "Renewal dates live on the lead record — the Missed Opportunity Engine surfaces them with ₹ value 30 days before lapse.",
        "Branch Manager Morning Brief: '12 Grade A leads unassigned. ₹4 L premium at risk today.'",
      ]}
      testimonial={{
        quote: "Agent-attribution disputes dropped 80% in two months. Our audit review used to take three days pulling records. Now it's three hours — one export from Leadkaun.",
        name: "Vikram N.",
        role: "Insurance Branch Manager",
        city: "Mumbai",
      }}
      faqs={[
        { q: "Is the data compliant with IRDAI / RBI audit requirements?", a: "Row-Level Security at the DB level; full audit trail per lead; one-click export. Talk to us for regulator-specific checklists." },
        { q: "Can we track renewals + upsell, not just new business?", a: "Lead records carry renewal dates. The Missed Opportunity Engine surfaces upcoming renewals as opportunities." },
        { q: "How is attribution handled across agents?", a: "First-contact attribution with a configurable 'assisted' credit model for DSA networks." },
        { q: "Does it work with aggregator-sourced leads?", a: "Yes — CSV / Google Sheet ingestion from PolicyBazaar / BankBazaar exports." },
        { q: "Does it support bancassurance cross-sell?", a: "Yes. A single lead can appear in multiple product queues with clear ownership rules." },
      ]}
      relatedCities={[
        { city: "Mumbai",      href: "/bfsi/mumbai" },
        { city: "Delhi",       href: "/bfsi/delhi" },
        { city: "Bengaluru",   href: "/bfsi/bengaluru" },
        { city: "Hyderabad",   href: "/bfsi/hyderabad" },
        { city: "Chennai",     href: "/bfsi/chennai" },
        { city: "Pune",        href: "/bfsi/pune" },
      ]}
      relatedFeature={{ label: "See how the Missed Opportunity Engine works", href: "/features/missed-opportunity-engine" }}
    />
  )
}
