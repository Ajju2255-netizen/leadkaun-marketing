import type { Metadata } from "next"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { QuickAnswer } from "@/app/components/quick-answer"
import {
  IndexRegister, LedgerBlock, LedgerCTA, LedgerMasthead, SectionHead,
} from "@/app/components/ledger"
import { getAlternatives } from "@/lib/pseo/lookup"

export const revalidate = 86400

export const metadata: Metadata = {
  title: "CRM Alternatives (2026), Honest Alternatives to Every Major CRM | Leadkaun",
  description:
    "Looking for an alternative to Zoho, HubSpot, Salesforce, Pipedrive, LeadSquared, Kylas, TeleCRM and more? Honest, India-fit alternatives for B2B sales teams.",
  alternates: { canonical: "/alternatives" },
}

type AltGuide = { slug: string; name: string; h1: string; intro: string }

export default async function AlternativesHub() {
  const guides = (await getAlternatives()) as AltGuide[]

  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <LedgerMasthead
        meta={["Alternatives", `${guides.length} guides`, "We build one of these"]}
        h1={<>Looking for an <span className="hero-accent">alternative?</span></>}
        lead="Honest, India-fit alternatives to every major CRM: why teams look elsewhere, and which options actually fit Indian B2B sales. We build Leadkaun, and we say where each incumbent still wins."
        secondary={{ label: "Head-to-head comparisons", href: "/compare" }}
      />

      <SectionGround variant="pure" size="lg">
        <Container>
          <SectionHead number="01" label="By tool" title="Pick the tool you're replacing." />

          <LedgerBlock label="Overview" first>
            <div className="[&>[data-quick-answer]]:!mx-0 [&>[data-quick-answer]]:!max-w-none">
              <QuickAnswer
                question="What are the best alternatives to Zoho, HubSpot and Salesforce in India?"
                answer="For Indian SMBs, the best alternative depends on why you're leaving. Leadkaun is a focused, flat-priced Sales Behaviour OS that grades and prioritises leads alongside your CRM; Kylas and Freshsales are also India-fit options. Each competitor page names where the incumbent still wins."
              />
            </div>
          </LedgerBlock>
        </Container>
      </SectionGround>

      <SectionGround variant="cream" size="lg">
        <Container>
          <IndexRegister
            items={guides.map((g) => ({
              href: `/alternatives/${g.slug}`,
              title: `${g.name} alternatives`,
              blurb: g.intro,
              meta: g.name,
            }))}
          />
        </Container>
      </SectionGround>

      <LedgerCTA
        headline="Or just try the alternative."
        sub="Import a CSV from whatever you use today and every lead comes back graded A–F with a ranked queue per rep. No card, no sales call."
        secondary={{ label: "See pricing", href: "/pricing" }}
      />

      <Footer />
    </main>
  )
}
