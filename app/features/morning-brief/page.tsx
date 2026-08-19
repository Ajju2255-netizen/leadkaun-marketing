import Link from "next/link"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Mail, Gauge, ListOrdered, AlertTriangle, ArrowRight, Sparkles, Clock, Users, Inbox, CheckCircle2, type LucideIcon } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FeatureCard } from "@/app/components/feature-card"
import { FloatingCard } from "@/app/components/floating-card"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { AppReplica } from "@/app/components/app-replica"
import { Voices } from "@/app/components/voices"
import { faqPageSchema, breadcrumbListSchema, jsonLdScript, ogMeta } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

const title = "Morning Brief, the 8:30 AM email that sets the day"
const description =
  "Every weekday at 8:30 AM IST, each rep and manager gets one email: ₹ at risk today, top Grade A leads, overdue follow-ups. The ritual that turns Leadkaun's scoring into a daily habit."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/features/morning-brief" },
  ...ogMeta({ title, description, path: "/features/morning-brief" }),
}

/** Inline highlighted term chip for the Quick Answer. */
function Chip({ children, tone = "sky" }: { children: ReactNode; tone?: "sky" | "mint" | "warn" }) {
  const styles: Record<string, string> = {
    sky: "bg-sky-50 text-sky-700 ring-sky-200",
    mint: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warn: "bg-orange-50 text-orange-700 ring-orange-200",
  }
  return <span className={`whitespace-nowrap rounded-md px-1.5 py-[1px] text-[13.5px] font-semibold ring-1 ${styles[tone]}`}>{children}</span>
}

const BRIEF_STATS = [
  { v: "8:30 AM", l: "IST, every weekday", h: "Before stand-up, before the first dashboard" },
  { v: "Mon–Sat", l: "Sunday off by default", h: "Per-user toggle for teams that work Sundays" },
  { v: "One CTA", l: "Rep brief ends with a single action", h: "Open the queue and start at the top" },
]

const PROOF: { Icon: LucideIcon; stat: string; label: string }[] = [
  { Icon: Inbox, stat: "8:30 AM", label: "In the inbox before the workday starts" },
  { Icon: Clock, stat: "Mon–Sat", label: "Consistent, so it becomes a habit" },
  { Icon: Users, stat: "Two views", label: "Rep opportunity view, manager rollup" },
  { Icon: Gauge, stat: "Same data", label: "Straight from scoring and the queue" },
]

const FAQ = [
  { q: "Why 8:30 AM IST?", a: "It hits before stand-up, before coffee, before anyone opens a dashboard. By the time the team gathers, everyone is looking at the same numbers, and by 11 AM, Grade A leads from overnight are contacted or on a recovery path." },
  { q: "What does a rep see vs what a manager sees?", a: "Rep brief: top 5 Grade A leads, ₹ at risk today, overdue follow-ups, one primary CTA. Manager brief: per-rep rollup of ₹ at risk, Grade A count, follow-up score, top stale leads. Same underlying data, different framing." },
  { q: "Does it send on Sundays or Saturdays?", a: "Monday through Saturday by default. Sunday is off. Per-user toggle for rep teams that work Sundays (real estate site visits, etc.)." },
  { q: "What if a rep is on leave?", a: "Toggle 'out of office' in settings. Brief pauses for them; their leads roll up to the assigned backup or the manager dashboard." },
  { q: "Can I customise what's in the brief?", a: "Reps see the same shape (brand-enforced consistency). Managers can pick which per-rep metrics appear, ₹ at risk, Grade A count, follow-up score, response-time average, etc." },
]

const RELATED = [
  { icon: Gauge, title: "Lead Scoring", description: "The Brief's Grade A list comes straight from the scoring engine. Every morning.", href: "/features/lead-scoring" },
  { icon: ListOrdered, title: "Priority Queue", description: "The rep's first 5 items are the top of their queue, now in their inbox.", href: "/features/priority-queue" },
  { icon: AlertTriangle, title: "Missed Opportunity", description: "The ₹ at risk number in the Brief comes from the Missed Opportunity Engine.", href: "/features/missed-opportunity-engine" },
]

/** A compact rendering of the rep-facing brief, drawn like an email. */
function BriefEmail() {
  return (
    <div className="mx-auto max-w-md">
      <div className="flex items-center justify-between rounded-t-2xl border-x border-t bg-white px-5 py-3" style={{ borderColor: "var(--paper-line)" }}>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-sky-600" strokeWidth={2} />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">To: Nikhil · 8:30 AM IST</span>
        </div>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100">Rep brief</span>
      </div>
      <div className="rounded-b-2xl border-x border-b bg-white px-5 py-5" style={{ borderColor: "var(--paper-line)" }}>
        <p className="text-[15px] font-semibold text-ink">Your day: ₹1.8L to recover</p>
        <div className="mt-4 flex items-baseline justify-between rounded-xl bg-orange-50/60 px-4 py-3 ring-1 ring-orange-100">
          <span className="text-[12px] font-medium text-orange-700">₹ at risk today</span>
          <span className="font-mono text-[22px] font-semibold text-ink">₹1.8L</span>
        </div>
        <p className="mt-4 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Top Grade A to call</p>
        <ul className="mt-2 space-y-1.5">
          {[["Priya Sharma", "Asked for pricing"], ["Rahul Mehta", "Wants a walkthrough"], ["Kavita Menon", "Site visit booked"]].map(([n, s]) => (
            <li key={n} className="flex items-center gap-2.5">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-emerald-50 font-mono text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100">A</span>
              <span className="text-[13px] font-medium text-ink">{n}</span>
              <span className="truncate text-[12px] text-ink-muted">— {s}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t pt-4 rule-paper">
          <span className="text-[12px] text-ink-soft">4 follow-ups overdue</span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-[12px] font-semibold text-white">Open my queue <ArrowRight className="h-3.5 w-3.5" /></span>
        </div>
      </div>
    </div>
  )
}

export default function MorningBriefPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Features", url: "/features" }, { name: "Morning Brief" }]), faqPageSchema(FAQ)]) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        {/* HERO — split, sample email right */}
        <section className="relative overflow-hidden border-b rule-paper" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, var(--paper) 100%)" }}>
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-[460px] w-[620px] rounded-full opacity-[0.30] blur-[130px]" style={{ background: "radial-gradient(circle, #BAE6FD 0%, transparent 70%)" }} />
          <Container className="relative pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div className="rise" style={{ animationDelay: "40ms" }}>
                <p className="ledger-num inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-sky-600">
                  <Mail className="h-3.5 w-3.5" strokeWidth={2} /> Morning Brief
                </p>
                <h1 className="display-xl mt-6 text-[40px] text-ink sm:text-[52px] lg:text-[58px]">
                  8:30 AM IST.
                  <br />
                  <span className="relative inline-block text-sky-600">
                    The day is set.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h1>
                <p className="mt-7 max-w-xl text-[17px] leading-[1.7] text-ink-soft md:text-[18px]">
                  One email lands before stand-up: ₹ at risk today, the top Grade A leads to call, and the follow-ups going overdue. No dashboard to open, no argument about where to start, the scoring already decided.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
                    Start free <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="/features/priority-queue" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)" }}>
                    See the queue <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Sample brief */}
              <div className="rise" style={{ animationDelay: "160ms" }}>
                <BriefEmail />
              </div>
            </div>
          </Container>
        </section>

        {/* 01 — THE LIVE PRODUCT (AppReplica opened on the dashboard) */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-8 max-w-3xl">
              <NumberedTag number="01" label="The live product" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                The brief is your dashboard, delivered.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Everything the 8:30 email summarises lives here. Open the dashboard and see the same ₹ at risk, Grade A count, and follow-up score the brief is built from.
              </p>
            </Reveal>
          </Container>
          <Reveal delay={0.06} className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <AppReplica initialView="dashboard" />
          </Reveal>
        </SectionGround>

        {/* QUICK ANSWER — accent card, chipped terms */}
        <SectionGround variant="pure" size="sm">
          <Container>
            <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border bg-white p-6 pl-7 md:p-8 md:pl-10" style={{ borderColor: "var(--paper-line)" }} data-quick-answer>
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", speakable: { "@type": "SpeakableSpecification", cssSelector: [".quick-answer-q", ".quick-answer-a"] } }) }} />
              <span aria-hidden className="absolute inset-y-0 left-0 w-1.5" style={{ background: "#0877B8" }} />
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sky-500" aria-hidden />
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">Quick answer</p>
              </div>
              <p className="quick-answer-q mt-3 text-[16px] font-semibold text-ink md:text-[17px]">What is the Leadkaun Morning Brief?</p>
              <p className="quick-answer-a mt-3 text-[16px] leading-[1.75] text-ink-soft">
                It&apos;s a daily email sent at <Chip>8:30 AM IST</Chip>, Monday to Saturday. Each rep gets their <Chip tone="mint">top Grade A leads</Chip>, the <Chip tone="warn">₹ at risk today</Chip>, overdue follow-ups, and one clear action; managers get a per-rep rollup of the same numbers. It exists so the day starts from the scoring, not from whoever shouts loudest at stand-up.
              </p>
            </div>
          </Container>
        </SectionGround>

        {/* 02 — REP VS MANAGER */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="02" tone="warm" label="Two briefs" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Same data. Written for who&apos;s reading it.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                A rep needs a to-do list. A manager needs a map of the floor. Both come from the same scoring engine, framed for the job in front of them.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2">
              <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"><Mail className="h-4 w-4" /></span>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-600">Rep brief</p>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {["Top 5 Grade A leads to call today", "₹ at risk today, framed as recovery", "Follow-ups going overdue", "One primary action, open the queue"].map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-[14px] leading-snug text-ink-soft"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{t}</li>
                  ))}
                </ul>
              </FloatingCard>
              <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-50 text-sky-600 ring-1 ring-sky-100"><Users className="h-4 w-4" /></span>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-600">Manager brief</p>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {["Per-rep ₹ at risk rollup", "Grade A count and follow-up score by rep", "Top stale leads across the floor", "Which metrics appear is yours to pick"].map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-[14px] leading-snug text-ink-soft"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />{t}</li>
                  ))}
                </ul>
              </FloatingCard>
            </Reveal>
          </Container>
        </SectionGround>

        {/* 03 — SAME TIME, EVERY DAY (text left, week strip right) */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <NumberedTag number="03" label="Consistency is the feature" />
                <h2 className="mt-5 text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[38px]">
                  A habit only forms if it&apos;s never late.
                </h2>
                <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
                  The value isn&apos;t the email; it&apos;s that it arrives at the same minute every working day. Reps stop asking &ldquo;where do I start,&rdquo; because the answer is already in their inbox. Sunday is off by default, with a toggle for teams that work it.
                </p>
              </div>
              <Reveal delay={0.06}>
                <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-8">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">This week&apos;s sends · 8:30 AM IST</p>
                  <div className="mt-5 grid grid-cols-7 gap-2">
                    {[["Mon", true], ["Tue", true], ["Wed", true], ["Thu", true], ["Fri", true], ["Sat", true], ["Sun", false]].map(([d, on]) => (
                      <div key={String(d)} className="text-center">
                        <div className={`grid h-11 place-items-center rounded-xl ring-1 ${on ? "bg-sky-50 ring-sky-200" : "bg-white/50 ring-black/5"}`}>
                          {on ? <Mail className="h-4 w-4 text-sky-600" /> : <span className="text-[11px] text-ink-faint">off</span>}
                        </div>
                        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">{d}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 border-t pt-4 text-[12.5px] leading-snug text-ink-muted rule-paper">Six sends, same time, no gaps. That is what turns scoring into a routine instead of a login someone forgets.</p>
                </FloatingCard>
              </Reveal>
            </div>
          </Container>
        </SectionGround>

        {/* 04 — THE NUMBERS */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-10 max-w-3xl">
              <NumberedTag number="04" label="The shape of it" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Predictable on purpose.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3">
              {BRIEF_STATS.map((m, i) => (
                <FloatingCard key={m.l} tier="2" depth="2" gloss aura={i === 1 ? "peach" : "sky"} className="p-6">
                  <div className="font-mono text-[34px] font-semibold tracking-[-0.025em] tabular text-ink">{m.v}</div>
                  <p className="mt-2 text-[13px] font-semibold text-ink">{m.l}</p>
                  <p className="mt-1 text-[12px] text-ink-muted">{m.h}</p>
                </FloatingCard>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* 05 — IN THEIR WORDS (illustrative placeholders, not real customer statements) */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-2xl">
              <NumberedTag number="05" tone="warm" label="In their words" />
              <h2 className="display-md mt-5 text-[30px] text-ink md:text-[40px]">
                The morning argument was always about where to start.
              </h2>
            </Reveal>
            <Reveal delay={0.08}><Voices /></Reveal>
          </Container>
        </SectionGround>

        {/* 06 — FAQ */}
        <SectionGround variant="pure" size="md">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <div className="flex justify-center"><NumberedTag number="06" label="FAQ" /></div>
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">Brief questions.</h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={FAQ} /></Reveal>
          </Container>
        </SectionGround>

        {/* 07 — WORKS WITH */}
        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="mb-10">
              <NumberedTag number="07" tone="warm" label="Works with" />
              <h2 className="mt-5 max-w-3xl text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">
                The brief is the delivery. Here&apos;s what fills it.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3 md:gap-6">
              {RELATED.map((r, i) => <FeatureCard key={r.href} {...r} variant={i % 2 === 1 ? "soft" : "default"} />)}
            </Reveal>
          </Container>
        </SectionGround>

        {/* PROOF — product-mechanics stat tiles */}
        <SectionGround variant="pure" size="md">
          <Container>
            <Reveal className="mb-7 text-center">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Product mechanics, published in full at{" "}
                <Link href="/methodology" className="text-sky-600 hover:underline">/methodology</Link>
              </p>
            </Reveal>
            <Reveal delay={0.06} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PROOF.map(({ Icon, stat, label }) => (
                <FloatingCard key={stat} tier="2" depth="2" gloss aura="sky" className="p-6 text-center">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100"><Icon className="h-5 w-5" strokeWidth={2} /></span>
                  <p className="mt-4 text-[26px] font-semibold tracking-[-0.02em] text-ink md:text-[30px]">{stat}</p>
                  <p className="mt-1.5 text-[13px] leading-snug text-ink-soft">{label}</p>
                </FloatingCard>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* CLOSING CTA */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-4xl">
              <div className="relative overflow-hidden rounded-3xl border p-10 text-center md:p-14" style={{ borderColor: "var(--paper-line)", background: "linear-gradient(180deg,#FFFFFF, var(--paper))" }}>
                <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-96 rounded-full opacity-30 blur-[110px]" style={{ background: "radial-gradient(circle,#BAE6FD 0%,transparent 70%)" }} />
                <p className="ledger-num relative text-[11px] uppercase tracking-[0.22em] text-sky-600">08 · Ready when you are</p>
                <h2 className="display-lg relative mx-auto mt-5 max-w-2xl text-[30px] text-ink md:text-[44px]">
                  Start tomorrow{" "}
                  <span className="relative inline-block text-sky-600">
                    at 8:30 AM.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h2>
                <p className="relative mx-auto mt-6 max-w-xl text-[16px] leading-[1.7] text-ink-soft">
                  Import your leads today. The first Morning Brief lands in every rep&apos;s inbox tomorrow at 8:30, with the day already sorted.
                </p>
                <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
                    Start free <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="/pricing" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)" }}>
                    See pricing
                  </Link>
                </div>
                <p className="ledger-num relative mt-8 text-[11.5px] uppercase tracking-[0.16em] text-ink-muted">Free ₹0 · no card · same-day setup</p>
              </div>
            </Reveal>
          </Container>
        </SectionGround>

        <Footer />
      </main>
    </>
  )
}
