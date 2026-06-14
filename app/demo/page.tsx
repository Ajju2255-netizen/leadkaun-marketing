import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle, Clock, Users, Video, Check } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FloatingCard } from "@/app/components/floating-card"
import { GlossButton } from "@/app/components/gloss-button"
import { Reveal } from "@/app/components/reveal"
import { APP_URLS } from "@/lib/urls"

export const metadata: Metadata = {
  title: "Book a Demo — See Leadkaun Score Your Leads in 15 Minutes",
  description:
    "Book a free 15-minute demo and watch Leadkaun grade your leads A–F, surface missed ₹, and show your team exactly who to call first. No commitment required.",
  alternates: { canonical: "/demo" },
}

const WHAT_TO_EXPECT = [
  { icon: CheckCircle, title: "Live lead scoring",            desc: "We'll import a sample of your leads and grade them A–F on the call — so you see exactly how it ranks against your real data, not a canned demo account." },
  { icon: Clock,       title: "60-minute setup walkthrough",  desc: "We show you how to go from zero to first scored lead in under an hour. No IT ticket, no vendor implementation fee, no consulting hours." },
  { icon: Users,       title: "Q&A with a product operator",  desc: "Ask anything — pricing, integrations, how grading works for your industry, how reps actually adopt it in week one. The person on the call built the thing." },
]

const GUARANTEES = [
  "No credit card, no signup required",
  "15 minutes — not an hour-long sales pitch",
  "Bring the team — managers and reps both welcome",
  "Take away a free lead-scoring template after the call",
]

const inputCls =
  "h-11 w-full rounded-xl glass-1 gloss-edge px-4 text-[14px] text-ink placeholder:text-ink-faint " +
  "transition-all focus:outline-none focus:[background:rgba(255,255,255,0.85)] focus:border-sky-400 " +
  "border border-white/70"

const labelCls =
  "mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted"

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <PageHero
        eyebrow="Free · 15 minutes · No commitment"
        h1={
          <>
            See Leadkaun score{" "}
            <em
              className="not-italic bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}
            >
              your
            </em>{" "}
            leads live.
          </>
        }
        sub="Book a 15-minute call. We import a sample of your leads, grade them A–F on screen, walk through the Priority Queue and Morning Brief. Zoom or Google Meet. That's it."
        center={false}
        primary={undefined}
      />

      <SectionGround variant="cream" size="lg">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
            {/* FORM */}
            <div>
              <Reveal>
                <NumberedTag number="01" label="Book your slot" />
                <h2 className="mt-5 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[30px]">
                  Pick a time.
                </h2>
              </Reveal>

              <Reveal delay={0.08}><FloatingCard tier="3" depth="3" gloss className="mt-8 p-6 md:p-8" as="form">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Your name</label>
                    <input type="text" name="name" placeholder="Rajan Mehta" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Company</label>
                    <input type="text" name="company" placeholder="Growfast Realty" className={inputCls} />
                  </div>
                </div>

                <div className="mt-5">
                  <label className={labelCls}>Work email</label>
                  <input type="email" name="email" placeholder="rajan@growfast.in" className={inputCls} />
                </div>

                <div className="mt-5">
                  <label className={labelCls}>Phone / WhatsApp</label>
                  <input type="tel" name="phone" placeholder="+91 98765 43210" className={inputCls} />
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Team size</label>
                    <select name="team_size" defaultValue="" className={inputCls + " text-ink-soft"}>
                      <option value="" disabled>Select…</option>
                      <option value="1-3">1–3 reps</option>
                      <option value="4-10">4–10 reps</option>
                      <option value="11-25">11–25 reps</option>
                      <option value="26+">26+ reps</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Preferred time (IST)</label>
                    <select name="preferred_time" defaultValue="" className={inputCls + " text-ink-soft"}>
                      <option value="" disabled>Select…</option>
                      <option value="morning">Morning (9 AM – 12 PM)</option>
                      <option value="afternoon">Afternoon (12 – 4 PM)</option>
                      <option value="evening">Evening (4 – 7 PM)</option>
                    </select>
                  </div>
                </div>

                <GlossButton variant="primary" size="md" type="submit" className="mt-6 w-full">
                  Book my demo
                  <span className="font-mono opacity-80">→</span>
                </GlossButton>

                <p className="mt-4 text-center text-[12px] text-ink-muted">
                  We confirm on WhatsApp or email within 2 hours.
                </p>
              </FloatingCard></Reveal>
            </div>

            {/* WHAT TO EXPECT */}
            <div>
              <Reveal>
                <NumberedTag number="02" tone="warm" label="What happens on the call" />
                <h2 className="mt-5 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[30px]">
                  Fifteen minutes, three things.
                </h2>
              </Reveal>

              <Reveal delay={0.08}><ul className="mt-8 space-y-5">
                {WHAT_TO_EXPECT.map((item) => (
                  <li key={item.title} className="flex gap-4">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background: "linear-gradient(180deg, #BAE6FD 0%, #7DD3FC 100%)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85), 0 4px 10px rgba(14,165,233,0.22)",
                      }}
                    >
                      <item.icon className="h-[18px] w-[18px] text-sky-600" strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold tracking-[-0.01em] text-ink">{item.title}</p>
                      <p className="mt-1 text-[14px] leading-[1.6] text-ink-soft">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul></Reveal>

              <Reveal delay={0.08}><FloatingCard tier="2" depth="2" gloss className="mt-8 p-6">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-sky-600" strokeWidth={1.75} />
                  <span className="text-[13px] font-semibold text-ink">Zoom or Google Meet — your call</span>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {GUARANTEES.map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-[13px] text-ink-soft">
                      <span
                        className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                        style={{
                          background: "linear-gradient(180deg, #6EE7B7 0%, #34D399 100%)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                        }}
                      >
                        <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </FloatingCard></Reveal>

              <p className="mt-6 text-[12px] text-ink-muted">
                Prefer to try it yourself first?{" "}
                <Link href={APP_URLS.register} className="text-sky-600 underline-offset-4 hover:underline">
                  Start free →
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </SectionGround>

      <CTABanner
        tag={{ number: "→", label: "Or skip the call" }}
        headline="Not ready for a demo? Start free."
        sub="Import your leads. Get grades in 60 minutes. No credit card, no commitment, no sales call required."
        secondaryLabel="How it works"
        secondaryHref="/how-it-works"
      />
      <Footer />
    </main>
  )
}
