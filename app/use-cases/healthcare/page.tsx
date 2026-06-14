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
        { title: "Corporate tie-up leads get lost.", body: "HR sends 200 employee numbers for a health check. Reps can't triage who's Grade A vs HR paperwork. 40% go cold without a callback in 48 hours." },
        { title: "Return patients vanish between visits.", body: "A patient bought a basic panel last month and is ready for an advanced one. Nobody remembers. ₹3k–₹30k of LTV walks to another chain." },
        { title: "Doctor referral attribution is guesswork.", body: "Referring doctors expect a monthly report showing how their referrals converted. Extracting it from 3 tools takes a day per month." },
      ]}
      helps={[
        "Patient records double as lead records — repeat-visit continuity with LTV tracking and upsell readiness signals.",
        "Referring-doctor source attribution baked in — every referred patient is tagged, and monthly doctor reports auto-generate.",
        "Corporate HR tie-ups supported as a business_type — bulk leads triaged by appointment urgency and package value.",
        "WhatsApp tracking logs appointment confirmations, report-delivery replies, and follow-up requests.",
        "Compliance-ready: every signal timestamped, every contact audit-exportable, DND flags respected.",
      ]}
      testimonial={{
        quote: "Corporate tie-up revenue jumped ₹6L in the first month. Every HR referral now gets called within 24 hours, not 4 days later. Our referring doctors finally get a real monthly report.",
        name: "Dr. Meera T.",
        role: "Head of Sales, Diagnostic Chain",
        city: "Chennai",
      }}
      faqs={[
        { q: "Is health data stored securely?", a: "Supabase Singapore region; RLS policies at DB level; encryption in transit and at rest; full audit log." },
        { q: "Does it support DND compliance for tele-callers?", a: "DND flag on lead record; callers don't see DND leads in the queue." },
        { q: "Can we track doctor-to-patient referral commissions?", a: "Yes, via source-attribution fields. Monthly per-doctor report auto-generates." },
        { q: "Does it integrate with our HIS (Hospital Info System)?", a: "Not natively in Phase 1. Export leads via CSV." },
        { q: "Can we run appointment reminders?", a: "Yes. The follow-up engine includes appointment-due reminder types." },
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
