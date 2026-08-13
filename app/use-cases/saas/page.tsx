import Link from "next/link"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Rocket, Gauge, ListOrdered, MessageCircle, AlertTriangle, Mail, Upload, History, Users, ArrowRight, Sparkles, IndianRupee, CalendarClock, Zap, TrendingUp, Boxes, Building2, MapPin, UserPlus, Plug, type LucideIcon } from "lucide-react"

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

const title = "SaaS Sales India, trial-to-paid & expansion CRM"
const description =
  "Leadkaun grades every trial signup A–F on fit and product behaviour, ranks the hottest ones before they expire, flags expansion signals, and puts ₹ ARR at risk on the board, the whole platform, built for Indian B2B SaaS."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/use-cases/saas" },
  ...ogMeta({ title, description, path: "/use-cases/saas" }),
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
  { grade: "A", name: "Acme Corp", meta: "40-seat trial · ₹6L ARR", tag: "Invited 5 teammates", next: true },
  { grade: "A", name: "BuildFlow", meta: "API user · ₹2.4L ARR", tag: "Hit rate limit" },
  { grade: "B", name: "Nimbus Labs", meta: "Solo trial · ₹90k ARR", tag: "Day 7, no call" },
  { grade: "C", name: "gmail signup", meta: "Personal email", tag: "Tyre-kicker" },
]

const STATS = [
  { Icon: IndianRupee, label: "Deal size (ARR)", value: "₹10k – ₹20L" },
  { Icon: CalendarClock, label: "Trial-to-paid cycle", value: "1 – 60 days" },
  { Icon: Zap, label: "Where leads come from", value: "Trials · inbound · PLG" },
]

const PAINS = [
  { n: "01", title: "Trials expire before anyone calls.", body: "A user signs up, pokes around, hits one point of friction and goes silent, and most self-serve trials never convert on their own. The signup is buried in a Mixpanel event or a #new-signups channel nobody triages. A fit-checked trial reached on day one behaves very differently from the same account reached on day nine, once they've forgotten why they signed up." },
  { n: "02", title: "Expansion signals rot in product data.", body: "An existing customer quietly added five seats, hit an API rate limit, and invited a new department, textbook expansion signals. But those events live in product analytics, not in front of the AE who owns the account, so nobody starts the upgrade conversation. In B2B SaaS, expansion left on the table often costs more than a lost new logo." },
  { n: "03", title: "Content-spike chaos.", body: "A single LinkedIn post or Product Hunt launch can drop hundreds of signups in a day, and sales can't triage the flood. Without grading, the few enterprise-shaped accounts hiding in that list look identical to the students and tyre-kickers, so reps work top-to-bottom and the best-fit trials go cold. The spike that should have paid for the quarter evaporates into an untriaged inbox." },
]

const FEATURES: { Icon: LucideIcon; title: string; body: string; href: string }[] = [
  { Icon: Gauge, title: "Lead Scoring", body: "Trials graded A–F on company size, tech-stack and role signals, so the enterprise-shaped trial never sits in the same list as a throwaway signup.", href: "/features/lead-scoring" },
  { Icon: ListOrdered, title: "Priority Queue", body: "Behaviour is signal: a user who invited teammates or connected an integration spikes toward Grade A and jumps the queue; a 10-day-silent trial grades down.", href: "/features/priority-queue" },
  { Icon: TrendingUp, title: "Expansion detection", body: "Existing customers showing usage, seat-add or limit-hit signals surface as their own lead type, so AEs see the upgrade moment, not a QBR three months late.", href: "/features/missed-opportunity-engine" },
  { Icon: AlertTriangle, title: "Missed Opportunity Engine", body: "₹ ARR attached to every Grade A/B trial aged past your follow-up window, rolled up per rep, so the head of sales sees which trials are about to lapse.", href: "/features/missed-opportunity-engine" },
  { Icon: Mail, title: "Morning Brief", body: "Opens the day with the real list: “12 trials hit day-7 without a sales call · ₹3.2L ARR at risk, Priya owns 8, Rajesh 4.”", href: "/features/morning-brief" },
  { Icon: Upload, title: "Intake Intelligence", body: "Sift a content-spike flood, dedupe, spot personal-email throwaways, before an SDR wastes a day on it.", href: "/features/intake-intelligence" },
  { Icon: History, title: "Score Evolution", body: "An append-only timeline of every grade change, so a trial that spiked to A then cooled traces to the exact event.", href: "/features/score-evolution" },
  { Icon: Users, title: "Rep Tracking", body: "Per-rep trials converted, Grade A response time, expansion opened, outcomes, not activity counts.", href: "/features/sales-rep-tracking" },
]

const SEGMENTS: { Icon: LucideIcon; name: string; signal: string }[] = [
  { Icon: Zap, name: "Self-serve trial", signal: "Fit-check plus activation depth. Speed to first touch decides it." },
  { Icon: Users, name: "Sales-assisted", signal: "Demo requests and enterprise-shaped signups. Buying committee behind one champion." },
  { Icon: TrendingUp, name: "Expansion", signal: "Seat-adds, limit-hits, new-department invites. The upgrade moment, surfaced." },
  { Icon: Boxes, name: "Cross-sell", signal: "Product B graded on Product B's fit, not the account's original purchase." },
  { Icon: Building2, name: "Enterprise inbound", signal: "Few, high-ARR, worth a senior AE's personal follow-up the same hour." },
]

const FUNNEL = [
  { stage: "Signups", count: 1000, color: "#38BDF8" },
  { stage: "Activated", count: 520, color: "#0EA5E9" },
  { stage: "Sales-qualified", count: 240, color: "#10B981" },
  { stage: "Paid", count: 90, color: "#FB923C" },
  { stage: "Expanded", count: 34, color: "#F97316" },
]

const FAQ = [
  { q: "Does it integrate with our trial signup flow?", a: "Yes, pipe signups in through a generic webhook or CSV, and we publish a SaaS-specific onboarding guide for mapping trial fields onto Fit and Intent. Native Segment and Mixpanel connectors are on the roadmap; until then most teams wire up the webhook the same day. Leadkaun runs alongside your existing CRM and product analytics, not instead of them." },
  { q: "How does it handle PLG self-upgrade events?", a: "Fire a 'self-upgrade' signal manually or via our API when a user upgrades in-product, and the scoring engine re-grades the account and surfaces it in the owner's queue for an expansion conversation. The signal weights are fixed and transparent. You configure which events describe your ICP, not the underlying maths." },
  { q: "Can we track account-level vs user-level?", a: "Every lead record supports a primary contact plus associated contacts, and account-level rollups appear on the Rep Performance card, so you can work an individual champion while still seeing the whole buying committee behind that logo." },
  { q: "Does it work for multi-product cross-sell?", a: "Set up a product-level ICP and a separate pipeline per product, so a cross-sell lead for Product B is graded on Product B's fit rather than inheriting the scores from the account's original purchase." },
  { q: "Can we export to our analytics stack?", a: "Not natively in Phase 1. CSV export is available today, and native Segment/Mixpanel connectors are on the roadmap. Because Leadkaun sits alongside your stack as the grading-and-queue layer, your warehouse and product analytics stay the system of record." },
]

const CITIES = [
  { city: "Bengaluru", href: "/saas/bengaluru" },
  { city: "Hyderabad", href: "/saas/hyderabad" },
  { city: "Pune", href: "/saas/pune" },
  { city: "Mumbai", href: "/saas/mumbai" },
  { city: "Delhi", href: "/saas/delhi" },
  { city: "Chennai", href: "/saas/chennai" },
]

const GUIDES = [
  { label: "Missed Opportunity Engine", href: "/features/missed-opportunity-engine" },
  { label: "How Leadkaun works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
]

const ROI: RoiConfig = {
  volumeLabel: "Trial signups per month", volumeDefault: 800, volumeMin: 50, volumeMax: 5000, volumeStep: 50,
  valueLabel: "Average ARR", valueDefault: 1_20_000, valueMin: 10_000, valueMax: 20_00_000, valueStep: 10_000,
  coldLabel: "Fit trials that go cold without a sales touch", coldDefault: 20,
  conv: 0.05, outcomeNoun: "conversions", riskLabel: "₹ ARR at risk", coldNoun: "fit trials",
}

/** Behaviour-driven trial grade visual (server-safe). */
function TrialBehaviour() {
  const rows = [
    { name: "Acme Corp", ev: "Invited 5 teammates · connected Slack", g: "A" as Grade, dir: "up" as const },
    { name: "BuildFlow", ev: "Hit API rate limit on day 2", g: "A" as Grade, dir: "up" as const },
    { name: "Nimbus Labs", ev: "Silent 10 days, one login", g: "C" as Grade, dir: "down" as const },
  ]
  return (
    <div>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Same trial cohort · day 3 of 14</p>
      <div className="mt-4 space-y-2.5">
        {rows.map((r) => (
          <div key={r.name} className={`flex items-center gap-3 rounded-xl p-3 ring-1 ${r.dir === "up" ? "bg-emerald-50/60 ring-emerald-200" : "bg-white/60 ring-black/5"}`}>
            <GradeBadge grade={r.g} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold text-ink">{r.name}</span>
              <span className="block truncate text-[11.5px] text-ink-muted">{r.ev}</span>
            </span>
            {r.dir === "up"
              ? <span className="inline-flex items-center gap-1 font-mono text-[10.5px] font-semibold text-emerald-600"><TrendingUp className="h-3.5 w-3.5" /> spiking</span>
              : <span className="font-mono text-[10.5px] font-semibold text-orange-500">cooling</span>}
          </div>
        ))}
      </div>
      <p className="mt-4 border-t pt-3.5 text-[12px] leading-snug text-ink-muted rule-paper">Behaviour, not the signup date, decides the grade, and the queue puts the spiking accounts first while the clock&apos;s still running.</p>
    </div>
  )
}

export default function SaaSPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Use cases", url: "/use-cases" }, { name: "SaaS" }]), faqPageSchema(FAQ)]) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        {/* HERO */}
        <section className="relative overflow-hidden border-b rule-paper" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, var(--paper) 100%)" }}>
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-[460px] w-[620px] rounded-full opacity-[0.30] blur-[130px]" style={{ background: "radial-gradient(circle, #BAE6FD 0%, transparent 70%)" }} />
          <Container className="relative pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div className="rise" style={{ animationDelay: "40ms" }}>
                <p className="ledger-num inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-sky-600">
                  <Rocket className="h-3.5 w-3.5" strokeWidth={2} /> Use case · SaaS
                </p>
                <h1 className="display-xl mt-6 text-[40px] text-ink sm:text-[52px] lg:text-[58px]">
                  Stop losing trials
                  <br />
                  <span className="relative inline-block text-sky-600">
                    to silence.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h1>
                <p className="mt-7 max-w-xl text-[17px] leading-[1.7] text-ink-soft md:text-[18px]">
                  Trial-to-paid, PLG-to-sales handoff and expansion usually live on three different tools. Leadkaun grades every signup on fit and product behaviour, ranks the hottest before they expire, and puts the ₹ ARR at risk on one board.
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
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Trial queue · today</p>
                    <span className="rounded-full bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-700 ring-1 ring-sky-100">reach first</span>
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
                  <p className="mt-3.5 text-[12px] leading-snug text-ink-muted">Fit-checked, behaviour-ranked, so the enterprise-shaped trial gets the call before the clock runs out.</p>
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
                This is the actual sales console.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Not a video, the real product. Fire a self-upgrade or teammate-invite signal on a trial and watch it re-grade and jump the queue underneath you.
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
              <span aria-hidden className="absolute inset-y-0 left-0 w-1.5" style={{ background: "#0877B8" }} />
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sky-500" aria-hidden />
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">Quick answer</p>
              </div>
              <p className="quick-answer-q mt-3 text-[16px] font-semibold text-ink md:text-[17px]">How does Leadkaun help Indian B2B SaaS sales teams?</p>
              <p className="quick-answer-a mt-3 text-[16px] leading-[1.75] text-ink-soft">
                It grades every trial <Chip>A–F</Chip> on company size, role and tech-stack fit, then reads <Chip tone="mint">product behaviour</Chip> as intent, teammate invites and integrations spike a trial toward A, ten days of silence grades it down, so the <Chip>Priority Queue</Chip> puts the hottest accounts first before they expire. <Chip tone="warn">Expansion signals</Chip> surface as their own lead type with ₹ ARR attached. It runs alongside your CRM and product analytics, not instead of them.
              </p>
            </div>
          </Container>
        </SectionGround>

        {/* 02 — THE PROBLEM */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="02" tone="warm" label="Why SaaS pipelines leak" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Three patterns we see in every funnel.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3 md:gap-6">
              {PAINS.map((p, i) => (
                <FloatingCard key={p.n} tier="2" depth="2" gloss aura={i === 1 ? "peach" : "sky"} className="p-7">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl font-mono text-[16px] font-bold text-white" style={{ background: i === 1 ? "#EA580C" : "#0877B8" }}>{p.n}</span>
                  <h3 className="mt-5 text-[18px] font-semibold leading-[1.3] tracking-[-0.01em] text-ink">{p.title}</h3>
                  <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft">{p.body}</p>
                </FloatingCard>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* 03 — BEHAVIOUR IS SIGNAL (text left, visual right) */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <NumberedTag number="03" label="Behaviour is the signal" />
                <h2 className="mt-5 text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[38px]">
                  A signup date tells you nothing. What they did tells you everything.
                </h2>
                <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
                  Intent scoring reads product behaviour, not the calendar. A trial that invited three teammates or connected an integration spikes toward Grade A and jumps the queue; one that&apos;s been silent for ten days grades down. Your rep spends the trial window on the accounts actually leaning in.
                </p>
              </div>
              <Reveal delay={0.06}>
                <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7"><TrialBehaviour /></FloatingCard>
              </Reveal>
            </div>
          </Container>
        </SectionGround>

        {/* 04 — FEATURE GRID */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="04" label="The whole platform, for SaaS" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Eight modules. Every one tuned to trial-to-paid and expansion.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Leadkaun isn&apos;t a lighter CRM, it&apos;s the grading-and-queue layer on top of your CRM and product analytics. Here&apos;s what each part does across every motion.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Keyed on title, not href: "Expansion detection" and "Missed
                  Opportunity Engine" both point at the same feature page. */}
              {FEATURES.map(({ Icon, title: t, body, href }) => (
                <Link key={t} href={href} className="group block">
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

        {/* 05 — EXPANSION */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <NumberedTag number="05" label="Expansion, surfaced" />
                <h2 className="mt-5 text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[38px]">
                  The upgrade is already sitting in your product data.
                </h2>
                <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
                  Seat-adds, limit-hits and new-department invites are the upgrade moment, but they live in analytics, not in front of the AE. Leadkaun surfaces existing customers with expansion signals as their own lead type, with ₹ ARR attached, so the conversation starts now, not in a QBR three months late.
                </p>
              </div>
              <Reveal delay={0.06}>
                <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Acme Corp · existing customer</p>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100">expansion</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    {[
                      { Icon: UserPlus, ev: "Added 5 seats this week" },
                      { Icon: Plug, ev: "Invited the ops department" },
                      { Icon: Zap, ev: "Hit the API rate limit twice" },
                    ].map((e) => (
                      <div key={e.ev} className="flex items-center gap-2.5 rounded-lg bg-white/60 p-2.5 ring-1 ring-black/5">
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-sky-50 text-sky-600 ring-1 ring-sky-100"><e.Icon className="h-3.5 w-3.5" /></span>
                        <span className="text-[12.5px] text-ink-soft">{e.ev}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-baseline justify-between border-t pt-3.5 rule-paper">
                    <span className="text-[12px] text-ink-soft">Upgrade opportunity</span>
                    <span className="font-mono text-[19px] font-semibold text-ink">+₹4.2L ARR</span>
                  </div>
                </FloatingCard>
              </Reveal>
            </div>
          </Container>
        </SectionGround>

        {/* 06 — MOTIONS */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="06" tone="warm" label="One score, tuned per motion" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                A self-serve trial and an expansion signal aren&apos;t the same lead.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Each motion gets a pipeline and an ICP, so a cross-sell lead is graded on the new product&apos;s fit, not inherited scores, while grades stay comparable across the team.
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
              <NumberedTag number="07" label="From signup to expansion" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                See the funnel narrow, and where ARR leaks.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Every signup is graded, so you can watch the cohort move from signup to paid to expanded, and see which grade band is falling out between activated and sales-qualified.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2 md:gap-6">
              <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Trial funnel · illustrative</p>
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
                <p className="mt-5 border-t pt-4 text-[12.5px] leading-snug text-ink-muted rule-paper">Grade A and B are your paying accounts to protect. The Missed Opportunity Engine flags trials before they expire.</p>
              </FloatingCard>
            </Reveal>
          </Container>
        </SectionGround>

        {/* 08 — ₹ CALCULATOR */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-10 max-w-3xl">
              <NumberedTag number="08" label="What a cold trial costs" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Put a rupee figure on the ARR you&apos;re letting expire.
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
                      ~$13B ARR,
                      <br />
                      <span className="text-sky-600">~30% growth.</span>
                    </p>
                    <p className="mt-3 text-[14px] leading-[1.55] text-ink-soft">India&apos;s B2B SaaS sector has scaled to roughly US$13 billion in ARR and is growing near 30% a year, flooding sales teams with trials and demo requests.</p>
                    <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted ring-1 ring-black/5">
                      <TrendingUp className="h-3 w-3 text-sky-500" strokeWidth={2.5} /> Source · NASSCOM
                    </span>
                  </div>
                  <div className="p-8 md:p-9">
                    <p className="text-[16px] leading-[1.7] text-ink-soft">
                      When volume outruns capacity, grading leads by fit and intent, and reaching the hottest ones first, is what protects the pipeline. Net revenue retention is what makes the unit economics work, so expansion left on the table costs the most.
                    </p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      {[
                        { k: "Volume", v: "Outruns capacity in a spike" },
                        { k: "Behaviour", v: "Beats signup date as signal" },
                        { k: "NRR", v: "Expansion left on the table costs most" },
                      ].map((s) => (
                        <div key={s.k} className="rounded-xl bg-sky-50/60 p-3.5 ring-1 ring-sky-100">
                          <p className="text-[13px] font-semibold text-ink">{s.k}</p>
                          <p className="mt-1 text-[11.5px] leading-[1.5] text-ink-soft">{s.v}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-6 border-t pt-5 text-[13.5px] leading-[1.65] text-ink-soft rule-paper">
                      Leadkaun unifies the grade, the queue and the ₹ ARR at risk across trial-to-paid and expansion, alongside your stack, not instead of it, so your warehouse stays the system of record.
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
                The enterprise trial was in the list the whole time. Nobody saw it.
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
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">SaaS sales questions.</h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={FAQ} /></Reveal>
          </Container>
        </SectionGround>

        {/* 11 — BY CITY */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-10 max-w-3xl">
              <NumberedTag number="11" tone="warm" label="SaaS by city" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
                Localised pages for top SaaS hubs.
              </h2>
              <p className="mt-4 text-[16px] leading-[1.55] text-ink-soft">
                City-level guides with local talent pools, ARR bands, and the inbound and PLG channels that convert in each hub.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CITIES.map((c) => (
                <Link key={c.href} href={c.href} className="group block">
                  <FloatingCard tier="2" depth="2" gloss aura="sky" className="flex items-center gap-3.5 p-5 transition-transform group-hover:-translate-y-0.5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100"><MapPin className="h-5 w-5" strokeWidth={2} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15.5px] font-semibold text-ink">{c.city}</span>
                      <span className="block text-[12px] text-ink-muted">SaaS leads in {c.city}</span>
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
          headline="Flat per account, not per rep."
          sub="Add SDRs, AEs and CS without the bill climbing seat by seat. Priced by team size and active-lead volume, 14-day free trial, no card, ~17% off on annual."
        />

        {/* CLOSING CTA */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-4xl">
              <div className="relative overflow-hidden rounded-3xl border p-10 text-center md:p-14" style={{ borderColor: "var(--paper-line)", background: "linear-gradient(180deg,#FFFFFF, var(--paper))" }}>
                <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-96 rounded-full opacity-30 blur-[110px]" style={{ background: "radial-gradient(circle,#BAE6FD 0%,transparent 70%)" }} />
                <p className="ledger-num relative text-[11px] uppercase tracking-[0.22em] text-sky-600">Ready when you are</p>
                <h2 className="display-lg relative mx-auto mt-5 max-w-2xl text-[30px] text-ink md:text-[44px]">
                  Reach the hot trial{" "}
                  <span className="relative inline-block text-sky-600">
                    before the clock runs out.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h2>
                <p className="relative mx-auto mt-6 max-w-xl text-[16px] leading-[1.7] text-ink-soft">
                  Pipe your signups in via webhook or CSV. Leadkaun grades every one on fit and behaviour and ranks the hottest into one queue, the same day you start.
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
