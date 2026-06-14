import type { Metadata } from "next"
import { GraduationCap } from "lucide-react"
import { UseCaseLayout } from "@/app/components/use-case-layout"

export const metadata: Metadata = {
  title: "EdTech Lead Management India — Score & prioritise student enquiries",
  description:
    "EdTech admissions teams run on WhatsApp, long parent threads, and seasonal cycles. Leadkaun grades every enquiry and tells counsellors which 8 parents to call first.",
  alternates: { canonical: "/use-cases/edtech" },
}

export default function EdTechPage() {
  return (
    <UseCaseLayout
      industryLabel="EdTech"
      icon={GraduationCap}
      h1="Score every student enquiry before it cools."
      subhead="EdTech admissions teams across India run on WhatsApp parent threads and seasonal cycles. Leadkaun grades every enquiry, tracks every reply, and surfaces the 8 parents to call first every morning."
      ticketBand="₹15k – ₹15L annual fee"
      salesCycle="3 days to 120 days"
      channels={["Facebook Ads", "Google Ads", "WhatsApp outreach", "Inbound forms", "Referrals"]}
      pains={[
        { title: "400 enquiries, one counsellor.", body: "Counsellors carry 200–500 leads each. Without triage, 30 minutes every morning goes to deciding who to call — instead of calling." },
        { title: "Parent threads drop mid-conversation.", body: "Parent says 'discuss with spouse', disappears, counsellor forgets. 80% of qualified conversations move to WhatsApp; most CRMs don't see it." },
        { title: "Admissions cycles are ₹-sensitive.", body: "A Grade A lead in April is worthless in September. Missing the 5-day follow-up window loses ₹50k–₹5L per enrolment." },
      ]}
      helps={[
        "Every enquiry graded A–F based on course fit, programme match, and engagement signals from both student and parent.",
        "3-tap WhatsApp logging captures every parent reply — stage, intent, outcome — feeding the Intent Score in real time.",
        "Priority Queue surfaces the Grade A parents who replied overnight, so the first call by 11 AM hits hot leads.",
        "Intent decay respects admissions cycles: a silent Grade A drops to Grade B over a week automatically.",
        "Morning Brief: '8 Grade A enquiries replied overnight. ₹6 L in admissions at risk if not called by 11 AM.'",
      ]}
      testimonial={{
        quote: "Counsellor morning triage dropped from 30 minutes to 2. We closed 12 more admissions in April because every counsellor knew exactly which Grade A parent to call at 9 AM.",
        name: "Rajesh M.",
        role: "EdTech Sales Head",
        city: "Bengaluru",
      }}
      faqs={[
        { q: "Does it handle the parent + student dual thread?", a: "Yes. Lead record has primary + secondary contacts. WhatsApp tracking logs who replied when; Intent Score aggregates across both." },
        { q: "Can we set different scoring per course?", a: "Yes, on Growth tier. Course-level ICP weights let you tune for engineering vs arts vs PG programmes." },
        { q: "Does it integrate with our LMS / SIS?", a: "Not natively in Phase 1. Export leads to CSV for your SIS; Leadkaun owns the enquiry-to-enrolment funnel." },
        { q: "What about offline / walk-in admissions?", a: "Manual entry takes 15 seconds. The lead enters the queue immediately, graded within 500ms." },
        { q: "How does it handle seasonality?", a: "Intent decay rates are configurable per admissions cycle. Default India EdTech cycle supported out of the box." },
      ]}
      relatedCities={[
        { city: "Bengaluru",   href: "/edtech/bengaluru" },
        { city: "Mumbai",      href: "/edtech/mumbai" },
        { city: "Delhi",       href: "/edtech/delhi" },
        { city: "Pune",        href: "/edtech/pune" },
        { city: "Hyderabad",   href: "/edtech/hyderabad" },
        { city: "Chennai",     href: "/edtech/chennai" },
      ]}
      relatedFeature={{ label: "See how WhatsApp tracking works", href: "/features/whatsapp-tracking" }}
    />
  )
}
