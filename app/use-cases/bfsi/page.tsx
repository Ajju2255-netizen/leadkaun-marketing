import type { Metadata } from "next"
import { Landmark } from "lucide-react"
import { UseCaseLayout } from "@/app/components/use-case-layout"

export const metadata: Metadata = {
  title: "BFSI Lead Management India, Insurance, NBFC & Wealth Sales Tracker",
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
      subhead="Branch managers, NBFC sales heads, and wealth RMs run regulated sales with compliance pressure and agent-network complexity. Leadkaun delivers grading, assignment, audit trail, and ₹ at risk, all the same day."
      ticketBand="₹8k – ₹2L premium / ₹1L – ₹25L disbursement"
      salesCycle="1 day to 60 days"
      channels={["PolicyBazaar", "BankBazaar", "Paisabazaar", "Google Ads", "DSA network"]}
      pains={[
        { title: "Compliance trail gaps at audit.", body: "A rep saying 'I called them last week' doesn't exist anywhere in the system, so at renewal, claim, or an IRDAI inspection there is no timestamped record of what was actually promised on the call. Mis-selling complaints in Indian insurance hinge on exactly this, who said what, and when, and a missing trail turns a routine audit into a regulator-visible risk. With DND and consent rules tightening around outbound calling, every contact now needs to be logged, not remembered." },
        { title: "Same lead, two agents, one dispute.", body: "Aggregator-sourced leads routinely get assigned twice across product lines. The same buyer lands in a term agent's list and a health agent's list on the same afternoon. When both claim the conversion, commission conflicts eat into the month and quietly poison team morale. Without clear first-contact ownership, the branch manager spends payout day refereeing disputes instead of building pipeline." },
        { title: "Renewals slip unnoticed.", body: "Existing policyholders due for renewal or eligible for a cross-sell aren't flagged until after they've lapsed or bought elsewhere. Every lapsed policy is ₹8k–₹1L of premium walking out the door, and a lapsed customer is far harder to win back than to retain. Persistency, the share of policies still in force year over year is watched closely across Indian life insurance, and quiet renewal slippage is exactly where it bleeds." },
      ]}
      helps={[
        "Every lead is graded A–F on Fit × Intent × Quality using per-product ICP templates, term, health, motor, disbursement, so a motor enquiry is scored on motor criteria, not a generic checklist.",
        "Each RM opens a Priority Queue that ranks the day's leads, so the highest-premium, highest-intent buyers get called first instead of whoever pinged most recently on WhatsApp.",
        "Every enquiry is graded on product fit before it reaches an agent, so a health lead never reaches a motor agent looking like a live one, and first contact is stamped on the lead the moment it happens, which is what actually settles the ownership disputes that surface on payout day.",
        "Every call, WhatsApp, and email is timestamp-logged via 3-tap logging and exported on demand, the audit trail for IRDAI / RBI inspection prep sits one click away, not in an agent's memory.",
        "Renewal and cross-sell dates live on the lead record; the Missed Opportunity Engine resurfaces them with ₹ premium at risk well before the policy lapses, so retention becomes a queue item rather than an afterthought.",
        "The Branch Manager Morning Brief lands each day, '12 Grade A leads untouched since yesterday, ₹4 L premium at risk today', turning ₹ at risk into a number the whole branch sees before 10 AM.",
      ]}
      insight="India's insurance penetration sits at roughly 3.7% against a ~7% global average (IRDAI / IBEF), and health-insurance premiums have grown strongly in recent years, enormous headroom, and heavy enquiry volume chasing every agent. In a market where buyers compare quotes instantly across aggregators, the first responder who follows up consistently usually wins the policy, while the rest of the funnel quietly lapses. Persistency and renewal discipline decide whether that book compounds or leaks. Leadkaun doesn't replace your CRM or your policy-admin system it's the lead-intelligence layer on top, grading, queueing, and putting a ₹ figure on the premium your team is about to lose track of."
      faqs={[
        { q: "Is the data compliant with IRDAI / RBI audit requirements?", a: "Leadkaun runs alongside your existing CRM as a lead-intelligence layer, adding Row-Level Security at the database level, a full timestamped audit trail per lead, and one-click export. It's built to make inspection prep faster, but compliance ultimately rests on your own processes, talk to us and we'll map the export format to the regulator-specific checklists your auditors ask for." },
        { q: "Can we track renewals + upsell, not just new business?", a: "Yes. Every lead record carries renewal and review dates, and the Missed Opportunity Engine surfaces upcoming renewals and cross-sell openings as ranked opportunities with a ₹ value attached, so your team works retention from the same Priority Queue they use for new business." },
        { q: "How is attribution handled across agents?", a: "First-contact ownership is stamped the moment a lead is worked, with a configurable 'assisted' credit model for DSA and bancassurance networks where two people genuinely touch a deal. The timestamped log settles disputes with evidence instead of argument on payout day." },
        { q: "Does it work with aggregator-sourced leads?", a: "Yes. Import PolicyBazaar / BankBazaar / Paisabazaar exports by CSV (including Google Sheet exports saved as CSV). Native API sync with aggregators is on the roadmap, not available today; CSV import is the reliable path right now." },
        { q: "Does it support bancassurance cross-sell?", a: "Yes. A single lead can appear in multiple product queues, say term and health, each with clear ownership rules, so bancassurance cross-sell doesn't collapse into an attribution fight between the two agents." },
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
