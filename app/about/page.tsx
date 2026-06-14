import type { Metadata } from "next"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import InternalLinksGrid from "@/app/components/internal-links-grid"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { MetricStrip } from "@/app/components/metric-strip"
import { FloatingCard } from "@/app/components/floating-card"
import { Reveal } from "@/app/components/reveal"

export const metadata: Metadata = {
  title: "About Leadkaun — Built for Indian Sales Teams, Not Silicon Valley",
  description:
    "Leadkaun was built to solve a specific Indian sales problem: leads going cold, reps working in the wrong order, and managers flying blind on missed ₹.",
  alternates: { canonical: "/about" },
}

const PRINCIPLES = [
  {
    title: "India-first, always.",
    desc: "INR pricing, IST cadence, Indian phone handling, Indian B2B cycles. Not a US product localised for India — built here, for how sales actually runs.",
  },
  {
    title: "Reps use it. Managers trust it.",
    desc: "A tool reps skip is a tool that fails. We obsess over rep adoption as much as manager analytics — because the dashboards are only as good as what the rep logged at 6:47 PM.",
  },
  {
    title: "Rupees over activity.",
    desc: "We don't count calls. We surface recovery. Every number in Leadkaun rolls up to ₹ — the one metric that decides whether your Friday review feels like progress or cope.",
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <PageHero
        eyebrow="About Leadkaun"
        h1={
          <>
            Built for the Indian sales rep.{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}
            >
              Not the Silicon Valley playbook.
            </span>
          </>
        }
        sub="Most CRM software is designed in the US for US sales teams. Leadkaun is different. Every decision is grounded in how Indian B2B actually runs — WhatsApp as a first-class signal, paid leads from IndiaMART and housing portals, high volume, manual follow-ups, and managers who need ₹ accountability instead of another dashboard."
        center={false}
        primary={undefined}
      />

      {/* NUMBERS */}
      <SectionGround variant="cream" size="md">
        <Container>
          <Reveal><MetricStrip
            items={[
              { value: "₹18L",   label: "Avg revenue recovered / team / 30 days" },
              { value: "3.4×",   label: "Follow-up rate lift in week 1" },
              { value: "60 min", label: "Setup to first scored lead" },
              { value: "50+",    label: "Indian B2B teams shipping on it" },
            ]}
          /></Reveal>
        </Container>
      </SectionGround>

      {/* ORIGIN */}
      <SectionGround variant="sky" size="lg">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <NumberedTag number="01" label="Why we built this" />
              <h2 className="mt-5 text-[30px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[40px]">
                Indian sales teams were paying for leads, then losing them to silence.
              </h2>
            </Reveal>
            <Reveal delay={0.08}><FloatingCard tier="3" depth="3" gloss className="mt-8 p-8 md:p-10">
              <div className="space-y-6 text-[16px] leading-[1.7] text-ink-soft md:text-[17px]">
                <p>
                  We kept watching the same scene. A manager pays thousands a month for leads — Facebook, IndiaMART,
                  housing portals, 99acres, Google — and half of them die between the form submission and the
                  third follow-up. Not because the reps were lazy. Because nothing in their stack told them{" "}
                  <em className="text-ink not-italic font-semibold">who to call first</em>.
                </p>
                <p>
                  Generic CRMs told managers &quot;X calls made&quot; and &quot;Y leads added.&quot; Nobody was telling them{" "}
                  <em className="text-ink not-italic font-semibold">&quot;₹18L is sitting in leads that haven&apos;t been
                  called in 3 days.&quot;</em> That number changes behaviour. That's what Leadkaun was built to surface.
                </p>
                <p>
                  We call the category <strong className="text-ink font-semibold">Sales Behaviour OS</strong> — not
                  a CRM replacement, but the layer that sits on top and tells your team what to do next. The CRM
                  remembers. Leadkaun acts.
                </p>
              </div>
            </FloatingCard></Reveal>
          </div>
        </Container>
      </SectionGround>

      {/* PRINCIPLES */}
      <SectionGround variant="cream" size="lg">
        <Container>
          <Reveal className="mb-10">
            <NumberedTag number="02" tone="warm" label="What we believe" />
            <h2 className="mt-5 max-w-3xl text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
              Three non-negotiables.
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <FloatingCard
                key={p.title}
                tier="2"
                depth="2"
                gloss
                aura={i === 1 ? "peach" : "sky"}
                className="p-7"
              >
                <span
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl font-mono text-[16px] font-bold text-white"
                  style={{
                    background: i === 1
                      ? "linear-gradient(180deg, #FDBA74 0%, #FB923C 100%)"
                      : "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 4px 12px rgba(14,165,233,0.30)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-[20px] font-semibold tracking-[-0.015em] text-ink">{p.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.65] text-ink-soft">{p.desc}</p>
              </FloatingCard>
            ))}
          </Reveal>
        </Container>
      </SectionGround>

      {/* TEAM */}
      <SectionGround variant="sky" size="md">
        <Container>
          <Reveal><FloatingCard tier="3" depth="3" gloss className="mx-auto max-w-3xl p-10 md:p-12 text-center">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">The team</p>
            <h2 className="mt-4 text-[24px] font-semibold leading-[1.2] tracking-[-0.02em] text-ink md:text-[28px]">
              A small team, on one big problem.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.65] text-ink-soft">
              We're not trying to build the world's most feature-complete CRM. We're trying to build the one tool
              that changes what happens to a lead in the first six hours after it comes in — because that's where
              Indian B2B revenue actually leaks.
            </p>
            <p className="mt-6">
              <a href="mailto:team@leadkaun.com" className="text-[14px] font-semibold text-sky-600 underline-offset-4 hover:underline">
                Say hello at team@leadkaun.com →
              </a>
            </p>
          </FloatingCard></Reveal>
        </Container>
      </SectionGround>

      <CTABanner />
      <InternalLinksGrid />
      <Footer />
    </main>
  )
}
