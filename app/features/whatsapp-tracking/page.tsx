import type { Metadata } from "next"
import { MessageSquare, Gauge, ListOrdered, Users } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FeatureCard } from "@/app/components/feature-card"
import { FloatingCard } from "@/app/components/floating-card"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { faqPageSchema, jsonLdScript } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

export const metadata: Metadata = {
  title: "WhatsApp Sales Tracking — 3 taps, any WhatsApp account",
  description:
    "70% of Indian B2B first-contact happens on WhatsApp. Leadkaun tracks every exchange in 3 taps — stage, intent, outcome — and feeds the Intent Score directly.",
  alternates: { canonical: "/features/whatsapp-tracking" },
}

const TAPS = [
  { num: "01", label: "Stage",   options: ["First reply", "Asking questions", "Negotiating", "Objection", "Meeting booked", "Ghosted"] },
  { num: "02", label: "Intent",  options: ["High · +10 pts", "Medium · +5", "Low · 0", "Negative · −10"] },
  { num: "03", label: "Outcome", options: ["Progressed", "Stuck", "Closed"] },
]

const FAQ = [
  { q: "Do I need WhatsApp Business API?", a: "No. 3-tap manual logging works with any WhatsApp account — regular WhatsApp, WhatsApp Business, whatever your reps are already using. That's the point." },
  { q: "Can it auto-log WhatsApp messages?", a: "Auto-logging requires a WhatsApp Business Service Provider (Gupshup, AiSensy, Interakt). If you use one, we integrate via webhook and log every inbound/outbound message as a signal. For most SMBs on regular WhatsApp, 3-tap manual logging is the right fit." },
  { q: "How long does logging take?", a: "About 10 seconds per exchange. Reps log after each meaningful reply — not every 'hi'. By the end of a morning of calls, logging is muscle memory." },
  { q: "Does the manager see the message content?", a: "No. Only the aggregated signals (stage + intent + outcome) show up on the manager view. Per-rep WhatsApp activity counts show on the Rep Performance card. No message content without explicit permission." },
  { q: "What feeds the scoring engine?", a: "Intent tap directly: High = +10 pts Intent, Medium = +5, Low = 0, Negative = −10. Stage transitions are logged for reporting. A high-intent reply can push a Grade C lead to Grade A within 500 ms." },
]

const RELATED = [
  { icon: Gauge,       title: "Lead Scoring",       description: "WhatsApp replies feed the Intent Score. 3 taps → 500 ms grade update.",          href: "/features/lead-scoring" },
  { icon: ListOrdered, title: "Priority Queue",     description: "High-intent WA replies instantly re-rank the lead to the top of the queue.",      href: "/features/priority-queue" },
  { icon: Users,       title: "Sales Rep Tracking", description: "Per-rep WhatsApp activity and stage progression on the Rep Performance card.",    href: "/features/sales-rep-tracking" },
]

export default function WhatsAppTrackingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqPageSchema(FAQ)) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <PageHero
          eyebrow={<><MessageSquare className="h-3 w-3" strokeWidth={2} /> WhatsApp Tracking</>}
          h1={<>WhatsApp is where half<br /><span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}>your conversations live.</span></>}
          sub="70% of Indian B2B first-contact happens on WhatsApp. Most CRMs treat it as an integration. Leadkaun treats it as a first-class signal — three taps per exchange, works with any WhatsApp account."
          primary={{ kind: "primary", label: "Start free trial", href: APP_URLS.register, external: true }}
          secondary={{ kind: "text", label: "See Lead Scoring", href: "/features/lead-scoring" }}
        />

        {/* 3-TAP LOGGING */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 md:mb-16 max-w-3xl">
              <NumberedTag number="01" tone="warm" label="Three taps. Ten seconds." />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Stage. Intent. Outcome.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                That&apos;s the whole logging model. No text entry. No forms. No breaking rep flow.
              </p>
            </Reveal>

            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3 md:gap-6">
              {TAPS.map((t, i) => (
                <FloatingCard key={t.num} tier="3" depth="3" gloss className="p-7">
                  <div className="flex items-start justify-between">
                    <span
                      className="inline-flex h-12 w-12 items-center justify-center rounded-2xl font-mono text-[18px] font-bold text-white"
                      style={{
                        background: i === 1 ? "linear-gradient(180deg, #FDBA74 0%, #FB923C 100%)" : "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 6px 16px rgba(14,165,233,0.32)",
                      }}
                    >
                      {t.num}
                    </span>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Tap</span>
                  </div>
                  <h3 className="mt-6 text-[20px] font-semibold text-ink tracking-[-0.01em]">{t.label}</h3>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {t.options.map((o) => (
                      <li key={o} className="inline-flex items-center rounded-full glass-1 gloss-edge px-3 py-1 font-mono text-[11px] text-ink-soft tabular">
                        {o}
                      </li>
                    ))}
                  </ul>
                </FloatingCard>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* STAT */}
        <SectionGround variant="sky" size="md">
          <Container>
            <Reveal delay={0.08}><FloatingCard tier="3" depth="3" gloss className="mx-auto max-w-3xl p-10 md:p-12 text-center">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">India-specific context</p>
              <p
                className="mt-4 font-mono text-[64px] md:text-[96px] font-bold leading-none tracking-[-0.04em] tabular bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #0EA5E9 0%, #FB923C 100%)" }}
              >
                70%
              </p>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                of Indian B2B leads first-contact on WhatsApp — not email, not phone. Any system that treats WhatsApp as an afterthought loses half the signal.
              </p>
            </FloatingCard></Reveal>
          </Container>
        </SectionGround>

        {/* FAQ */}
        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <div className="flex justify-center"><NumberedTag number="02" tone="warm" label="FAQ" /></div>
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
                WhatsApp tracking questions.
              </h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={FAQ} /></Reveal>
          </Container>
        </SectionGround>

        {/* RELATED */}
        <SectionGround variant="sky" size="md">
          <Container>
            <Reveal className="mb-10">
              <NumberedTag number="03" label="Works with" />
              <h2 className="mt-5 max-w-3xl text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">
                Every WhatsApp signal goes somewhere useful.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3 md:gap-6">
              {RELATED.map((r, i) => <FeatureCard key={r.href} {...r} variant={i % 2 === 1 ? "soft" : "default"} />)}
            </Reveal>
          </Container>
        </SectionGround>

        <CTABanner
          tag={{ number: "04", label: "Ready when you are" }}
          headline="Log your first WhatsApp exchange today."
          sub="Three taps. Ten seconds. Integrated with scoring and the queue from the first interaction."
        />

        <Footer />
      </main>
    </>
  )
}
