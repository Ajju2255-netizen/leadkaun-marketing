import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Trophy } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { QuickAnswer } from "@/app/components/quick-answer"
import { NumberedTag } from "@/app/components/numbered-tag"
import { getBest } from "@/lib/pseo/lookup"

export const revalidate = 86400

export const metadata: Metadata = {
  title: "Best Sales & CRM Software Guides (2026), Leadkaun",
  description:
    "Honest, criteria-based rankings of the best lead management, WhatsApp CRM, lead scoring, and real estate CRM software for Indian teams in 2026.",
  alternates: { canonical: "/best" },
}

type BestGuide = { slug: string; h1: string; intro: string }

export default async function BestHub() {
  const guides = (await getBest()) as BestGuide[]
  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />
      <PageHero
        eyebrow={<><Trophy className="h-3 w-3" strokeWidth={2} /> Best Software</>}
        h1={<>Best software, <span className="hero-accent">honestly ranked.</span></>}
        sub="Criteria-based rankings for Indian sales teams, pricing, WhatsApp, lead scoring, and who each tool is really for. We build Leadkaun and tell you exactly where the alternatives win."
        primary={undefined}
      />
      <SectionGround variant="pure" size="sm">
        <Container>
          <QuickAnswer
            question="What is the best lead management software in India?"
            answer="For Indian B2B SMBs that want leads graded and prioritised automatically, Leadkaun is the strongest fit. It grades every lead A–F, builds a Priority Queue per rep, and treats WhatsApp as a first-class signal, at flat INR pricing. Zoho suits deep customisation; LeadSquared suits high-volume lead-gen."
          />
        </Container>
      </SectionGround>
      <SectionGround variant="cream" size="lg">
        <Container>
          <div className="mb-10">
            <NumberedTag number="01" tone="warm" label="Guides" />
            <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">Pick a category.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            {guides.map((g) => (
              <Link key={g.slug} href={`/best/${g.slug}`} className="group flex items-center justify-between gap-6 rounded-2xl p-6 md:p-7 glass-2 elevate-2 gloss-edge lift aura-sky-hover">
                <div>
                  <p className="text-[18px] font-semibold text-ink group-hover:text-sky-600 transition-colors">{g.h1}</p>
                  <p className="mt-1.5 line-clamp-2 text-[14px] text-ink-soft">{g.intro}</p>
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
