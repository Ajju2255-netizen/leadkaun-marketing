import type { Metadata } from "next"
import { Briefcase } from "lucide-react"
import { UseCaseLayout } from "@/app/components/use-case-layout"

export const metadata: Metadata = {
  title: "Agency Sales Software India, Multi-client pipeline management",
  description:
    "B2B agencies juggle client pipelines and new business simultaneously. Leadkaun gives you per-client ICP, protected new-business queues, and one-click white-label reports.",
  alternates: { canonical: "/use-cases/agencies" },
}

export default function AgenciesPage() {
  return (
    <UseCaseLayout
      industryLabel="Agencies"
      icon={Briefcase}
      h1="Run 8 client pipelines without 8 spreadsheets."
      subhead="B2B agencies, performance marketing, BD-as-a-service, SEO, SaaS-for-agency, juggle client pipelines and new business in parallel. Leadkaun gives you per-client ICP, protected new-business queues, and one-click white-label reports."
      ticketBand="₹50k – ₹25L retainer / project"
      salesCycle="7 to 180 days"
      channels={["Referrals", "LinkedIn outreach", "Content", "Google / LinkedIn Ads", "Events"]}
      pains={[
        { title: "8 clients, 8 spreadsheets.", body: "Every retainer client runs a different sales motion, so most agencies end up with one tracking sheet per client and a founder holding it all together in their head. The leads arrive from all over referrals, LinkedIn outreach, inbound RFPs, event conversations, and the follow-up notes and next steps live in a dozen tabs that no two people read the same way. Context-switching between them quietly eats a chunk of every week that should have gone into pitching or delivery, and the moment the founder is out, the whole system stalls because nobody else can see the full picture." },
        { title: "New business collapses when delivery gets loud.", body: "When two retainer clients escalate in the same week, the whole team drops into firefighting and the new-business pipeline goes untouched for days. Warm inbound RFPs and referral intros, the very leads that renew the agency's own revenue, quietly age out while everyone services existing accounts. By the time someone circles back, the prospect has signed with a shop that answered on day one." },
        { title: "White-label reporting eats your Fridays.", body: "Every client expects a branded monthly report, and stitching one together by hand from scattered sheets is hours of copy-paste per account. Across ten clients that is a recurring day-plus of senior time spent formatting rather than selling. The work is unbillable, unloved, and the first thing to slip when the month gets busy, yet a thin or late report is exactly what makes a nervous client start questioning the retainer. Reporting that assembles itself from data the team already logged turns a Friday write-off into a renewal-protecting habit." },
      ]}
      helps={[
        "Each client runs as its own workspace, separate pipeline, lead sources, follow-up cadences, templates, and analytics, so eight clients never collapse back into eight spreadsheets, while the ICP scoring brain stays consistent at the account level (per-workspace ICP is on the roadmap).",
        "Every lead is graded A–F on Fit × Intent × Quality and ranked into a per-workspace Priority Queue, so each account team opens the day to a ranked callback list instead of a raw inbox.",
        "The new-business workspace runs as a separate, protected queue that doesn't get crushed when a delivery client gets loud, the agency's own pipeline finally has a home that isn't an afterthought.",
        "Role-based, per-workspace access means account directors see only their clients while the founder sees everything, without sharing one giant sheet with the whole team.",
        "The Missed Opportunity Engine surfaces every stale Grade A/B lead with ₹ at risk per workspace, and per-client CSV export makes a white-label monthly report a quick assembly job rather than a Friday write-off.",
        "The Morning Brief email goes out per workspace: the BD head sees new-business, and each account director sees their own client's ₹ at risk before the day starts.",
      ]}
      insight="India's digital advertising grew about 21% in 2024 and now rivals TV for the largest share of ad spend (Dentsu). As budgets shift, agencies field more inbound project enquiries and RFPs than they can chase, so the shops that qualify prospects, respond fast, and follow up on proposals win more retainers."
      faqs={[
        { q: "Can each client have its own ICP?", a: "Each client gets its own workspace, a separate pipeline, lead sources, follow-up cadences, templates, and analytics. The ICP scoring brain is currently set once at the account level and shared across every workspace, which keeps grading consistent; per-workspace ICP is on the roadmap. In practice most agencies map one workspace per client and run their own new-business as a separate workspace, and the shared ICP works well because the fit criteria across a shop's clients tend to rhyme." },
        { q: "Is there a client-portal view?", a: "Not in Phase 1 clients don't log in directly. You export a per-client CSV that drops straight into a branded, white-label monthly report, so the client sees polished output without you exposing the underlying tool." },
        { q: "Can I manage both new-business and client delivery?", a: "Yes. Set up two workspaces, one for new-business and one (or more) for client delivery. Each has its own pipeline and Priority Queue, so a busy delivery week never buries the agency's own BD pipeline." },
        { q: "Does it track retainer renewal dates?", a: "Yes. The follow-up engine can carry a renewal cadence, so an upcoming retainer renewal resurfaces in the queue with enough runway to have the conversation before the term lapses rather than after." },
        { q: "Can team members see across clients?", a: "Access is role-based and scoped by workspace: account directors see only the clients they're a member of, while the agency head or founder sees every workspace. Nobody has to share one all-clients spreadsheet to keep the founder in the loop." },
      ]}
      relatedCities={[
        { city: "Bengaluru",   href: "/agencies/bengaluru" },
        { city: "Mumbai",      href: "/agencies/mumbai" },
        { city: "Delhi",       href: "/agencies/delhi" },
        { city: "Pune",        href: "/agencies/pune" },
        { city: "Gurugram",    href: "/agencies/gurugram" },
        { city: "Hyderabad",   href: "/agencies/hyderabad" },
      ]}
      relatedFeature={{ label: "See how sales-rep tracking works across agency clients", href: "/features/sales-rep-tracking" }}
    />
  )
}
