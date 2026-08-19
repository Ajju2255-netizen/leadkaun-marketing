import type { Metadata } from "next"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import { LedgerCTA } from "@/app/components/ledger"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { DetailHero } from "@/app/components/detail-hero"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { MissedRevenueCalculator } from "@/app/components/calculator/missed-revenue-calculator"
import { CalcCapture } from "@/app/components/calculator/calc-capture"
import { breadcrumbListSchema, faqPageSchema, jsonLdScript } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Missed Revenue Calculator. What Slow Lead Follow-Up Costs You",
  description:
    "Free calculator: estimate the ₹ your B2B sales team leaves on the table every month from slow lead follow-up, and what faster response could recover. Transparent formula, runs in your browser, no signup.",
  alternates: { canonical: "/tools/missed-revenue-calculator" },
}

const faqs = [
  {
    q: "How is the missed revenue calculated?",
    a: "Leads per month × (improved conversion rate − current conversion rate) × average deal value. You set both conversion numbers yourself, so the estimate reflects your business. There is no baked-in multiplier.",
  },
  {
    q: "Why does follow-up speed change conversion?",
    a: "A B2B lead is warmest right after it arrives. The longer the wait, the more likely they have moved on or been called by a competitor first. Contacting hot leads inside their window is the single biggest lever most Indian SMB sales teams have.",
  },
  {
    q: "How does Leadkaun help recover this?",
    a: "Leadkaun grades every lead A–F, puts the highest-intent ones at the top of each rep's Priority Queue, and surfaces the ₹ at risk when a lead goes cold, so the recoverable revenue this calculator shows actually gets recovered.",
  },
  {
    q: "Is my data stored?",
    a: "No. The calculator runs entirely in your browser. Nothing you type is sent anywhere.",
  },
]

export default function MissedRevenueCalculatorPage() {
  const schemas = [
    breadcrumbListSchema([
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools/missed-revenue-calculator" },
      { name: "Missed Revenue Calculator" },
    ]),
    faqPageSchema(faqs),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <DetailHero
          breadcrumb={[{ label: "Tools", href: "/tools/missed-revenue-calculator" }]}
          eyebrow="Free tool · runs in your browser"
          h1="What is slow lead follow-up costing you?"
          sub="Most Indian B2B teams lose more to cold leads than to lost deals. Move the sliders to see the ₹ you could recover every month. The exact number Leadkaun surfaces as “₹ at risk.”"
        />

        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal>
              <MissedRevenueCalculator />
              <CalcCapture source="calc-missed-revenue" />
            </Reveal>
          </Container>
        </SectionGround>

        <SectionGround variant="sky" size="md">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <h2 className="text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[34px]">
                How the number works.
              </h2>
              <div className="mt-8">
                <Faq items={faqs} />
              </div>
            </Reveal>
          </Container>
        </SectionGround>

        <LedgerCTA headline="Your reps open their queue tomorrow." sub="Setup the same day. Free forever on 1 user and 100 active leads. No card." />
        <Footer />
      </main>
    </>
  )
}
