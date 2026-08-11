import Link from "next/link"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { GraduationCap, Gauge, ListOrdered, MessageCircle, AlertTriangle, Mail, Upload, History, Users, ArrowRight, Sparkles, IndianRupee, Clock, CalendarClock, type LucideIcon } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FloatingCard } from "@/app/components/floating-card"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { GradeBadge } from "@/app/components/demo/primitives"
import { AppReplica } from "@/app/components/app-replica"
import { Voices } from "@/app/components/voices"
import type { Grade } from "@/lib/demo-app"
import { faqPageSchema, breadcrumbListSchema, jsonLdScript, ogMeta } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

const title = "EdTech Lead Management India, score & prioritise student enquiries"
const description =
  "EdTech admissions teams run on WhatsApp parent threads and seasonal cycles. Leadkaun grades every enquiry A–F, builds a Priority Queue per counsellor, and surfaces the ₹ fees at risk, the whole platform, built for admissions."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/use-cases/edtech" },
  ...ogMeta({ title, description, path: "/use-cases/edtech" }),
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

// Illustrative admissions queue for the hero (sample data, real grading logic).
const HERO_QUEUE: { grade: Grade; name: string; meta: string; tag: string; next?: boolean }[] = [
  { grade: "A", name: "Kavya Nair · parent", meta: "B.Tech CSE · fee ₹4.8L", tag: "Asked fees on WhatsApp", next: true },
  { grade: "A", name: "Rohan Menon", meta: "MBA · fee ₹9L", tag: "Booked campus visit" },
  { grade: "B", name: "Sharma family", meta: "PG Diploma · fee ₹2.2L", tag: "“Discuss with spouse”" },
  { grade: "C", name: "Aisha Khan", meta: "BBA · fee ₹1.4L", tag: "Downloaded brochure" },
]

const STATS = [
  { Icon: IndianRupee, label: "Annual fee band", value: "₹15k – ₹15L" },
  { Icon: CalendarClock, label: "Enquiry-to-enrolment", value: "3 – 120 days" },
  { Icon: MessageCircle, label: "Where it happens", value: "WhatsApp parent threads" },
]

const PAINS = [
  { n: "01", title: "400 enquiries, one counsellor.", body: "In peak season a single counsellor carries 200–500 open enquiries. The first 30 minutes each morning vanish into scrolling and deciding who to call. In a flat list, the serious April parent and the casual brochure-collector look identical." },
  { n: "02", title: "Parent threads drop mid-conversation.", body: "A parent says “let me discuss with my spouse,” goes quiet, and the counsellor, juggling hundreds of chats, forgets to circle back. The one follow-up that would have secured the seat never goes out. The enquiry doesn’t say no; it just goes cold." },
  { n: "03", title: "Admissions cycles are ₹-sensitive.", body: "A Grade A lead in April is near-worthless by September, once the cohort fills. Miss the window on a serious parent and that’s ₹50k–₹5L of annual fee gone to a competitor. In admissions, timing beats effort every time." },
]

// The whole platform, each module mapped to what it does for admissions.
const FEATURES: { Icon: LucideIcon; title: string; body: string; href: string }[] = [
  { Icon: Gauge, title: "Lead Scoring", body: "Every enquiry graded A–F on course fit, plus intent and quality signals from both student and parent, so the admission-seeker rises above the brochure-collector.", href: "/features/lead-scoring" },
  { Icon: ListOrdered, title: "Priority Queue", body: "One ranked list per counsellor: the Grade A parents who replied overnight, at the top, so 11 AM calls land on hot leads, not whoever enquired first.", href: "/features/priority-queue" },
  { Icon: MessageCircle, title: "WhatsApp Tracking", body: "3-tap logging on the long parent threads where admissions actually happen, stage, intent, outcome, feeding the score without leaving the chat.", href: "/features/whatsapp-tracking" },
  { Icon: AlertTriangle, title: "Missed Opportunity Engine", body: "Resurfaces the “discuss with spouse” parents who dropped mid-thread, with the ₹ fee at stake attached, so promising enquiries don’t die of forgetfulness.", href: "/features/missed-opportunity-engine" },
  { Icon: Mail, title: "Morning Brief", body: "Lands before the day starts: “8 Grade A enquiries replied overnight, ₹6L in admissions at risk if not called by 11 AM.” The whole floor sees the same number.", href: "/features/morning-brief" },
  { Icon: Upload, title: "Intake Intelligence", body: "Check a bought enquiry list, valid phones, duplicates, B2C-vs-genuine, before a counsellor burns a week dialling a bad file.", href: "/features/intake-intelligence" },
  { Icon: History, title: "Score Evolution", body: "Why a keen April parent slid to Grade C by June: the append-only timeline names the cause, usually intent decay against the admissions calendar.", href: "/features/score-evolution" },
  { Icon: Users, title: "Counsellor Tracking", body: "Per-counsellor ₹ enrolled, Grade A response time, follow-ups kept, outcomes, not call-counts, so you coach the process, not the person.", href: "/features/sales-rep-tracking" },
]

const INSIGHT =
  "India is one of the world’s largest e-learning markets, with the edtech sector valued in the billions of dollars and projected to keep growing through the decade (IBEF). Course enquiries arrive in bulk from paid ads and referrals but vary wildly in intent, and most of the serious conversation now happens in long WhatsApp threads with fee-paying parents. Counselling teams that grade every enquiry, call the serious ones first, and follow up before the cohort fills simply enrol more of them."

const FAQ = [
  { q: "Does it handle the parent + student dual thread?", a: "Yes. Each lead record holds a primary and secondary contact, student and parent, and 3-tap WhatsApp logging records who replied and when. The Intent Score aggregates signals across both, so a keen student with a hesitant fee-paying parent reads differently from one where the parent is already sold." },
  { q: "Can we set a different ICP per course?", a: "Yes. You can define a distinct ideal-customer profile per course, because what makes a strong engineering enquiry differs from an arts or PG enquiry. The scoring weights themselves are fixed and transparent across the board; what you configure is your ICP, not the underlying maths, so grades stay comparable and auditable between counsellors." },
  { q: "Does it integrate with our LMS / SIS?", a: "Not natively in Phase 1. Leadkaun runs alongside your existing stack as the enquiry-to-enrolment layer rather than replacing your SIS. Export enrolled leads to CSV for your SIS today, with deeper integrations on the roadmap." },
  { q: "What about offline / walk-in admissions?", a: "Manual entry takes a few seconds, and the walk-in enters the Priority Queue immediately, graded in real time alongside your online enquiries, so an offline admission never sits forgotten in a separate register no one checks." },
  { q: "How does it handle seasonality?", a: "Intent decay is tied to the admissions calendar rather than a flat clock, so a lead’s urgency reflects how close you are to cohort close. You tell Leadkaun your cycle and the default Indian EdTech admissions cycle is supported out of the box; the scoring weights stay fixed, it’s the timing context that adapts." },
]

const CITIES = [
  { city: "Bengaluru", href: "/edtech/bengaluru" },
  { city: "Mumbai", href: "/edtech/mumbai" },
  { city: "Delhi", href: "/edtech/delhi" },
  { city: "Pune", href: "/edtech/pune" },
  { city: "Hyderabad", href: "/edtech/hyderabad" },
  { city: "Chennai", href: "/edtech/chennai" },
]

export default function EdTechPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Use cases", url: "/use-cases" }, { name: "EdTech" }]), faqPageSchema(FAQ)]) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        {/* HERO — split, live admissions queue right */}
        <section className="relative overflow-hidden border-b rule-paper" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, var(--paper) 100%)" }}>
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-[460px] w-[620px] rounded-full opacity-[0.30] blur-[130px]" style={{ background: "radial-gradient(circle, #BAE6FD 0%, transparent 70%)" }} />
          <Container className="relative pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div className="rise" style={{ animationDelay: "40ms" }}>
                <p className="ledger-num inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-sky-600">
                  <GraduationCap className="h-3.5 w-3.5" strokeWidth={2} /> Use case · EdTech
                </p>
                <h1 className="display-xl mt-6 text-[40px] text-ink sm:text-[52px] lg:text-[58px]">
                  Score every enquiry
                  <br />
                  <span className="relative inline-block text-sky-600">
                    before it cools.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h1>
                <p className="mt-7 max-w-xl text-[17px] leading-[1.7] text-ink-soft md:text-[18px]">
                  EdTech admissions teams run on WhatsApp parent threads and seasonal cycles. Leadkaun grades every enquiry, tracks every reply, and surfaces the 8 parents each counsellor should call first, every morning, with the ₹ fees at risk attached.
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

              {/* Live admissions queue */}
              <div className="rise" style={{ animationDelay: "160ms" }}>
                <FloatingCard tier="2" depth="3" gloss aura="sky" className="mx-auto max-w-md p-5 md:p-6">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Admissions queue · today</p>
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
                  <p className="mt-3.5 text-[12px] leading-snug text-ink-muted">Re-ranks as parents reply and the cohort fills, so the top is always the next enrolment to save.</p>
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

        {/* 01 — THE PLATFORM (AppReplica) */}
        <SectionGround variant="sky" size="lg" id="platform">
          <Container>
            <Reveal className="mb-8 max-w-3xl">
              <NumberedTag number="01" label="The platform, live" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                This is the actual admissions console.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Not a video, the real product. Open a lead, log a WhatsApp reply, and watch the enquiry re-grade and climb the queue underneath you. This is what your counselling floor works in every day.
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
              <p className="quick-answer-q mt-3 text-[16px] font-semibold text-ink md:text-[17px]">How does Leadkaun help EdTech admissions teams in India?</p>
              <p className="quick-answer-a mt-3 text-[16px] leading-[1.75] text-ink-soft">
                It grades every student enquiry <Chip>A–F</Chip> on course fit, student and parent intent, and quality, then builds a <Chip tone="mint">Priority Queue</Chip> per counsellor so the Grade A parents who replied overnight get called first. <Chip>3-tap WhatsApp logging</Chip> captures the long parent threads, and intent decay follows the <Chip tone="warn">admissions calendar</Chip>, so a serious April parent never goes cold before the cohort fills. It runs alongside your SIS, not instead of it.
              </p>
            </div>
          </Container>
        </SectionGround>

        {/* 02 — THE PROBLEM */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="02" tone="warm" label="Why admissions teams lose seats" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Three patterns we see every season.
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

        {/* 03 — EVERY FEATURE, FOR ADMISSIONS */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="03" label="The whole platform, for admissions" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Eight modules. Every one tuned to the enquiry-to-enrolment funnel.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Leadkaun isn&apos;t a lighter CRM, it&apos;s the lead-intelligence layer that sits on top of your SIS. Here&apos;s what each part does for a counselling floor.
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

        {/* 04 — INDUSTRY BENCHMARK */}
        <SectionGround variant="sky" size="md">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <FloatingCard tier="2" depth="2" gloss aura="sky" className="p-8 md:p-10">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600">Industry benchmark</p>
                <p className="mt-3 text-[20px] font-medium leading-[1.45] text-ink md:text-[23px]">{INSIGHT}</p>
                <p className="mt-4 text-[13px] text-ink-muted">Leadkaun doesn&apos;t replace your CRM or SIS, it&apos;s the layer that turns a chaotic enquiry list into a ranked queue with a ₹ figure attached to the admissions you&apos;re about to lose.</p>
              </FloatingCard>
            </Reveal>
          </Container>
        </SectionGround>

        {/* 05 — IN THEIR WORDS (illustrative placeholders, not real customer statements) */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-2xl">
              <NumberedTag number="05" tone="warm" label="In their words" />
              <h2 className="display-md mt-5 text-[30px] text-ink md:text-[40px]">
                The seat wasn&apos;t lost on price. It was lost on a follow-up nobody sent.
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
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">Admissions questions.</h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={FAQ} /></Reveal>
          </Container>
        </SectionGround>

        {/* 07 — BY CITY */}
        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="mb-8">
              <NumberedTag number="07" tone="warm" label="EdTech by city" />
              <h2 className="mt-5 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[32px]">
                Localised pages for top admissions markets.
              </h2>
            </Reveal>
            <div className="flex flex-wrap gap-2.5">
              {CITIES.map((c) => (
                <Link key={c.href} href={c.href} className="inline-flex items-center rounded-full glass-1 gloss-edge px-4 py-2 text-[13px] font-medium text-ink-soft transition-all hover:text-sky-600 lift">
                  {c.city}
                </Link>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/features/whatsapp-tracking" className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-600 hover:text-sky-500">
                See how WhatsApp tracking works <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Container>
        </SectionGround>

        {/* CLOSING CTA */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-4xl">
              <div className="relative overflow-hidden rounded-3xl border p-10 text-center md:p-14" style={{ borderColor: "var(--paper-line)", background: "linear-gradient(180deg,#FFFFFF, var(--paper))" }}>
                <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-96 rounded-full opacity-30 blur-[110px]" style={{ background: "radial-gradient(circle,#BAE6FD 0%,transparent 70%)" }} />
                <p className="ledger-num relative text-[11px] uppercase tracking-[0.22em] text-sky-600">Ready when you are</p>
                <h2 className="display-lg relative mx-auto mt-5 max-w-2xl text-[30px] text-ink md:text-[44px]">
                  Fill the batch{" "}
                  <span className="relative inline-block text-sky-600">
                    before the cohort closes.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h2>
                <p className="relative mx-auto mt-6 max-w-xl text-[16px] leading-[1.7] text-ink-soft">
                  Import your enquiries. Leadkaun grades every one and hands each counsellor a ranked queue the same day, with the ₹ fees at risk on top.
                </p>
                <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
                    Start free trial <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="/pricing" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)" }}>
                    See pricing
                  </Link>
                </div>
                <p className="ledger-num relative mt-8 text-[11.5px] uppercase tracking-[0.16em] text-ink-muted">Free ₹0 · no card · same-day setup · runs alongside your SIS</p>
              </div>
            </Reveal>
          </Container>
        </SectionGround>

        <Footer />
      </main>
    </>
  )
}
