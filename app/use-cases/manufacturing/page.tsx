import Link from "next/link"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Factory, Gauge, ListOrdered, MessageCircle, AlertTriangle, Mail, Upload, History, Users, ArrowRight, Sparkles, IndianRupee, CalendarClock, Cog, Package, Wrench, Hammer, MapPin, TrendingUp, FileText, type LucideIcon } from "lucide-react"

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

const title = "B2B Manufacturing Lead Management India, quote-to-close CRM"
const description =
  "Leadkaun grades every RFQ A–F, holds the multi-stakeholder thread across a 90–180 day cycle, and surfaces stalled quotes with the ₹ at risk before they go to a competitor, the whole platform, built for B2B manufacturing."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/use-cases/manufacturing" },
  ...ogMeta({ title, description, path: "/use-cases/manufacturing" }),
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
  { grade: "A", name: "Bharat Forge unit", meta: "Machinery · ₹42L order", tag: "RFQ, matching industry", next: true },
  { grade: "A", name: "Kirloskar plant", meta: "Components · ₹8L order", tag: "Sample requested" },
  { grade: "B", name: "Rajkot Castings", meta: "Raw material · ₹5L", tag: "Quote sent, 22d quiet" },
  { grade: "C", name: "IndiaMART lead", meta: "Unclear spec", tag: "Student project?" },
]

const STATS = [
  { Icon: IndianRupee, label: "Order value", value: "₹50k – ₹50L" },
  { Icon: CalendarClock, label: "Enquiry-to-PO cycle", value: "30 – 180 days" },
  { Icon: Factory, label: "Where leads come from", value: "IndiaMART · TradeIndia · dealers" },
]

const PAINS = [
  { n: "01", title: "Quote sent. Silence. Deal lost.", body: "Industrial buyers fire the same RFQ to several suppliers, then go quiet while they compare. A quote that sits without a follow-up inside the evaluation window loses to whoever chased hardest, often not the lowest price, just the most present vendor. Without a system holding the next-touch date, a ₹5L quote slips off the radar between plant visits and never gets reopened." },
  { n: "02", title: "Multi-stakeholder thread loss.", body: "Procurement asked for the quote, finance is checking payment terms, engineering wants a trial sample before sign-off, three parallel conversations feeding one order. When they live in separate WhatsApp chats and inboxes, nobody sees the whole thread. A rep who forgets engineering is still waiting on a datasheet can stall a ₹40L deal for weeks without realising it." },
  { n: "03", title: "90-day cycles, 30-day memory.", body: "Engineered-goods and capital-equipment cycles run 90–180 days from enquiry to PO. The buying signal a rep picked up on day 15, a plant expansion, a competitor's price hike, is forgotten by day 45, and field notes scribbled after a factory meeting rarely make it into any system. On the long deal it's usually memory, not effort, that loses the order." },
]

const FEATURES: { Icon: LucideIcon; title: string; body: string; href: string }[] = [
  { Icon: Gauge, title: "Lead Scoring", body: "Every RFQ graded A–F the moment it lands, so a serious ₹-crore enquiry from a matching industry never sits in the same inbox as a tyre-kicker.", href: "/features/lead-scoring" },
  { Icon: ListOrdered, title: "Priority Queue", body: "The deals worth chasing today at the top, instead of the rep working whatever enquiry shouted loudest last.", href: "/features/priority-queue" },
  { Icon: MessageCircle, title: "WhatsApp Tracking", body: "Field reps log a factory meeting in 3 taps from the phone and fire a follow-up over WhatsApp, so the day-15 signal actually gets recorded.", href: "/features/whatsapp-tracking" },
  { Icon: AlertTriangle, title: "Missed Opportunity Engine", body: "Watches open quotes and flags the ones going stale with a ₹-at-risk figure from the quote value, so a ₹5L quote drifting past its date surfaces before it dies.", href: "/features/missed-opportunity-engine" },
  { Icon: Mail, title: "Morning Brief", body: "Lands before the floor gets busy: the day's queue, the quotes that need a nudge, and the ₹ at risk if they slip.", href: "/features/morning-brief" },
  { Icon: Upload, title: "Intake Intelligence", body: "Sift an IndiaMART export, valid numbers, duplicates, spec-less enquiries, before an SDR burns a day on a dead RFQ.", href: "/features/intake-intelligence" },
  { Icon: History, title: "Score Evolution", body: "An append-only timeline of every grade change over a 180-day cycle, so a deal that cooled traces to the event that caused it.", href: "/features/score-evolution" },
  { Icon: Users, title: "Rep Tracking", body: "Per-rep ₹ order value won, Grade A response time, quotes chased, follow-ups kept, outcomes, not activity counts.", href: "/features/sales-rep-tracking" },
]

const SEGMENTS: { Icon: LucideIcon; name: string; signal: string }[] = [
  { Icon: Cog, name: "Components / Parts", signal: "Spec match and volume drive it. Repeat-order potential signals a keeper." },
  { Icon: Factory, name: "Machinery / Capital", signal: "Long cycle, high value. Plant-expansion and financing signals matter most." },
  { Icon: Package, name: "Raw materials / Bulk", signal: "Price and reliability driven. Contract-supply intent beats one-off RFQs." },
  { Icon: Wrench, name: "Custom / Engineered", signal: "Datasheet and sample stage is decisive. Engineering sign-off gates the order." },
  { Icon: Hammer, name: "MRO / Spares", signal: "Urgency and availability signal a serious, fast-closing buyer." },
]

const FUNNEL = [
  { stage: "Enquiries (RFQ)", count: 1000, color: "#38BDF8" },
  { stage: "Quoted", count: 420, color: "#0EA5E9" },
  { stage: "Sampled / trial", count: 180, color: "#10B981" },
  { stage: "Negotiation", count: 90, color: "#FB923C" },
  { stage: "PO won", count: 38, color: "#F97316" },
]

const FAQ = [
  { q: "Does it handle quote tracking?", a: "Yes. Each lead carries a quote object with value, status, validity and a next-touch date. When a quote passes its follow-up date without activity, the Missed Opportunity Engine surfaces it with the ₹ at risk drawn from that quote value, so stalled quotes get chased before they expire. It runs alongside your existing CRM or ERP, not instead of it." },
  { q: "How does it work with field reps on patchy mobile data?", a: "The 3-tap logging screen is built mobile-first and kept light for reps standing on a factory floor or a client site on patchy 3G. A 30-minute meeting logs in a few taps, and follow-ups go out over WhatsApp manually from the same screen, no writing up notes back at the desk." },
  { q: "Can we attribute to distributors?", a: "Yes. Inside-sales and distributor-sourced deals can be tagged and split, so when a dealer closes an enquiry your inside team originated, the credit is recorded on the lead rather than argued over later." },
  { q: "Does it integrate with our ERP (SAP, Tally, Zoho Books)?", a: "Not in Phase 1. Today you export graded leads and quotes to CSV to move into your ERP or accounting stack; native ERP integration is on the roadmap. Leadkaun is designed as a lead-intelligence layer alongside those systems, not a replacement for them." },
  { q: "Can multiple team members collaborate on one lead?", a: "Yes. Lead notes, a full activity timeline and assignment let procurement-facing, engineering-facing and finance-facing touches sit on one thread, so the multi-stakeholder deal stays visible to everyone working it." },
]

const CITIES = [
  { city: "Pune", href: "/manufacturing/pune" },
  { city: "Chennai", href: "/manufacturing/chennai" },
  { city: "Coimbatore", href: "/manufacturing/coimbatore" },
  { city: "Ahmedabad", href: "/manufacturing/ahmedabad" },
  { city: "Ludhiana", href: "/manufacturing/ludhiana" },
  { city: "Rajkot", href: "/manufacturing/rajkot" },
]

const GUIDES = [
  { label: "Lead scoring, explained", href: "/features/lead-scoring" },
  { label: "How Leadkaun works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
]

const ROI: RoiConfig = {
  volumeLabel: "RFQs per month", volumeDefault: 300, volumeMin: 30, volumeMax: 2000, volumeStep: 25,
  valueLabel: "Average order value", valueDefault: 5_00_000, valueMin: 50_000, valueMax: 50_00_000, valueStep: 50_000,
  coldLabel: "Open quotes that stall without follow-up", coldDefault: 20,
  conv: 0.1, outcomeNoun: "orders", riskLabel: "₹ orders at risk", coldNoun: "open quotes",
}

/** Multi-stakeholder thread visual (server-safe). */
function StakeholderThread() {
  const rows = [
    { role: "Procurement", who: "Asked for the quote", state: "done" as const },
    { role: "Finance", who: "Checking payment terms", state: "active" as const },
    { role: "Engineering", who: "Waiting on a datasheet", state: "blocked" as const },
  ]
  const tone: Record<string, string> = {
    done: "bg-emerald-50/60 ring-emerald-200",
    active: "bg-sky-50/60 ring-sky-200",
    blocked: "bg-orange-50/70 ring-orange-200",
  }
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Order #RFQ-2213 · ₹40L</p>
        <span className="inline-flex items-center gap-1.5"><GradeBadge grade="A" size="sm" /><span className="font-mono text-[11px] font-semibold text-emerald-600">one thread</span></span>
      </div>
      <div className="mt-4 space-y-2.5">
        {rows.map((r) => (
          <div key={r.role} className={`flex items-center gap-3 rounded-xl p-3 ring-1 ${tone[r.state]}`}>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-semibold text-ink">{r.role}</span>
              <span className="block truncate text-[11.5px] text-ink-muted">{r.who}</span>
            </span>
            <span className={`font-mono text-[10.5px] font-semibold ${r.state === "blocked" ? "text-orange-600" : r.state === "active" ? "text-sky-600" : "text-emerald-600"}`}>
              {r.state === "blocked" ? "you're the blocker" : r.state === "active" ? "in progress" : "done"}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 border-t pt-3.5 text-[12px] leading-snug text-ink-muted rule-paper">Three conversations, one order, one timeline, so nobody forgets engineering is still waiting.</p>
    </div>
  )
}

export default function ManufacturingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Use cases", url: "/use-cases" }, { name: "Manufacturing" }]), faqPageSchema(FAQ)]) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        {/* HERO */}
        <section className="relative overflow-hidden border-b rule-paper" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, var(--paper) 100%)" }}>
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-[460px] w-[620px] rounded-full opacity-[0.30] blur-[130px]" style={{ background: "radial-gradient(circle, #BAE6FD 0%, transparent 70%)" }} />
          <Container className="relative pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div className="rise" style={{ animationDelay: "40ms" }}>
                <p className="ledger-num inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-sky-600">
                  <Factory className="h-3.5 w-3.5" strokeWidth={2} /> Use case · Manufacturing
                </p>
                <h1 className="display-xl mt-6 text-[40px] text-ink sm:text-[52px] lg:text-[58px]">
                  Win the 90-day cycle
                  <br />
                  <span className="relative inline-block text-sky-600">
                    without losing the thread.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h1>
                <p className="mt-7 max-w-xl text-[17px] leading-[1.7] text-ink-soft md:text-[18px]">
                  Long cycles, multi-stakeholder threads and quote-revision loops. Leadkaun scores every RFQ, holds the thread across 180 days, and surfaces stalled quotes with the ₹ at risk before they go to a competitor.
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
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">RFQ queue · today</p>
                    <span className="rounded-full bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-700 ring-1 ring-sky-100">chase first</span>
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
                  <p className="mt-3.5 text-[12px] leading-snug text-ink-muted">Serious ₹-crore RFQs on top, with the next-touch date held so no quote goes quiet unnoticed.</p>
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
                This is the actual quote-to-close pipeline.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Not a video, the real product. Move a deal through the stages, log a factory visit, and watch stalled quotes surface with the ₹ at risk attached.
              </p>
            </Reveal>
          </Container>
          <Reveal delay={0.06} className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <AppReplica initialView="pipeline" />
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
              <p className="quick-answer-q mt-3 text-[16px] font-semibold text-ink md:text-[17px]">How does Leadkaun help B2B manufacturing sales teams in India?</p>
              <p className="quick-answer-a mt-3 text-[16px] leading-[1.75] text-ink-soft">
                It grades every RFQ <Chip>A–F</Chip> on industry fit and order size, ranks the deals worth chasing today, and holds the <Chip tone="mint">multi-stakeholder thread</Chip>, procurement, finance and engineering, on one timeline across a 90–180 day cycle. Each quote carries a next-touch date, and the <Chip tone="warn">Missed Opportunity Engine</Chip> resurfaces stalled ones with the ₹ at risk. It runs alongside your CRM or ERP, not instead of it.
              </p>
            </div>
          </Container>
        </SectionGround>

        {/* 02 — THE PROBLEM */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="02" tone="warm" label="Why long-cycle deals slip" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Three patterns we see on every long deal.
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

        {/* 03 — MULTI-STAKEHOLDER THREAD */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <NumberedTag number="03" label="One order, one thread" />
                <h2 className="mt-5 text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[38px]">
                  Three conversations feed one order. See all of them.
                </h2>
                <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
                  Procurement, finance and engineering each run their own conversation, and when they live in separate chats nobody sees the whole deal. Leadkaun holds them on one thread with a full activity timeline, so the moment engineering is the blocker, you know, before it stalls a ₹40L order for weeks.
                </p>
              </div>
              <Reveal delay={0.06}>
                <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7"><StakeholderThread /></FloatingCard>
              </Reveal>
            </div>
          </Container>
        </SectionGround>

        {/* 04 — FEATURE GRID */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="04" label="The whole platform, for manufacturing" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Eight modules. Every one tuned to the quote-to-close cycle.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Leadkaun isn&apos;t a lighter CRM, it&apos;s the lead-intelligence layer on top of your CRM or ERP. Here&apos;s what each part does across a long deal.
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

        {/* 05 — STALLED QUOTE */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <NumberedTag number="05" label="Stalled quotes, surfaced" />
                <h2 className="mt-5 text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[38px]">
                  A ₹5L quote shouldn&apos;t die between plant visits.
                </h2>
                <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
                  Every quote carries a value, validity and a next-touch date. When it passes that date without activity, the Missed Opportunity Engine surfaces it with the ₹ at risk drawn from the quote value, so a drifting quote gets a nudge before it expires or goes to whoever chased harder.
                </p>
              </div>
              <Reveal delay={0.06}>
                <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Quote #Q-881 · Rajkot Castings</p>
                    <span className="rounded-full bg-orange-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-orange-700 ring-1 ring-orange-100">stalling</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2.5">
                    {[["Quote value", "₹5.0L"], ["Sent", "22 days ago"], ["Validity", "30 days"], ["Last touch", "none"]].map(([l, v]) => (
                      <div key={l} className="rounded-xl bg-white/60 p-3 ring-1 ring-black/5">
                        <p className="text-[11px] text-ink-muted">{l}</p>
                        <p className="mt-0.5 font-mono text-[14px] font-semibold text-ink">{v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-orange-50/70 p-3.5 ring-1 ring-orange-200">
                    <FileText className="h-4 w-4 text-orange-600" />
                    <span className="text-[13px] font-semibold text-ink">₹5.0L at risk</span>
                    <span className="ml-auto rounded-lg bg-white px-2.5 py-1 font-mono text-[10.5px] font-semibold text-sky-700 ring-1 ring-sky-100">Nudge now</span>
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
                A components RFQ and a capital-equipment enquiry aren&apos;t the same lead.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Configure the ICP, which industries, order sizes and regions count as a fit, and every rep sees the same consistent grade, so &ldquo;hot lead&rdquo; means the same thing across the team, whatever the product line.
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
              <NumberedTag number="07" label="From RFQ to PO" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                See the pipeline narrow, and where orders leak.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Every RFQ is graded, so you can watch the cohort move from enquiry to quoted to PO, and see which grade band is stalling between quoted and sampled.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2 md:gap-6">
              <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Order funnel · illustrative</p>
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
                <p className="mt-5 border-t pt-4 text-[12.5px] leading-snug text-ink-muted rule-paper">Grade A and B are the orders to protect. The Missed Opportunity Engine flags stalled quotes before they expire.</p>
              </FloatingCard>
            </Reveal>
          </Container>
        </SectionGround>

        {/* 08 — ₹ CALCULATOR */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-10 max-w-3xl">
              <NumberedTag number="08" label="What a stalled quote costs" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Put a rupee figure on the orders drifting away.
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
                      200M+ buyers,
                      <br />
                      <span className="text-sky-600">one RFQ, many vendors.</span>
                    </p>
                    <p className="mt-3 text-[14px] leading-[1.55] text-ink-soft">IndiaMART alone connects 8M+ suppliers with 200M+ registered buyers and holds a majority of India&apos;s online B2B enquiry traffic.</p>
                    <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted ring-1 ring-black/5">
                      <TrendingUp className="h-3 w-3 text-sky-500" strokeWidth={2.5} /> Source · IndiaMART
                    </span>
                  </div>
                  <div className="p-8 md:p-9">
                    <p className="text-[16px] leading-[1.7] text-ink-soft">
                      Industrial buyers fire the same RFQ to several suppliers at once, so the vendor who quotes first and keeps chasing through the long evaluation cycle typically lands the order, more than any single price.
                    </p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      {[
                        { k: "First quote", v: "Sets the reference the buyer compares to" },
                        { k: "90+ days", v: "Holding the thread beats one low price" },
                        { k: "Field notes", v: "The day-15 signal has to be recorded" },
                      ].map((s) => (
                        <div key={s.k} className="rounded-xl bg-sky-50/60 p-3.5 ring-1 ring-sky-100">
                          <p className="text-[13px] font-semibold text-ink">{s.k}</p>
                          <p className="mt-1 text-[11.5px] leading-[1.5] text-ink-soft">{s.v}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-6 border-t pt-5 text-[13.5px] leading-[1.65] text-ink-soft rule-paper">
                      Leadkaun scores every RFQ, holds the thread across 180 days, and puts a ₹ figure on the stalled quotes, alongside your CRM or ERP, not instead of it.
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
                The order wasn&apos;t lost on price. It was lost on a follow-up nobody remembered.
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
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">Manufacturing sales questions.</h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={FAQ} /></Reveal>
          </Container>
        </SectionGround>

        {/* 11 — BY CITY */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-10 max-w-3xl">
              <NumberedTag number="11" tone="warm" label="Manufacturing by city" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
                Localised pages for top manufacturing clusters.
              </h2>
              <p className="mt-4 text-[16px] leading-[1.55] text-ink-soft">
                City-level guides with local industrial clusters, order bands, and the marketplaces and dealer networks that convert in each hub.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CITIES.map((c) => (
                <Link key={c.href} href={c.href} className="group block">
                  <FloatingCard tier="2" depth="2" gloss aura="sky" className="flex items-center gap-3.5 p-5 transition-transform group-hover:-translate-y-0.5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100"><MapPin className="h-5 w-5" strokeWidth={2} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15.5px] font-semibold text-ink">{c.city}</span>
                      <span className="block text-[12px] text-ink-muted">Manufacturing leads in {c.city}</span>
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
          sub="Add the inside-sales desk and field reps without the bill climbing seat by seat. Priced by team size and active-lead volume, 14-day free trial, no card, ~17% off on annual."
        />

        {/* CLOSING CTA */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-4xl">
              <div className="relative overflow-hidden rounded-3xl border p-10 text-center md:p-14" style={{ borderColor: "var(--paper-line)", background: "linear-gradient(180deg,#FFFFFF, var(--paper))" }}>
                <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-96 rounded-full opacity-30 blur-[110px]" style={{ background: "radial-gradient(circle,#BAE6FD 0%,transparent 70%)" }} />
                <p className="ledger-num relative text-[11px] uppercase tracking-[0.22em] text-sky-600">Ready when you are</p>
                <h2 className="display-lg relative mx-auto mt-5 max-w-2xl text-[30px] text-ink md:text-[44px]">
                  Hold the thread{" "}
                  <span className="relative inline-block text-sky-600">
                    all the way to the PO.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h2>
                <p className="relative mx-auto mt-6 max-w-xl text-[16px] leading-[1.7] text-ink-soft">
                  Import your IndiaMART, TradeIndia and dealer enquiries. Leadkaun grades every RFQ, ranks the day, and surfaces stalled quotes, the same day you start.
                </p>
                <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
                    Start free trial <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="/how-it-works" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)" }}>
                    How it works
                  </Link>
                </div>
                <p className="ledger-num relative mt-8 text-[11.5px] uppercase tracking-[0.16em] text-ink-muted">Free ₹0 · no card · same-day setup · runs alongside your ERP</p>
              </div>
            </Reveal>
          </Container>
        </SectionGround>

        <Footer />
      </main>
    </>
  )
}
