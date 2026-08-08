import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { getPillars } from "@/lib/pseo/lookup"

export const revalidate = 86400

export const metadata: Metadata = {
  title: "Learn, Complete Guides to Sales Behaviour, Lead Scoring & More | Leadkaun",
  description:
    "In-depth topic guides for Indian B2B sales teams: lead scoring, lead management, WhatsApp sales, follow-up & response time, missed revenue, and sales behaviour.",
  alternates: { canonical: "/learn" },
}

type Pillar = { slug: string; title: string; dek: string }

export default async function LearnHub() {
  const pillars = (await getPillars()) as Pillar[]
  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />
      <PageHero
        eyebrow={<><BookOpen className="h-3 w-3" strokeWidth={2} /> Learn</>}
        h1={<>The Indian B2B <span className="hero-accent">sales playbook.</span></>}
        sub="Complete, honest guides to the topics that decide whether your team closes or leaks, each one maps every concept, guide, tool and read in one place."
        primary={undefined}
      />
      <SectionGround variant="cream" size="lg">
        <Container>
          <div className="mb-10">
            <NumberedTag number="01" tone="warm" label="Topic guides" />
            <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">Pick a topic.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            {pillars.map((p) => (
              <Link key={p.slug} href={`/learn/${p.slug}`} className="group flex items-center justify-between gap-6 rounded-2xl p-6 md:p-7 glass-2 elevate-2 gloss-edge lift aura-sky-hover">
                <div>
                  <p className="text-[18px] font-semibold text-ink group-hover:text-sky-600 transition-colors">{p.title}</p>
                  <p className="mt-1.5 line-clamp-2 text-[14px] text-ink-soft">{p.dek}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-ink-muted transition-all group-hover:text-sky-500 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </Container>
      </SectionGround>
      <CTABanner />
      <Footer />
    </main>
  )
}
