import type { Metadata } from "next"
import { GraduationCap } from "lucide-react"
import { UseCaseLayout } from "@/app/components/use-case-layout"

export const metadata: Metadata = {
  title: "EdTech Lead Management India, Score & prioritise student enquiries",
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
        { title: "400 enquiries, one counsellor.", body: "During peak admissions season a single counsellor routinely carries 200–500 open enquiries. Without triage, the first 30 minutes every morning disappears into scrolling and deciding who to call, time stolen from actually calling. In a flat list the serious April parent and the casual brochure-collector look identical." },
        { title: "Parent threads drop mid-conversation.", body: "A parent says 'let me discuss with my spouse,' goes quiet, and the counsellor, juggling hundreds of chats, simply forgets to circle back. Most qualified conversations in Indian EdTech happen on WhatsApp, and most CRMs never see that thread, so the one follow-up that would have secured the seat never goes out. The enquiry doesn't say no; it just goes cold." },
        { title: "Admissions cycles are ₹-sensitive.", body: "A Grade A lead in April is close to worthless by September, once the cohort has filled and the buying window has shut. Miss the follow-up window on a serious parent and that's ₹50k–₹5L of annual fee gone to a competitor down the road. In admissions, timing rather than effort is what separates a full batch from an empty one." },
      ]}
      helps={[
        "Every enquiry is graded A–F on Fit × Intent × Quality, course fit, programme match, and engagement signals from both student and parent, so the serious admission-seeker rises above the brochure-collector automatically.",
        "Each counsellor opens a Priority Queue that names the Grade A parents who replied overnight, so the first calls of the day by 11 AM land on hot leads instead of whoever sits next in a random list.",
        "3-tap WhatsApp logging captures every parent reply, stage, intent, outcome, in seconds, feeding the Intent Score without the counsellor leaving the chat or double-entering into a separate CRM.",
        "Intent decay respects the admissions calendar: a silent Grade A quietly slips toward Grade B over a week, so the queue always reflects who is still genuinely warm, not who enquired first.",
        "The Missed Opportunity Engine resurfaces parents who dropped mid-thread, the 'discuss with spouse' conversations, with the ₹ fee at stake attached, so promising enquiries don't die of forgetfulness.",
        "The Morning Brief email lands before the day starts, '8 Grade A enquiries replied overnight, ₹6 L in admissions at risk if not called by 11 AM', making ₹ at risk a number the whole counselling floor can see.",
      ]}
      insight="India is one of the world's largest e-learning markets, with the edtech sector valued in the billions of dollars and projected to keep growing through the decade (IBEF). Course enquiries arrive in bulk from paid ads and referrals but vary wildly in intent, and most of the serious conversation now happens in long WhatsApp threads with fee-paying parents rather than on a call. Counselling teams that grade every enquiry, call the serious ones first, and follow up before the cohort fills simply enrol more of them. Leadkaun doesn't replace your CRM or SIS it's the lead-intelligence layer that sits on top, turning a chaotic enquiry list into a ranked queue with a ₹ figure attached to the admissions you're about to lose."
      faqs={[
        { q: "Does it handle the parent + student dual thread?", a: "Yes. Each lead record holds a primary and secondary contact, student and parent, and 3-tap WhatsApp logging records who replied and when. The Intent Score aggregates signals across both, so a keen student with a hesitant fee-paying parent reads differently from one where the parent is already sold." },
        { q: "Can we set a different ICP per course?", a: "Yes. You can define a distinct ideal-customer profile per course, because what makes a strong engineering enquiry differs from an arts or PG enquiry. The scoring weights themselves are fixed and transparent across the board; what you configure is your ICP, not the underlying maths, so grades stay comparable and auditable between counsellors." },
        { q: "Does it integrate with our LMS / SIS?", a: "Not natively in Phase 1. Leadkaun runs alongside your existing stack as the enquiry-to-enrolment layer rather than replacing your SIS. Export enrolled leads to CSV for your SIS today, with deeper integrations on the roadmap." },
        { q: "What about offline / walk-in admissions?", a: "Manual entry takes a few seconds, and the walk-in enters the Priority Queue immediately, graded in real time alongside your online enquiries, so an offline admission never sits forgotten in a separate register no one checks." },
        { q: "How does it handle seasonality?", a: "Intent decay is tied to the admissions calendar rather than a flat clock, so a lead's urgency reflects how close you are to cohort close. You tell Leadkaun your cycle and the default Indian EdTech admissions cycle is supported out of the box; the scoring weights stay fixed it's the timing context that adapts." },
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
