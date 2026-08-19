import Link from "next/link"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Landmark, Gauge, ListOrdered, MessageCircle, AlertTriangle, Mail, Upload, History, Users, ArrowRight, Sparkles, IndianRupee, CalendarClock, Shield, HeartPulse, Car, PiggyBank, Banknote, Gem, MapPin, TrendingUp, Clock, FileCheck, type LucideIcon } from "lucide-react"

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

const title = "BFSI Lead Management India, insurance, NBFC & wealth sales tracker"
const description =
  "Leadkaun grades BFSI leads A–F on per-product ICP, stamps first-contact ownership, keeps a timestamped audit trail, and surfaces renewals with ₹ premium at risk, the whole platform, built for insurance, NBFC and wealth sales."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/use-cases/bfsi" },
  ...ogMeta({ title, description, path: "/use-cases/bfsi" }),
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
  { grade: "A", name: "Meera Iyer", meta: "Term · ₹18k/yr premium", tag: "Quote requested", next: true },
  { grade: "A", name: "Rajat Bose", meta: "Health · ₹42k/yr premium", tag: "Comparing on aggregator" },
  { grade: "B", name: "Sunita Rao", meta: "Motor · renewal", tag: "Renews in 6 days" },
  { grade: "C", name: "DSA lead", meta: "NBFC · ₹8L disbursement", tag: "Aggregator, unverified" },
]

const STATS = [
  { Icon: IndianRupee, label: "Premium / disbursement", value: "₹8k – ₹25L" },
  { Icon: CalendarClock, label: "Sales cycle", value: "1 – 60 days" },
  { Icon: Shield, label: "Where leads come from", value: "PolicyBazaar · BankBazaar · DSA" },
]

const PAINS = [
  { n: "01", title: "Compliance trail gaps at audit.", body: "A rep saying “I called them last week” doesn't exist anywhere in the system. At renewal, claim, or an IRDAI inspection there's no timestamped record of what was promised on the call, and mis-selling complaints hinge on exactly that: who said what, and when. With DND and consent rules tightening, every contact needs to be logged, not remembered." },
  { n: "02", title: "Same lead, two agents, one dispute.", body: "Aggregator leads get assigned twice across product lines, the same buyer lands in a term agent's list and a health agent's list the same afternoon. When both claim the conversion, commission conflicts eat the month and poison morale. Without first-contact ownership, payout day is spent refereeing disputes." },
  { n: "03", title: "Renewals slip unnoticed.", body: "Policyholders due for renewal or cross-sell aren't flagged until after they've lapsed or bought elsewhere. Every lapsed policy is ₹8k–₹1L of premium walking out, and a lapsed customer is far harder to win back than to retain. Persistency bleeds exactly here, in quiet renewal slippage." },
]

const FEATURES: { Icon: LucideIcon; title: string; body: string; href: string }[] = [
  { Icon: Gauge, title: "Lead Scoring", body: "Graded A–F on per-product ICP, term, health, motor, disbursement, so a motor enquiry scores on motor criteria, not a generic checklist.", href: "/features/lead-scoring" },
  { Icon: ListOrdered, title: "Priority Queue", body: "Each RM's day ranked so the highest-premium, highest-intent buyers get called first, not whoever pinged most recently.", href: "/features/priority-queue" },
  { Icon: MessageCircle, title: "WhatsApp Tracking", body: "Every call, WhatsApp and email timestamp-logged in 3 taps, the evidence a dispute or an inspection actually needs.", href: "/features/whatsapp-tracking" },
  { Icon: AlertTriangle, title: "Missed Opportunity Engine", body: "Renewal and cross-sell dates resurface with ₹ premium at risk before the policy lapses, so retention is a queue item, not an afterthought.", href: "/features/missed-opportunity-engine" },
  { Icon: Mail, title: "Morning Brief", body: "Branch-manager brief each day: “12 Grade A leads untouched, ₹4L premium at risk today”, the whole branch sees it before 10 AM.", href: "/features/morning-brief" },
  { Icon: Upload, title: "Intake Intelligence", body: "Check an aggregator export, valid phones, duplicates, before an agent burns a day on a dead file.", href: "/features/intake-intelligence" },
  { Icon: History, title: "Score Evolution", body: "An append-only timeline of every score change per lead, so a grade movement traces to the event that caused it.", href: "/features/score-evolution" },
  { Icon: Users, title: "Rep Tracking", body: "Per-RM ₹ premium written, Grade A response time, renewals saved, follow-ups kept, outcomes, not call-counts.", href: "/features/sales-rep-tracking" },
]

const SEGMENTS: { Icon: LucideIcon; name: string; signal: string }[] = [
  { Icon: Shield, name: "Term Life", signal: "Income, age and cover-need drive fit. Fast, comparison-led decisions." },
  { Icon: HeartPulse, name: "Health", signal: "Family size, pre-existing conditions and city tier shape the right plan." },
  { Icon: Car, name: "Motor", signal: "Renewal-date driven, price-sensitive. Timing beats everything." },
  { Icon: PiggyBank, name: "Life / Investment", signal: "ULIP and endowment, longer trust cycle. RM relationship weighs heaviest." },
  { Icon: Banknote, name: "NBFC / Loans", signal: "Disbursement size, eligibility and urgency signal a serious borrower." },
  { Icon: Gem, name: "Wealth / HNI", signal: "Few leads, high value, each worth a senior RM's personal follow-up." },
]

const FUNNEL = [
  { stage: "Leads", count: 1000, color: "#38BDF8" },
  { stage: "Contacted", count: 680, color: "#0EA5E9" },
  { stage: "Quoted", count: 310, color: "#10B981" },
  { stage: "Issued", count: 110, color: "#FB923C" },
  { stage: "Renewed (yr 1)", count: 84, color: "#F97316" },
]

const FAQ = [
  { q: "Is the data compliant with IRDAI / RBI audit requirements?", a: "Leadkaun runs alongside your existing CRM as a lead-intelligence layer, adding Row-Level Security at the database level, a full timestamped audit trail per lead, and one-click export. It's built to make inspection prep faster, but compliance ultimately rests on your own processes, talk to us and we'll map the export format to the regulator-specific checklists your auditors ask for." },
  { q: "Can we track renewals + upsell, not just new business?", a: "Yes. Every lead record carries renewal and review dates, and the Missed Opportunity Engine surfaces upcoming renewals and cross-sell openings as ranked opportunities with a ₹ value attached, so your team works retention from the same Priority Queue they use for new business." },
  { q: "How is attribution handled across agents?", a: "First-contact ownership is stamped the moment a lead is worked, with a configurable 'assisted' credit model for DSA and bancassurance networks where two people genuinely touch a deal. The timestamped log settles disputes with evidence instead of argument on payout day." },
  { q: "Does it work with aggregator-sourced leads?", a: "Yes. Import PolicyBazaar / BankBazaar / Paisabazaar exports by CSV (including Google Sheet exports saved as CSV). Native API sync with aggregators is on the roadmap, not available today; CSV import is the reliable path right now." },
  { q: "Does it support bancassurance cross-sell?", a: "Yes. A single lead can appear in multiple product queues, say term and health, each with clear ownership rules, so bancassurance cross-sell doesn't collapse into an attribution fight between the two agents." },
]

const CITIES = [
  { city: "Mumbai", href: "/bfsi/mumbai" },
  { city: "Delhi", href: "/bfsi/delhi" },
  { city: "Bengaluru", href: "/bfsi/bengaluru" },
  { city: "Hyderabad", href: "/bfsi/hyderabad" },
  { city: "Chennai", href: "/bfsi/chennai" },
  { city: "Pune", href: "/bfsi/pune" },
]

const GUIDES = [
  { label: "Missed Opportunity Engine", href: "/features/missed-opportunity-engine" },
  { label: "How Leadkaun works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
]

const ROI: RoiConfig = {
  volumeLabel: "New enquiries per month", volumeDefault: 500, volumeMin: 50, volumeMax: 3000, volumeStep: 50,
  valueLabel: "Average premium / value", valueDefault: 30_000, valueMin: 8_000, valueMax: 5_00_000, valueStep: 2_000,
  coldLabel: "Warm enquiries that go cold without follow-up", coldDefault: 20,
  conv: 0.06, outcomeNoun: "policies", riskLabel: "₹ premium at risk", coldNoun: "warm enquiries",
}

/** Bespoke audit-trail visual (server-safe). */
function AuditTrail() {
  const log = [
    { t: "11:02", icon: MessageCircle, label: "Call logged", note: "Discussed ₹1Cr term cover · RM Aditya" },
    { t: "11:14", icon: MessageCircle, label: "WhatsApp", note: "Sent quote comparison · High intent" },
    { t: "14:30", icon: FileCheck, label: "First contact stamped", note: "Owner: Aditya · disputes settled" },
  ]
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Meera Iyer · lead #4821</p>
        <span className="inline-flex items-center gap-1.5"><GradeBadge grade="A" size="sm" /><span className="font-mono text-[11px] font-semibold text-emerald-600">Term</span></span>
      </div>
      <div className="mt-4 space-y-3">
        {log.map((e, i) => (
          <div key={e.t} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-sky-50 text-sky-600 ring-1 ring-sky-100"><e.icon className="h-3.5 w-3.5" /></span>
              {i < log.length - 1 && <span aria-hidden className="mt-1 h-5 w-px bg-ink/10" />}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-ink">{e.label}</span>
                <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">{e.t}</span>
              </div>
              <p className="mt-0.5 text-[12px] leading-snug text-ink-soft">{e.note}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 border-t pt-3.5 rule-paper">
        <Clock className="h-3.5 w-3.5 text-ink-muted" />
        <span className="text-[12px] text-ink-soft">Timestamped &amp; exportable</span>
        <span className="ml-auto rounded-lg bg-sky-50 px-2.5 py-1 font-mono text-[10.5px] font-semibold text-sky-700 ring-1 ring-sky-100">Export audit trail</span>
      </div>
    </div>
  )
}

export default function BFSIPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Use cases", url: "/use-cases" }, { name: "BFSI & Insurance" }]), faqPageSchema(FAQ)]) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        {/* HERO */}
        <section className="relative overflow-hidden border-b rule-paper" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, var(--paper) 100%)" }}>
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-[460px] w-[620px] rounded-full opacity-[0.30] blur-[130px]" style={{ background: "radial-gradient(circle, #BAE6FD 0%, transparent 70%)" }} />
          <Container className="relative pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div className="rise" style={{ animationDelay: "40ms" }}>
                <p className="ledger-num inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-sky-600">
                  <Landmark className="h-3.5 w-3.5" strokeWidth={2} /> Use case · BFSI &amp; Insurance
                </p>
                <h1 className="display-xl mt-6 text-[40px] text-ink sm:text-[52px] lg:text-[58px]">
                  Audit trail. Assignment.
                  <br />
                  <span className="relative inline-block text-sky-600">
                    Accountability in ₹.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h1>
                <p className="mt-7 max-w-xl text-[17px] leading-[1.7] text-ink-soft md:text-[18px]">
                  Branch managers, NBFC sales heads and wealth RMs run regulated sales with compliance pressure and agent-network complexity. Leadkaun grades every lead, stamps first-contact ownership, keeps a timestamped trail, and puts a ₹ figure on the premium about to slip, all the same day.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
                    Start free <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="#platform" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)" }}>
                    See the platform <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="rise" style={{ animationDelay: "160ms" }}>
                <FloatingCard tier="2" depth="3" gloss aura="sky" className="mx-auto max-w-md p-5 md:p-6">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">RM queue · today</p>
                    <span className="rounded-full bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-700 ring-1 ring-sky-100">call first</span>
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
                  <p className="mt-3.5 text-[12px] leading-snug text-ink-muted">Highest-premium, highest-intent buyers on top, with first contact stamped the moment it happens.</p>
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
                Not a video, the real product. Open a lead and every call, WhatsApp and status change is stamped on it, the trail an inspection or a payout dispute actually needs.
              </p>
            </Reveal>
          </Container>
          <Reveal delay={0.06} className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <AppReplica initialView="lead" />
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
              <p className="quick-answer-q mt-3 text-[16px] font-semibold text-ink md:text-[17px]">How does Leadkaun help BFSI and insurance sales teams in India?</p>
              <p className="quick-answer-a mt-3 text-[16px] leading-[1.75] text-ink-soft">
                It grades every lead <Chip>A–F</Chip> on per-product ICP (term, health, motor, disbursement), builds an RM <Chip tone="mint">Priority Queue</Chip>, and stamps <Chip>first-contact ownership</Chip> to settle attribution. Every contact is timestamp-logged and exportable for <Chip tone="warn">inspection prep</Chip>, and renewals resurface with ₹ premium at risk before they lapse. It runs alongside your CRM and policy-admin system, not instead of them.
              </p>
            </div>
          </Container>
        </SectionGround>

        {/* 02 — THE PROBLEM */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="02" tone="warm" label="Why regulated sales teams leak" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Three patterns we see in every branch.
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

        {/* 03 — AUDIT TRAIL (text left, trail right) */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <NumberedTag number="03" label="Logged, not remembered" />
                <h2 className="mt-5 text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[38px]">
                  “I called them last week” isn&apos;t evidence.
                </h2>
                <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
                  Every call, WhatsApp and status change is timestamp-logged on the lead in three taps, so what was said and when sits one click from an export. It won&apos;t make you compliant on its own, that rests on your processes, but it turns inspection prep and mis-selling questions into a lookup instead of an argument.
                </p>
              </div>
              <Reveal delay={0.06}>
                <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7"><AuditTrail /></FloatingCard>
              </Reveal>
            </div>
          </Container>
        </SectionGround>

        {/* 04 — FEATURE GRID */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="04" label="The whole platform, for BFSI" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Eight modules. Every one tuned to regulated, multi-product sales.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Leadkaun isn&apos;t a lighter CRM, it&apos;s the lead-intelligence layer on top of your CRM and policy-admin system. Here&apos;s what each part does in a branch.
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

        {/* 05 — FIRST CONTACT OWNERSHIP */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <NumberedTag number="05" label="One lead, one owner" />
                <h2 className="mt-5 text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[38px]">
                  Settle payout day with evidence, not argument.
                </h2>
                <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
                  The same aggregator buyer lands in a term list and a health list the same afternoon. Leadkaun stamps first-contact ownership the moment a lead is worked, with an optional assisted-credit split for DSA and bancassurance, so commission disputes are decided by a timestamp, not by who argues loudest.
                </p>
              </div>
              <Reveal delay={0.06}>
                <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7">
                  <div className="space-y-3">
                    <div className="rounded-xl bg-white/60 p-4 ring-1 ring-black/5">
                      <div className="flex items-center gap-2">
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-sky-50 font-mono text-[11px] font-bold text-sky-700 ring-1 ring-sky-100">T</span>
                        <span className="text-[13px] font-medium text-ink">Term agent · Aditya</span>
                        <span className="ml-auto font-mono text-[11px] font-semibold text-emerald-600">first contact 11:02</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/60 p-4 ring-1 ring-black/5">
                      <div className="flex items-center gap-2">
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-sky-50 font-mono text-[11px] font-bold text-sky-700 ring-1 ring-sky-100">H</span>
                        <span className="text-[13px] font-medium text-ink">Health agent · Neha</span>
                        <span className="ml-auto font-mono text-[11px] text-ink-muted">contacted 15:40</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-50/70 p-4 ring-1 ring-emerald-200">
                      <FileCheck className="h-4 w-4 text-emerald-600" />
                      <span className="text-[13px] font-semibold text-ink">Owner: Aditya</span>
                      <span className="ml-auto text-[11.5px] text-ink-soft">Neha: assisted credit</span>
                    </div>
                  </div>
                </FloatingCard>
              </Reveal>
            </div>
          </Container>
        </SectionGround>

        {/* 06 — PER-PRODUCT ICP */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="06" tone="warm" label="One score, tuned per product" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                A term lead and a motor renewal aren&apos;t scored the same.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Per-product ICP templates mean a motor enquiry is graded on motor criteria, not a generic checklist, so grades stay comparable across the branch while the signals that matter change by line.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              <NumberedTag number="07" label="From lead to persistency" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                See the book narrow, and where premium leaks.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Every lead is graded, so you can watch it move from aggregator list to issued policy to renewed, and see where Grade A/B premium is slipping between quoted and issued.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2 md:gap-6">
              <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Policy funnel · illustrative</p>
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
                <p className="mt-5 border-t pt-4 text-[12.5px] leading-snug text-ink-muted rule-paper">Grade A and B are the premium to protect. The Missed Opportunity Engine flags renewals before they lapse.</p>
              </FloatingCard>
            </Reveal>
          </Container>
        </SectionGround>

        {/* 08 — ₹ CALCULATOR */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-10 max-w-3xl">
              <NumberedTag number="08" label="What a cold enquiry costs" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Put a rupee figure on the premium you&apos;re missing.
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
                      3.7% penetration,
                      <br />
                      <span className="text-sky-600">huge headroom.</span>
                    </p>
                    <p className="mt-3 text-[14px] leading-[1.55] text-ink-soft">India&apos;s insurance penetration sits at roughly 3.7% against a ~7% global average, with health premiums growing strongly in recent years.</p>
                    <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted ring-1 ring-black/5">
                      <TrendingUp className="h-3 w-3 text-sky-500" strokeWidth={2.5} /> Source · IRDAI / IBEF
                    </span>
                  </div>
                  <div className="p-8 md:p-9">
                    <p className="text-[16px] leading-[1.7] text-ink-soft">
                      Heavy enquiry volume chases every agent, and buyers compare quotes instantly across aggregators. The first responder who follows up consistently usually wins the policy, while the rest of the funnel quietly lapses.
                    </p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      {[
                        { k: "First responder", v: "Usually wins the policy" },
                        { k: "Persistency", v: "Renewal discipline compounds the book" },
                        { k: "Audit-ready", v: "Trail decides mis-selling questions" },
                      ].map((s) => (
                        <div key={s.k} className="rounded-xl bg-sky-50/60 p-3.5 ring-1 ring-sky-100">
                          <p className="text-[13px] font-semibold text-ink">{s.k}</p>
                          <p className="mt-1 text-[11.5px] leading-[1.5] text-ink-soft">{s.v}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-6 border-t pt-5 text-[13.5px] leading-[1.65] text-ink-soft rule-paper">
                      Leadkaun is the lead-intelligence layer that grades, queues, and puts a ₹ figure on the premium your team is about to lose track of, alongside your CRM and policy-admin system, not instead of them.
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
                The dispute wasn&apos;t about effort. It was about who had the timestamp.
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
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">BFSI sales questions.</h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={FAQ} /></Reveal>
          </Container>
        </SectionGround>

        {/* 11 — BY CITY */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-10 max-w-3xl">
              <NumberedTag number="11" tone="warm" label="BFSI by city" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
                Localised pages for top BFSI markets.
              </h2>
              <p className="mt-4 text-[16px] leading-[1.55] text-ink-soft">
                City-level guides with local channel mix, premium bands, and the aggregators and DSA networks that convert in each market.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CITIES.map((c) => (
                <Link key={c.href} href={c.href} className="group block">
                  <FloatingCard tier="2" depth="2" gloss aura="sky" className="flex items-center gap-3.5 p-5 transition-transform group-hover:-translate-y-0.5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100"><MapPin className="h-5 w-5" strokeWidth={2} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15.5px] font-semibold text-ink">{c.city}</span>
                      <span className="block text-[12px] text-ink-muted">BFSI leads in {c.city}</span>
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
          headline="Flat per account, not per agent."
          sub="Add the whole branch and DSA desk without the bill climbing seat by seat. Priced by team size and active-lead volume, free forever tier, no card, ~17% off on annual."
        />

        {/* CLOSING CTA */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-4xl">
              <div className="relative overflow-hidden rounded-3xl border p-10 text-center md:p-14" style={{ borderColor: "var(--paper-line)", background: "linear-gradient(180deg,#FFFFFF, var(--paper))" }}>
                <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-96 rounded-full opacity-30 blur-[110px]" style={{ background: "radial-gradient(circle,#BAE6FD 0%,transparent 70%)" }} />
                <p className="ledger-num relative text-[11px] uppercase tracking-[0.22em] text-sky-600">Ready when you are</p>
                <h2 className="display-lg relative mx-auto mt-5 max-w-2xl text-[30px] text-ink md:text-[44px]">
                  Grade, queue, and{" "}
                  <span className="relative inline-block text-sky-600">
                    stamp every lead.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h2>
                <p className="relative mx-auto mt-6 max-w-xl text-[16px] leading-[1.7] text-ink-soft">
                  Import your aggregator and DSA leads. Leadkaun grades every one, ranks the RM&apos;s day, and keeps the timestamped trail, the same day you start.
                </p>
                <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
                    Start free <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="/how-it-works" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)" }}>
                    How it works
                  </Link>
                </div>
                <p className="ledger-num relative mt-8 text-[11.5px] uppercase tracking-[0.16em] text-ink-muted">Free ₹0 · no card · same-day setup · runs alongside your CRM</p>
              </div>
            </Reveal>
          </Container>
        </SectionGround>

        <Footer />
      </main>
    </>
  )
}
