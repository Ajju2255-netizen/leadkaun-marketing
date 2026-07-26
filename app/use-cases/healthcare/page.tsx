import type { Metadata } from "next"
import { Stethoscope } from "lucide-react"
import { UseCaseLayout } from "@/app/components/use-case-layout"

export const metadata: Metadata = {
  title: "Healthcare Sales CRM India — Diagnostic, Clinic & Pharma Lead Management",
  description:
    "Leadkaun helps Indian healthcare teams grade patient enquiries A–F, track doctor referrals, and surface missed revenue in ₹. Compliance-ready, DND-aware.",
  alternates: { canonical: "/use-cases/healthcare" },
}

export default function HealthcarePage() {
  return (
    <UseCaseLayout
      industryLabel="Healthcare"
      icon={Stethoscope}
      h1="Patient relationships without losing the thread."
      subhead="Diagnostic chains, clinic groups, health-package sales teams, and pharma field reps run on relationships and repeat visits. Leadkaun grades, tracks, and surfaces missed revenue — with the compliance trail and DND handling Indian healthcare requires."
      ticketBand="₹500 – ₹5L per package"
      salesCycle="Same-day to 90 days"
      channels={["Google Ads", "Facebook Ads", "Doctor referrals", "Corporate tie-ups", "Walk-ins"]}
      pains={[
        { title: "Corporate tie-up leads get lost.", body: "An HR team sends 200 employee numbers for an annual health check, and the enquiry lands as one undifferentiated block. Reps can't quickly tell the booking-ready Grade-A employee from routine HR paperwork, so a large share go cold before anyone calls back inside the first day or two. Each of those is a booked package plus the repeat diagnostics that would have followed it — and a tie-up that converts poorly rarely gets renewed the next year." },
        { title: "Return patients vanish between visits.", body: "A patient who bought a basic panel last month may be due an advanced one now, but nobody remembers to reach out. That ₹3k–₹30k of lifetime value quietly walks to whichever chain calls first. In diagnostics and health-package sales the repeat visit is the business, and it is the touch most often dropped." },
        { title: "Doctor referral attribution is guesswork.", body: "Referring doctors expect a monthly report showing how their referrals actually converted, and pulling that out of three disconnected tools eats the better part of a day every month. When the numbers are fuzzy, the referral relationship — the channel that feeds the whole practice — quietly cools. A referring doctor who feels uncounted simply refers elsewhere." },
      ]}
      helps={[
        "Every patient enquiry — from a portal, a Google or Facebook ad, a walk-in or a WhatsApp message — is graded A–F on Fit × Intent × Quality, so a booking-ready enquiry never queues behind a price-checker.",
        "Each tele-caller works a Priority Queue ordered by grade and appointment urgency, delivered every morning as a Morning Brief email that lists the queue, the reminders due, and the enquiries about to go cold.",
        "Patient records double as lead records with repeat-visit continuity, so last month's basic-panel patient surfaces as due-for-upsell rather than disappearing — and the Missed Opportunity Engine flags the unbooked follow-ups with the ₹ at risk.",
        "Appointment confirmations and report-delivery messages go out over WhatsApp manually in three taps and get logged back to the patient thread, so the conversation history stays in one place.",
        "Referring-doctor attribution is tagged on every referred patient, and a per-doctor monthly report generates from it — turning a day of spreadsheet work into something you can send without hunting across tools.",
        "Contacts are DND-aware and audit-exportable: DND-flagged leads drop out of the caller's queue, and every signal and touch is timestamped for the compliance trail Indian healthcare expects.",
      ]}
      insight="India's digital-health segment is compounding at roughly 24% a year (IBEF), pushing more patient enquiries for appointments, diagnostics and procedures onto portals and WhatsApp. Health decisions are urgent and comparison-driven — a patient rarely waits on one clinic — so the diagnostics and clinic teams that respond fast and chase unbooked enquiries convert far more of them than those relying on the patient to call back."
      faqs={[
        { q: "Is health data stored securely?", a: "Data sits in Supabase's Singapore region with row-level-security policies enforced at the database level, encryption in transit and at rest, and a full audit log of access. Access is scoped so a tele-caller sees only the leads assigned to them, and every export is logged. Leadkaun runs alongside your existing systems as a lead-intelligence layer rather than becoming another silo of patient records." },
        { q: "Does it support DND compliance for tele-callers?", a: "Yes. A DND flag sits on the lead record and DND-flagged leads are kept out of the caller's Priority Queue, so callers don't dial numbers they shouldn't. Every contact is timestamped for the audit trail." },
        { q: "Can we track doctor-to-patient referral commissions?", a: "Yes. Referring doctors are captured as a source on each patient, and a per-doctor monthly report generates from that attribution, so the referral relationship is backed by numbers rather than guesswork." },
        { q: "Does it integrate with our HIS (Hospital Info System)?", a: "Not natively in Phase 1. You export graded leads and enquiries to CSV to move into your HIS or billing system. Leadkaun is built to run alongside those systems, not replace them." },
        { q: "Can we run appointment reminders?", a: "Yes. The follow-up engine surfaces appointment-due reminders to the caller in their queue, and the reminder itself can go out over WhatsApp manually in three taps and be logged back to the patient thread. Because the reminder is tied to the graded lead, a high-value package booking gets chased more persistently than a routine walk-in, and nothing due today is missed in the Morning Brief." },
      ]}
      relatedCities={[
        { city: "Bengaluru",  href: "/healthcare/bengaluru" },
        { city: "Mumbai",     href: "/healthcare/mumbai" },
        { city: "Delhi",      href: "/healthcare/delhi" },
        { city: "Chennai",    href: "/healthcare/chennai" },
        { city: "Hyderabad",  href: "/healthcare/hyderabad" },
        { city: "Pune",       href: "/healthcare/pune" },
      ]}
      relatedFeature={{ label: "See how WhatsApp tracking works for appointments", href: "/features/whatsapp-tracking" }}
    />
  )
}
