import Link from "next/link"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Stethoscope, Gauge, ListOrdered, MessageCircle, AlertTriangle, Mail, Upload, History, Users, ArrowRight, Sparkles, IndianRupee, CalendarClock, TestTube, HeartPulse, Smile, Building2, Repeat, UserCheck, MapPin, TrendingUp, type LucideIcon } from "lucide-react"

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

const title = "Healthcare Sales CRM India, diagnostic, clinic & pharma lead management"
const description =
  "Leadkaun grades every patient enquiry A–F, ranks the booking-ready ones, resurfaces return patients due for a repeat visit, and reports referring-doctor attribution, DND-aware and audit-exportable, built for Indian diagnostics, clinics and health-package sales."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/use-cases/healthcare" },
  ...ogMeta({ title, description, path: "/use-cases/healthcare" }),
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
  { grade: "A", name: "Sunita Rao", meta: "Full-body checkup · ₹4k", tag: "Booked, confirm today", next: true },
  { grade: "A", name: "Corporate · HR desk", meta: "200 employees · annual", tag: "Health-check tie-up" },
  { grade: "B", name: "Ravi Kumar", meta: "Advanced panel due · ₹3.5k", tag: "Basic panel last month" },
  { grade: "C", name: "Price checker", meta: "Comparing 4 labs", tag: "Just a quote" },
]

const STATS = [
  { Icon: IndianRupee, label: "Package / test value", value: "₹500 – ₹5L" },
  { Icon: CalendarClock, label: "Enquiry-to-visit", value: "Same-day – 90 days" },
  { Icon: HeartPulse, label: "Where leads come from", value: "Ads · referrals · walk-ins" },
]

const PAINS = [
  { n: "01", title: "Corporate tie-up leads get lost.", body: "An HR team sends 200 employee numbers for an annual health check, and it lands as one undifferentiated block. Reps can't tell the booking-ready employee from routine paperwork, so a large share go cold before anyone calls back in the first day. Each is a booked package plus the repeat diagnostics that follow, and a tie-up that converts poorly rarely gets renewed." },
  { n: "02", title: "Return patients vanish between visits.", body: "A patient who bought a basic panel last month may be due an advanced one now, but nobody remembers to reach out. That ₹3k–₹30k of lifetime value walks to whichever chain calls first. In diagnostics and health-package sales the repeat visit is the business, and it's the touch most often dropped." },
  { n: "03", title: "Doctor referral attribution is guesswork.", body: "Referring doctors expect a monthly report showing how their referrals converted, and pulling it from three disconnected tools eats a day every month. When the numbers are fuzzy, the referral relationship, the channel that feeds the whole practice, quietly cools. A doctor who feels uncounted refers elsewhere." },
]

const FEATURES: { Icon: LucideIcon; title: string; body: string; href: string }[] = [
  { Icon: Gauge, title: "Lead Scoring", body: "Every enquiry, portal, ad, walk-in or WhatsApp, graded A–F, so a booking-ready patient never queues behind a price-checker.", href: "/features/lead-scoring" },
  { Icon: ListOrdered, title: "Priority Queue", body: "Each tele-caller works a queue ordered by grade and appointment urgency, and DND-flagged leads drop out of it automatically.", href: "/features/priority-queue" },
  { Icon: MessageCircle, title: "WhatsApp Tracking", body: "Appointment confirmations and report-delivery messages go out in 3 taps and log back to the patient thread, so history stays in one place.", href: "/features/whatsapp-tracking" },
  { Icon: AlertTriangle, title: "Missed Opportunity Engine", body: "Unbooked follow-ups and repeat-visit-due patients resurface with the ₹ at risk, so lifetime value doesn't quietly walk to another chain.", href: "/features/missed-opportunity-engine" },
  { Icon: Mail, title: "Morning Brief", body: "Lists the day's queue, the reminders due, and the enquiries about to go cold, before the first call of the day.", href: "/features/morning-brief" },
  { Icon: Upload, title: "Intake Intelligence", body: "Triage a 200-employee corporate block or an ad-lead dump, dedupe, validate numbers, before callers burn a morning on it.", href: "/features/intake-intelligence" },
  { Icon: History, title: "Score Evolution", body: "An append-only, timestamped trail of every touch and grade change, DND-aware and audit-exportable for the compliance record.", href: "/features/score-evolution" },
  { Icon: Users, title: "Rep Tracking", body: "Per-caller ₹ booked, response time, reminders kept, referral conversions, outcomes, not dial-counts.", href: "/features/sales-rep-tracking" },
]

const SEGMENTS: { Icon: LucideIcon; name: string; signal: string }[] = [
  { Icon: TestTube, name: "Diagnostics / Labs", signal: "Speed and repeat-visit potential drive it. Panel-due patients are the recurring win." },
  { Icon: Stethoscope, name: "Clinic / OPD", signal: "Appointment urgency and specialty fit decide the booking." },
  { Icon: HeartPulse, name: "Health packages", signal: "Preventive and corporate-check volume. Tie-up conversion sets renewal." },
  { Icon: Smile, name: "Dental / Specialty", signal: "High-ticket, plan-based. Treatment acceptance signals a serious patient." },
  { Icon: Building2, name: "Corporate tie-ups", signal: "Bulk enquiries, few booking-ready. Triage surfaces the ones to call today." },
]

const FUNNEL = [
  { stage: "Enquiries", count: 1000, color: "#38BDF8" },
  { stage: "Contacted", count: 620, color: "#0EA5E9" },
  { stage: "Appointment booked", count: 300, color: "#10B981" },
  { stage: "Visited", count: 210, color: "#FB923C" },
  { stage: "Repeat / upsell", count: 78, color: "#F97316" },
]

const FAQ = [
  { q: "Is health data stored securely?", a: "Data sits in Supabase's Singapore region with row-level-security policies enforced at the database level, encryption in transit and at rest, and a full audit log of access. Access is scoped so a tele-caller sees only the leads assigned to them, and every export is logged. Leadkaun runs alongside your existing systems as a lead-intelligence layer rather than becoming another silo of patient records." },
  { q: "Does it support DND compliance for tele-callers?", a: "Yes. A DND flag sits on the lead record and DND-flagged leads are kept out of the caller's Priority Queue, so callers don't dial numbers they shouldn't. Every contact is timestamped for the audit trail." },
  { q: "Can we track doctor-to-patient referral commissions?", a: "Yes. Referring doctors are captured as a source on each patient, and a per-doctor monthly report generates from that attribution, so the referral relationship is backed by numbers rather than guesswork." },
  { q: "Does it integrate with our HIS (Hospital Info System)?", a: "Not natively in Phase 1. You export graded leads and enquiries to CSV to move into your HIS or billing system. Leadkaun is built to run alongside those systems, not replace them." },
  { q: "Can we run appointment reminders?", a: "Yes. The follow-up engine surfaces appointment-due reminders to the caller in their queue, and the reminder itself can go out over WhatsApp manually in three taps and be logged back to the patient thread. Because the reminder is tied to the graded lead, a high-value package booking gets chased more persistently than a routine walk-in, and nothing due today is missed in the Morning Brief." },
]

const CITIES = [
  { city: "Bengaluru", href: "/healthcare/bengaluru" },
  { city: "Mumbai", href: "/healthcare/mumbai" },
  { city: "Delhi", href: "/healthcare/delhi" },
  { city: "Chennai", href: "/healthcare/chennai" },
  { city: "Hyderabad", href: "/healthcare/hyderabad" },
  { city: "Pune", href: "/healthcare/pune" },
]

const GUIDES = [
  { label: "WhatsApp tracking for appointments", href: "/features/whatsapp-tracking" },
  { label: "How Leadkaun works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
]

const ROI: RoiConfig = {
  volumeLabel: "Patient enquiries per month", volumeDefault: 1500, volumeMin: 100, volumeMax: 8000, volumeStep: 100,
  valueLabel: "Average package / visit value", valueDefault: 4_000, valueMin: 500, valueMax: 5_00_000, valueStep: 500,
  coldLabel: "Warm enquiries that go cold without a callback", coldDefault: 22,
  conv: 0.15, outcomeNoun: "bookings", riskLabel: "₹ bookings at risk", coldNoun: "warm enquiries",
}

/** Return-patient continuity visual (server-safe). */
function ReturnPatient() {
  const visits = [
    { when: "6 weeks ago", what: "Basic lipid panel", amt: "₹800", state: "done" as const },
    { when: "Due now", what: "Advanced cardiac panel", amt: "₹3.5k", state: "due" as const },
  ]
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Ravi Kumar · patient record</p>
        <span className="inline-flex items-center gap-1.5"><GradeBadge grade="B" size="sm" /><span className="font-mono text-[11px] font-semibold text-sky-600">repeat</span></span>
      </div>
      <div className="mt-4 space-y-3">
        {visits.map((v, i) => (
          <div key={v.when} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <span className={`grid h-7 w-7 place-items-center rounded-lg ring-1 ${v.state === "due" ? "bg-emerald-50 text-emerald-600 ring-emerald-200" : "bg-sky-50 text-sky-600 ring-sky-100"}`}><Repeat className="h-3.5 w-3.5" /></span>
              {i < visits.length - 1 && <span aria-hidden className="mt-1 h-5 w-px bg-ink/10" />}
            </div>
            <div className={`min-w-0 flex-1 rounded-xl p-3 ring-1 ${v.state === "due" ? "bg-emerald-50/60 ring-emerald-200" : "bg-white/60 ring-black/5"}`}>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-ink">{v.what}</span>
                <span className="ml-auto font-mono text-[12px] font-semibold text-ink">{v.amt}</span>
              </div>
              <p className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-muted">{v.when}{v.state === "due" && " · due for upsell"}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 border-t pt-3.5 text-[12px] leading-snug text-ink-muted rule-paper">Last month&apos;s patient resurfaces as due-for-upsell, with +₹3.5k of repeat value attached, instead of disappearing.</p>
    </div>
  )
}

export default function HealthcarePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Use cases", url: "/use-cases" }, { name: "Healthcare" }]), faqPageSchema(FAQ)]) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        {/* HERO */}
        <section className="relative overflow-hidden border-b rule-paper" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, var(--paper) 100%)" }}>
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-[460px] w-[620px] rounded-full opacity-[0.30] blur-[130px]" style={{ background: "radial-gradient(circle, #BAE6FD 0%, transparent 70%)" }} />
          <Container className="relative pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div className="rise" style={{ animationDelay: "40ms" }}>
                <p className="ledger-num inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-sky-600">
                  <Stethoscope className="h-3.5 w-3.5" strokeWidth={2} /> Use case · Healthcare
                </p>
                <h1 className="display-xl mt-6 text-[40px] text-ink sm:text-[52px] lg:text-[58px]">
                  Patient relationships
                  <br />
                  <span className="relative inline-block text-sky-600">
                    without losing the thread.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h1>
                <p className="mt-7 max-w-xl text-[17px] leading-[1.7] text-ink-soft md:text-[18px]">
                  Diagnostic chains, clinic groups and health-package teams run on relationships and repeat visits. Leadkaun grades every enquiry, resurfaces the patients due back, and reports referral attribution, DND-aware and audit-exportable.
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
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Caller queue · today</p>
                    <span className="rounded-full bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-700 ring-1 ring-sky-100">DND-aware</span>
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
                  <p className="mt-3.5 text-[12px] leading-snug text-ink-muted">Booking-ready patients and repeat-visit-due ones on top; DND-flagged numbers never enter the queue.</p>
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
                This is the actual caller console.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Not a video, the real product. Work a graded queue, log a WhatsApp confirmation, and watch repeat-visit-due patients surface with the ₹ at risk, DND numbers kept out.
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
              <p className="quick-answer-q mt-3 text-[16px] font-semibold text-ink md:text-[17px]">How does Leadkaun help healthcare and diagnostic sales teams in India?</p>
              <p className="quick-answer-a mt-3 text-[16px] leading-[1.75] text-ink-soft">
                It grades every patient enquiry <Chip>A–F</Chip>, ranks a tele-caller&apos;s <Chip tone="mint">Priority Queue</Chip> by grade and appointment urgency, and resurfaces <Chip>return patients</Chip> due for a repeat visit with the ₹ at risk. Referring doctors are tracked for a per-doctor monthly report, and the queue is <Chip tone="warn">DND-aware</Chip> and audit-exportable. It runs alongside your HIS, not instead of it.
              </p>
            </div>
          </Container>
        </SectionGround>

        {/* 02 — THE PROBLEM */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="02" tone="warm" label="Why patient revenue leaks" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Three patterns we see in every chain.
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

        {/* 03 — RETURN PATIENTS */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <NumberedTag number="03" label="The repeat visit is the business" />
                <h2 className="mt-5 text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[38px]">
                  Last month&apos;s patient is this month&apos;s upsell.
                </h2>
                <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
                  A basic-panel patient may be due an advanced one now, and that ₹3k–₹30k of lifetime value walks to whoever calls first. Patient records double as lead records with repeat-visit continuity, so the due-for-upsell patient surfaces in the queue instead of being forgotten between visits.
                </p>
              </div>
              <Reveal delay={0.06}>
                <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7"><ReturnPatient /></FloatingCard>
              </Reveal>
            </div>
          </Container>
        </SectionGround>

        {/* 04 — FEATURE GRID */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="04" label="The whole platform, for healthcare" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Eight modules. Every one tuned to patient acquisition and repeat visits.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Leadkaun isn&apos;t a lighter CRM, it&apos;s the lead-intelligence layer on top of your HIS, DND-aware and audit-exportable. Here&apos;s what each part does for a chain.
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

        {/* 05 — REFERRAL ATTRIBUTION */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <NumberedTag number="05" label="Referrals, counted" />
                <h2 className="mt-5 text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[38px]">
                  A referring doctor who feels uncounted refers elsewhere.
                </h2>
                <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
                  Referring doctors are captured as a source on each patient, so the per-doctor monthly report generates from real attribution instead of a day of spreadsheet stitching. The channel that feeds the whole practice is backed by numbers, not guesswork.
                </p>
              </div>
              <Reveal delay={0.06}>
                <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Dr. Mehta · March referrals</p>
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-sky-50 text-sky-600 ring-1 ring-sky-100"><UserCheck className="h-3.5 w-3.5" /></span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2.5">
                    {[["Referred", "24"], ["Booked", "15"], ["Revenue", "₹1.4L"]].map(([l, v]) => (
                      <div key={l} className="rounded-xl bg-white/60 p-3 text-center ring-1 ring-black/5">
                        <p className="font-mono text-[19px] font-semibold text-ink">{v}</p>
                        <p className="mt-0.5 text-[11px] text-ink-muted">{l}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2 border-t pt-3.5 rule-paper">
                    <span className="text-[12px] text-ink-soft">Auto-generated, per doctor</span>
                    <span className="ml-auto rounded-lg bg-sky-50 px-2.5 py-1 font-mono text-[10.5px] font-semibold text-sky-700 ring-1 ring-sky-100">Send report</span>
                  </div>
                </FloatingCard>
              </Reveal>
            </div>
          </Container>
        </SectionGround>

        {/* 06 — SEGMENTS */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="06" tone="warm" label="One score, tuned per line" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                A walk-in blood test and a dental plan aren&apos;t the same patient.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Whatever mix you run, the account-level ICP keeps grades consistent, while the signals that matter, urgency, repeat potential, treatment acceptance, change by line.
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
              <NumberedTag number="07" label="From enquiry to repeat visit" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                See the funnel narrow, and where bookings leak.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Every enquiry is graded, so you can watch the cohort move from enquiry to visit to repeat, and see which grade band is falling out between contacted and booked.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2 md:gap-6">
              <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Patient funnel · illustrative</p>
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
                <p className="mt-5 border-t pt-4 text-[12.5px] leading-snug text-ink-muted rule-paper">Grade A and B are the bookings to protect. The Missed Opportunity Engine flags repeat-visit-due patients before they lapse.</p>
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
                Put a rupee figure on the bookings you&apos;re missing.
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
                      ~24% a year,
                      <br />
                      <span className="text-sky-600">onto portals &amp; WhatsApp.</span>
                    </p>
                    <p className="mt-3 text-[14px] leading-[1.55] text-ink-soft">India&apos;s digital-health segment is compounding at roughly 24% a year, pushing more appointment, diagnostic and procedure enquiries onto portals and WhatsApp.</p>
                    <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted ring-1 ring-black/5">
                      <TrendingUp className="h-3 w-3 text-sky-500" strokeWidth={2.5} /> Source · IBEF
                    </span>
                  </div>
                  <div className="p-8 md:p-9">
                    <p className="text-[16px] leading-[1.7] text-ink-soft">
                      Health decisions are urgent and comparison-driven, a patient rarely waits on one clinic. The diagnostics and clinic teams that respond fast and chase unbooked enquiries convert far more of them than those relying on the patient to call back.
                    </p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      {[
                        { k: "Respond fast", v: "Urgent, comparison-led decisions" },
                        { k: "Repeat visit", v: "Where the real LTV lives" },
                        { k: "DND-aware", v: "Compliant tele-calling by default" },
                      ].map((s) => (
                        <div key={s.k} className="rounded-xl bg-sky-50/60 p-3.5 ring-1 ring-sky-100">
                          <p className="text-[13px] font-semibold text-ink">{s.k}</p>
                          <p className="mt-1 text-[11.5px] leading-[1.5] text-ink-soft">{s.v}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-6 border-t pt-5 text-[13.5px] leading-[1.65] text-ink-soft rule-paper">
                      Leadkaun grades, ranks, and resurfaces the patients due back, with the compliance trail Indian healthcare expects, alongside your HIS, not instead of it.
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
                The patient didn&apos;t churn. We just never called them back for the next test.
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
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">Healthcare sales questions.</h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={FAQ} /></Reveal>
          </Container>
        </SectionGround>

        {/* 11 — BY CITY */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-10 max-w-3xl">
              <NumberedTag number="11" tone="warm" label="Healthcare by city" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
                Localised pages for top healthcare markets.
              </h2>
              <p className="mt-4 text-[16px] leading-[1.55] text-ink-soft">
                City-level guides with local patient demand, package bands, and the referral and ad channels that convert in each market.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CITIES.map((c) => (
                <Link key={c.href} href={c.href} className="group block">
                  <FloatingCard tier="2" depth="2" gloss aura="sky" className="flex items-center gap-3.5 p-5 transition-transform group-hover:-translate-y-0.5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100"><MapPin className="h-5 w-5" strokeWidth={2} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15.5px] font-semibold text-ink">{c.city}</span>
                      <span className="block text-[12px] text-ink-muted">Healthcare leads in {c.city}</span>
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
          headline="Flat per account, not per tele-caller."
          sub="Add the whole calling floor and every centre without the bill climbing seat by seat. Priced by team size and active-lead volume, 14-day free trial, no card, ~17% off on annual."
        />

        {/* CLOSING CTA */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-4xl">
              <div className="relative overflow-hidden rounded-3xl border p-10 text-center md:p-14" style={{ borderColor: "var(--paper-line)", background: "linear-gradient(180deg,#FFFFFF, var(--paper))" }}>
                <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-96 rounded-full opacity-30 blur-[110px]" style={{ background: "radial-gradient(circle,#BAE6FD 0%,transparent 70%)" }} />
                <p className="ledger-num relative text-[11px] uppercase tracking-[0.22em] text-sky-600">Ready when you are</p>
                <h2 className="display-lg relative mx-auto mt-5 max-w-2xl text-[30px] text-ink md:text-[44px]">
                  Book more patients,{" "}
                  <span className="relative inline-block text-sky-600">
                    keep the ones you have.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h2>
                <p className="relative mx-auto mt-6 max-w-xl text-[16px] leading-[1.7] text-ink-soft">
                  Import your enquiries and patient list. Leadkaun grades every one, ranks the caller&apos;s day DND-aware, and resurfaces the patients due back, the same day you start.
                </p>
                <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
                    Start free trial <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="/how-it-works" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)" }}>
                    How it works
                  </Link>
                </div>
                <p className="ledger-num relative mt-8 text-[11.5px] uppercase tracking-[0.16em] text-ink-muted">Free ₹0 · no card · same-day setup · runs alongside your HIS</p>
              </div>
            </Reveal>
          </Container>
        </SectionGround>

        <Footer />
      </main>
    </>
  )
}
