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
          body: "In real estate the first team to reach a fresh enquiry usually wins the site visit — a buyer who fills a 99acres or MagicBricks form is visible to a dozen builders and channel partners at once, and interest fades fast the moment the calls start pouring in. Most site teams still call back hours later, or lose the lead in a shared portal inbox that nobody owns. Leadkaun puts the freshest, highest-fit enquiries at the top of each rep's Priority Queue, so the callback happens while the buyer is still deciding whom to visit.",
        },
        {
          title: "One missed site visit is a booking gone",
          body: "Property deals are high-value and emotion-driven, and the site visit is the moment intent turns into a booking — a buyer who never gets scheduled in almost never comes back on their own. A cold lead doesn't just fail to convert; they tour the project of whichever builder followed up first. Against ticket sizes that run from a ₹50L flat to a multi-crore villa, a single lost booking can outweigh a whole month of portal and ad spend, which is why every un-actioned Grade A enquiry carries a real cost.",
        },
        {
          title: "Reps chase new enquiries and forget the warm ones",
          body: "Without a shared queue, reps gravitate to whatever name just landed — the newest enquiry always feels the most urgent. But a Grade B buyer who toured the project last week and replied to a WhatsApp two days ago is usually far closer to booking than a cold portal lead who filled ten forms in one sitting. Leadkaun re-ranks the day by likelihood to convert, so warm, mid-funnel buyers don't quietly age out while the team keeps dialling fresh noise.",
        },
      ]}
      helps={[
        "Every property enquiry is graded A–F on Fit × Intent × Quality — project price band, city and location match, source reliability, and engagement — so reps see at a glance which buyers deserve the first call",
        "The Priority Queue surfaces the leads most likely to book a site visit today, not just the newest ones — each rep opens the app to a ranked callback list instead of a chaotic portal inbox",
        "3-tap logging lets a rep mark call outcome, WhatsApp stage, and site-visit booking in seconds; WhatsApp is captured with fast manual logging today, with BSP auto-sync (AiSensy, Gupshup, Interakt) on the roadmap",
        "The Missed Opportunity Engine shows every stale Grade A/B enquiry with the project's ₹ value attached and rolls it up per rep, so the sales manager sees exactly where bookings are leaking",
        "The Morning Brief email lands before the day starts: '4 Grade A enquiries need callback · ₹12L in site visits at risk today'",
        "Follow-up cadences keep mid-funnel buyers warm between touches, so a lead who went quiet after a first tour resurfaces in the queue instead of disappearing into the CRM",
      ]}
      insight="Per Anarock's ASTRA analysis of 2.8 million homebuyer leads, the average enquiry-to-booking cycle stretched from 25 days in 2022 to 28 days in 2024 — a longer, multi-touch decision. Over a window that long, the site teams that respond first and keep following up before leads go cold capture a disproportionate share."
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
          a: "Every Grade A/B lead that hasn't been contacted inside your follow-up window surfaces with the project's average ticket size attached, and the totals roll up per rep so the sales manager can see who is sitting on booking-ready buyers. A typical day might read '6 leads · ₹2.4 Cr at risk', turning a vague 'we're busy' into a specific, accountable list — the number is illustrative and reflects your own pipeline, not a promised outcome.",
        },
        {
          q: "Do we have to drop our existing CRM to use Leadkaun?",
          a: "No. Leadkaun is a Sales Behaviour OS that runs alongside your CRM, not instead of it — it's the lead-intelligence layer most builder CRMs are missing. Portal and ad leads flow in via CSV or webhook, get graded and queued, and your reps keep recording deals wherever they already do. Pricing is flat per account (Starter ₹2,999, Growth ₹7,999, Scale ₹19,999 per month), so adding more site executives or a second project team never changes the bill.",
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
