import type { Metadata } from "next"
import { Building2 } from "lucide-react"
import { UseCaseLayout } from "@/app/components/use-case-layout"

export const metadata: Metadata = {
  title: "Real Estate Lead Management India — Stop Losing Property Enquiries",
  description:
    "Leadkaun helps real estate sales teams in India grade property enquiries A–F, build a priority callback queue, and surface stale leads with ₹ value before they're gone.",
  alternates: { canonical: "/use-cases/real-estate" },
}

export default function RealEstatePage() {
  return (
    <UseCaseLayout
      industryLabel="Real Estate"
      icon={Building2}
      h1="Stop losing property enquiries."
      subhead="Real estate sales teams across India lose lakhs every week to slow follow-up and no-priority-system. Leadkaun fixes that the same day."
      ticketBand="₹5L–₹5Cr GCV"
      salesCycle="2 days to 4 months"
      channels={["99acres", "MagicBricks", "Facebook Ads", "Google Ads", "Walk-ins"]}
      pains={[
        {
          title: "Property enquiries go cold within the hour",
          body: "In real estate, the first team to reach a fresh enquiry usually wins it — interest fades fast once a buyer starts calling around. Most teams call back in 4+ hours, or not at all. Leadkaun puts the freshest, highest-fit enquiries at the top of each rep's queue.",
        },
        {
          title: "One missed site visit = ₹5–₹50L lost",
          body: "Property deals are high-value and emotion-driven. A cold lead doesn't just not convert — they go to a competitor who called first.",
        },
        {
          title: "Reps call new enquiries. Forget the warm ones.",
          body: "Without a queue, reps naturally call the freshest lead. But a Grade B lead that replied to a WhatsApp 2 days ago is far more likely to close than a cold new enquiry.",
        },
      ]}
      helps={[
        "Every property enquiry gets Grade A–F based on project fit, location match, and engagement",
        "Priority Queue surfaces the leads most likely to convert TODAY — not just the newest ones",
        "3-tap logging: rep marks call outcome, WhatsApp stage, and site visit booking in under 10 seconds",
        "Missed Opportunity Engine shows every stale enquiry with ₹ value — manager sees per-rep accountability",
        "Morning Brief: '4 Grade A enquiries need callback. ₹12L in site visits at risk today'",
      ]}
      faqs={[
        {
          q: "How long does it take to set up Leadkaun for a real-estate team?",
          a: "The same day from signup to your first graded property enquiry in the queue. Real estate ICP weights are pre-configured — you tweak project tiers and city focus, then go live.",
        },
        {
          q: "Do you integrate with 99acres, MagicBricks, and HousingMan?",
          a: "Yes — via CSV bulk import and webhooks, most teams pipe portal leads in the same day. Google Sheets sync and WhatsApp BSP auto-logging (AiSensy, Gupshup, Interakt) are on our roadmap; until then, WhatsApp is tracked with fast 3-tap manual logging.",
        },
        {
          q: "What if a rep handles HNI buyers — different ICP from mass-market?",
          a: "Your ICP is set once per account and captures what a strong real-estate lead looks like — project price band, city and location match, and source reliability. It's shared across the account today (per-segment weighting isn't available yet), but the Fit score still reflects each lead's price band and geography, so an HNI-fit enquiry and an affordable-housing-fit enquiry grade on their own merits.",
        },
        {
          q: "How does Missed Opportunity work for property leads?",
          a: "Every Grade A/B lead that hasn't been contacted in 24 hours surfaces with the project's average ticket size. A typical day shows '6 leads · ₹2.4 Cr at risk' to the sales manager.",
        },
      ]}
      relatedCities={[
        { city: "Mumbai",    href: "/real-estate/mumbai" },
        { city: "Pune",      href: "/real-estate/pune" },
        { city: "Bengaluru", href: "/real-estate/bengaluru" },
        { city: "Delhi NCR", href: "/real-estate/delhi-ncr" },
        { city: "Hyderabad", href: "/real-estate/hyderabad" },
        { city: "Chennai",   href: "/real-estate/chennai" },
      ]}
      relatedFeature={{ label: "How Lead Scoring works →", href: "/features/lead-scoring" }}
    />
  )
}
