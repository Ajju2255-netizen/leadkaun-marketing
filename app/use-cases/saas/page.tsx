import type { Metadata } from "next"
import { Rocket } from "lucide-react"
import { UseCaseLayout } from "@/app/components/use-case-layout"

export const metadata: Metadata = {
  title: "SaaS Sales India, Trial-to-paid & expansion CRM",
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
      subhead="Indian B2B SaaS teams run trial-to-paid, PLG-to-sales handoff, and expansion, usually on three different tools. Leadkaun unifies the grade, the queue, and the ₹ at risk across every motion."
      ticketBand="₹10k – ₹20L ARR"
      salesCycle="1 to 60 days"
      channels={["Inbound website", "Trial signups", "Content marketing", "Google Ads", "LinkedIn outbound"]}
      pains={[
        { title: "Trials expire before anyone calls.", body: "A user signs up, pokes around for a day or two, hits one point of friction, and goes silent, and with self-serve SaaS the majority of trials never convert on their own. Nobody on sales reaches out, because the signup is buried in a Mixpanel event or a #new-signups Slack channel that nobody triages. The trial clock runs out and a genuinely qualified account churns before a human ever said hello. Speed and prioritisation are the whole game here: a fit-checked trial reached on day one behaves very differently from the same account reached on day nine, once they've already forgotten why they signed up." },
        { title: "Expansion signals rot in product data.", body: "An existing customer quietly added five seats, hit an API rate limit, and invited a new department into the workspace, textbook expansion signals. But those events live in product analytics, not in front of the AE who owns the account, so nobody starts the upgrade conversation. In Indian B2B SaaS, where net revenue retention is what makes the unit economics work, expansion left on the table is often costlier than a lost new logo." },
        { title: "Content-spike chaos.", body: "A single LinkedIn post or a Product Hunt launch can drop hundreds of trial signups in a day, and sales has no way to triage the flood. As more Indian SaaS shifts to product-led, self-serve funnels, signup volume gets lumpier and less predictable, one good week of content can outrun a whole month of pipeline capacity. Without grading, the handful of enterprise-shaped accounts hiding in that list look identical to the students and tyre-kickers, so reps work it top-to-bottom and the best-fit trials go cold. The spike that should have paid for the quarter mostly evaporates into an untriaged inbox." },
      ]}
      helps={[
        "Trial signups import via CSV or a generic webhook (including Google Sheet exports) and get graded A–F on company size, tech-stack and role signals, so the enterprise-shaped trial never sits in the same undifferentiated list as a throwaway signup.",
        "Intent scoring tuned for SaaS reads behaviour as signal: a trial silent for ten days grades down, while a user who invited three teammates or connected an integration spikes toward Grade A and jumps the Priority Queue.",
        "Expansion-opportunity detection flags existing customers showing usage, seat-add, or limit-hit signals as their own lead type, so AEs see the upgrade moment instead of finding it in a QBR three months late.",
        "The Missed Opportunity Engine attaches ₹ ARR to every Grade A/B trial that has aged past your follow-up window and rolls it up per rep, so the head of sales sees exactly which trials are about to lapse.",
        "The Morning Brief email opens the day with the real list: '12 trial users hit day-7 without a sales call · ₹3.2L ARR at risk, Priya owns 8, Rajesh owns 4.'",
        "Multi-seat deal threading carries the SDR's first touch into the AE's closing thread without losing context, so a self-serve signup that grows into a 40-seat deal keeps its full history.",
      ]}
      insight="India's B2B SaaS sector has scaled to roughly US$13 billion in ARR and is growing near 30% a year (NASSCOM), flooding sales teams with trial signups and inbound demo requests. When volume outruns capacity, grading leads by fit and intent, and reaching the hottest ones first is what protects the pipeline."
      faqs={[
        { q: "Does it integrate with our trial signup flow?", a: "Yes, pipe signups in through a generic webhook or CSV, and we publish a SaaS-specific onboarding guide for mapping trial fields onto Fit and Intent. Native Segment and Mixpanel connectors are on the roadmap; until then most teams wire up the webhook the same day. Leadkaun runs alongside your existing CRM and product analytics, not instead of them." },
        { q: "How does it handle PLG self-upgrade events?", a: "Fire a 'self-upgrade' signal manually or via our API when a user upgrades in-product, and the scoring engine re-grades the account and surfaces it in the owner's queue for an expansion conversation. The signal weights are fixed and transparent. You configure which events describe your ICP, not the underlying maths." },
        { q: "Can we track account-level vs user-level?", a: "Every lead record supports a primary contact plus associated contacts, and account-level rollups appear on the Rep Performance card, so you can work an individual champion while still seeing the whole buying committee behind that logo." },
        { q: "Does it work for multi-product cross-sell?", a: "Set up a product-level ICP and a separate pipeline per product, so a cross-sell lead for Product B is graded on Product B's fit rather than inheriting the scores from the account's original purchase." },
        { q: "Can we export to our analytics stack?", a: "Not natively in Phase 1. CSV export is available today, and native Segment/Mixpanel connectors are on the roadmap. Because Leadkaun sits alongside your stack as the grading-and-queue layer, your warehouse and product analytics stay the system of record." },
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
