import type { Metadata } from "next"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import { LedgerCTA } from "@/app/components/ledger"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { DetailHero } from "@/app/components/detail-hero"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { JunkLeadCalculator } from "@/app/components/calculator/junk-lead-calculator"
import { CalcCapture } from "@/app/components/calculator/calc-capture"
import { breadcrumbListSchema, faqPageSchema, jsonLdScript } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Junk Lead Cost Calculator (2026)",
  description:
    "Free calculator: work out what junk leads cost your sales team every month in rep hours and rupees. Your own numbers, transparent formula, runs in your browser, no signup.",
  alternates: { canonical: "/tools/junk-lead-calculator" },
}

const faqs = [
  {
    q: "What counts as a junk lead?",
    a: "An enquiry that was never going to buy from you — a price-shopper collecting quotes, a competitor, a wrong-fit requirement, or a record with an unusable phone number. Very few are fraudulent. Most are real people whose enquiry was never going to end in a purchase from you.",
  },
  {
    q: "How is the cost calculated?",
    a: "Leads per month × your junk share × minutes spent per dead lead ÷ 60, multiplied by a rep-hour cost derived from your own monthly cost per rep over a 22-day, 8-hour month. Every input is yours; there is no benchmark or multiplier baked in.",
  },
  {
    q: "Isn't the real cost the good leads that went cold?",
    a: "Yes, and this calculator deliberately does not count that. It shows the time cost only, so the number is defensible. The opportunity cost of a warm lead going cold while a rep worked through dead ones is usually larger — the missed revenue calculator estimates that separately.",
  },
  {
    q: "How do I reduce it?",
    a: "Stop sorting the list by reading it. Grade every lead on fit, engagement and data quality, then work a ranked queue. The junk does not need to be identified in advance — it identifies itself by not engaging, and drops down the order without anyone deciding anything.",
  },
  {
    q: "Is my data stored?",
    a: "No. The calculator runs entirely in your browser. Nothing you type is sent anywhere.",
  },
]

export default function JunkLeadCalculatorPage() {
  const schemas = [
    breadcrumbListSchema([
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools/junk-lead-calculator" },
      { name: "Junk Lead Cost Calculator" },
    ]),
    faqPageSchema(faqs),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <DetailHero
          breadcrumb={[{ label: "Tools", href: "/tools/junk-lead-calculator" }]}
          eyebrow="Free tool · runs in your browser"
          h1="What are junk leads costing you?"
          sub="Most teams argue about lead quality without ever pricing it. Move the sliders to see what your team spends every month working enquiries that were never going to buy — in rep hours and in rupees."
        />

        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal>
              <JunkLeadCalculator />
              <CalcCapture
                source="calc-junk-lead"
                headline="Find out which of your leads are the junk"
                sub="Import a real list and Leadkaun grades every lead A–F on fit, engagement and data quality, so reps work the buyers and the rest sinks down the queue. Free forever on 1 user and 100 active leads."
              />
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

        <LedgerCTA
          headline="Your reps open their queue tomorrow."
          sub="Setup the same day. Free forever on 1 user and 100 active leads. No card."
        />
        <Footer />
      </main>
    </>
  )
}
