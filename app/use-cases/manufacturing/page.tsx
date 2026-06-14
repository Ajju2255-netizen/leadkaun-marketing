import type { Metadata } from "next"
import { Factory } from "lucide-react"
import { UseCaseLayout } from "@/app/components/use-case-layout"

export const metadata: Metadata = {
  title: "B2B Manufacturing Lead Management India — Quote-to-close CRM",
  description:
    "Industrial B2B sales has long cycles and multi-stakeholder threads. Leadkaun scores every lead, holds the thread across 180 days, and surfaces ₹ at risk in stalled quotes.",
  alternates: { canonical: "/use-cases/manufacturing" },
}

export default function ManufacturingPage() {
  return (
    <UseCaseLayout
      industryLabel="Manufacturing"
      icon={Factory}
      h1="Win the 90-day cycle without losing the thread."
      subhead="Manufacturing B2B teams live with long cycles, multi-stakeholder threads, and quote-revision loops. Leadkaun scores every lead, holds the thread across 180 days, and surfaces stalled quotes in ₹ before they go to a competitor."
      ticketBand="₹50k – ₹50L per order"
      salesCycle="30 to 180 days"
      channels={["IndiaMART", "TradeIndia", "Distributor network", "Outbound SDR", "Trade shows"]}
      pains={[
        { title: "Quote sent. Silence. Deal lost.", body: "40% of B2B industrial quotes never receive a follow-up within the buyer's SLA. The vendor who follows up in 24 hours wins 60% of the time." },
        { title: "Multi-stakeholder thread loss.", body: "Procurement asked for a quote. Finance is evaluating. Engineering wants a sample. Three conversations, one deal — nobody sees the full thread." },
        { title: "90-day cycles, 30-day memory.", body: "Engineered goods cycles run 90+ days. The buying signal from day 15 is forgotten by day 45. Field rep notes never get logged." },
      ]}
      helps={[
        "Intent Score tracks signals across a 90–180 day cycle with slow decay — a quote sent on day 15 still influences the grade on day 60.",
        "Follow-up cadence defaults are long-B2B-aware: Grade A gets weekly touches, not daily spam.",
        "Mobile-optimised 3-tap logging works on patchy 3G — field reps log a 30-minute factory meeting in 10 seconds.",
        "Quote objects on the lead record carry value, validity, and next-touch date — the Missed Opportunity Engine surfaces ₹ at risk per open quote.",
        "Distributor attribution with commission splits — no more credit disputes when a dealer closes an inside-sales-sourced deal.",
      ]}
      testimonial={{
        quote: "Our sales cycle dropped from 95 days to 62 because reps stopped losing the thread between quote and close. ₹1.4Cr of pipeline that would have stalled last quarter actually closed.",
        name: "Suresh K.",
        role: "Sales Director, Industrial",
        city: "Pune",
      }}
      faqs={[
        { q: "Does it handle quote tracking?", a: "Lead record has a quote object with value, status, and follow-up schedule. Stale quotes surface with ₹ at risk." },
        { q: "How does it work with field reps on patchy mobile data?", a: "Mobile-optimised logging works offline; syncs when connectivity returns." },
        { q: "Can we attribute to distributors?", a: "Yes, with configurable commission splits between inside sales and distributor." },
        { q: "Does it integrate with our ERP (SAP, Tally, Zoho Books)?", a: "Not in Phase 1. Export leads to CSV for ERP; ERP integration on roadmap." },
        { q: "Can multiple team members collaborate on one lead?", a: "Yes. Lead notes, activity timeline, and assignment support multi-rep collaboration." },
      ]}
      relatedCities={[
        { city: "Pune",         href: "/manufacturing/pune" },
        { city: "Chennai",      href: "/manufacturing/chennai" },
        { city: "Coimbatore",   href: "/manufacturing/coimbatore" },
        { city: "Ahmedabad",    href: "/manufacturing/ahmedabad" },
        { city: "Ludhiana",     href: "/manufacturing/ludhiana" },
        { city: "Rajkot",       href: "/manufacturing/rajkot" },
      ]}
      relatedFeature={{ label: "See how lead scoring handles long cycles", href: "/features/lead-scoring" }}
    />
  )
}
