import type { Metadata } from "next"
import { Briefcase } from "lucide-react"
import { UseCaseLayout } from "@/app/components/use-case-layout"

export const metadata: Metadata = {
  title: "Agency Sales Software India — Multi-client pipeline management",
  description:
    "B2B agencies juggle client pipelines and new business simultaneously. Leadkaun gives you per-client ICP, protected new-business queues, and one-click white-label reports.",
  alternates: { canonical: "/use-cases/agencies" },
}

export default function AgenciesPage() {
  return (
    <UseCaseLayout
      industryLabel="Agencies"
      icon={Briefcase}
      h1="Run 8 client pipelines without 8 spreadsheets."
      subhead="B2B agencies — performance marketing, BD-as-a-service, SEO, SaaS-for-agency — juggle client pipelines and new business in parallel. Leadkaun gives you per-client ICP, protected new-business queues, and one-click white-label reports."
      ticketBand="₹50k – ₹25L retainer / project"
      salesCycle="7 to 180 days"
      channels={["Referrals", "LinkedIn outreach", "Content", "Google / LinkedIn Ads", "Events"]}
      pains={[
        { title: "8 clients, 8 spreadsheets.", body: "Every client has a different ICP. Spreadsheets multiply. Context-switching costs half a day per week." },
        { title: "New business collapses when delivery gets loud.", body: "Existing clients escalate, BD pipeline goes untouched for a week. Three pitches time out." },
        { title: "White-label reporting eats your Fridays.", body: "Every client expects a branded monthly report. 4 hours per client, every month. Ten clients is a week of ops cost." },
      ]}
      helps={[
        "Per-client pipelines, each with its own ICP weights.",
        "New-business pipeline runs as a separate, protected queue — doesn't get crushed when a delivery client gets loud.",
        "Account directors see only their clients; founder sees everything via role-based access.",
        "CSV export per client is white-label-ready — branded report in 10 minutes, not 4 hours.",
        "Morning Brief per pipeline: BD head sees new-business; each account director sees their client's ₹ at risk.",
      ]}
      testimonial={{
        quote: "We stopped dropping the new-business pipeline every time a client got loud. BD conversion doubled in a quarter. Monthly reporting went from 4 hours to 10 minutes per client.",
        name: "Anjali R.",
        role: "Agency Founder",
        city: "Bengaluru",
      }}
      faqs={[
        { q: "Can each client have its own ICP?", a: "Yes — define per-pipeline ICP weights on Growth tier." },
        { q: "Is there a client-portal view?", a: "Not in Phase 1. Export per-client CSV for white-label reporting." },
        { q: "Can I manage both new-business and client delivery?", a: "Yes — set up two pipelines (new-business, per-client-delivery). Each has its own queue." },
        { q: "Does it track retainer renewal dates?", a: "Yes, via the follow-up engine renewal cadence." },
        { q: "Can team members see across clients?", a: "Role-based — account directors see their clients only; agency head sees all." },
      ]}
      relatedCities={[
        { city: "Bengaluru",   href: "/agencies/bengaluru" },
        { city: "Mumbai",      href: "/agencies/mumbai" },
        { city: "Delhi",       href: "/agencies/delhi" },
        { city: "Pune",        href: "/agencies/pune" },
        { city: "Gurugram",    href: "/agencies/gurugram" },
        { city: "Hyderabad",   href: "/agencies/hyderabad" },
      ]}
      relatedFeature={{ label: "See how sales-rep tracking works across agency clients", href: "/features/sales-rep-tracking" }}
    />
  )
}
