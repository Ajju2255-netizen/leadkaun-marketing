import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"

export const metadata: Metadata = {
  title: "CRM Alternatives India — Compare Leadkaun vs Zoho, Salesforce, HubSpot, LeadSquared, Freshsales",
  description:
    "Honest comparisons. See how Leadkaun stacks up against every major CRM for Indian B2B SMB sales teams. Feature matrix, pricing, switching guides.",
  alternates: { canonical: "/compare" },
}

const COMPARES = [
  { slug: "leadkaun-vs-zoho-crm",    name: "Zoho CRM",    tagline: "The default Indian SMB CRM — rep adoption is the seam." },
  { slug: "leadkaun-vs-leadsquared", name: "LeadSquared", tagline: "India-built. Activity-tracking ≠ behaviour-tracking." },
  { slug: "leadkaun-vs-hubspot",     name: "HubSpot",     tagline: "USD pricing. Marketing-first. Expensive at scale." },
  { slug: "leadkaun-vs-salesforce",  name: "Salesforce",  tagline: "Enterprise-grade. Overkill under 200 reps." },
  { slug: "leadkaun-vs-freshsales",  name: "Freshsales",  tagline: "Clean UI. 'AI' scoring is opaque." },
]

export default function CompareHub() {
  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <PageHero
        eyebrow="CRM Alternatives"
        h1={<>Leadkaun vs <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}>every major CRM.</span></>}
        sub="Honest, feature-by-feature. Named weak points for Leadkaun where they exist. No trash talk, no unverifiable claims."
        primary={undefined}
      />

      <SectionGround variant="cream" size="lg">
        <Container>
          <div className="mb-10">
            <NumberedTag number="01" tone="warm" label="Side-by-side" />
            <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
              Pick a comparison.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            {COMPARES.map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="group flex items-center justify-between gap-6 rounded-2xl p-6 md:p-7 glass-2 elevate-2 gloss-edge lift aura-sky-hover"
              >
                <div>
                  <p className="text-[18px] font-semibold text-ink group-hover:text-sky-600 transition-colors">
                    Leadkaun vs {c.name}
                  </p>
                  <p className="mt-1.5 text-[14px] text-ink-soft">{c.tagline}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-ink-muted transition-all group-hover:text-sky-500 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </Container>
      </SectionGround>

      <CTABanner
        tag={{ number: "02", label: "Ready when you are" }}
        headline="Or just try Leadkaun alongside your current CRM."
        sub="14-day trial. Run both in parallel. Let ₹ recovered decide which one stays."
      />
      <Footer />
    </main>
  )
}
