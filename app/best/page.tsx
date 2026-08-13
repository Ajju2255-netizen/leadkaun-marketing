import type { Metadata } from "next"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { QuickAnswer } from "@/app/components/quick-answer"
import {
  IndexRegister, LedgerBlock, LedgerCTA, LedgerMasthead, SectionHead,
} from "@/app/components/ledger"
import { getBest } from "@/lib/pseo/lookup"

export const revalidate = 86400

export const metadata: Metadata = {
  title: "Best Sales & CRM Software Guides (2026), Leadkaun",
  description:
    "Honest, criteria-based rankings of the best lead management, WhatsApp CRM, lead scoring, and real estate CRM software for Indian teams in 2026.",
  alternates: { canonical: "/best" },
}

type BestGuide = { slug: string; h1: string; intro: string; updated?: string }

export default async function BestHub() {
  const guides = (await getBest()) as BestGuide[]

  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <LedgerMasthead
        meta={["Buyer's guides", `${guides.length} categories`, "We build one of these"]}
        h1={<>Best software, <span className="hero-accent">honestly ranked.</span></>}
        lead="Criteria-based rankings for Indian sales teams: pricing, WhatsApp, lead scoring, and who each tool is really for. We build Leadkaun, and every entry carries a watch-out — including ours."
        secondary={{ label: "Head-to-head comparisons", href: "/compare" }}
      />

      <SectionGround variant="pure" size="lg">
        <Container>
          <SectionHead number="01" label="The guides" title="Pick a category." />

          <LedgerBlock label="Overview" first>
            <div className="[&>[data-quick-answer]]:!mx-0 [&>[data-quick-answer]]:!max-w-none">
              <QuickAnswer
                question="What is the best lead management software in India?"
                answer="For Indian B2B SMBs that want leads graded and prioritised automatically, Leadkaun is the strongest fit. It grades every lead A–F, builds a Priority Queue per rep, and treats WhatsApp as a first-class signal, at flat INR pricing. Zoho suits deep customisation; LeadSquared suits high-volume lead-gen."
              />
            </div>
          </LedgerBlock>
        </Container>
      </SectionGround>

      <SectionGround variant="cream" size="lg">
        <Container>
          <IndexRegister
            items={guides.map((g) => ({
              href: `/best/${g.slug}`,
              title: g.h1,
              blurb: g.intro,
              meta: g.updated ? `Updated ${g.updated}` : "Guide",
            }))}
          />
        </Container>
      </SectionGround>

      <LedgerCTA
        headline="See where you'd land in these rankings."
        sub="Import a CSV and every lead comes back graded A–F with a ranked queue per rep. Same-day setup, no card, no sales call."
        secondary={{ label: "See pricing", href: "/pricing" }}
      />

      <Footer />
    </main>
  )
}
