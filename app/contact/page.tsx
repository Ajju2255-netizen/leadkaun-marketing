import type { Metadata } from "next"
import Link from "next/link"
import { Mail, MessageCircle, Briefcase } from "lucide-react"

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
  title: "Contact Leadkaun — Sales, Support & Partnerships",
  description:
    "Reach the Leadkaun team for sales questions, product support, or partnership enquiries. We respond within 4 business hours on WhatsApp or email.",
  alternates: { canonical: "/contact" },
}

const CONTACT_OPTIONS = [
  { icon: Briefcase,    label: "Sales",        desc: "Pricing, onboarding, team demos",         handle: "sales@leadkaun.com" },
  { icon: MessageCircle, label: "Support",      desc: "Help with your account or integrations", handle: "support@leadkaun.com" },
  { icon: Mail,          label: "Partnerships", desc: "Reseller, referral, API integrations",   handle: "partnerships@leadkaun.com" },
]

const inputCls =
  "h-11 w-full rounded-xl glass-1 gloss-edge px-4 text-[14px] text-ink placeholder:text-ink-faint " +
  "transition-all focus:outline-none focus:[background:rgba(255,255,255,0.85)] focus:border-sky-400 " +
  "border border-white/70"

const labelCls =
  "mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <PageHero
        eyebrow="Contact"
        h1="Get in touch."
        sub="We're a small team. Every message is read and replied to within 4 business hours (Mon–Sat, 9 AM–7 PM IST). No ticketing black hole, no round-robin bot."
        center={false}
        primary={undefined}
      />

      <SectionGround variant="cream" size="lg">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
            {/* FORM */}
            <div>
              <Reveal>
                <NumberedTag number="01" label="Send a message" />
                <h2 className="mt-5 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[30px]">
                  Tell us what you need.
                </h2>
              </Reveal>

              <Reveal delay={0.08}><FloatingCard tier="3" depth="3" gloss className="mt-8 p-6 md:p-8" as="form">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Name</label>
                    <input type="text" name="name" placeholder="Sunita Patel" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Work email</label>
                    <input type="email" name="email" placeholder="sunita@edureach.in" className={inputCls} />
                  </div>
                </div>

                <div className="mt-5">
                  <label className={labelCls}>Topic</label>
                  <select name="topic" className={inputCls + " text-ink-soft"} defaultValue="">
                    <option value="" disabled>Select a topic…</option>
                    <option value="sales">Sales / Pricing</option>
                    <option value="support">Product Support</option>
                    <option value="partnership">Partnership / Reseller</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mt-5">
                  <label className={labelCls}>Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Tell us what you need. Include team size, current tool, and what you're trying to fix."
                    className={"w-full resize-none rounded-xl glass-1 gloss-edge px-4 py-3 text-[14px] leading-[1.6] text-ink placeholder:text-ink-faint border border-white/70 transition-all focus:outline-none focus:border-sky-400 focus:[background:rgba(255,255,255,0.85)]"}
                  />
                </div>

                <GlossButton variant="primary" size="md" type="submit" className="mt-6 w-full">
                  Send message
                  <span className="font-mono opacity-80">→</span>
                </GlossButton>

                <p className="mt-4 text-center text-[12px] text-ink-muted">
                  Prefer a demo?{" "}
                  <Link href="/demo" className="text-sky-600 underline-offset-4 hover:underline">
                    Book a 15-min call →
                  </Link>
                </p>
              </FloatingCard></Reveal>
            </div>

            {/* DIRECT CHANNELS */}
            <div>
              <Reveal>
                <NumberedTag number="02" tone="warm" label="Or reach us directly" />
                <h2 className="mt-5 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[30px]">
                  Straight to inbox.
                </h2>
              </Reveal>

              <Reveal delay={0.08} className="mt-8 space-y-3">
                {CONTACT_OPTIONS.map((opt) => (
                  <a
                    key={opt.label}
                    href={`mailto:${opt.handle}`}
                    className="group flex items-start gap-4 rounded-2xl p-5 glass-1 gloss-edge lift aura-sky-hover"
                  >
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background: "linear-gradient(180deg, #BAE6FD 0%, #7DD3FC 100%)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85), 0 4px 10px rgba(14,165,233,0.22)",
                      }}
                    >
                      <opt.icon className="h-[18px] w-[18px] text-sky-600" strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-ink">{opt.label}</p>
                      <p className="mt-0.5 text-[12px] text-ink-muted">{opt.desc}</p>
                      <p className="mt-2 text-[13px] font-semibold text-sky-600 transition-colors group-hover:underline underline-offset-4">
                        {opt.handle}
                      </p>
                    </div>
                  </a>
                ))}

                <FloatingCard tier="peach" depth="2" gloss className="p-5 mt-3">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-500">
                    Fastest reply
                  </p>
                  <p className="mt-2 text-[14px] font-semibold text-ink">WhatsApp to sales</p>
                  <p className="mt-1 text-[13px] leading-[1.55] text-ink-soft">
                    We typically respond within 2 hours during IST business hours (Mon–Sat, 9 AM – 7 PM).
                  </p>
                </FloatingCard>
              </Reveal>
            </div>
          </div>
        </Container>
      </SectionGround>

      <CTABanner />
      <Footer />
    </main>
  )
}
