import type { Metadata } from "next"
import { ComparePageLayout } from "@/app/components/compare-layout"

export const metadata: Metadata = {
  title: "Leadkaun vs Sell.Do (2026), Horizontal B2B vs Real-Estate CRM",
  description:
    "Honest side-by-side of Leadkaun vs Sell.Do for Indian teams, horizontal B2B lead grading vs a real-estate-specific CRM, pricing transparency, and WhatsApp.",
  alternates: { canonical: "/compare/leadkaun-vs-selldo" },
}

export default function VsSellDo() {
  return (
    <ComparePageLayout
      competitor="Sell.Do"
      competitorShort="Sell.Do"
      tldr="Sell.Do is an India-built, real-estate-specific CRM (from the makers of Kylas) with AI call analysis and native WhatsApp, strong for property developers and brokers. Leadkaun is horizontal: it grades any lead source A–F across industries, with transparent flat pricing. In real estate they overlap; outside it, Leadkaun fits where Sell.Do is over-specialised."
      positioning="Sell.Do is a vertical CRM for Indian real estate, site visits, bookings, channel partners, and AI call sentiment scoring, built around property-sales workflows. It's genuinely India-first. The trade-offs outside real estate: it's shaped around property motions, pricing is quote-only (opaque), and its scoring reads real-estate buyer intent rather than a generic A–F grade."
      strengths={[
        "Purpose-built for Indian real estate (site visits, bookings, channel partners)",
        "India-first: native WhatsApp, Indian telephony, multi-language AI call analysis",
        "AI call sentiment and buyer-intent scoring",
        "Track record and scale in the Indian property market",
      ]}
      weaknesses={[
        "Vertical fit, built around real estate, often overkill for general B2B",
        "Opaque, quote-based pricing (no public tiers to compare)",
        "Scoring is real-estate-buyer-intent, not a horizontal A–F Fit × Intent × Quality grade",
        "Likely heavier / more enterprise-leaning to implement",
        "Assumes property-sales workflows you may not have",
      ]}
      features={[
        { label: "Works across B2B industries (horizontal)",            leadkaun: true,           competitor: "Real estate" },
        { label: "Transparent public pricing",                          leadkaun: true,           competitor: false },
        { label: "3-dimensional A–F grading (any lead source)",         leadkaun: true,           competitor: "RE-specific" },
        { label: "Priority Queue (auto-ranked, real-time)",             leadkaun: true,           competitor: "neutral" },
        { label: "Missed Opportunity Engine (₹-denominated)",           leadkaun: true,           competitor: false },
        { label: "WhatsApp handling",                                   leadkaun: "3-tap signal", competitor: "Native" },
        { label: "Real-estate-specific workflows (site visits, bookings)", leadkaun: false,       competitor: true  },
        { label: "AI call sentiment analysis",                          leadkaun: false,          competitor: true  },
        { label: "India-specific UX",                                   leadkaun: true,           competitor: true  },
        { label: "Setup time",                                          leadkaun: "same day",       competitor: "Guided / heavier" },
      ]}
      pricing={{
        leadkaun:   { tier: "Growth", price: "₹7,999 / mo", note: "Flat per account, transparent, 14-day free trial" },
        competitor: { tier: "Custom", price: "Quote-based", note: "No public pricing, request a demo/quote. As of 2026, verify." },
      }}
      switching={[
        { title: "Decide by vertical", body: "If you're a property developer needing deep real-estate workflows, Sell.Do is purpose-built. For horizontal B2B, read on." },
        { title: "Export leads",       body: "Export leads and activity as CSV." },
        { title: "Onboard Leadkaun",   body: "Same-day wizard with a pre-configured ICP for your industry." },
        { title: "Run parallel",       body: "Grade the same leads in both for 2–4 weeks and compare how each ranks your day." },
      ]}
      faqs={[
        { q: "Sell.Do or Leadkaun for real estate?", a: "Sell.Do is deeply real-estate-specific (site visits, bookings, channel partners) and suits larger developers. Leadkaun is lighter and focused on grading enquiries and fixing response time, often a better fit for brokers and mid-size teams, and it can sit alongside a heavier system." },
        { q: "Is Leadkaun only for real estate?", a: "No. Leadkaun is horizontal. It grades leads A–F across real estate, EdTech, BFSI, manufacturing, healthcare, SaaS, agencies, and more. Sell.Do is specialised to real estate." },
        { q: "How transparent is pricing?", a: "Leadkaun publishes flat INR tiers (Free / ₹2,999 / ₹7,999 / ₹19,999). Sell.Do is quote-based with no public pricing, which makes direct comparison harder." },
        { q: "Who's behind Sell.Do?", a: "Sell.Do and Kylas share a founder (Ketan Sabnis). Kylas is the horizontal SMB CRM, Sell.Do the real-estate product. (It is not an ANAROCK product; ANAROCK runs a separate CRM.)" },
      ]}
      verdict={{
        competitorWins: "Sell.Do is a genuinely India-first, real-estate-specific CRM. It is built around property motions, site visits, bookings, channel partners, with native WhatsApp, Indian telephony, and multi-language AI call sentiment analysis. For property developers and larger brokerages that live in those workflows, that vertical depth is a real strength Leadkaun does not attempt to match.",
        leadkaunWins: "Leadkaun is horizontal where Sell.Do is specialised. It grades any lead source A–F on Fit, Intent, and Quality across industries, not just real-estate buyer intent, and publishes flat, transparent INR pricing where Sell.Do stays quote-only. For a general B2B team, or a broker wanting lighter grading and faster response over property-specific machinery, that fit is the better one.",
        bottomLine: "If you are a property developer whose day runs on site visits, bookings, and channel-partner tracking, Sell.Do is purpose-built, so pick it. If you sell across other B2B industries, or want horizontal A–F grading with transparent pricing, choose Leadkaun. In real estate the two overlap, and a lighter Leadkaun layer can sit alongside a heavier vertical system.",
      }}
    />
  )
}
