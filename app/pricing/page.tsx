import type { Metadata } from "next"
import Link from "next/link"
import { Check, Minus } from "lucide-react"
import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { ProductShowcase } from "@/app/components/sell/blocks"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FloatingCard } from "@/app/components/floating-card"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { APP_URLS } from "@/lib/urls"
import { PricingPlans } from "./pricing-plans"

export const metadata: Metadata = {
  title: "Pricing in ₹ — Start Free, Scale to Enterprise",
  description:
    "Leadkaun pricing in Indian Rupees. Start free (100 active leads, 14 days), then Starter ₹2,999, Growth ₹7,999, Scale ₹19,999 — flat per account, priced by team size and active-lead volume. Save 17% on annual billing.",
  alternates: { canonical: "/pricing" },
}

// Feature comparison — Free / Starter / Growth / Scale.
const FEATURE_MATRIX: {
  category: string
  rows: { label: string; free: boolean | string; starter: boolean | string; growth: boolean | string; scale: boolean | string }[]
}[] = [
  {
    category: "Core behaviour layer",
    rows: [
      { label: "AI lead scoring (Grade A–F)", free: true, starter: true, growth: true, scale: true },
      { label: "Priority Queue",              free: true, starter: true, growth: true, scale: true },
      { label: "CRM + pipeline",              free: true, starter: true, growth: true, scale: true },
      { label: "WhatsApp activity tracking",  free: true, starter: true, growth: true, scale: true },
    ],
  },
  {
    category: "Limits",
    rows: [
      { label: "Users",       free: "1",   starter: "10",        growth: "30",        scale: "75" },
      { label: "Active leads",  free: "100", starter: "5,000",     growth: "25,000",    scale: "Unlimited" },
      { label: "CSV import",  free: true,  starter: "Unlimited", growth: "Unlimited", scale: "Unlimited" },
    ],
  },
  {
    category: "AI & intelligence",
    rows: [
      { label: "AI Learning Engine",        free: false, starter: false,   growth: true,       scale: true },
      { label: "Missed Opportunity Engine", free: false, starter: false,   growth: true,       scale: true },
      { label: "Rep tracking + scorecards", free: false, starter: false,   growth: true,       scale: true },
      { label: "Revenue analytics",         free: false, starter: "Basic", growth: "Advanced", scale: "Advanced" },
    ],
  },
  {
    category: "Scale & integrations",
    rows: [
      { label: "Multiple workspaces", free: false, starter: false, growth: false, scale: true },
      { label: "API access",          free: false, starter: false, growth: false, scale: true },
      { label: "Webhooks",            free: false, starter: false, growth: false, scale: true },
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
  { name: "Additional user (Growth)",  price: "₹200/mo" },
  { name: "Additional workspace",      price: "₹999/mo" },
  { name: "White-label reports",       price: "₹1,999/mo" },
  { name: "API access (before Scale)", price: "₹2,999/mo" },
  { name: "Data migration",            price: "₹4,999",  note: "one-time" },
  { name: "Premium onboarding",        price: "₹9,999",  note: "one-time" },
  { name: "AI credits",                price: "Usage-based", note: "coming soon" },
]

const FAQ = [
  { q: "Is there really a free plan?", a: "Yes. Free gives you 1 user and 100 active leads for 14 days — full AI scoring, the Priority Queue, pipeline, CSV import and WhatsApp logging, no credit card. It's the fastest way to watch Leadkaun grade your own leads before you roll it out." },
  { q: "How is Leadkaun priced?", a: "Flat per account, not per seat — priced by team size and active-lead volume. Starter ₹2,999 (10 users, 5,000 active leads), Growth ₹7,999 (30 users, 25,000 active leads), Scale ₹19,999 (75 users, unlimited leads). The AI Learning Engine, Missed Opportunity Engine and rep tracking start on Growth." },
  { q: "What counts as an 'active lead' — and what happens at the limit?", a: "An active lead is an open one you're still working. When you win, lose, or archive a deal it stops counting, so the limit tracks your live pipeline, not everything you've ever added. If you hit the cap, nothing locks: every existing lead stays fully usable — view, edit, call, close, export. Only adding new leads pauses until you close a few or upgrade. It rewards good CRM hygiene instead of punishing growth." },
  { q: "Do you charge in USD?", a: "No. All pricing is in Indian Rupees (INR). Invoices are GST-compliant." },
  { q: "Is there an annual discount?", a: "Yes — annual billing is ~17% off (two months free): Starter ₹29,990/yr, Growth ₹79,990/yr, Scale ₹1,99,990/yr. Toggle 'Annual' above to see the effective monthly price." },
  { q: "Can I change plans later?", a: "Yes. Upgrade or downgrade anytime; billing adjusts pro-rata. Most teams start on Starter and move to Growth once they feel leads going cold and want the Missed Opportunity Engine + AI Learning." },
  { q: "What if I need more than 75 users?", a: "That's Enterprise — unlimited users, workspaces and leads on dedicated infrastructure, with custom AI models, private cloud, SSO and a dedicated success manager. Talk to sales for a quote." },
  { q: "Can I add users or workspaces without upgrading?", a: "Yes. Extra seats are ₹250/mo (Starter) or ₹200/mo (Growth), extra workspaces ₹999/mo, and API access is available as a ₹2,999/mo add-on before Scale." },
]

function MintCheck() {
  return (
    <span
      className="inline-flex h-5 w-5 items-center justify-center rounded-full"
      style={{
        background: "linear-gradient(180deg, #6EE7B7 0%, #34D399 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 3px rgba(16,185,129,0.30)",
      }}
    >
      <Check className="h-3 w-3 text-white" strokeWidth={3} />
    </span>
  )
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <PageHero
        eyebrow="Pricing"
        h1={
          <>
            Start free.<br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}
            >
              Grow into more sales.
            </span>
          </>
        }
        sub="You're not buying CRM software — you're buying faster follow-ups, fewer cold leads, and AI-driven execution. Start free, upgrade when you're leaving money on the table."
        primary={{ kind: "primary", label: "Start free", href: APP_URLS.register, external: true }}
        secondary={{ kind: "text", label: "How it works", href: "/how-it-works" }}
      />

      <ProductShowcase
        number="01"
        ground="sky"
        title={<>Here&apos;s what you&apos;re paying for.</>}
        sub="Every lead graded A–F, a live Priority Queue per rep, and the ₹ at risk in real rupees — the working system, on every tier."
      />

      {/* TIERS + toggle (client) */}
      <SectionGround variant="cream" size="md">
        <Container>
          <Reveal>
            <PricingPlans />
          </Reveal>
        </Container>
      </SectionGround>

      {/* FEATURE MATRIX */}
      <SectionGround variant="sky" size="lg">
        <Container>
          <Reveal className="mb-12">
            <NumberedTag number="02" label="Full comparison" />
            <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
              Everything in each plan.
            </h2>
          </Reveal>

          <Reveal delay={0.08}><FloatingCard tier="3" depth="3" gloss className="overflow-x-auto">
            <div className="min-w-[720px]">
              <div
                className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr]"
                style={{ borderBottom: "1px solid var(--hairline-strong)" }}
              >
                <div className="px-6 py-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                  Feature
                </div>
                {["Free", "Starter", "Growth", "Scale"].map((p, i) => (
                  <div
                    key={p}
                    className={`px-4 py-5 text-center text-[13px] font-bold uppercase tracking-[0.14em] ${
                      i === 2 ? "text-sky-600" : "text-ink"
                    }`}
                    style={i === 2 ? { background: "linear-gradient(180deg, rgba(186,230,253,0.30) 0%, transparent 100%)" } : undefined}
                  >
                    {p}
                  </div>
                ))}
              </div>

              {FEATURE_MATRIX.map((section) => (
                <div key={section.category}>
                  <div
                    className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr]"
                    style={{
                      borderBottom: "1px solid var(--hairline)",
                      background: "linear-gradient(180deg, rgba(186,230,253,0.18) 0%, rgba(186,230,253,0.04) 100%)",
                    }}
                  >
                    <div className="col-span-5 px-6 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600">
                      {section.category}
                    </div>
                  </div>
                  {section.rows.map((row) => (
                    <div
                      key={row.label}
                      className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] hover:bg-sky-50/40 transition-colors"
                      style={{ borderBottom: "1px solid var(--hairline)" }}
                    >
                      <div className="px-6 py-4 text-[14px] text-ink">{row.label}</div>
                      {[row.free, row.starter, row.growth, row.scale].map((v, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-center px-4 py-4 text-center"
                          style={i === 2 ? { background: "linear-gradient(90deg, rgba(186,230,253,0.18) 0%, rgba(186,230,253,0.04) 100%)" } : undefined}
                        >
                          {v === true ? <MintCheck /> : v === false ? (
                            <Minus className="h-4 w-4 text-ink-faint" strokeWidth={2} />
                          ) : (
                            <span className="font-mono text-[12.5px] font-semibold text-ink tabular">{v}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </FloatingCard></Reveal>

          <p className="mt-6 text-center text-[13px] text-ink-muted">
            Need more than 75 users or something custom?{" "}
            <Link href="/contact" className="text-sky-600 underline-offset-4 hover:underline">
              Talk to sales
            </Link>
            .
          </p>
        </Container>
      </SectionGround>

      {/* ADD-ONS */}
      <SectionGround variant="cream" size="md">
        <Container>
          <Reveal className="mb-10">
            <NumberedTag number="03" tone="warm" label="Add-ons" />
            <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
              Add only what you need.
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-[1.6] text-ink-soft">
              You don&apos;t have to jump a whole tier for one thing. Bolt on seats, a workspace, or
              API access to your current plan.
            </p>
          </Reveal>

          <Reveal delay={0.08} className="grid gap-3 sm:grid-cols-2">
            {ADDONS.map((a) => (
              <div
                key={a.name}
                className="flex items-center justify-between gap-4 rounded-2xl px-5 py-4 glass-2 elevate-1 gloss-edge"
              >
                <span className="text-[14px] font-medium text-ink">{a.name}</span>
                <span className="flex items-baseline gap-1.5 shrink-0">
                  <span className="font-mono text-[15px] font-semibold text-ink tabular">{a.price}</span>
                  {a.note && (
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                      {a.note}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </Reveal>
        </Container>
      </SectionGround>

      {/* PER-SEAT VS FLAT CALCULATOR */}
      <SectionGround variant="pure" size="sm">
        <Container>
          <Reveal className="mx-auto max-w-3xl">
            <div className="flex flex-col items-start gap-4 rounded-2xl glass-2 elevate-1 gloss-edge p-6 md:flex-row md:items-center md:justify-between md:p-7">
              <div>
                <p className="text-[16px] font-semibold text-ink">Paying per seat elsewhere?</p>
                <p className="mt-1 text-[14px] leading-[1.55] text-ink-soft">
                  See what per-user pricing costs as your team grows, versus Leadkaun&apos;s flat per-account price.
                </p>
              </div>
              <Link
                href="/tools/crm-cost-calculator"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full glass-1 gloss-edge px-5 py-2.5 text-[14px] font-semibold text-sky-600 transition-all hover:text-sky-500 lift"
              >
                CRM cost calculator →
              </Link>
            </div>
          </Reveal>
        </Container>
      </SectionGround>

      {/* FAQ */}
      <SectionGround variant="sky" size="md">
        <Container>
          <Reveal className="mx-auto mb-10 max-w-3xl text-center">
            <div className="flex justify-center">
              <NumberedTag number="04" label="FAQ" />
            </div>
            <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
              Common pricing questions.
            </h2>
          </Reveal>
          <Reveal delay={0.08}><Faq items={FAQ} /></Reveal>
        </Container>
      </SectionGround>

      <CTABanner
        tag={{ number: "05", label: "Ready when you are" }}
        headline="Start free. Upgrade when you're leaving money on the table."
        sub="100 leads, full AI scoring, no credit card. Setup the same day."
      />

      <Footer />
    </main>
  )
}
