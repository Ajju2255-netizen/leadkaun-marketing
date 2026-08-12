import type { Metadata } from "next"
import type { ReactNode } from "react"
import Link from "next/link"
import { Check, Minus, ArrowRight, Sparkles, Gauge, ListOrdered, MessageCircle, Kanban, IndianRupee, Infinity as InfinityIcon, Unlock, ArrowLeftRight, type LucideIcon } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FloatingCard } from "@/app/components/floating-card"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { APP_URLS } from "@/lib/urls"
import { faqPageSchema, offerSchema, breadcrumbListSchema, jsonLdScript, ogMeta } from "@/lib/seo"
import { PricingPlans } from "./pricing-plans"

const pricingTitle = "Lead Management Software Pricing in ₹, Start Free"
const pricingDescription =
  "Leadkaun pricing in Indian Rupees. Start free (100 active leads, 14 days), then Starter ₹2,999, Growth ₹7,999, Scale ₹19,999, flat per account, priced by team size and active-lead volume. Save 17% on annual billing."

export const metadata: Metadata = {
  title: pricingTitle,
  description: pricingDescription,
  alternates: { canonical: "/pricing" },
  ...ogMeta({ title: pricingTitle, description: pricingDescription, path: "/pricing" }),
}

function Chip({ children, tone = "sky" }: { children: ReactNode; tone?: "sky" | "mint" | "warn" }) {
  const styles: Record<string, string> = {
    sky: "bg-sky-50 text-sky-700 ring-sky-200",
    mint: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warn: "bg-orange-50 text-orange-700 ring-orange-200",
  }
  return <span className={`whitespace-nowrap rounded-md px-1.5 py-[1px] text-[13.5px] font-semibold ring-1 ${styles[tone]}`}>{children}</span>
}

const INCLUDED: { Icon: LucideIcon; title: string; body: string; href: string }[] = [
  { Icon: Gauge, title: "AI Lead Scoring", body: "Every lead graded A–F on Fit × Intent × Quality, on every tier, including Free.", href: "/features/lead-scoring" },
  { Icon: ListOrdered, title: "Priority Queue", body: "One ranked list of who to call next, re-ranking as signals arrive.", href: "/features/priority-queue" },
  { Icon: Kanban, title: "CRM + pipeline", body: "A full lead record and pipeline, so Leadkaun replaces the spreadsheet, not just adds to it.", href: "/how-it-works" },
  { Icon: MessageCircle, title: "WhatsApp tracking", body: "3-tap logging of the conversations where Indian B2B deals actually happen.", href: "/features/whatsapp-tracking" },
]

const FEATURE_MATRIX: {
  category: string
  rows: { label: string; free: boolean | string; starter: boolean | string; growth: boolean | string; scale: boolean | string }[]
}[] = [
  {
    category: "Core behaviour layer",
    rows: [
      { label: "AI lead scoring (Grade A–F)", free: true, starter: true, growth: true, scale: true },
      { label: "Priority Queue", free: true, starter: true, growth: true, scale: true },
      { label: "CRM + pipeline", free: true, starter: true, growth: true, scale: true },
      { label: "WhatsApp activity tracking", free: true, starter: true, growth: true, scale: true },
    ],
  },
  {
    category: "Limits",
    rows: [
      { label: "Users", free: "1", starter: "10", growth: "30", scale: "75" },
      { label: "Active leads", free: "100", starter: "5,000", growth: "25,000", scale: "Unlimited" },
      { label: "CSV import", free: true, starter: "Unlimited", growth: "Unlimited", scale: "Unlimited" },
    ],
  },
  {
    category: "AI & intelligence",
    rows: [
      { label: "AI Learning Engine", free: false, starter: false, growth: true, scale: true },
      { label: "Missed Opportunity Engine", free: false, starter: false, growth: true, scale: true },
      { label: "Rep tracking + scorecards", free: false, starter: false, growth: true, scale: true },
      { label: "Revenue analytics", free: false, starter: "Basic", growth: "Advanced", scale: "Advanced" },
    ],
  },
  {
    category: "Scale & integrations",
    rows: [
      { label: "Multiple workspaces", free: false, starter: false, growth: false, scale: true },
      { label: "API access", free: false, starter: false, growth: false, scale: true },
      { label: "Webhooks", free: false, starter: false, growth: false, scale: true },
    ],
  },
  {
    category: "Support",
    rows: [
      { label: "Support", free: false, starter: "Email", growth: "Priority", scale: "Dedicated" },
    ],
  },
]

const ADDONS: { name: string; price: string; note?: string }[] = [
  { name: "Additional user (Starter)", price: "₹250/mo" },
  { name: "Additional user (Growth)", price: "₹200/mo" },
  { name: "Additional workspace", price: "₹999/mo" },
  { name: "White-label reports", price: "₹1,999/mo" },
  { name: "API access (before Scale)", price: "₹2,999/mo" },
  { name: "Data migration", price: "₹4,999", note: "one-time" },
  { name: "Premium onboarding", price: "₹9,999", note: "one-time" },
  { name: "AI credits", price: "Usage-based", note: "coming soon" },
]

const FAQ = [
  { q: "Is there really a free plan?", a: "Yes. Free gives you 1 user and 100 active leads for 14 days, full AI scoring, the Priority Queue, pipeline, CSV import and WhatsApp logging, no credit card. It's the fastest way to watch Leadkaun grade your own leads before you roll it out." },
  { q: "How is Leadkaun priced?", a: "Flat per account, not per seat, priced by team size and active-lead volume. Starter ₹2,999 (10 users, 5,000 active leads), Growth ₹7,999 (30 users, 25,000 active leads), Scale ₹19,999 (75 users, unlimited leads). The AI Learning Engine, Missed Opportunity Engine and rep tracking start on Growth." },
  { q: "What counts as an 'active lead', and what happens at the limit?", a: "An active lead is an open one you're still working. When you win, lose, or archive a deal it stops counting, so the limit tracks your live pipeline, not everything you've ever added. If you hit the cap, nothing locks: every existing lead stays fully usable, view, edit, call, close, export. Only adding new leads pauses until you close a few or upgrade. It rewards good CRM hygiene instead of punishing growth." },
  { q: "Do you charge in USD?", a: "No. All pricing is in Indian Rupees (INR). Invoices are GST-compliant." },
  { q: "Is there an annual discount?", a: "Yes, annual billing is ~17% off (two months free): Starter ₹29,990/yr, Growth ₹79,990/yr, Scale ₹1,99,990/yr. Toggle 'Annual' above to see the effective monthly price." },
  { q: "Can I change plans later?", a: "Yes. Upgrade or downgrade anytime; billing adjusts pro-rata. Most teams start on Starter and move to Growth once they feel leads going cold and want the Missed Opportunity Engine + AI Learning." },
  { q: "What if I need more than 75 users?", a: "That's Enterprise, unlimited users, workspaces and leads on dedicated infrastructure, with custom AI models, private cloud, SSO and a dedicated success manager. Talk to sales for a quote." },
  { q: "Can I add users or workspaces without upgrading?", a: "Yes. Extra seats are ₹250/mo (Starter) or ₹200/mo (Growth), extra workspaces ₹999/mo, and API access is available as a ₹2,999/mo add-on before Scale." },
]

function MintCheck() {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full" style={{ background: "linear-gradient(180deg, #6EE7B7 0%, #34D399 100%)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 3px rgba(16,185,129,0.30)" }}>
      <Check className="h-3 w-3 text-white" strokeWidth={3} />
    </span>
  )
}

// Illustrative per-seat vs flat comparison at a representative team size.
const PERSEAT = [
  { size: "10 reps", perseat: "₹6,000", flat: "₹2,999", plan: "Starter" },
  { size: "30 reps", perseat: "₹18,000", flat: "₹7,999", plan: "Growth" },
  { size: "60 reps", perseat: "₹36,000", flat: "₹19,999", plan: "Scale" },
]

export default function PricingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([
        breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Pricing" }]),
        faqPageSchema(FAQ),
        offerSchema({ name: "Leadkaun Starter", priceInr: 2999, url: "/pricing" }),
        offerSchema({ name: "Leadkaun Growth", priceInr: 7999, url: "/pricing" }),
        offerSchema({ name: "Leadkaun Scale", priceInr: 19999, url: "/pricing" }),
      ]) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        {/* HERO */}
        <section className="relative overflow-hidden border-b rule-paper" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, var(--paper) 100%)" }}>
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-[460px] w-[620px] rounded-full opacity-[0.30] blur-[130px]" style={{ background: "radial-gradient(circle, #BAE6FD 0%, transparent 70%)" }} />
          <Container className="relative pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div className="rise" style={{ animationDelay: "40ms" }}>
                <p className="ledger-num inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-sky-600">
                  <IndianRupee className="h-3.5 w-3.5" strokeWidth={2} /> Pricing
                </p>
                <h1 className="display-xl mt-6 text-[40px] text-ink sm:text-[52px] lg:text-[58px]">
                  Start free.
                  <br />
                  <span className="relative inline-block text-sky-600">
                    Grow into more sales.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h1>
                <p className="mt-7 max-w-xl text-[17px] leading-[1.7] text-ink-soft md:text-[18px]">
                  You&apos;re not buying CRM software, you&apos;re buying faster follow-ups, fewer cold leads and AI-driven execution. Flat per account, not per seat, so adding reps never raises the bill within a tier. Start free, upgrade when you&apos;re leaving money on the table.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
                    Start free <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="#plans" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)" }}>
                    See the plans <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2.5">
                  {["Free ₹0 · no card", "Flat per account", "GST invoices", "~17% off annual"].map((t) => (
                    <span key={t} className="inline-flex items-center gap-2 text-[13px] font-medium text-ink-soft"><MintCheck />{t}</span>
                  ))}
                </div>
              </div>

              {/* Add reps, same bill */}
              <div className="rise" style={{ animationDelay: "160ms" }}>
                <FloatingCard tier="2" depth="3" gloss aura="sky" className="mx-auto max-w-md p-5 md:p-6">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Growth plan · flat per account</p>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100">same bill</span>
                  </div>
                  <div className="mt-4 space-y-2.5">
                    {[["3 reps", "starting out"], ["12 reps", "hiring hard"], ["30 reps", "scaled up"]].map(([reps, note]) => (
                      <div key={reps} className="flex items-center gap-3 rounded-xl bg-white/60 p-3 ring-1 ring-black/5">
                        <span className="min-w-0 flex-1">
                          <span className="block text-[14px] font-semibold text-ink">{reps}</span>
                          <span className="block text-[11.5px] text-ink-muted">{note}</span>
                        </span>
                        <span className="font-mono text-[17px] font-semibold text-ink">₹7,999<span className="text-[11px] font-normal text-ink-muted">/mo</span></span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3.5 text-[12px] leading-snug text-ink-muted">Add reps within your tier and the bill doesn&apos;t move. You upgrade for capability and volume, not for headcount.</p>
                </FloatingCard>
              </div>
            </div>
          </Container>
        </section>

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
              <p className="quick-answer-q mt-3 text-[16px] font-semibold text-ink md:text-[17px]">How much does Leadkaun cost?</p>
              <p className="quick-answer-a mt-3 text-[16px] leading-[1.75] text-ink-soft">
                Leadkaun is priced <Chip>flat per account</Chip>, not per seat: <Chip tone="mint">Free ₹0</Chip>, Starter ₹2,999, Growth ₹7,999, Scale ₹19,999 per month, plus custom Enterprise. Annual billing saves about <Chip tone="warn">17%</Chip>, and adding reps doesn&apos;t raise the bill within a tier&apos;s seat cap. All prices in INR, with GST-compliant invoices.
              </p>
            </div>
          </Container>
        </SectionGround>

        {/* PLANS */}
        <SectionGround variant="cream" size="lg" id="plans">
          <Container>
            <Reveal className="mb-10 max-w-3xl">
              <NumberedTag number="01" tone="warm" label="Plans" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Four plans. The working system on every one.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Every tier grades your leads, builds the queue, and tracks WhatsApp, including Free. You pay more for team size, active-lead volume, and the AI intelligence layer, never for the basics.
              </p>
            </Reveal>
            <Reveal delay={0.08}><PricingPlans /></Reveal>
          </Container>
        </SectionGround>

        {/* 02 — FLAT VS PER-SEAT */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <NumberedTag number="02" label="Flat per account, not per seat" />
                <h2 className="mt-5 text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[38px]">
                  Per-seat pricing punishes you for hiring.
                </h2>
                <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
                  Most CRMs charge per user, so the bill climbs every time you grow the team. Leadkaun is flat per account: one price for the whole floor within your tier. The bigger your team, the more the gap widens in your favour.
                </p>
                <Link href="/tools/crm-cost-calculator" className="group mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-600 hover:text-sky-500">
                  <ArrowLeftRight className="h-4 w-4" /> Compare with the CRM cost calculator <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
              <Reveal delay={0.06}>
                <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7">
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 pb-3">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted">Team</span>
                    <span />
                    <span className="text-right font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted">Per-seat vs flat</span>
                  </div>
                  <div className="space-y-2.5">
                    {PERSEAT.map((r) => (
                      <div key={r.size} className="flex items-center gap-3 rounded-xl bg-white/60 p-3 ring-1 ring-black/5">
                        <span className="w-16 text-[13px] font-semibold text-ink">{r.size}</span>
                        <span className="flex-1 text-right font-mono text-[13px] text-ink-muted line-through">{r.perseat}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="w-24 text-right">
                          <span className="font-mono text-[14px] font-semibold text-emerald-600">{r.flat}</span>
                          <span className="block font-mono text-[9px] uppercase tracking-[0.1em] text-ink-muted">{r.plan}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 border-t pt-3.5 text-[11.5px] leading-snug text-ink-muted rule-paper">Per-seat figures are illustrative (a typical ₹600/user model), shown to size the gap, not a competitor quote. Leadkaun prices are actual.</p>
                </FloatingCard>
              </Reveal>
            </div>
          </Container>
        </SectionGround>

        {/* 03 — WHAT EVERY PLAN INCLUDES */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="03" label="On every tier" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Here&apos;s what you&apos;re paying for.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                The core behaviour layer, grade, queue, pipeline, WhatsApp, is on every plan, including Free. Higher tiers add the AI intelligence layer on top.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {INCLUDED.map(({ Icon, title: t, body, href }) => (
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

        {/* 04 — FEATURE MATRIX */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <Reveal className="mb-10 max-w-3xl">
              <NumberedTag number="04" label="Full comparison" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Everything in each plan.
              </h2>
            </Reveal>
            <Reveal delay={0.08}><FloatingCard tier="3" depth="3" gloss className="overflow-x-auto">
              <div className="min-w-[720px]">
                <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr]" style={{ borderBottom: "1px solid var(--hairline-strong)" }}>
                  <div className="px-6 py-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Feature</div>
                  {["Free", "Starter", "Growth", "Scale"].map((p, i) => (
                    <div key={p} className={`px-4 py-5 text-center text-[13px] font-bold uppercase tracking-[0.14em] ${i === 2 ? "text-sky-600" : "text-ink"}`} style={i === 2 ? { background: "linear-gradient(180deg, rgba(186,230,253,0.30) 0%, transparent 100%)" } : undefined}>{p}</div>
                  ))}
                </div>
                {FEATURE_MATRIX.map((section) => (
                  <div key={section.category}>
                    <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr]" style={{ borderBottom: "1px solid var(--hairline)", background: "linear-gradient(180deg, rgba(186,230,253,0.18) 0%, rgba(186,230,253,0.04) 100%)" }}>
                      <div className="col-span-5 px-6 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600">{section.category}</div>
                    </div>
                    {section.rows.map((row) => (
                      <div key={row.label} className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] transition-colors hover:bg-sky-50/40" style={{ borderBottom: "1px solid var(--hairline)" }}>
                        <div className="px-6 py-4 text-[14px] text-ink">{row.label}</div>
                        {[row.free, row.starter, row.growth, row.scale].map((v, i) => (
                          <div key={i} className="flex items-center justify-center px-4 py-4 text-center" style={i === 2 ? { background: "linear-gradient(90deg, rgba(186,230,253,0.18) 0%, rgba(186,230,253,0.04) 100%)" } : undefined}>
                            {v === true ? <MintCheck /> : v === false ? <Minus className="h-4 w-4 text-ink-faint" strokeWidth={2} /> : <span className="font-mono text-[12.5px] font-semibold text-ink tabular">{v}</span>}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </FloatingCard></Reveal>
            <p className="mt-6 text-center text-[13px] text-ink-muted">
              Need more than 75 users or something custom? <Link href="/contact" className="text-sky-600 underline-offset-4 hover:underline">Talk to sales</Link>.
            </p>
          </Container>
        </SectionGround>

        {/* 05 — ADD-ONS */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-10 max-w-3xl">
              <NumberedTag number="05" tone="warm" label="Add-ons" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Add only what you need.
              </h2>
              <p className="mt-4 text-[16px] leading-[1.55] text-ink-soft">
                You don&apos;t have to jump a whole tier for one thing. Bolt on seats, a workspace, or API access to your current plan.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-3 sm:grid-cols-2">
              {ADDONS.map((a) => (
                <div key={a.name} className="flex items-center justify-between gap-4 rounded-2xl px-5 py-4 glass-2 elevate-1 gloss-edge">
                  <span className="text-[14px] font-medium text-ink">{a.name}</span>
                  <span className="flex shrink-0 items-baseline gap-1.5">
                    <span className="font-mono text-[15px] font-semibold text-ink tabular">{a.price}</span>
                    {a.note && <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted">{a.note}</span>}
                  </span>
                </div>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* 06 — ACTIVE LEADS POLICY */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-4xl">
              <FloatingCard tier="3" depth="3" gloss className="p-8 md:p-10">
                <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:gap-12">
                  <div>
                    <NumberedTag number="06" label="Fair by design" />
                    <h2 className="mt-5 text-[28px] font-semibold leading-[1.14] tracking-[-0.03em] text-ink md:text-[34px]">
                      Hitting the lead cap locks nothing.
                    </h2>
                    <p className="mt-4 text-[15px] leading-[1.65] text-ink-soft">
                      An active lead is an open one you&apos;re still working. Win, lose or archive it and it stops counting, so the limit tracks your live pipeline, not everything you&apos;ve ever added.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { Icon: Unlock, t: "Nothing locks", b: "Every existing lead stays fully usable: view, edit, call, close, export." },
                      { Icon: InfinityIcon, t: "Only new adds pause", b: "You just close a few or upgrade to add more, on your schedule." },
                      { Icon: IndianRupee, t: "Flat per account", b: "Adding reps within a tier never changes the bill." },
                      { Icon: Check, t: "Rewards hygiene", b: "The cap tracks live pipeline, so good CRM habits keep you under it." },
                    ].map(({ Icon, t, b }) => (
                      <div key={t} className="rounded-2xl bg-sky-50/50 p-4 ring-1 ring-sky-100">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sky-600 ring-1 ring-sky-100"><Icon className="h-[18px] w-[18px]" strokeWidth={2} /></span>
                        <p className="mt-3 text-[14px] font-semibold text-ink">{t}</p>
                        <p className="mt-1 text-[12.5px] leading-[1.55] text-ink-soft">{b}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FloatingCard>
            </Reveal>
          </Container>
        </SectionGround>

        {/* 07 — FAQ */}
        <SectionGround variant="sky" size="md">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <div className="flex justify-center"><NumberedTag number="07" label="FAQ" /></div>
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">Common pricing questions.</h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={FAQ} /></Reveal>
          </Container>
        </SectionGround>

        {/* CLOSING CTA */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-4xl">
              <div className="relative overflow-hidden rounded-3xl border p-10 text-center md:p-14" style={{ borderColor: "var(--paper-line)", background: "linear-gradient(180deg,#FFFFFF, var(--paper))" }}>
                <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-96 rounded-full opacity-30 blur-[110px]" style={{ background: "radial-gradient(circle,#BAE6FD 0%,transparent 70%)" }} />
                <p className="ledger-num relative text-[11px] uppercase tracking-[0.22em] text-sky-600">Ready when you are</p>
                <h2 className="display-lg relative mx-auto mt-5 max-w-2xl text-[30px] text-ink md:text-[44px]">
                  Start free. Upgrade when you&apos;re{" "}
                  <span className="relative inline-block text-sky-600">
                    leaving money on the table.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h2>
                <p className="relative mx-auto mt-6 max-w-xl text-[16px] leading-[1.7] text-ink-soft">
                  100 leads, full AI scoring, no credit card. Setup the same day, and the working system is live before you decide to pay for anything.
                </p>
                <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
                    Start free <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="/how-it-works" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)" }}>
                    How it works
                  </Link>
                </div>
                <p className="ledger-num relative mt-8 text-[11.5px] uppercase tracking-[0.16em] text-ink-muted">Free ₹0 · no card · flat per account · GST invoices</p>
              </div>
            </Reveal>
          </Container>
        </SectionGround>

        <Footer />
      </main>
    </>
  )
}
