import type { Metadata } from "next"
import { Rocket } from "lucide-react"
import { UseCaseLayout } from "@/app/components/use-case-layout"

export const metadata: Metadata = {
  title: "SaaS Sales India — Trial-to-paid & expansion CRM",
  description:
    "Indian B2B SaaS teams run trial-to-paid, PLG-to-sales handoff, and expansion. Leadkaun unifies grade, queue, and ₹ at risk across every motion.",
  alternates: { canonical: "/use-cases/saas" },
}

export default function SaaSPage() {
  return (
    <UseCaseLayout
      industryLabel="SaaS"
      icon={Rocket}
      h1="Stop losing trials to silence."
      subhead="Indian B2B SaaS teams run trial-to-paid, PLG-to-sales handoff, and expansion — usually on three different tools. Leadkaun unifies the grade, the queue, and the ₹ at risk across every motion."
      ticketBand="₹10k – ₹20L ARR"
      salesCycle="1 to 60 days"
      channels={["Inbound website", "Trial signups", "Content marketing", "Google Ads", "LinkedIn outbound"]}
      pains={[
        { title: "Trials expire before anyone calls.", body: "User signs up, tries for 2 days, goes silent. No one reaches out. Trial expires. 60% of self-serve trials follow this shape." },
        { title: "Expansion signals rot in product data.", body: "An existing customer added 5 seats, hit an API limit, invited a new department. Expansion-ready signals. Nobody on sales sees them." },
        { title: "Content-spike chaos.", body: "A viral LinkedIn post drops 400 trial signups in a day. Sales has no triage. 350 go cold. Six figures of ARR walks away." },
      ]}
      helps={[
        "Trial signups ingested via webhook, CSV, or Google Sheet — graded A–F by company size, stack signals, and role.",
        "Intent decay tuned for SaaS: a trial user silent for 10 days is a strong negative; someone who invited 3 teammates is a Grade A spike.",
        "Expansion-opportunity detection flags existing customers with usage, role-add, or seat-limit signals as a separate lead type.",
        "Morning Brief: '12 trial users hit day-7 without a sales call. ₹3.2L ARR at risk — Priya owns 8, Rajesh owns 4.'",
        "Multi-seat deal threading: SDR's initial contact flows to the AE's closing thread without losing context.",
      ]}
      testimonial={{
        quote: "We stopped losing trials to forgotten follow-ups. Trial-to-paid went from 22% to 34% in 60 days. Leadkaun surfaces the Grade A trials on day 1, not day 10 when they've already churned.",
        name: "Karthik P.",
        role: "Head of Sales, B2B SaaS",
        city: "Bengaluru",
      }}
      faqs={[
        { q: "Does it integrate with our trial signup flow?", a: "Webhook or CSV; we publish a SaaS-specific onboarding guide. Segment/Mixpanel on roadmap." },
        { q: "How does it handle PLG self-upgrade events?", a: "Trigger a 'self-upgrade' signal manually or via API; scoring surfaces the user for expansion conversations." },
        { q: "Can we track account-level vs user-level?", a: "Lead record supports primary + associated contacts; account-level rollups on the Rep Performance card." },
        { q: "Does it work for multi-product cross-sell?", a: "Product-level ICP and a separate pipeline per product." },
        { q: "Can we export to our analytics stack?", a: "Not natively in Phase 1. CSV export available; Segment/Mixpanel on roadmap." },
      ]}
      relatedCities={[
        { city: "Bengaluru",   href: "/saas/bengaluru" },
        { city: "Hyderabad",   href: "/saas/hyderabad" },
        { city: "Pune",        href: "/saas/pune" },
        { city: "Mumbai",      href: "/saas/mumbai" },
        { city: "Delhi",       href: "/saas/delhi" },
        { city: "Chennai",     href: "/saas/chennai" },
      ]}
      relatedFeature={{ label: "See how Missed Opportunity handles trial ARR at risk", href: "/features/missed-opportunity-engine" }}
    />
  )
}
