import Link from "next/link"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { MessageCircle, Gauge, ListOrdered, Users, ArrowRight, Sparkles, Smartphone, EyeOff, Clock, type LucideIcon } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FeatureCard } from "@/app/components/feature-card"
import { FloatingCard } from "@/app/components/floating-card"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { GradeBadge } from "@/app/components/demo/primitives"
import { AppReplica } from "@/app/components/app-replica"
import { Voices } from "@/app/components/voices"
import { faqPageSchema, breadcrumbListSchema, jsonLdScript, ogMeta } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

const title = "WhatsApp Sales Tracking, 3 taps, any WhatsApp account"
const description =
  "Most Indian B2B first-contact happens on WhatsApp. Leadkaun logs every exchange in 3 taps, stage, intent, outcome, and feeds the Intent Score directly. Any WhatsApp account, no Business API needed."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/features/whatsapp-tracking" },
  ...ogMeta({ title, description, path: "/features/whatsapp-tracking" }),
}

/** Inline highlighted term chip for the Quick Answer. */
function Chip({ children, tone = "mint" }: { children: ReactNode; tone?: "sky" | "mint" | "warn" }) {
  const styles: Record<string, string> = {
    sky: "bg-sky-50 text-sky-700 ring-sky-200",
    mint: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warn: "bg-orange-50 text-orange-700 ring-orange-200",
  }
  return <span className={`whitespace-nowrap rounded-md px-1.5 py-[1px] text-[13.5px] font-semibold ring-1 ${styles[tone]}`}>{children}</span>
}

const TAPS = [
  { num: "01", label: "Stage", options: ["First reply", "Asking questions", "Negotiating", "Objection", "Meeting booked", "Ghosted"] },
  { num: "02", label: "Intent", options: ["High · +10 pts", "Medium · +5", "Low · 0", "Negative · −10"] },
  { num: "03", label: "Outcome", options: ["Progressed", "Stuck", "Closed"] },
]

const PROOF: { Icon: LucideIcon; stat: string; label: string }[] = [
  { Icon: MessageCircle, stat: "3 taps", label: "~10 seconds per conversation" },
  { Icon: Smartphone, stat: "Any account", label: "Regular or Business WhatsApp, no API" },
  { Icon: Gauge, stat: "Feeds scoring", label: "Intent tap updates the grade in real time" },
  { Icon: EyeOff, stat: "No content", label: "Only stage, intent, outcome are stored" },
]

const FAQ = [
  { q: "Do I need WhatsApp Business API?", a: "No. 3-tap manual logging works with any WhatsApp account, regular WhatsApp, WhatsApp Business, whatever your reps are already using. That's the point." },
  { q: "Can it auto-log WhatsApp messages?", a: "Not yet, auto-logging via a WhatsApp Business Service Provider (Gupshup, AiSensy, Interakt) is on our roadmap. Today, 3-tap manual logging works with any WhatsApp account and takes about 10 seconds per conversation, and that's what feeds the Intent Score." },
  { q: "How long does logging take?", a: "About 10 seconds per exchange. Reps log after each meaningful reply, not every 'hi'. By the end of a morning of calls, logging is muscle memory." },
  { q: "Does the manager see the message content?", a: "No. Only the aggregated signals (stage + intent + outcome) show up on the manager view. Per-rep WhatsApp activity counts show on the Rep Performance card. No message content without explicit permission." },
  { q: "What feeds the scoring engine?", a: "Intent tap directly: High = +10 pts Intent, Medium = +5, Low = 0, Negative = −10. Stage transitions are logged for reporting. A high-intent reply can push a Grade C lead to Grade A in real time." },
]

const RELATED = [
  { icon: Gauge, title: "Lead Scoring", description: "WhatsApp replies feed the Intent Score. 3 taps → real-time grade update.", href: "/features/lead-scoring" },
  { icon: ListOrdered, title: "Priority Queue", description: "High-intent WA replies instantly re-rank the lead to the top of the queue.", href: "/features/priority-queue" },
  { icon: Users, title: "Sales Rep Tracking", description: "Per-rep WhatsApp activity and stage progression on the Rep Performance card.", href: "/features/sales-rep-tracking" },
]

export default function WhatsAppTrackingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Features", url: "/features" }, { name: "WhatsApp Tracking" }]), faqPageSchema(FAQ)]) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        {/* HERO — split, 3-tap log right */}
        <section className="relative overflow-hidden border-b rule-paper" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, var(--paper) 100%)" }}>
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-[460px] w-[620px] rounded-full opacity-[0.30] blur-[130px]" style={{ background: "radial-gradient(circle, #BBF7D0 0%, transparent 70%)" }} />
          <Container className="relative pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div className="rise" style={{ animationDelay: "40ms" }}>
                <p className="ledger-num inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-emerald-600">
                  <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} /> WhatsApp Tracking
                </p>
                <h1 className="display-xl mt-6 text-[40px] text-ink sm:text-[52px] lg:text-[58px]">
                  WhatsApp is where half
                  <br />
                  <span className="relative inline-block text-emerald-600">
                    your deals actually live.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-emerald-200" />
                  </span>
                </h1>
                <p className="mt-7 max-w-xl text-[17px] leading-[1.7] text-ink-soft md:text-[18px]">
                  In Indian B2B, the real conversation moves to WhatsApp after the first call, and disappears from the CRM. Leadkaun logs each exchange in three taps, stage, intent, outcome, on any WhatsApp account, and feeds the Intent Score straight away.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
                    Start free trial <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="/features/lead-scoring" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)" }}>
                    See lead scoring <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* 3-tap log */}
              <div className="rise" style={{ animationDelay: "160ms" }}>
                <FloatingCard tier="2" depth="3" gloss aura="sky" className="mx-auto max-w-md p-5 md:p-6">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Log WhatsApp · Priya Sharma</p>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100">3 taps</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {[
                      { n: "01", l: "Stage", v: "Asking questions", tone: "bg-sky-50 text-sky-700 ring-sky-200" },
                      { n: "02", l: "Intent", v: "High · +10", tone: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
                      { n: "03", l: "Outcome", v: "Progressed", tone: "bg-sky-50 text-sky-700 ring-sky-200" },
                    ].map((t) => (
                      <div key={t.n} className="flex items-center gap-3">
                        <span className="font-mono text-[10px] font-semibold text-ink-muted">{t.n}</span>
                        <span className="w-16 text-[12px] font-medium text-ink-soft">{t.l}</span>
                        <span className={`ml-auto rounded-lg px-2.5 py-1 text-[12.5px] font-semibold ring-1 ${t.tone}`}>{t.v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2 border-t pt-4 rule-paper">
                    <GradeBadge grade="C" size="sm" />
                    <ArrowRight className="h-4 w-4 text-emerald-500" />
                    <GradeBadge grade="A" size="sm" />
                    <span className="ml-auto font-mono text-[11px] font-semibold text-emerald-600">intent updated</span>
                  </div>
                  <p className="mt-3 text-[11px] leading-snug text-ink-muted">Illustrative. Manual log, ~10 seconds, feeds the grade in real time.</p>
                </FloatingCard>
              </div>
            </div>
          </Container>
        </section>

        {/* 01 — THE LIVE PRODUCT (AppReplica opened on a lead) */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-8 max-w-3xl">
              <NumberedTag number="01" label="The live product" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Log a reply and watch the grade move.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                This is the actual lead view. Log a WhatsApp reply with a high-intent tap and watch the score, and the lead&apos;s place in the queue, update underneath you.
              </p>
            </Reveal>
          </Container>
          <Reveal delay={0.06} className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <AppReplica initialView="lead" />
          </Reveal>
        </SectionGround>

        {/* QUICK ANSWER — accent card, chipped terms */}
        <SectionGround variant="pure" size="sm">
          <Container>
            <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border bg-white p-6 pl-7 md:p-8 md:pl-10" style={{ borderColor: "var(--paper-line)" }} data-quick-answer>
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", speakable: { "@type": "SpeakableSpecification", cssSelector: [".quick-answer-q", ".quick-answer-a"] } }) }} />
              <span aria-hidden className="absolute inset-y-0 left-0 w-1.5" style={{ background: "linear-gradient(180deg,#34D399,#10B981)" }} />
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-500" aria-hidden />
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-600">Quick answer</p>
              </div>
              <p className="quick-answer-q mt-3 text-[16px] font-semibold text-ink md:text-[17px]">How does Leadkaun track WhatsApp sales conversations?</p>
              <p className="quick-answer-a mt-3 text-[16px] leading-[1.75] text-ink-soft">
                With a <Chip>3-tap manual log</Chip>, stage, intent, outcome, that takes about ten seconds. It works with <Chip tone="sky">any WhatsApp account</Chip>, regular or Business, and needs <Chip>no WhatsApp Business API</Chip>. The Intent tap feeds the lead&apos;s score directly, so a high-intent reply can move a Grade C to Grade A. Auto-logging via a Business Service Provider is <Chip tone="warn">on the roadmap</Chip>; today it is a fast manual log.
              </p>
            </div>
          </Container>
        </SectionGround>

        {/* 02 — STAGE. INTENT. OUTCOME. */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="02" tone="warm" label="The 3-tap model" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Stage. Intent. Outcome.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Three taps a rep can do one-handed between calls. Enough structure to score the lead, little enough that reps actually do it.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3">
              {TAPS.map((t) => (
                <FloatingCard key={t.num} tier="2" depth="2" gloss className="p-6">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[13px] font-semibold text-emerald-600">{t.num}</span>
                    <span className="text-[15px] font-semibold text-ink">{t.label}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {t.options.map((o) => (
                      <span key={o} className="rounded-lg bg-white/70 px-2.5 py-1 text-[12.5px] font-medium text-ink-soft ring-1 ring-black/5">{o}</span>
                    ))}
                  </div>
                </FloatingCard>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* 03 — A REPLY MOVES THE GRADE (text left, visual right) */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <NumberedTag number="03" label="It feeds the score" />
                <h2 className="mt-5 text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[38px]">
                  One high-intent reply can change the grade.
                </h2>
                <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
                  The Intent tap isn&apos;t a note; it&apos;s a score input. High is +10, Medium +5, Negative −10. A quiet Grade C that suddenly asks for pricing on WhatsApp gets logged High, and moves up in real time, so the rep who is on it calls while the lead is still warm.
                </p>
              </div>
              <Reveal delay={0.06}>
                <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Intent tap → points</p>
                  <div className="mt-4 space-y-2">
                    {[["High", "+10", "bg-emerald-50 text-emerald-700 ring-emerald-200"], ["Medium", "+5", "bg-sky-50 text-sky-700 ring-sky-200"], ["Low", "0", "bg-white/60 text-ink-soft ring-black/5"], ["Negative", "−10", "bg-rose-50 text-rose-700 ring-rose-200"]].map(([l, p, tone]) => (
                      <div key={l} className={`flex items-center justify-between rounded-lg px-3.5 py-2.5 ring-1 ${tone}`}>
                        <span className="text-[13.5px] font-medium">{l}</span>
                        <span className="font-mono text-[14px] font-semibold">{p}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2 border-t pt-4 rule-paper">
                    <GradeBadge grade="C" size="sm" />
                    <ArrowRight className="h-4 w-4 text-emerald-500" />
                    <GradeBadge grade="A" size="sm" />
                    <span className="ml-auto text-[12px] text-ink-soft">on a single High reply</span>
                  </div>
                </FloatingCard>
              </Reveal>
            </div>
          </Container>
        </SectionGround>

        {/* 04 — TODAY VS ROADMAP (honest boundary) */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-10 max-w-3xl">
              <NumberedTag number="04" label="Straight about it" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Manual today. Auto-logging is on the roadmap.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2">
              <FloatingCard tier="2" depth="2" gloss aura="sky" className="p-6 md:p-7">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-600">Today, and it works</p>
                <p className="mt-3 text-[17px] font-semibold leading-snug text-ink">3-tap manual logging, any WhatsApp account.</p>
                <p className="mt-3 text-[13.5px] leading-[1.6] text-ink-soft">No Business API, no setup, no per-message fees. About ten seconds per exchange, and it feeds the score the same as anything else.</p>
              </FloatingCard>
              <FloatingCard tier="2" depth="2" gloss aura="peach" className="p-6 md:p-7">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-600">On the roadmap</p>
                <p className="mt-3 text-[17px] font-semibold leading-snug text-ink">Auto-logging via a Business Service Provider.</p>
                <p className="mt-3 text-[13.5px] leading-[1.6] text-ink-soft">Gupshup, AiSensy, Interakt and the like. It isn&apos;t live yet, so we won&apos;t pretend it is, we&apos;d rather you buy what ships today.</p>
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
                The deal happened on WhatsApp. The CRM never knew.
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
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">WhatsApp questions.</h2>
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
                The log is an input. Here&apos;s where it lands.
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
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"><Icon className="h-5 w-5" strokeWidth={2} /></span>
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
                <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-96 rounded-full opacity-30 blur-[110px]" style={{ background: "radial-gradient(circle,#BBF7D0 0%,transparent 70%)" }} />
                <p className="ledger-num relative text-[11px] uppercase tracking-[0.22em] text-emerald-600">08 · Ready when you are</p>
                <h2 className="display-lg relative mx-auto mt-5 max-w-2xl text-[30px] text-ink md:text-[44px]">
                  Get the WhatsApp deals{" "}
                  <span className="relative inline-block text-emerald-600">
                    back into the pipeline.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-emerald-200" />
                  </span>
                </h2>
                <p className="relative mx-auto mt-6 max-w-xl text-[16px] leading-[1.7] text-ink-soft">
                  Import your leads and start logging WhatsApp exchanges in three taps. Every high-intent reply feeds the score and moves the lead up the queue.
                </p>
                <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
                    Start free trial <ArrowRight className="h-4 w-4" />
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
