import type { Metadata } from "next"
import { AlertTriangle, Gauge, ListOrdered, Mail } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import InternalLinksGrid from "@/app/components/internal-links-grid"
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
  title: "Missed Opportunity Engine — See ₹ at risk, per rep, per week",
  description:
    "Every stale lead gets a rupee value. The Missed Opportunity Engine translates 'overdue follow-up' into ₹ at risk — the metric every Monday sales review should open with.",
  alternates: { canonical: "/features/missed-opportunity-engine" },
}

const STALE_WINDOWS = [
  { grade: "A", color: "#10B981", window: "24 hours", reason: "Hottest leads cool fastest" },
  { grade: "B", color: "#0EA5E9", window: "48 hours", reason: "Nurture window closes by week 2" },
  { grade: "C", color: "#FB923C", window: "7 days",   reason: "Industry-dependent; tuneable per pipeline" },
  { grade: "D", color: "#F97316", window: "30 days",  reason: "Long-tail; low-priority recovery" },
]

const FAQ = [
  { q: "How is ₹ at risk calculated?", a: "Formula: avg deal value for that grade × grade-specific conversion rate × 1 lead. For a real-estate team with ₹45L avg GCV and 10% Grade A conversion, a single stale Grade A lead = ₹4.5L at risk. Aggregated across stale leads, this becomes your weekly ₹ at risk number." },
  { q: "Where do the avg deal values come from?", a: "Default values are industry benchmarks (calibrated across 50+ Indian B2B teams). On Growth and Scale, you customise per pipeline using your actual last-90-day closed-won data." },
  { q: "Does it shame reps?", a: "Rep-facing copy is framed as opportunity, not blame. The rep's Morning Brief says '₹1.8L to recover today — top 3: Priya, Rajesh, Mohan' — not 'you missed ₹1.8L'. Same number, different conversation. Managers see per-rep rollups separately." },
  { q: "What happens when we mark a lead as closed-lost?", a: "It leaves the at-risk bucket and gets logged for Loss Analysis — so over time you see which sources / industries / reps have higher loss rates, and you can coach / retarget accordingly." },
  { q: "How does it integrate with Morning Brief?", a: "The top of every Morning Brief email leads with 'Your ₹ at risk today' and lists the top Grade A leads to recover. It's the single metric that sets the rep's day." },
]

const RELATED = [
  { icon: Gauge,       title: "Lead Scoring",   description: "Stale leads only matter after they've been graded. See how scoring drives the ₹ at risk number.", href: "/features/lead-scoring" },
  { icon: ListOrdered, title: "Priority Queue", description: "Recovery actions show up in the rep's queue — with the ₹ value attached.",                       href: "/features/priority-queue" },
  { icon: Mail,        title: "Morning Brief",  description: "Where the ₹ at risk number lands every weekday at 8:30 AM IST — rep and manager versions.",       href: "/features/morning-brief" },
]

export default function MissedOpportunityPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqPageSchema(FAQ)) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <PageHero
          eyebrow={<><AlertTriangle className="h-3 w-3" strokeWidth={2} /> Missed Opportunity Engine</>}
          h1={<>Every stale lead<br /><span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #FB923C 0%, #0EA5E9 100%)" }}>gets a rupee value.</span></>}
          sub="The metric that turns Monday reviews from activity debates into money conversations. ₹ at risk per rep, per week — every week."
          primary={{ kind: "primary", label: "Start free trial", href: APP_URLS.register, external: true }}
          secondary={{ kind: "text", label: "See Morning Brief", href: "/features/morning-brief" }}
        />

        {/* FORMULA */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 md:mb-16 max-w-3xl">
              <NumberedTag number="01" tone="warm" label="The formula" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                One line. Zero black box.
              </h2>
            </Reveal>

            <Reveal delay={0.08}><FloatingCard tier="3" depth="3" gloss className="p-8 md:p-12">
              <p className="font-mono text-[20px] md:text-[28px] font-semibold leading-relaxed text-center text-ink tabular">
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}>₹ at risk</span> = avg deal value × grade conversion rate × stale lead count
              </p>
              <div className="mt-10 grid gap-5 md:grid-cols-3">
                {[
                  { lab: "Example — real estate", body: <>₹45L avg deal × 10% Grade A conv. × 1 stale lead = <span className="font-mono font-semibold text-ink">₹4.5L at risk</span> per stale Grade A lead</> },
                  { lab: "Example — EdTech",      body: <>₹75k avg fee × 22% Grade A conv. × 1 stale lead = <span className="font-mono font-semibold text-ink">₹16,500</span> per stale Grade A lead</> },
                  { lab: "Typical team baseline", body: <>10-rep Indian B2B SMB:<span className="font-mono font-semibold text-ink"> ₹2–5 L / week</span> steady-state ₹ at risk after 30 days on Leadkaun</> },
                ].map((c, i) => (
                  <FloatingCard key={c.lab} tier={i === 1 ? "peach" : "sky"} depth="1" className="p-5">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">{c.lab}</p>
                    <p className="mt-3 text-[14px] leading-[1.55] text-ink-soft">{c.body}</p>
                  </FloatingCard>
                ))}
              </div>
            </FloatingCard></Reveal>
          </Container>
        </SectionGround>

        {/* STALE WINDOWS */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-12 md:mb-16 max-w-3xl">
              <NumberedTag number="02" label="What counts as stale" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Stale windows vary by grade.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Grade A leads cool in hours. Grade C in weeks. The windows below are defaults; industry templates override them automatically.
              </p>
            </Reveal>

            <Reveal delay={0.08}><FloatingCard tier="3" depth="3" gloss className="overflow-hidden">
              <div className="grid grid-cols-[80px_1fr_1fr]" style={{ borderBottom: "1px solid var(--hairline-strong)" }}>
                <div className="px-6 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Grade</div>
                <div className="px-6 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Stale after</div>
                <div className="px-6 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Why</div>
              </div>
              {STALE_WINDOWS.map((r, i) => (
                <div key={r.grade} className="grid grid-cols-[80px_1fr_1fr] items-center" style={i < STALE_WINDOWS.length - 1 ? { borderBottom: "1px solid var(--hairline)" } : undefined}>
                  <div className="px-6 py-5">
                    <span
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full font-mono text-[14px] font-bold text-white"
                      style={{
                        background: `linear-gradient(180deg, color-mix(in srgb, ${r.color} 70%, white) 0%, ${r.color} 100%)`,
                        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), 0 4px 10px ${r.color}55`,
                      }}
                    >
                      {r.grade}
                    </span>
                  </div>
                  <div className="px-6 py-5 font-mono text-[14px] font-semibold text-ink tabular">{r.window}</div>
                  <div className="px-6 py-5 text-[14px] text-ink-soft">{r.reason}</div>
                </div>
              ))}
            </FloatingCard></Reveal>
          </Container>
        </SectionGround>

        {/* FAQ */}
        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <div className="flex justify-center"><NumberedTag number="03" tone="warm" label="FAQ" /></div>
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
                Questions about ₹ at risk.
              </h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={FAQ} /></Reveal>
          </Container>
        </SectionGround>

        {/* RELATED */}
        <SectionGround variant="sky" size="md">
          <Container>
            <Reveal className="mb-10">
              <NumberedTag number="04" label="Works with" />
              <h2 className="mt-5 max-w-3xl text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">
                Where the ₹ at risk number lives.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3 md:gap-6">
              {RELATED.map((r, i) => <FeatureCard key={r.href} {...r} variant={i % 2 === 1 ? "soft" : "default"} />)}
            </Reveal>
          </Container>
        </SectionGround>

        <CTABanner
          tag={{ number: "05", label: "Ready when you are" }}
          headline="See your ₹ at risk — week one."
          sub="Import your leads. Leadkaun grades them, surfaces the stale ones, attaches a rupee value. Free for 14 days."
        />

        <InternalLinksGrid />
        <Footer />
      </main>
    </>
  )
}
