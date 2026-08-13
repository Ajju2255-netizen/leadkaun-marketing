import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { ArticleHeader, MEASURE } from "@/app/components/reading"
import { LedgerCTA } from "@/app/components/ledger"
import { breadcrumbListSchema, jsonLdScript } from "@/lib/seo"

/* A position statement, not a product page. The layout is a manifesto: a
   narrative in one measured column, the argument pulled out at display size,
   then what we believe and — the part most about-pages skip — what we won't
   do. Product detail belongs on /product; this page is why we exist. */

export const metadata: Metadata = {
  title: "About Leadkaun, Built for Indian Sales Teams, Not Silicon Valley",
  description:
    "Leadkaun was built to solve a specific Indian sales problem: leads going cold, reps working in the wrong order, and managers flying blind on missed ₹.",
  alternates: { canonical: "/about" },
}

/** Facts about how the product works — each one checkable on /methodology. */
const FACTS = [
  { value: "A–F",      label: "Every lead graded, in real time" },
  { value: "3 scores", label: "Fit, Intent and Quality, weights published" },
  { value: "Same day", label: "Setup to first scored lead" },
  { value: "Flat ₹",   label: "Priced per account, never per seat" },
]

const PRINCIPLES = [
  {
    title: "India-first, always.",
    desc: "INR pricing, IST cadence, Indian phone handling, Indian B2B cycles. Not a US product localised for India — built here, for how sales actually runs here.",
  },
  {
    title: "Reps use it. Managers trust it.",
    desc: "A tool reps skip is a tool that fails. We obsess over rep adoption as much as manager analytics, because the dashboards are only as good as what the rep logged at 6:47 PM.",
  },
  {
    title: "Rupees over activity.",
    desc: "We don't count calls, we surface recovery. Every number in Leadkaun rolls up to ₹ — the one metric that decides whether your Friday review feels like progress or cope.",
  },
]

/** The honest counterpart. An about page that only lists virtues isn't one. */
const WONT = [
  {
    title: "We won't replace your CRM.",
    desc: "Leadkaun runs alongside whatever you already use. If you want one system of record for everything, buy a CRM — we are the behaviour layer on top of it, and we say so on every comparison page.",
  },
  {
    title: "We won't score leads in a black box.",
    desc: "The Fit, Intent and Quality weights are published and identical for every account. No per-customer model tuning, because a grade a rep can't explain is a grade a rep won't trust.",
  },
  {
    title: "We won't rank ourselves where we don't belong.",
    desc: "Our buyer's guide to routing software ranks five competitors and excludes us entirely, because we don't do rules-based routing. If we're the wrong tool for your job, the page you're reading should tell you.",
  },
]

const BUILT = [
  { href: "/features/lead-scoring",        label: "Lead scoring",        note: "A–F grading on Fit × Intent × Quality, with decay" },
  { href: "/features/priority-queue",      label: "Priority Queue",      note: "Each rep's day, ranked automatically" },
  { href: "/features/missed-opportunity-engine", label: "Missed Opportunity Engine", note: "The ₹ sitting in leads nobody has called" },
  { href: "/features/morning-brief",       label: "Morning Brief",       note: "What matters today, at 8:30 AM IST" },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-bg-pure">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "About" }])]) }} />
      <Navbar />

      <ArticleHeader
        kicker="About Leadkaun"
        title="Built for the Indian sales rep."
        dek="Most CRM software is designed in the US, for US sales teams. Every decision here is grounded in how Indian B2B actually runs: WhatsApp as a first-class signal, paid leads from IndiaMART and housing portals, high volume, manual follow-ups, and managers who need ₹ accountability rather than another dashboard."
        // Only claims the site already makes elsewhere. Don't put a founding
        // date or a city here until someone confirms them — an about page is
        // exactly where an invented fact gets quoted back at you.
        meta={["Sales Behaviour OS", "Runs alongside your CRM", "Built for Indian B2B"]}
      />

      {/* WHAT THE PRODUCT DOES — four facts, each checkable */}
      <SectionGround variant="cream" size="md">
        <Container>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl md:grid-cols-4" style={{ background: "var(--paper-line)" }}>
            {FACTS.map((f) => (
              <div key={f.label} className="bg-white px-5 py-6">
                <dt className="ledger-num text-[22px] font-semibold leading-none tracking-[-0.02em] text-ink md:text-[26px]">
                  {f.value}
                </dt>
                <dd className="mt-3 text-[13px] leading-[1.5] text-ink-soft">{f.label}</dd>
              </div>
            ))}
          </dl>
          <p className="ledger-num mt-4 text-[10px] uppercase tracking-[0.14em] text-ink-muted">
            How the product works — not customer results.{" "}
            <Link href="/methodology" className="text-sky-700 hover:text-sky-600">See the method</Link>
          </p>
        </Container>
      </SectionGround>

      {/* THE ARGUMENT */}
      <SectionGround variant="pure" size="lg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)] lg:gap-x-10">
            <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted lg:pt-2">
              Why we built this
            </p>
            <div>
              <h2 className={`text-[28px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[38px] ${MEASURE}`}>
                Indian sales teams were paying for leads, then losing them to silence.
              </h2>

              <div className={`mt-8 space-y-6 text-[17px] leading-[1.75] text-ink-soft md:text-[18px] ${MEASURE}`}>
                <p>
                  We kept watching the same scene. A manager pays thousands a month for leads — Facebook, IndiaMART,
                  housing portals, 99acres, Google — and half of them die between the form submission and the third
                  follow-up. Not because the reps were lazy. Because nothing in their stack told them{" "}
                  <strong className="font-semibold text-ink">who to call first</strong>.
                </p>
                <p>
                  Generic CRMs reported &ldquo;X calls made&rdquo; and &ldquo;Y leads added&rdquo;. Useful for an audit,
                  useless on a Tuesday morning. Nobody was telling the manager the one sentence that actually changes
                  what a team does next:
                </p>
              </div>

              {/* The pull-quote is the whole thesis */}
              <blockquote
                className={`mt-10 pl-6 ${MEASURE}`}
                style={{ boxShadow: "inset 3px 0 0 #0877B8" }}
              >
                <p className="display-md text-[24px] leading-[1.3] text-ink md:text-[32px]">
                  There is money sitting in leads that haven&apos;t been called in three days.
                </p>
              </blockquote>

              <div className={`mt-10 space-y-6 text-[17px] leading-[1.75] text-ink-soft md:text-[18px] ${MEASURE}`}>
                <p>
                  That number changes behaviour. It is also, notably, not a number any CRM was designed to produce —
                  a system of record remembers what happened, it doesn&apos;t have an opinion about what should happen
                  next. So we built the layer that does.
                </p>
                <p>
                  We call the category a <strong className="font-semibold text-ink">Sales Behaviour OS</strong>: it runs
                  alongside your CRM and tells your team what to do next. The CRM remembers. Leadkaun acts.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </SectionGround>

      {/* WHAT WE BELIEVE */}
      <SectionGround variant="cream" size="lg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)] lg:gap-x-10">
            <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted lg:pt-2">
              What we believe
            </p>
            <div>
              <h2 className="text-[26px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[34px]">
                Three non-negotiables.
              </h2>
              <ol className="mt-8 border-t" style={{ borderColor: "var(--paper-line-2)" }}>
                {PRINCIPLES.map((p, i) => (
                  <li
                    key={p.title}
                    className="grid grid-cols-[44px_minmax(0,1fr)] gap-x-5 py-7 md:grid-cols-[64px_minmax(0,1fr)] md:gap-x-8"
                    style={{ borderBottom: "1px solid var(--paper-line)" }}
                  >
                    <span className="ledger-num text-[15px] font-semibold text-sky-700 tabular md:pt-1 md:text-[18px]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-[19px] font-semibold leading-snug tracking-[-0.015em] text-ink md:text-[21px]">{p.title}</h3>
                      <p className="mt-2.5 max-w-[62ch] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">{p.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </SectionGround>

      {/* AND WHAT WE WON'T DO */}
      <SectionGround variant="pure" size="lg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)] lg:gap-x-10">
            <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-500 lg:pt-2">
              And what we won&apos;t
            </p>
            <div>
              <h2 className="text-[26px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[34px]">
                Three things we turn down.
              </h2>
              <ol className="mt-8 border-t" style={{ borderColor: "var(--paper-line-2)" }}>
                {WONT.map((w) => (
                  <li key={w.title} className="py-7" style={{ borderBottom: "1px solid var(--paper-line)" }}>
                    <h3 className="text-[19px] font-semibold leading-snug tracking-[-0.015em] text-ink md:text-[21px]">{w.title}</h3>
                    <p className="mt-2.5 max-w-[62ch] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">{w.desc}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </SectionGround>

      {/* THE TEAM */}
      <SectionGround variant="cream" size="lg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)] lg:gap-x-10">
            <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted lg:pt-2">
              The team
            </p>
            <div>
              <h2 className={`text-[26px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[34px] ${MEASURE}`}>
                A small team, on one big problem.
              </h2>
              <p className={`mt-6 text-[17px] leading-[1.75] text-ink-soft md:text-[18px] ${MEASURE}`}>
                We&apos;re not trying to build the world&apos;s most feature-complete CRM. We&apos;re trying to build the
                one tool that changes what happens to a lead in the first six hours after it arrives, because that is
                where Indian B2B revenue actually leaks.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
                <a href="mailto:team@leadkaun.com" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-sky-700 hover:text-sky-600">
                  team@leadkaun.com <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <Link href="/contact" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-sky-700 hover:text-sky-600">
                  Talk to us <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </SectionGround>

      {/* WHAT WE BUILT — links, not a card grid; the product pages own the detail */}
      <SectionGround variant="pure" size="md">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)] lg:gap-x-10">
            <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted lg:pt-1.5">
              What we built
            </p>
            <ul className="border-t" style={{ borderColor: "var(--paper-line)" }}>
              {BUILT.map((b) => (
                <li key={b.href} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                  <Link href={b.href} className="group grid gap-x-8 gap-y-1 py-4 md:grid-cols-[minmax(0,240px)_minmax(0,1fr)_auto]">
                    <span className="text-[16px] font-semibold text-ink group-hover:text-sky-700">{b.label}</span>
                    <span className="text-[14px] leading-[1.55] text-ink-soft md:text-[15px]">{b.note}</span>
                    <ArrowUpRight className="hidden h-4 w-4 shrink-0 self-center text-ink-faint group-hover:text-sky-700 md:block" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </SectionGround>

      <LedgerCTA
        headline="The argument is easy to test."
        sub="Import a CSV and see how much of your own pipeline is sitting uncalled. If the number is small, you don't need us — and that's a fine outcome."
        secondary={{ label: "See pricing", href: "/pricing" }}
      />

      <Footer />
    </main>
  )
}
