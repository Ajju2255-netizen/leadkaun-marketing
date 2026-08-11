import Link from "next/link"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Briefcase, Gauge, ListOrdered, MessageCircle, AlertTriangle, Mail, Upload, History, Users, ArrowRight, Sparkles, IndianRupee, CalendarClock, FolderKanban, Shield, Megaphone, Search, PenTool, Handshake, RefreshCw, MapPin, TrendingUp, type LucideIcon } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FloatingCard } from "@/app/components/floating-card"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { GradeBadge } from "@/app/components/demo/primitives"
import { GradeDistribution } from "@/app/components/viz/grade-distribution"
import { AppReplica } from "@/app/components/app-replica"
import { Voices } from "@/app/components/voices"
import { UseCaseRoiCalc, type RoiConfig } from "@/app/components/use-case-roi-calc"
import { UseCasePricing } from "@/app/components/use-case-pricing"
import type { Grade } from "@/lib/demo-app"
import { faqPageSchema, breadcrumbListSchema, jsonLdScript, ogMeta } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

const title = "Agency Sales Software India, multi-client pipeline management"
const description =
  "Leadkaun runs each client as its own workspace and pipeline, protects your new-business queue from delivery chaos, grades every lead A–F, and makes white-label reports a quick export, the whole platform, built for B2B agencies."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/use-cases/agencies" },
  ...ogMeta({ title, description, path: "/use-cases/agencies" }),
}

function Chip({ children, tone = "sky" }: { children: ReactNode; tone?: "sky" | "mint" | "warn" }) {
  const styles: Record<string, string> = {
    sky: "bg-sky-50 text-sky-700 ring-sky-200",
    mint: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warn: "bg-orange-50 text-orange-700 ring-orange-200",
  }
  return <span className={`whitespace-nowrap rounded-md px-1.5 py-[1px] text-[13.5px] font-semibold ring-1 ${styles[tone]}`}>{children}</span>
}

const HERO_QUEUE: { grade: Grade; name: string; meta: string; tag: string; next?: boolean }[] = [
  { grade: "A", name: "D2C brand brief", meta: "Perf marketing · ₹6L/yr", tag: "Referral intro", next: true },
  { grade: "A", name: "Fintech RFP", meta: "SEO retainer · ₹18L/yr", tag: "Inbound RFP" },
  { grade: "B", name: "SaaS founder", meta: "Retainer · ₹3L/yr", tag: "Event conversation" },
  { grade: "C", name: "Cold LinkedIn", meta: "Unclear budget", tag: "Spray-and-pray" },
]

const STATS = [
  { Icon: IndianRupee, label: "Retainer / project", value: "₹50k – ₹25L" },
  { Icon: CalendarClock, label: "Pitch-to-signed cycle", value: "7 – 180 days" },
  { Icon: Briefcase, label: "Where leads come from", value: "Referrals · LinkedIn · RFPs" },
]

const PAINS = [
  { n: "01", title: "8 clients, 8 spreadsheets.", body: "Every retainer runs a different sales motion, so most agencies end up with one sheet per client and a founder holding it in their head. Leads arrive from referrals, LinkedIn, inbound RFPs and event chats, and the notes live in a dozen tabs no two people read the same way. The moment the founder is out, the whole system stalls." },
  { n: "02", title: "New business collapses when delivery gets loud.", body: "When two retainer clients escalate the same week, the team drops into firefighting and the new-business pipeline goes untouched for days. Warm RFPs and referral intros, the leads that renew the agency's own revenue, age out while everyone services accounts. By the time someone circles back, the prospect signed with a shop that answered on day one." },
  { n: "03", title: "White-label reporting eats your Fridays.", body: "Every client expects a branded monthly report, and stitching one by hand from scattered sheets is hours of copy-paste per account. Across ten clients that's a recurring day-plus of senior time formatting instead of selling, and a thin or late report is exactly what makes a nervous client question the retainer." },
]

const FEATURES: { Icon: LucideIcon; title: string; body: string; href: string }[] = [
  { Icon: Gauge, title: "Lead Scoring", body: "Every lead graded A–F on fit, intent and quality, so a serious RFP never sits in the same list as a spray-and-pray cold DM.", href: "/features/lead-scoring" },
  { Icon: ListOrdered, title: "Priority Queue", body: "A ranked callback list per workspace, so each account team opens the day to priorities, not a raw inbox.", href: "/features/priority-queue" },
  { Icon: Shield, title: "Protected new-business", body: "The agency's own pipeline runs as a separate, protected queue that doesn't get crushed when a delivery client gets loud.", href: "/features/priority-queue" },
  { Icon: AlertTriangle, title: "Missed Opportunity Engine", body: "Every stale Grade A/B lead with ₹ at risk, per workspace, so a warm RFP never quietly ages out during a busy delivery week.", href: "/features/missed-opportunity-engine" },
  { Icon: Mail, title: "Morning Brief", body: "Per workspace: the BD head sees new-business, each account director sees their own client's ₹ at risk, before the day starts.", href: "/features/morning-brief" },
  { Icon: Upload, title: "Intake Intelligence", body: "Sift a list-buy or event scan, dedupe, spot junk, before an account exec wastes a week on a bad file.", href: "/features/intake-intelligence" },
  { Icon: History, title: "Score Evolution", body: "An append-only timeline of every grade change, so a prospect that cooled between pitch and proposal traces to the cause.", href: "/features/score-evolution" },
  { Icon: Users, title: "Rep Tracking", body: "Per-director ₹ retainer won, response time, proposals chased, across clients, outcomes, not activity counts.", href: "/features/sales-rep-tracking" },
]

const SEGMENTS: { Icon: LucideIcon; name: string; signal: string }[] = [
  { Icon: Megaphone, name: "Performance / Ads", signal: "Budget size and channel fit drive it. Fast decisions, monthly retainers." },
  { Icon: Search, name: "SEO / Content", signal: "Longer cycle, compounding value. Domain fit and ambition signal a keeper." },
  { Icon: PenTool, name: "Web / Design", signal: "Project-shaped, scope-led. Repeat-work potential turns one project into a retainer." },
  { Icon: Handshake, name: "BD-as-a-service", signal: "Their pipeline is your product. ICP clarity decides whether it's a fit." },
  { Icon: RefreshCw, name: "Retainer renewals", signal: "Existing clients due for renewal, resurfaced with enough runway to have the talk." },
]

const FUNNEL = [
  { stage: "RFPs / intros", count: 1000, color: "#38BDF8" },
  { stage: "Qualified", count: 480, color: "#0EA5E9" },
  { stage: "Pitched", count: 220, color: "#10B981" },
  { stage: "Proposal", count: 110, color: "#FB923C" },
  { stage: "Retainer won", count: 46, color: "#F97316" },
]

const FAQ = [
  { q: "Can each client have its own ICP?", a: "Each client gets its own workspace, a separate pipeline, lead sources, follow-up cadences, templates, and analytics. The ICP scoring brain is currently set once at the account level and shared across every workspace, which keeps grading consistent; per-workspace ICP is on the roadmap. In practice most agencies map one workspace per client and run their own new-business as a separate workspace, and the shared ICP works well because the fit criteria across a shop's clients tend to rhyme." },
  { q: "Is there a client-portal view?", a: "Not in Phase 1, clients don't log in directly. You export a per-client CSV that drops straight into a branded, white-label monthly report, so the client sees polished output without you exposing the underlying tool." },
  { q: "Can I manage both new-business and client delivery?", a: "Yes. Set up two workspaces, one for new-business and one (or more) for client delivery. Each has its own pipeline and Priority Queue, so a busy delivery week never buries the agency's own BD pipeline." },
  { q: "Does it track retainer renewal dates?", a: "Yes. The follow-up engine can carry a renewal cadence, so an upcoming retainer renewal resurfaces in the queue with enough runway to have the conversation before the term lapses rather than after." },
  { q: "Can team members see across clients?", a: "Access is role-based and scoped by workspace: account directors see only the clients they're a member of, while the agency head or founder sees every workspace. Nobody has to share one all-clients spreadsheet to keep the founder in the loop." },
]

const CITIES = [
  { city: "Bengaluru", href: "/agencies/bengaluru" },
  { city: "Mumbai", href: "/agencies/mumbai" },
  { city: "Delhi", href: "/agencies/delhi" },
  { city: "Pune", href: "/agencies/pune" },
  { city: "Gurugram", href: "/agencies/gurugram" },
  { city: "Hyderabad", href: "/agencies/hyderabad" },
]

const GUIDES = [
  { label: "Rep tracking across clients", href: "/features/sales-rep-tracking" },
  { label: "How Leadkaun works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
]

const ROI: RoiConfig = {
  volumeLabel: "New-business enquiries per month", volumeDefault: 60, volumeMin: 10, volumeMax: 500, volumeStep: 5,
  valueLabel: "Average retainer / project (annual)", valueDefault: 3_00_000, valueMin: 50_000, valueMax: 25_00_000, valueStep: 25_000,
  coldLabel: "Warm RFPs that stall in a busy delivery week", coldDefault: 20,
  conv: 0.15, outcomeNoun: "retainers", riskLabel: "₹ retainers at risk", coldNoun: "warm RFPs",
}

/** Multi-workspace visual (server-safe). */
function Workspaces() {
  const rows = [
    { name: "New Business", meta: "Your own pipeline", leads: 4, protectedWs: true },
    { name: "Acme Retail", meta: "Perf marketing", leads: 3 },
    { name: "BrightEdu", meta: "SEO retainer", leads: 2 },
    { name: "Nimbus SaaS", meta: "Renewal due", leads: 1 },
  ]
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Workspaces · founder view</p>
        <span className="rounded-full bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-700 ring-1 ring-sky-100">role-scoped</span>
      </div>
      <div className="mt-4 space-y-2.5">
        {rows.map((r) => (
          <div key={r.name} className={`flex items-center gap-3 rounded-xl p-3 ring-1 ${r.protectedWs ? "bg-emerald-50/60 ring-emerald-200" : "bg-white/60 ring-black/5"}`}>
            <span className={`grid h-8 w-8 place-items-center rounded-lg ring-1 ${r.protectedWs ? "bg-white text-emerald-600 ring-emerald-200" : "bg-sky-50 text-sky-600 ring-sky-100"}`}>
              {r.protectedWs ? <Shield className="h-4 w-4" /> : <FolderKanban className="h-4 w-4" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold text-ink">{r.name}{r.protectedWs && <span className="ml-2 rounded bg-emerald-100 px-1.5 py-[1px] font-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-emerald-700">protected</span>}</span>
              <span className="block truncate text-[11.5px] text-ink-muted">{r.meta}</span>
            </span>
            <span className="font-mono text-[11px] font-semibold text-ink-soft">{r.leads} in queue</span>
          </div>
        ))}
      </div>
      <p className="mt-4 border-t pt-3.5 text-[12px] leading-snug text-ink-muted rule-paper">One pipeline per client, plus a protected new-business queue, and directors see only their own.</p>
    </div>
  )
}

export default function AgenciesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Use cases", url: "/use-cases" }, { name: "Agencies" }]), faqPageSchema(FAQ)]) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        {/* HERO */}
        <section className="relative overflow-hidden border-b rule-paper" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, var(--paper) 100%)" }}>
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-[460px] w-[620px] rounded-full opacity-[0.30] blur-[130px]" style={{ background: "radial-gradient(circle, #BAE6FD 0%, transparent 70%)" }} />
          <Container className="relative pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div className="rise" style={{ animationDelay: "40ms" }}>
                <p className="ledger-num inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-sky-600">
                  <Briefcase className="h-3.5 w-3.5" strokeWidth={2} /> Use case · Agencies
                </p>
                <h1 className="display-xl mt-6 text-[40px] text-ink sm:text-[52px] lg:text-[58px]">
                  Run 8 client pipelines
                  <br />
                  <span className="relative inline-block text-sky-600">
                    without 8 spreadsheets.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h1>
                <p className="mt-7 max-w-xl text-[17px] leading-[1.7] text-ink-soft md:text-[18px]">
                  Performance marketing, SEO, BD-as-a-service, you juggle client pipelines and new business in parallel. Leadkaun gives you a workspace per client, a protected new-business queue, and white-label reports that assemble themselves.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
                    Start free trial <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="#platform" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)" }}>
                    See the platform <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="rise" style={{ animationDelay: "160ms" }}>
                <FloatingCard tier="2" depth="3" gloss aura="sky" className="mx-auto max-w-md p-5 md:p-6">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">New Business · today</p>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100">protected</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    {HERO_QUEUE.map((r) => (
                      <div key={r.name} className={`flex items-center gap-3 rounded-xl p-2.5 ring-1 ${r.next ? "bg-sky-50/70 ring-sky-200" : "bg-white/60 ring-black/5"}`}>
                        <GradeBadge grade={r.grade} size="sm" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13.5px] font-semibold leading-tight text-ink">{r.name}</span>
                          <span className="block truncate text-[11.5px] text-ink-muted">{r.meta}</span>
                        </span>
                        {r.next
                          ? <span className="whitespace-nowrap rounded-full bg-sky-600 px-2 py-0.5 font-mono text-[10px] font-semibold text-white">Next</span>
                          : <span className="whitespace-nowrap font-mono text-[10px] font-semibold text-sky-600">{r.tag}</span>}
                      </div>
                    ))}
                  </div>
                  <p className="mt-3.5 text-[12px] leading-snug text-ink-muted">Your own pipeline in its own queue, so it never gets buried when a delivery client escalates.</p>
                </FloatingCard>
              </div>
            </div>
          </Container>
        </section>

        {/* CONTEXT STRIP */}
        <SectionGround variant="pure" size="sm">
          <Container>
            <Reveal className="grid gap-4 md:grid-cols-3">
              {STATS.map(({ Icon, label, value }) => (
                <FloatingCard key={label} tier="2" depth="2" gloss aura="sky" className="flex items-center gap-4 p-6">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100"><Icon className="h-5 w-5" strokeWidth={2} /></span>
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">{label}</p>
                    <p className="mt-1 text-[17px] font-semibold text-ink">{value}</p>
                  </div>
                </FloatingCard>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* 01 — THE PLATFORM */}
        <SectionGround variant="sky" size="lg" id="platform">
          <Container>
            <Reveal className="mb-8 max-w-3xl">
              <NumberedTag number="01" label="The platform, live" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                This is the actual agency console.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Not a video, the real product. Switch between client workspaces, work a ranked queue, and watch stale leads surface with the ₹ at risk per client.
              </p>
            </Reveal>
          </Container>
          <Reveal delay={0.06} className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <AppReplica initialView="queue" />
          </Reveal>
        </SectionGround>

        {/* QUICK ANSWER */}
        <SectionGround variant="pure" size="sm">
          <Container>
            <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border bg-white p-6 pl-7 md:p-8 md:pl-10" style={{ borderColor: "var(--paper-line)" }} data-quick-answer>
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", speakable: { "@type": "SpeakableSpecification", cssSelector: [".quick-answer-q", ".quick-answer-a"] } }) }} />
              <span aria-hidden className="absolute inset-y-0 left-0 w-1.5" style={{ background: "linear-gradient(180deg,#38BDF8,#0EA5E9)" }} />
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sky-500" aria-hidden />
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">Quick answer</p>
              </div>
              <p className="quick-answer-q mt-3 text-[16px] font-semibold text-ink md:text-[17px]">How does Leadkaun help B2B agencies manage multiple client pipelines?</p>
              <p className="quick-answer-a mt-3 text-[16px] leading-[1.75] text-ink-soft">
                Each client runs as its own <Chip>workspace</Chip>, separate pipeline, sources, cadences and analytics, so eight clients never collapse into eight spreadsheets. Your own <Chip tone="mint">new-business queue</Chip> is protected, so it isn&apos;t crushed when a delivery client gets loud. Every lead is graded <Chip>A–F</Chip>, access is role-scoped, and a <Chip tone="warn">per-client CSV</Chip> turns a white-label monthly report into a quick assembly. It runs alongside your stack, not instead of it.
              </p>
            </div>
          </Container>
        </SectionGround>

        {/* 02 — THE PROBLEM */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="02" tone="warm" label="Why agency pipelines fray" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Three patterns we see in every shop.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3 md:gap-6">
              {PAINS.map((p, i) => (
                <FloatingCard key={p.n} tier="2" depth="2" gloss aura={i === 1 ? "peach" : "sky"} className="p-7">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl font-mono text-[16px] font-bold text-white" style={{ background: i === 1 ? "linear-gradient(180deg,#FDBA74,#FB923C)" : "linear-gradient(180deg,#38BDF8,#0EA5E9)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 4px 12px rgba(14,165,233,0.30)" }}>{p.n}</span>
                  <h3 className="mt-5 text-[18px] font-semibold leading-[1.3] tracking-[-0.01em] text-ink">{p.title}</h3>
                  <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft">{p.body}</p>
                </FloatingCard>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* 03 — WORKSPACES */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <NumberedTag number="03" label="A workspace per client" />
                <h2 className="mt-5 text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[38px]">
                  Eight clients. Eight pipelines. Not eight spreadsheets.
                </h2>
                <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
                  Each client is its own workspace, separate pipeline, sources, cadences, templates and analytics, while the scoring stays consistent at the account level. Access is role-scoped: account directors see only their clients, the founder sees everything, without one giant shared sheet.
                </p>
              </div>
              <Reveal delay={0.06}>
                <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7"><Workspaces /></FloatingCard>
              </Reveal>
            </div>
          </Container>
        </SectionGround>

        {/* 04 — FEATURE GRID */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="04" label="The whole platform, for agencies" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Eight modules. Every one tuned to multi-client sales.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Leadkaun isn&apos;t a lighter CRM, it&apos;s the lead-intelligence layer across every workspace you run. Here&apos;s what each part does for a shop.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map(({ Icon, title: t, body, href }) => (
                <Link key={href} href={href} className="group block">
                  <FloatingCard tier="2" depth="2" gloss aura="sky" className="flex h-full flex-col p-6 transition-transform group-hover:-translate-y-0.5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100"><Icon className="h-5 w-5" strokeWidth={2} /></span>
                    <p className="mt-4 text-[15.5px] font-semibold text-ink">{t}</p>
                    <p className="mt-2 flex-1 text-[13px] leading-[1.6] text-ink-soft">{body}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold text-sky-600">See how it works <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
                  </FloatingCard>
                </Link>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* 05 — PROTECTED NEW BUSINESS */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <NumberedTag number="05" label="Your pipeline, protected" />
                <h2 className="mt-5 text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[38px]">
                  New business shouldn&apos;t go dark during a loud delivery week.
                </h2>
                <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
                  The agency&apos;s own pipeline is the one that renews your revenue, and it&apos;s the first thing to slip when two clients escalate at once. A separate, protected new-business workspace keeps those warm RFPs ranked and chased, so they don&apos;t age out while the team firefights.
                </p>
              </div>
              <Reveal delay={0.06}>
                <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7">
                  <div className="space-y-3">
                    <div className="rounded-xl bg-orange-50/70 p-4 ring-1 ring-orange-200">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span className="text-[13px] font-semibold text-ink">Delivery, this week</span>
                        <span className="ml-auto font-mono text-[10.5px] font-semibold text-orange-600">2 clients escalating</span>
                      </div>
                      <p className="mt-1.5 text-[12px] text-ink-soft">The whole team drops into firefighting.</p>
                    </div>
                    <div className="flex items-center justify-center"><ArrowRight className="h-4 w-4 rotate-90 text-sky-400" /></div>
                    <div className="rounded-xl bg-emerald-50/70 p-4 ring-1 ring-emerald-200">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-emerald-600" />
                        <span className="text-[13px] font-semibold text-ink">New Business, protected</span>
                        <span className="ml-auto font-mono text-[10.5px] font-semibold text-emerald-600">4 RFPs still ranked</span>
                      </div>
                      <p className="mt-1.5 text-[12px] text-ink-soft">Separate queue, untouched, still chased on cadence.</p>
                    </div>
                  </div>
                </FloatingCard>
              </Reveal>
            </div>
          </Container>
        </SectionGround>

        {/* 06 — SERVICE LINES */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="06" tone="warm" label="One score, across service lines" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                A performance retainer and an SEO project aren&apos;t won the same way.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Whatever mix of services you sell, the account-level ICP keeps grades consistent across the shop, and each workspace runs its own pipeline and cadences.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {SEGMENTS.map(({ Icon, name, signal }) => (
                <FloatingCard key={name} tier="2" depth="2" gloss aura="sky" className="p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600 ring-1 ring-sky-100"><Icon className="h-[18px] w-[18px]" strokeWidth={2} /></span>
                  <p className="mt-3.5 text-[14.5px] font-semibold text-ink">{name}</p>
                  <p className="mt-1.5 text-[12.5px] leading-[1.55] text-ink-soft">{signal}</p>
                </FloatingCard>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* 07 — FUNNEL + GRADES */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl">
              <NumberedTag number="07" label="From RFP to retainer" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                See new business narrow, and where it leaks.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Every enquiry is graded, so you can watch the cohort move from RFP to retainer, and see which grade band is falling out between pitched and proposal.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2 md:gap-6">
              <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">New-business funnel · illustrative</p>
                <div className="mt-5 space-y-3">
                  {FUNNEL.map((s) => (
                    <div key={s.stage}>
                      <div className="flex items-baseline justify-between">
                        <span className="text-[13px] text-ink-soft">{s.stage}</span>
                        <span className="font-mono text-[12.5px] font-semibold tabular text-ink">{s.count.toLocaleString("en-IN")}<span className="ml-1.5 text-[11px] text-ink-muted">{Math.round((s.count / FUNNEL[0].count) * 100)}%</span></span>
                      </div>
                      <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-black/[0.04]">
                        <div className="h-full rounded-full" style={{ width: `${(s.count / FUNNEL[0].count) * 100}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}cc)` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </FloatingCard>
              <FloatingCard tier="3" depth="3" gloss className="flex flex-col justify-center p-6 md:p-7">
                <GradeDistribution />
                <p className="mt-5 border-t pt-4 text-[12.5px] leading-snug text-ink-muted rule-paper">Grade A and B are the retainers to protect. The Missed Opportunity Engine flags stale RFPs before they age out.</p>
              </FloatingCard>
            </Reveal>
          </Container>
        </SectionGround>

        {/* 08 — ₹ CALCULATOR */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-10 max-w-3xl">
              <NumberedTag number="08" label="What a missed RFP costs" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Put a rupee figure on the retainers slipping past you.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-9">
                <UseCaseRoiCalc cfg={ROI} />
              </FloatingCard>
            </Reveal>
          </Container>
        </SectionGround>

        {/* INDUSTRY BENCHMARK */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-4xl">
              <FloatingCard tier="3" depth="3" gloss className="overflow-hidden">
                <div className="grid md:grid-cols-[0.82fr_1.18fr]">
                  <div className="relative flex flex-col justify-center p-8 md:p-9" style={{ background: "linear-gradient(158deg,#EFF6FF 0%,#F0FDFA 100%)" }}>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600">Industry benchmark</p>
                    <p className="mt-4 text-[34px] font-semibold leading-[1.04] tracking-[-0.03em] text-ink md:text-[40px]">
                      +21% digital,
                      <br />
                      <span className="text-sky-600">more RFPs than you can chase.</span>
                    </p>
                    <p className="mt-3 text-[14px] leading-[1.55] text-ink-soft">India&apos;s digital advertising grew about 21% in 2024 and now rivals TV for the largest share of ad spend.</p>
                    <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted ring-1 ring-black/5">
                      <TrendingUp className="h-3 w-3 text-sky-500" strokeWidth={2.5} /> Source · Dentsu
                    </span>
                  </div>
                  <div className="p-8 md:p-9">
                    <p className="text-[16px] leading-[1.7] text-ink-soft">
                      As budgets shift, agencies field more inbound project enquiries and RFPs than they can chase. The shops that qualify prospects, respond fast, and follow up on proposals win more retainers.
                    </p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      {[
                        { k: "Respond fast", v: "Day-one answer wins the retainer" },
                        { k: "Protect BD", v: "Own pipeline can't wait for a quiet week" },
                        { k: "Report clean", v: "White-label output protects renewals" },
                      ].map((s) => (
                        <div key={s.k} className="rounded-xl bg-sky-50/60 p-3.5 ring-1 ring-sky-100">
                          <p className="text-[13px] font-semibold text-ink">{s.k}</p>
                          <p className="mt-1 text-[11.5px] leading-[1.5] text-ink-soft">{s.v}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-6 border-t pt-5 text-[13.5px] leading-[1.65] text-ink-soft rule-paper">
                      Leadkaun gives every client a workspace, protects your new-business queue, and turns reporting into an export, alongside your stack, not instead of it.
                    </p>
                  </div>
                </div>
              </FloatingCard>
            </Reveal>
          </Container>
        </SectionGround>

        {/* 09 — VOICES */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-2xl">
              <NumberedTag number="09" label="In their words" />
              <h2 className="display-md mt-5 text-[30px] text-ink md:text-[40px]">
                The retainer we lost was our own new business, buried under everyone else&apos;s.
              </h2>
            </Reveal>
            <Reveal delay={0.08}><Voices /></Reveal>
          </Container>
        </SectionGround>

        {/* 10 — FAQ */}
        <SectionGround variant="sky" size="md">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <div className="flex justify-center"><NumberedTag number="10" label="FAQ" /></div>
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">Agency sales questions.</h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={FAQ} /></Reveal>
          </Container>
        </SectionGround>

        {/* 11 — BY CITY */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-10 max-w-3xl">
              <NumberedTag number="11" tone="warm" label="Agencies by city" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
                Localised pages for top agency hubs.
              </h2>
              <p className="mt-4 text-[16px] leading-[1.55] text-ink-soft">
                City-level guides with local client bases, retainer bands, and the referral and outbound channels that convert in each hub.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CITIES.map((c) => (
                <Link key={c.href} href={c.href} className="group block">
                  <FloatingCard tier="2" depth="2" gloss aura="sky" className="flex items-center gap-3.5 p-5 transition-transform group-hover:-translate-y-0.5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100"><MapPin className="h-5 w-5" strokeWidth={2} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15.5px] font-semibold text-ink">{c.city}</span>
                      <span className="block text-[12px] text-ink-muted">Agency leads in {c.city}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-sky-500 transition-transform group-hover:translate-x-0.5" />
                  </FloatingCard>
                </Link>
              ))}
            </Reveal>
            <Reveal delay={0.12} className="mt-10 border-t pt-6 rule-paper">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Keep reading</p>
              <div className="mt-3.5 flex flex-wrap items-center gap-x-6 gap-y-3">
                {GUIDES.map((g) => (
                  <Link key={g.href} href={g.href} className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-600 hover:text-sky-500">
                    {g.label} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </Reveal>
          </Container>
        </SectionGround>

        {/* 12 — PRICING */}
        <UseCasePricing
          headline="Flat per account, not per client workspace."
          sub="Add clients and account directors without the bill climbing seat by seat. Priced by team size and active-lead volume, 14-day free trial, no card, ~17% off on annual."
        />

        {/* CLOSING CTA */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-4xl">
              <div className="relative overflow-hidden rounded-3xl border p-10 text-center md:p-14" style={{ borderColor: "var(--paper-line)", background: "linear-gradient(180deg,#FFFFFF, var(--paper))" }}>
                <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-96 rounded-full opacity-30 blur-[110px]" style={{ background: "radial-gradient(circle,#BAE6FD 0%,transparent 70%)" }} />
                <p className="ledger-num relative text-[11px] uppercase tracking-[0.22em] text-sky-600">Ready when you are</p>
                <h2 className="display-lg relative mx-auto mt-5 max-w-2xl text-[30px] text-ink md:text-[44px]">
                  Give every client{" "}
                  <span className="relative inline-block text-sky-600">
                    a pipeline, not a tab.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h2>
                <p className="relative mx-auto mt-6 max-w-xl text-[16px] leading-[1.7] text-ink-soft">
                  Set up a workspace per client and one for your own new business. Leadkaun grades and ranks every lead, and keeps your BD queue protected, the same day you start.
                </p>
                <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
                    Start free trial <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="/how-it-works" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)" }}>
                    How it works
                  </Link>
                </div>
                <p className="ledger-num relative mt-8 text-[11.5px] uppercase tracking-[0.16em] text-ink-muted">Free ₹0 · no card · same-day setup · runs alongside your stack</p>
              </div>
            </Reveal>
          </Container>
        </SectionGround>

        <Footer />
      </main>
    </>
  )
}
