import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FloatingCard } from "@/app/components/floating-card"
import { Reveal } from "@/app/components/reveal"

import { CATEGORIES, getAllPosts, estimateReadingTime } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Leadkaun Blog — Sales Behaviour Insights for Indian B2B Teams",
  description:
    "Practical guides on lead scoring, priority queues, rupee-first analytics, WhatsApp sales, and building accountability in Indian B2B sales teams.",
  alternates: { canonical: "/blog" },
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
}

export default function BlogPage() {
  const posts = getAllPosts()
  const [featured, ...rest] = posts
  const recent = rest

  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <PageHero
        eyebrow="The Leadkaun Journal"
        h1={<>Sales behaviour insights for <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}>Indian B2B teams.</span></>}
        sub="Practical field notes from operators — on A–F lead scoring, rupee-first analytics, WhatsApp as a signal, and running sales accountability without micromanagement. Two articles a week. Built for founders, sales heads, and RevOps leaders in 2026-era Indian B2B."
        center={false}
        primary={undefined}
      />

      {/* FEATURED */}
      {featured && (() => {
        const cat = CATEGORIES.find((c) => c.slug === featured.category)
        return (
          <SectionGround variant="cream" size="lg">
            <Container>
              <Reveal className="mb-8">
                <NumberedTag number="01" tone="warm" label="Featured" />
              </Reveal>
              <Reveal delay={0.08}>
              <Link href={`/blog/${featured.slug}`} className="block">
                <FloatingCard tier="3" depth="3" gloss interactive aura="sky" className="p-8 md:p-12">
                  <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                      {cat && (
                        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">
                          {cat.title}
                        </p>
                      )}
                      <h2 className="mt-4 text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[40px]">
                        {featured.title}
                      </h2>
                      <p className="mt-5 max-w-2xl text-[16px] leading-[1.65] text-ink-soft md:text-[17px]">
                        {featured.description}
                      </p>
                      <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-[12px] uppercase tracking-[0.10em] text-ink-muted">
                        <span>{formatDate(featured.date)}</span>
                        <span aria-hidden>·</span>
                        <span>{featured.readingTime ?? estimateReadingTime(featured.body)}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-600 transition-transform group-hover:translate-x-0.5">
                      Read essay <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </FloatingCard>
              </Link>
              </Reveal>
            </Container>
          </SectionGround>
        )
      })()}

      {/* RECENT */}
      {recent.length > 0 && (
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-10 flex items-end justify-between gap-6">
              <div>
                <NumberedTag number="02" label={`All articles · ${posts.length}`} />
                <h2 className="mt-5 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">
                  Every article in the journal.
                </h2>
              </div>
            </Reveal>

            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {recent.map((p, i) => {
                const cat = CATEGORIES.find((c) => c.slug === p.category)
                return (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="block">
                    <FloatingCard
                      tier="2"
                      depth="2"
                      gloss
                      interactive
                      aura={i % 2 === 1 ? "peach" : "sky"}
                      className="flex flex-col justify-between gap-6 p-6 md:p-7 h-full"
                    >
                      <div>
                        {cat && (
                          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600">
                            {cat.title}
                          </p>
                        )}
                        <h3 className="mt-3 text-[18px] font-semibold leading-[1.3] tracking-[-0.015em] text-ink transition-colors">
                          {p.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-[14px] leading-[1.55] text-ink-soft">
                          {p.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.10em] text-ink-muted">
                        <span>{formatDate(p.date)}</span>
                        <span>{p.readingTime ?? estimateReadingTime(p.body)}</span>
                      </div>
                    </FloatingCard>
                  </Link>
                )
              })}
            </Reveal>
          </Container>
        </SectionGround>
      )}

      {/* PILLARS */}
      <SectionGround variant="cream" size="lg">
        <Container>
          <Reveal className="mb-10">
            <NumberedTag number="03" tone="warm" label="Browse by pillar" />
            <h2 className="mt-5 max-w-3xl text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">
              Ten editorial pillars.
            </h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-[1.65] text-ink-soft">
              Every article fits inside one of ten topical pillars — pick the one that matches the problem you&apos;re trying to solve this quarter.
            </p>
          </Reveal>

          <Reveal delay={0.08} className="grid gap-4 md:grid-cols-2 md:gap-5">
            {CATEGORIES.map((p, i) => (
              <Link key={p.slug} href={`/blog/categories/${p.slug}`} className="block">
                <FloatingCard
                  tier="1"
                  depth="1"
                  gloss
                  interactive
                  aura={i % 2 === 1 ? "peach" : "sky"}
                  className="flex items-start justify-between gap-6 p-6 h-full"
                >
                  <div className="min-w-0">
                    <p className={`font-mono text-[11px] font-semibold uppercase tracking-[0.16em] ${i % 2 === 1 ? "text-orange-500" : "text-sky-600"}`}>
                      Pillar {p.pillar}
                    </p>
                    <p className="mt-3 text-[17px] font-semibold tracking-[-0.01em] text-ink transition-colors">
                      {p.title}
                    </p>
                    <p className="mt-1.5 text-[14px] leading-[1.55] text-ink-soft">{p.description}</p>
                  </div>
                  <ArrowRight
                    className="mt-1 h-4 w-4 shrink-0 text-ink-muted transition-all group-hover:translate-x-0.5"
                    strokeWidth={1.75}
                  />
                </FloatingCard>
              </Link>
            ))}
          </Reveal>
        </Container>
      </SectionGround>

      <CTABanner
        tag={{ number: "04", label: "Ship behaviour, not dashboards" }}
        headline="Stop reading. Start scoring."
        sub="Leadkaun grades every lead A–F, ranks the queue, and surfaces missed ₹ — so Monday actually feels like progress."
      />
      <Footer />
    </main>
  )
}
