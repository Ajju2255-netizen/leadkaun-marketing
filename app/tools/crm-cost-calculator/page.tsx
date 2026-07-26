import type { Metadata } from "next"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { DetailHero } from "@/app/components/detail-hero"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { CrmCostCalculator } from "@/app/components/calculator/crm-cost-calculator"
import { breadcrumbListSchema, faqPageSchema, jsonLdScript } from "@/lib/seo"

export const metadata: Metadata = {
  title: "CRM Cost Calculator — Per-Seat vs Flat Pricing (India)",
  description:
    "Free calculator: see what a per-user CRM costs as your sales team grows, compared with Leadkaun's flat per-account price. Transparent arithmetic, runs in your browser, no signup.",
  alternates: { canonical: "/tools/crm-cost-calculator" },
}

const faqs = [
  {
    q: "How is the comparison calculated?",
    a: "Per-seat cost is simply your per-user price × number of reps. Leadkaun's figure is its flat per-account tier for your team size — Starter ₹2,999 (up to 10 seats), Growth ₹7,999 (up to 30), Scale ₹19,999 (up to 75). You enter your own per-user price, so the comparison reflects your actual tool.",
  },
  {
    q: "Why does per-seat pricing get expensive?",
    a: "With a per-user model, every rep you add raises the bill — a 20-rep team pays 20× the base. Flat per-account pricing charges the same whether you have 3 reps or 30 (within a tier's seat cap), so cost stops scaling with headcount.",
  },
  {
    q: "Is this a claim that Leadkaun replaces my CRM?",
    a: "No. This is a list-price comparison of the pricing model only; features differ, and Leadkaun is built to run alongside your CRM as a grading-and-prioritisation layer. The takeaway is about how the two pricing models behave as you grow.",
  },
  {
    q: "Is my data stored?",
    a: "No. The calculator runs entirely in your browser. Nothing you type is sent anywhere.",
  },
]

export default function CrmCostCalculatorPage() {
  const schemas = [
    breadcrumbListSchema([
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools/crm-cost-calculator" },
      { name: "CRM Cost Calculator" },
    ]),
    faqPageSchema(faqs),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <DetailHero
          breadcrumb={[{ label: "Tools", href: "/tools/crm-cost-calculator" }]}
          eyebrow="Free tool · runs in your browser"
          h1="What does per-seat CRM pricing cost as your team grows?"
          sub="Per-user tools bill you more with every rep you add. Move the sliders to see the per-seat premium over Leadkaun's flat per-account price — the money that stops scaling with headcount."
        />

        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal>
              <CrmCostCalculator />
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

        <CTABanner />
        <Footer />
      </main>
    </>
  )
}
