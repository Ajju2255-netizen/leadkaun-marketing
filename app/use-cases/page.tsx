import type { Metadata } from "next"
import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import { LedgerCTA } from "@/app/components/ledger"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { IndustryTile } from "@/app/components/industry-tile"

export const metadata: Metadata = {
  title: "Use Cases, By Industry",
  description:
    "See how Leadkaun works across real estate, EdTech, BFSI, agencies, manufacturing, healthcare, and SaaS sales teams in India. Industry-specific ICP templates, cadences, and proof.",
  alternates: { canonical: "/use-cases" },
}

const INDUSTRIES = [
  { href: "/use-cases/real-estate",   label: "Real Estate",       meta: "₹5–50L GCV · high-velocity leads" },
  { href: "/use-cases/edtech",        label: "EdTech",            meta: "Admissions cycles · WA-heavy" },
  { href: "/use-cases/bfsi",          label: "BFSI & Insurance",  meta: "Audit-ready · Renewals" },
  { href: "/use-cases/saas",          label: "SaaS",              meta: "Trial → paid · Expansion" },
  { href: "/use-cases/manufacturing", label: "Manufacturing",     meta: "90-day cycles · Quotes" },
  { href: "/use-cases/agencies",      label: "Agencies",          meta: "Multi-client · White-label" },
  { href: "/use-cases/healthcare",    label: "Healthcare",        meta: "DND-compliant · Repeat LTV" },
  { href: "/use-cases/retail",        label: "Retail",            meta: "High-volume · Franchise leads" },
  { href: "/use-cases/logistics",     label: "Logistics",         meta: "Recurring contracts · RFQs" },
  { href: "/use-cases/fintech",       label: "Fintech",           meta: "Disbursement · AUM cycles" },
  { href: "/use-cases/hospitality",   label: "Hospitality",       meta: "Events · Bookings" },
]

export default function UseCasesHub() {
  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <PageHero
        eyebrow="Use Cases"
        h1={<>Built for the Indian<br /><span className="hero-accent">sales reality.</span></>}
        sub="ICP templates, cadence defaults, and copy tuned for eleven Indian B2B verticals. Every setting is a starting point, not a locked path."
        primary={undefined}
      />

      <SectionGround variant="cream" size="lg">
        <Container>
          <div className="mb-10">
            <NumberedTag number="01" tone="warm" label="Eleven industries" />
            <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
              Pick your vertical. Start the same day.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIES.map((i) => (
              <IndustryTile key={i.href} {...i} />
            ))}
          </div>
        </Container>
      </SectionGround>

      <LedgerCTA headline="Your reps open their queue tomorrow." sub="Setup the same day. 14-day free trial. No credit card required." />
      <Footer />
    </main>
  )
}
