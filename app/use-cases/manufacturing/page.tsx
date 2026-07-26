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
        { title: "Quote sent. Silence. Deal lost.", body: "Industrial buyers on IndiaMART and TradeIndia fire the same RFQ to several suppliers at once, then go quiet while they compare. A quote that sits without a follow-up inside the buyer's evaluation window quietly loses to whoever chased hardest — often not the lowest price, just the most present vendor. Without a system holding the next-touch date, a ₹5L quote slips off the radar between plant visits and never gets reopened." },
        { title: "Multi-stakeholder thread loss.", body: "Procurement asked for the quote, finance is checking payment terms, and engineering wants a trial sample before sign-off. That is three parallel conversations feeding one order, and when they live in separate WhatsApp chats and inboxes, nobody sees the whole thread. A rep who forgets engineering is still waiting on a datasheet can stall a ₹40L deal for weeks without realising it." },
        { title: "90-day cycles, 30-day memory.", body: "Engineered-goods and capital-equipment cycles routinely run 90 to 180 days from first enquiry to purchase order. The buying signal a rep picked up on day 15 — a plant expansion, a competitor's price hike — is forgotten by day 45, and field notes scribbled after a factory meeting rarely make it into any system. On the long deal it is usually memory, not effort, that loses the order." },
      ]}
      helps={[
        "Every enquiry is graded A–F on Fit × Intent × Quality the moment it lands, so a serious ₹-crore RFQ from a matching industry never sits in the same undifferentiated inbox as a tyre-kicker or a student project.",
        "Each rep opens a Priority Queue built from those grades — the deals worth chasing today sit at the top, instead of the rep working whatever enquiry shouted loudest last.",
        "The Missed Opportunity Engine watches open quotes and flags the ones going stale, attaching a ₹-at-risk figure drawn from the quote value on the lead record, so a ₹5L quote drifting past its follow-up date surfaces before it dies.",
        "A Morning Brief email lands before the factory floor gets busy, listing the day's Priority Queue, the quotes that need a nudge, and the ₹ at risk if they slip — no logging into anything to know where the day should go.",
        "Field reps log a factory meeting or site call in three taps from the phone and fire a follow-up over WhatsApp manually from the same screen — no typing up notes back at the desk, so the day-15 signal actually gets recorded.",
        "Grading weights are fixed and transparent — you configure your ICP (which industries, order sizes and regions count as a fit), and every rep sees the same consistent grade, so 'hot lead' means the same thing across the team.",
      ]}
      insight="IndiaMART alone connects over 8 million suppliers with 200 million-plus registered buyers and holds a majority of India's online B2B enquiry traffic (IndiaMART). Because industrial buyers fire the same RFQ to several suppliers at once, the vendor who quotes first and keeps chasing the enquiry through the long evaluation cycle typically lands the order — which is why holding the thread across 90-plus days matters more than any single price."
      faqs={[
        { q: "Does it handle quote tracking?", a: "Yes. Each lead carries a quote object with value, status, validity and a next-touch date. When a quote passes its follow-up date without activity, the Missed Opportunity Engine surfaces it with the ₹ at risk drawn from that quote value, so stalled quotes get chased before they expire. It runs alongside your existing CRM or ERP, not instead of it." },
        { q: "How does it work with field reps on patchy mobile data?", a: "The 3-tap logging screen is built mobile-first and kept light for reps standing on a factory floor or a client site on patchy 3G. A 30-minute meeting logs in a few taps, and follow-ups go out over WhatsApp manually from the same screen — no writing up notes back at the desk." },
        { q: "Can we attribute to distributors?", a: "Yes. Inside-sales and distributor-sourced deals can be tagged and split, so when a dealer closes an enquiry your inside team originated, the credit is recorded on the lead rather than argued over later." },
        { q: "Does it integrate with our ERP (SAP, Tally, Zoho Books)?", a: "Not in Phase 1. Today you export graded leads and quotes to CSV to move into your ERP or accounting stack; native ERP integration is on the roadmap. Leadkaun is designed as a lead-intelligence layer alongside those systems, not a replacement for them." },
        { q: "Can multiple team members collaborate on one lead?", a: "Yes. Lead notes, a full activity timeline and assignment let procurement-facing, engineering-facing and finance-facing touches sit on one thread, so the multi-stakeholder deal stays visible to everyone working it." },
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
