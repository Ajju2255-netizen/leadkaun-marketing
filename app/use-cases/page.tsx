import type { Metadata } from "next"
import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { ProductBlock } from "@/app/components/sell/blocks"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { IndustryTile } from "@/app/components/industry-tile"

export const metadata: Metadata = {
  title: "Use Cases — By Industry",
  description:
    "See how Leadkaun works across real estate, EdTech, BFSI, agencies, manufacturing, healthcare, and SaaS sales teams in India. Industry-specific ICP templates, cadences, and proof.",
  alternates: { canonical: "/use-cases" },
}

const INDUSTRIES = [
  { href: "/use-cases/real-estate",   label: "Real Estate",       meta: "₹5–50L GCV · 47-min window" },
  { href: "/use-cases/edtech",        label: "EdTech",            meta: "Admissions cycles · WA-heavy" },
  { href: "/use-cases/bfsi",          label: "BFSI & Insurance",  meta: "Audit-ready · Renewals" },
  { href: "/use-cases/saas",          label: "SaaS",              meta: "Trial → paid · Expansion" },
  { href: "/use-cases/manufacturing", label: "Manufacturing",     meta: "90-day cycles · Quotes" },
  { href: "/use-cases/agencies",      label: "Agencies",          meta: "Multi-client · White-label" },
  { href: "/use-cases/healthcare",    label: "Healthcare",        meta: "DND-compliant · Repeat LTV" },
]

export default function UseCasesHub() {
  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <PageHero
        eyebrow="Use Cases"
        h1={<>Built for the Indian<br /><span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}>sales reality.</span></>}
        sub="ICP templates, cadence defaults, and copy tuned for seven Indian B2B verticals. Every setting is a starting point — not a locked path."
        primary={undefined}
      />

      <SectionGround variant="cream" size="lg">
        <Container>
          <div className="mb-10">
            <NumberedTag number="01" tone="warm" label="Seven industries" />
            <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
              Pick your vertical. Start in 60 minutes.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIES.map((i) => (
              <IndustryTile key={i.href} {...i} />
            ))}
          </div>
        </Container>
      </SectionGround>

      <ProductBlock />

      <CTABanner />
      <Footer />
    </main>
  )
}
