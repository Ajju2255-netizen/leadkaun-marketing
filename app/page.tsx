import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight, Check } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import { Container } from "@/app/components/container"
import { Reveal } from "@/app/components/reveal"
import { Faq } from "@/app/components/faq"
import { AppReplica } from "@/app/components/app-replica"
import { Voices } from "@/app/components/voices"
import { APP_URLS } from "@/lib/urls"
import { faqPageSchema, jsonLdScript } from "@/lib/seo"

export const metadata: Metadata = {
  title: { absolute: "Lead Management Software for Indian B2B Sales Teams | Leadkaun" },
  description:
    "Leadkaun is lead management software for Indian B2B teams, grade every lead A–F, build each rep's Priority Queue, and surface missed revenue in ₹. Lead scoring, lead tracking and sales CRM in one place. Runs alongside your CRM. Start free.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Leadkaun, Lead Management Software for Indian B2B Teams",
    description:
      "Grade every lead A–F, work a live Priority Queue, and recover missed revenue in ₹. Lead management and lead tracking software that tells reps who to call next. Start free.",
    url: "/",
    type: "website",
  },
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOMEPAGE, "THE LEDGER"

   The product decides an ORDER: who a rep calls next, ranked A–F, with the
   rupees at stake. Its native artefact is a register, so the page is built as
   one: display serif for authority, monospace for every figure, hairline rules,
   and the grade chip repeating from hero to close.

   Two ink anchors (hero, closing band) bracket a warm paper body. Section order
   answers the buyer's questions in the order they are actually asked:
   what breaks → what we do → how the grade works → what it costs → objections.
   ═══════════════════════════════════════════════════════════════════════════ */

const GRADE_BG: Record<string, string> = {
  A: "linear-gradient(180deg,#6EE7B7,#10B981)",
  B: "linear-gradient(180deg,#38BDF8,#0EA5E9)",
  C: "linear-gradient(180deg,#FDBA74,#FB923C)",
  D: "linear-gradient(180deg,#FDBA74,#F97316)",
}

function Grade({ g }: { g: string }) {
  return <span className="grade-chip" style={{ background: GRADE_BG[g] ?? "linear-gradient(180deg,#CBD5E1,#94A3B8)" }}>{g}</span>
}

/* Rank, name, grade, why it sits there, rupees at stake. Illustrative of the
   mechanism. No customer is named and no outcome is claimed. */
const QUEUE = [
  { rank: "01", who: "Sharma Textiles",    city: "Surat",     g: "A", why: "Replied on WhatsApp · 14 min ago", val: "₹ 6,40,000" },
  { rank: "02", who: "Meridian Interiors", city: "Bengaluru", g: "A", why: "Asked for pricing · 2 h ago",      val: "₹ 4,10,000" },
  { rank: "03", who: "Kalyani Motors",     city: "Pune",      g: "B", why: "Callback due today",               val: "₹ 2,75,000" },
  { rank: "04", who: "Anand Polymers",     city: "Vadodara",  g: "B", why: "Site visit booked",                val: "₹ 1,95,000" },
  { rank: "05", who: "Deccan Logistics",   city: "Hyderabad", g: "C", why: "Went quiet · intent decaying",     val: "₹ 88,000" },
]

const BREAKS = [
  {
    n: "01",
    head: "The best lead is not the newest one",
    body: "Enquiries arrive from IndiaMART, a website form, a hoarding, a referral and three different WhatsApp numbers. The inbox sorts them by arrival time, so that is the order they get called in. Arrival time is not a measure of anything.",
  },
  {
    n: "02",
    head: "Nobody notices a good lead going cold",
    body: "A rep gets busy and a strong enquiry slips down the screen. There is no moment where it turns red. It simply stops being visible, and three weeks later nobody remembers it existed.",
  },
  {
    n: "03",
    head: "Monday review argues about effort",
    body: "Activity reports count calls, so the meeting becomes a debate about how hard people worked. The question worth asking did we call the right leads first, is not on the sheet.",
  },
]

const MOVES = [
  { k: "Grade",   t: "Every lead scored the moment it lands", d: "Three independent 0–100 reads, Fit against the customer profile you set, Intent from live signals, Quality from whether the record can be trusted, combine into one letter." },
  { k: "Rank",    t: "One list per rep, re-ordering itself",  d: "The queue re-ranks as signals arrive and sinks leads whose intent has decayed. A rep opens it and works top-down. There is no triage step." },
  { k: "Recover", t: "The money still on the table, in ₹",    d: "Stale leads carry a rupee value and roll up daily, so a manager opens the morning on a number rather than a feeling." },
]

/* The published mechanism — the site's strongest first-party evidence, because
   committing to fixed weights is something competitors do not do. */
const SCORES = [
  { tag: "Fit",     range: "0–100", body: "Industry, state, business type, decision-maker role and budget band, the profile you configure." },
  { tag: "Intent",  range: "0–100", body: "Source strength plus signal events. Decays as a lead goes quiet, floored at where it started." },
  { tag: "Quality", range: "0–100", body: "Phone and email validity, completeness, duplicates. Caps the grade rather than averaging into it." },
]

const THRESHOLDS = [
  { k: "Grade A", v: "Fit ≥ 65 · Intent ≥ 60 · Quality ≥ 60" },
  { k: "F guard", v: "Quality < 20 forces F, always" },
  { k: "Decay",   v: "−3 / day after 28 days of silence" },
  { k: "Weights", v: "Fixed and identical for every account" },
]

const MODULES = [
  { t: "Lead Scoring",        d: "A–F in real time, on published weights.",       href: "/features/lead-scoring" },
  { t: "Priority Queue",      d: "One ranked list per rep. No sorting.",          href: "/features/priority-queue" },
  { t: "Missed Opportunity",  d: "Stale leads, priced in rupees, daily.",         href: "/features/missed-opportunity-engine" },
  { t: "Morning Brief",       d: "8:30 AM IST. The day's top five and the risk.", href: "/features/morning-brief" },
  { t: "WhatsApp Tracking",   d: "Log an exchange in a few taps; it scores.",     href: "/features/whatsapp-tracking" },
  { t: "Intake Intelligence", d: "Read a lead list before you import it.",        href: "/features/intake-intelligence" },
  { t: "Score Evolution",     d: "Why a grade moved, frozen at each change.",     href: "/features/score-evolution" },
  { t: "Rep Tracking",        d: "Whether the queue is actually being worked.",   href: "/features/sales-rep-tracking" },
]

const ALONGSIDE = [
  { crm: "Records what happened",                    lk: "Decides what happens next" },
  { crm: "A single opaque lead score",               lk: "Three visible scores and a published threshold" },
  { crm: "Good leads age out unnoticed",             lk: "Intent decays, so the queue stays honest" },
  { crm: "Priority is whatever the rep last opened", lk: "One ranked list, re-ordering as signals land" },
  { crm: "Reviews argue about activity",             lk: "Reviews open on the rupees at risk" },
]

const INDUSTRIES = [
  { n: "Real estate", h: "/use-cases/real-estate" }, { n: "EdTech & admissions", h: "/use-cases/edtech" },
  { n: "BFSI", h: "/use-cases/bfsi" }, { n: "Manufacturing", h: "/use-cases/manufacturing" },
  { n: "Healthcare", h: "/use-cases/healthcare" }, { n: "B2B SaaS", h: "/use-cases/saas" },
  { n: "Agencies", h: "/use-cases/agencies" }, { n: "Retail & distribution", h: "/use-cases/retail" },
]

const TIERS = [
  { name: "Free",    price: "₹0",      note: "1 seat · 100 active leads", cta: "Start free" },
  { name: "Starter", price: "₹2,999",  note: "10 seats · 5,000 leads",    cta: "Start free" },
  { name: "Growth",  price: "₹7,999",  note: "30 seats · 25,000 leads",   cta: "Start free", feature: true },
  { name: "Scale",   price: "₹19,999", note: "75 seats · unlimited",      cta: "Talk to us" },
]

const HOME_FAQ = [
  { q: "How is Leadkaun different from a CRM?", a: "A CRM records what happened. Leadkaun decides what happens next, grading every lead, building a Priority Queue that re-ranks in real time, and surfacing missed revenue in rupees. It runs alongside your CRM rather than replacing it, and most teams keep both." },
  { q: "How long does setup take?", a: "You can go live the same day, from signup to your first Grade A lead in the queue. The onboarding wizard uses pre-configured ICP defaults across a range of Indian B2B verticals, so you do not need to define your customer profile from scratch." },
  { q: "Do I need to import all my historical leads?", a: "No, and we recommend you do not. Import only the live leads, roughly the last 90 days of activity. Stale data pollutes the grade distribution, and Leadkaun will tell you what is in a file before you import it." },
  { q: "Does it handle WhatsApp?", a: "As a first-class signal. Reps open the chat from Leadkaun, have the conversation in their own WhatsApp, then record the outcome in a few taps, which feeds the Intent Score. It is manual capture rather than a Business API integration, and we would rather say so plainly." },
  { q: "What happens if a rep leaves?", a: "Ownership transfers with the history intact, lead records, logged conversations and follow-up schedules move to the new owner. The pipeline does not leave with the person." },
  { q: "Can I see why a lead's grade changed?", a: "Yes. Every score change is written to an append-only timeline with the grade, confidence and all three sub-scores frozen at that moment, so a drop traces back to the event that caused it rather than looking like a glitch." },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg-pure">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([faqPageSchema(HOME_FAQ)]) }} />
      <Navbar />

      <Hero />
      <Thesis />
      <ProductDemo />
      <WhatBreaks />
      <ThreeMoves />
      <TheGrade />
      <Modules />
      <Alongside />
      <Industries />
      <InTheirWords />
      <Pricing />
      <FaqBlock />
      <CloseBand />

      <Footer />
    </main>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   HERO, ink anchor. The ledger IS the hero image.
   ───────────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden border-b rule-paper" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, var(--paper) 100%)" }}>
      {/* A single soft wash, low-saturation. No competing colour fields. */}
      <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-[460px] w-[620px] rounded-full opacity-[0.30] blur-[130px]" style={{ background: "radial-gradient(circle, #BAE6FD 0%, transparent 70%)" }} />

      {/* Hero banner — sits on the right half. Only a narrow left edge is
          feathered into the cream ground so the photo stays crisp and full;
          gentle top/bottom fades melt it into the section. Decorative. */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-1/2 overflow-hidden lg:block">
        <img
          src="/brand/hero-portrait.webp"
          alt=""
          className="h-full w-full object-cover object-[78%_42%]"
          style={{
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 13%, #000 28%)",
            maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 13%, #000 28%)",
          }}
        />
        {/* gentle feathering into the white section top and the paper bottom */}
        <div className="absolute inset-x-0 top-0 h-16" style={{ background: "linear-gradient(to bottom, #FFFFFF 0%, rgba(255,255,255,0) 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 h-20" style={{ background: "linear-gradient(to top, var(--paper) 0%, rgba(252,250,246,0) 100%)" }} />
      </div>

      <Container className="relative pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="relative z-10 max-w-2xl lg:max-w-[500px] xl:max-w-[560px]">

          <div className="rise" style={{ animationDelay: "40ms" }}>
            <p className="ledger-num text-[11px] uppercase tracking-[0.22em] text-sky-600">
              Lead management software · India
            </p>

            <h1 className="display-xl mt-6 text-[42px] text-ink sm:text-[54px] lg:text-[64px]">
              Your reps have
              <br />
              enough leads.
              <br />
              <span className="relative inline-block text-sky-600">
                They need the order.
                <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-[17px] leading-[1.7] text-ink-soft md:text-[18px]">
              Leadkaun grades every lead A–F, ranks one queue per rep, and prices the revenue
              going cold, so the next call is decided before anyone opens a screen. It runs
              alongside the CRM you already have.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href={APP_URLS.register}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5"
                style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}
              >
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/demo" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)", color: "var(--ink)" }}>
                Book a walkthrough
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5">
              {["Live the same day", "Free tier, no card", "Runs alongside your CRM"].map((t) => (
                <li key={t} className="flex items-center gap-2 text-[14px] text-ink-soft">
                  <Check className="h-3.5 w-3.5 text-sky-500" strokeWidth={3} />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Banner image on mobile — a blended card beneath the copy, since the
              full-bleed desktop version is hidden below lg. */}
          <div className="rise relative mt-12 overflow-hidden rounded-2xl lg:hidden" style={{ animationDelay: "180ms", boxShadow: "0 26px 60px -34px rgba(15,23,42,0.28)" }}>
            <img src="/brand/hero-portrait.webp" alt="" className="h-60 w-full object-cover object-[68%_45%] sm:h-72" />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-20" style={{ background: "linear-gradient(to top, var(--paper) 0%, rgba(252,250,246,0) 100%)" }} />
            <div aria-hidden className="absolute inset-0 opacity-[0.12] mix-blend-soft-light" style={{ background: "linear-gradient(115deg, #0EA5E9 0%, transparent 55%, #FB923C 100%)" }} />
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   THESIS, one oversized claim on paper. Breathing room after the ink.
   ───────────────────────────────────────────────────────────────────────── */
function Thesis() {
  return (
    <section className="relative overflow-hidden grain" style={{ background: "var(--paper)" }}>
      <Container className="relative py-24 md:py-32">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="ledger-num text-[11px] uppercase tracking-[0.24em] text-ink-muted">The whole idea</p>
          <p className="display-lg mt-7 text-[30px] text-ink sm:text-[40px] md:text-[50px]">
            Pipeline problems look like a shortage of leads.
            <br className="hidden sm:block" />
            <span className="text-ink-soft"> They are almost always a </span>
            <span className="relative inline-block">
              problem of order
              <span aria-hidden className="absolute -bottom-1.5 left-0 h-[6px] w-full rounded-full" style={{ background: "linear-gradient(90deg,#FDBA74,#0EA5E9)" }} />
            </span>
            <span className="text-ink-soft">.</span>
          </p>
        </Reveal>
      </Container>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   THE PRODUCT ITSELF. Not a screenshot and not an illustration: the real
   app's shell, sidebar and screens, rebuilt with sample data so a visitor
   can click through what they would actually sign in to.
   ───────────────────────────────────────────────────────────────────────── */
function ProductDemo() {
  return (
    <section className="relative bg-bg-pure py-10 md:py-14">
      <Container>
        <Reveal className="mx-auto mb-5 max-w-3xl text-center md:mb-6">
          <p className="ledger-num text-[11px] uppercase tracking-[0.24em] text-sky-600">The product</p>
          <h2 className="display-md mt-4 text-[27px] text-ink md:text-[34px]">
            This is the whole thing. Have a look around.
          </h2>
          <p className="mt-3 text-[15.5px] leading-[1.6] text-ink-soft">
            The screens below are the ones you sign in to, on sample data. Move between them with
            the sidebar. Every name and rupee figure is invented for the demo.
          </p>
        </Reveal>
      </Container>

      <div className="mx-auto w-full max-w-[1360px] px-6 md:px-8">
        <Reveal delay={0.08}>
          <AppReplica />
        </Reveal>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   WHAT BREAKS, ledger rows, not cards. Numbered, ruled, asymmetric.
   ───────────────────────────────────────────────────────────────────────── */
function WhatBreaks() {
  return (
    <section className="relative bg-bg-pure">
      <Container className="py-20 md:py-28">
        <Reveal className="mb-12 max-w-2xl md:mb-16">
          <p className="ledger-num text-[11px] uppercase tracking-[0.24em] text-sky-600">01 · What actually breaks</p>
          <h2 className="display-md mt-5 text-[30px] text-ink md:text-[40px]">
            Three failures, none of which show up on an activity report.
          </h2>
        </Reveal>

        <div className="border-t rule-paper">
          {BREAKS.map((b, i) => (
            <Reveal key={b.n} delay={0.06 * i}>
              <div className="grid gap-4 border-b py-8 rule-paper md:grid-cols-[auto_minmax(0,22rem)_1fr] md:gap-10 md:py-10">
                <span className="ledger-num text-[13px] text-ink-faint md:pt-1.5">{b.n}</span>
                <h3 className="display-md text-[21px] text-ink md:text-[25px]">{b.head}</h3>
                <p className="max-w-2xl text-[15.5px] leading-[1.72] text-ink-soft md:text-[16.5px]">{b.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   THREE MOVES, what the product does, in the order it does it.
   ───────────────────────────────────────────────────────────────────────── */
function ThreeMoves() {
  return (
    <section className="relative overflow-hidden grain" style={{ background: "var(--paper)" }}>
      <Container className="relative py-20 md:py-28">
        <Reveal className="mb-12 max-w-2xl md:mb-16">
          <p className="ledger-num text-[11px] uppercase tracking-[0.24em] text-orange-500">02 · What Leadkaun does</p>
          <h2 className="display-md mt-5 text-[30px] text-ink md:text-[40px]">Grade it. Rank it. Recover it.</h2>
        </Reveal>

        <div className="grid gap-px overflow-hidden rounded-2xl md:grid-cols-3" style={{ background: "var(--paper-line)" }}>
          {MOVES.map((m, i) => (
            <Reveal key={m.k} delay={0.07 * i} className="h-full">
              <div className="flex h-full flex-col p-7 md:p-8" style={{ background: "var(--paper)" }}>
                <span className="ledger-num text-[11px] uppercase tracking-[0.2em] text-sky-600">{m.k}</span>
                <h3 className="display-md mt-4 text-[20px] text-ink md:text-[23px]">{m.t}</h3>
                <p className="mt-3.5 text-[15px] leading-[1.7] text-ink-soft">{m.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   THE GRADE, publish the mechanism. Competitors structurally cannot copy
   this, because doing so means committing to fixed weights.
   ───────────────────────────────────────────────────────────────────────── */
function TheGrade() {
  return (
    <section className="relative bg-bg-pure">
      <Container className="py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <Reveal>
            <p className="ledger-num text-[11px] uppercase tracking-[0.24em] text-sky-600">03 · The grade</p>
            <h2 className="display-md mt-5 text-[30px] text-ink md:text-[40px]">
              We publish the weights. That is the whole argument.
            </h2>
            <p className="mt-6 max-w-lg text-[16px] leading-[1.7] text-ink-soft">
              A grade a rep cannot interrogate is a grade a rep ignores. So the thresholds are
              fixed, identical for every account, and printed here, which means two managers
              comparing notes are reading the same scale.
            </p>
            <Link href="/methodology" className="mt-7 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-sky-600 hover:text-sky-500">
              Read the full methodology <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="mt-9 flex flex-wrap gap-2">
              {["A", "B", "C", "D", "F"].map((g) => (
                <span key={g} className="flex items-center gap-2 rounded-full border px-3 py-1.5 rule-paper">
                  <Grade g={g} />
                  <span className="ledger-num text-[12px] text-ink-soft">grade {g}</span>
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="grid gap-px overflow-hidden rounded-2xl border rule-paper" style={{ background: "var(--paper-line)" }}>
              {SCORES.map((s) => (
                <div key={s.tag} className="bg-bg-pure p-6 md:p-7">
                  <div className="flex items-baseline justify-between">
                    <p className="ledger-num text-[11px] uppercase tracking-[0.2em] text-sky-600">{s.tag}</p>
                    <p className="ledger-num text-[12px] text-ink-muted">{s.range}</p>
                  </div>
                  <p className="mt-3 text-[15px] leading-[1.65] text-ink-soft">{s.body}</p>
                </div>
              ))}
              <div className="bg-bg-pure p-6 md:p-7">
                <p className="ledger-num text-[11px] uppercase tracking-[0.2em] text-orange-500">Thresholds</p>
                <dl className="mt-4 space-y-2.5">
                  {THRESHOLDS.map((t) => (
                    <div key={t.k} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                      <dt className="text-[14.5px] font-medium text-ink">{t.k}</dt>
                      <dd className="ledger-num text-[13px] text-ink-soft">{t.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   MODULES, a ledger index, not a card grid.
   ───────────────────────────────────────────────────────────────────────── */
function Modules() {
  return (
    <section className="relative overflow-hidden grain" style={{ background: "var(--paper)" }}>
      <Container className="relative py-20 md:py-28">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-5 md:mb-14">
          <div className="max-w-2xl">
            <p className="ledger-num text-[11px] uppercase tracking-[0.24em] text-orange-500">04 · The product</p>
            <h2 className="display-md mt-5 text-[30px] text-ink md:text-[40px]">Every module reads the same three scores.</h2>
          </div>
          <Link href="/product" className="inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-sky-600 hover:text-sky-500">
            See the full product <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="grid border-t rule-paper sm:grid-cols-2">
          {MODULES.map((m, i) => (
            <Reveal key={m.href} delay={0.04 * i}>
              <Link
                href={m.href}
                className="group flex items-baseline gap-5 border-b py-5 rule-paper transition-colors hover:bg-white/60 sm:px-1"
              >
                <span className="ledger-num text-[12px] text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[17px] font-medium text-ink transition-colors group-hover:text-sky-600 md:text-[18px]">{m.t}</span>
                  <span className="mt-1 block text-[14.5px] text-ink-soft">{m.d}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-ink-faint transition-all group-hover:translate-x-0.5 group-hover:text-sky-600" />
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   ALONGSIDE replaces the old anti-CRM block, which contradicted
   the positioning and repelled the sales-CRM queries the site targets.
   ───────────────────────────────────────────────────────────────────────── */
function Alongside() {
  return (
    <section className="relative bg-bg-pure">
      <Container className="py-20 md:py-28">
        <Reveal className="mb-10 max-w-2xl md:mb-14">
          <p className="ledger-num text-[11px] uppercase tracking-[0.24em] text-sky-600">05 · Alongside your CRM</p>
          <h2 className="display-md mt-5 text-[30px] text-ink md:text-[40px]">Keep the system of record. Add the decision layer.</h2>
          <p className="mt-5 text-[16px] leading-[1.7] text-ink-soft">
            Nothing here asks you to migrate. Your CRM stays the record of what happened;
            Leadkaun decides what happens next.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="overflow-hidden rounded-2xl border rule-paper">
          <div className="grid grid-cols-2 border-b rule-paper">
            <p className="ledger-num px-5 py-3 text-[10.5px] uppercase tracking-[0.2em] text-ink-muted md:px-7">Your CRM</p>
            <p className="ledger-num border-l px-5 py-3 text-[10.5px] uppercase tracking-[0.2em] text-sky-600 rule-paper md:px-7">Leadkaun</p>
          </div>
          {ALONGSIDE.map((r, i) => (
            <div key={r.crm} className={`grid grid-cols-2 ${i < ALONGSIDE.length - 1 ? "border-b rule-paper" : ""}`}>
              <p className="px-5 py-4 text-[14.5px] text-ink-muted md:px-7 md:py-5">{r.crm}</p>
              <p className="border-l px-5 py-4 text-[14.5px] font-medium text-ink rule-paper md:px-7 md:py-5">{r.lk}</p>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  )
}

function Industries() {
  return (
    <section className="relative overflow-hidden grain" style={{ background: "var(--paper)" }}>
      <Container className="relative py-20 md:py-24">
        <Reveal className="mb-9 max-w-2xl">
          <p className="ledger-num text-[11px] uppercase tracking-[0.24em] text-orange-500">06 · Where it is used</p>
          <h2 className="display-md mt-5 text-[28px] text-ink md:text-[36px]">Built for how Indian B2B actually sells.</h2>
        </Reveal>
        <Reveal delay={0.08} className="flex flex-wrap gap-2.5">
          {INDUSTRIES.map((s) => (
            <Link key={s.h} href={s.h} className="rounded-full border bg-bg-pure px-4 py-2 text-[14px] text-ink-soft transition-colors rule-paper hover:border-sky-300 hover:text-sky-600">
              {s.n}
            </Link>
          ))}
        </Reveal>
      </Container>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   IN THEIR WORDS. The complaint first, then what changed, then the lead the
   quote is about. See app/components/voices.tsx: every name is invented.
   ───────────────────────────────────────────────────────────────────────── */
function InTheirWords() {
  return (
    <section className="relative overflow-hidden grain" style={{ background: "var(--paper)" }}>
      <Container className="relative py-20 md:py-28">
        <Reveal className="mb-12 max-w-2xl md:mb-14">
          <p className="ledger-num text-[11px] uppercase tracking-[0.24em] text-sky-600">07 · In their words</p>
          <h2 className="display-md mt-5 text-[30px] text-ink md:text-[40px]">
            Nobody switches over a feature. They switch over one lead they lost.
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <Voices />
        </Reveal>
      </Container>
    </section>
  )
}

function Pricing() {
  return (
    <section className="relative bg-bg-pure">
      <Container className="py-20 md:py-28">
        <Reveal className="mb-10 max-w-2xl md:mb-14">
          <p className="ledger-num text-[11px] uppercase tracking-[0.24em] text-sky-600">08 · Pricing</p>
          <h2 className="display-md mt-5 text-[30px] text-ink md:text-[40px]">Flat per account. Never per seat.</h2>
          <p className="mt-5 text-[16px] leading-[1.7] text-ink-soft">
            Per-seat pricing makes teams ration logins, and rationed logins corrupt the very
            accountability data the product runs on. So adding a rep does not change the bill.
          </p>
        </Reveal>

        <div className="grid gap-px overflow-hidden rounded-2xl border rule-paper sm:grid-cols-2 lg:grid-cols-4" style={{ background: "var(--paper-line)" }}>
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={0.05 * i} className="h-full">
              <div className="flex h-full flex-col bg-bg-pure p-6 md:p-7">
                <div className="flex items-center gap-2">
                  <p className="ledger-num text-[11px] uppercase tracking-[0.2em] text-ink-muted">{t.name}</p>
                  {t.feature && <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700">Most teams</span>}
                </div>
                <p className="ledger-num mt-4 text-[30px] font-semibold text-ink">{t.price}</p>
                <p className="mt-1 text-[13px] text-ink-muted">per month</p>
                <p className="mt-4 text-[14px] leading-[1.6] text-ink-soft">{t.note}</p>
                <Link
                  href={t.cta === "Talk to us" ? "/contact" : APP_URLS.register}
                  className="mt-auto pt-6 text-[14px] font-semibold text-sky-600 hover:text-sky-500"
                >
                  {t.cta} →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-6">
          <Link href="/pricing" className="inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-sky-600 hover:text-sky-500">
            Full pricing and what is in each tier <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </Container>
    </section>
  )
}

function FaqBlock() {
  return (
    <section className="relative overflow-hidden grain" style={{ background: "var(--paper)" }}>
      <Container className="relative py-20 md:py-28">
        <Reveal className="mb-10 max-w-2xl md:mb-12">
          <p className="ledger-num text-[11px] uppercase tracking-[0.24em] text-orange-500">09 · Questions</p>
          <h2 className="display-md mt-5 text-[30px] text-ink md:text-[40px]">The ones we actually get asked.</h2>
        </Reveal>
        <Reveal delay={0.08}><Faq items={HOME_FAQ} /></Reveal>
      </Container>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   CLOSE, the second ink anchor, bracketing the page against the hero.
   ───────────────────────────────────────────────────────────────────────── */
function CloseBand() {
  return (
    <section className="relative overflow-hidden border-t rule-paper" style={{ background: "linear-gradient(180deg, var(--paper) 0%, var(--paper-2) 100%)" }}>
      <Container className="relative py-24 text-center md:py-32">
        <Reveal className="mx-auto max-w-3xl">
          <p className="ledger-num text-[11px] uppercase tracking-[0.22em] text-sky-600">10 · Ready when you are</p>
          <h2 className="display-lg mt-6 text-[32px] text-ink md:text-[48px]">
            Find out what your pipeline
            <br />
            <span className="relative inline-block text-sky-600">
              has been hiding.
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
            </span>
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-[16.5px] leading-[1.7] text-ink-soft">
            Import a CSV, watch every lead grade itself, and see the order your team should have
            been working in. Free tier, no card, live the same day.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={APP_URLS.register}
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}
            >
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/demo" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)", color: "var(--ink)" }}>
              Book a walkthrough
            </Link>
          </div>

          <p className="ledger-num mt-9 text-[11.5px] uppercase tracking-[0.16em] text-ink-muted">
            Free ₹0 · Starter ₹2,999 · Growth ₹7,999 · Scale ₹19,999 · flat per account
          </p>
        </Reveal>
      </Container>
    </section>
  )
}
