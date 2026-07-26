import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { ProductBlock } from "@/app/components/sell/blocks"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { QuickAnswer } from "@/app/components/quick-answer"
import { NumberedTag } from "@/app/components/numbered-tag"
import { breadcrumbListSchema, jsonLdScript, canonical } from "@/lib/seo"

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
  { slug: "leadkaun-vs-pipedrive",   name: "Pipedrive",   tagline: "Global pipeline CRM. Per-user USD, WhatsApp is an add-on." },
  { slug: "leadkaun-vs-zoho-bigin",  name: "Zoho Bigin",  tagline: "Light and cheap — but no real scoring engine." },
  { slug: "leadkaun-vs-kylas",       name: "Kylas",       tagline: "Flat, unlimited users. Pricey for small teams." },
  { slug: "leadkaun-vs-telecrm",     name: "TeleCRM",     tagline: "Telecalling-first. Great dialer, no intent grading." },
  { slug: "leadkaun-vs-bitrix24",    name: "Bitrix24",    tagline: "All-in-one suite. Broad, complex, USD-priced." },
  { slug: "leadkaun-vs-monday",      name: "monday CRM",  tagline: "No-code Work OS CRM. USD per-seat, build-your-own scoring." },
  { slug: "leadkaun-vs-close",       name: "Close",       tagline: "Inside-sales CRM with native calling. USD + usage." },
  { slug: "leadkaun-vs-selldo",      name: "Sell.Do",     tagline: "Real-estate-specific CRM. Horizontal vs vertical." },
  { slug: "leadkaun-vs-apollo",      name: "Apollo.io",   tagline: "Prospecting DB — different tool, used together." },
  { slug: "leadkaun-vs-clay",        name: "Clay",        tagline: "Data enrichment, not a CRM — complementary." },
]

export default function CompareHub() {
  return (
    <main className="min-h-screen bg-bg-pure">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([
        breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Compare" }]),
        { "@context": "https://schema.org", "@type": "ItemList", name: "Leadkaun CRM comparisons",
          itemListElement: COMPARES.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: `Leadkaun vs ${c.name}`, url: canonical(`/compare/${c.slug}`) })) },
      ]) }} />
      <Navbar />

      <PageHero
        eyebrow="CRM Alternatives"
        h1={<>Leadkaun vs <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}>every major CRM.</span></>}
        sub="Honest, feature-by-feature. Named weak points for Leadkaun where they exist. No trash talk, no unverifiable claims."
        primary={undefined}
      />

      <SectionGround variant="pure" size="sm">
        <Container>
          <QuickAnswer
            question="What is the best CRM alternative for Indian SMB sales teams?"
            answer="For Indian B2B SMBs that want leads graded and prioritised, Leadkaun is a strong alternative — it grades every lead A–F, ranks each rep's queue, and treats WhatsApp as a first-class signal, at flat INR pricing, running alongside your CRM. Zoho, Freshsales and Kylas suit other needs."
          />
        </Container>
      </SectionGround>

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

      <ProductBlock />

      <CTABanner
        tag={{ number: "02", label: "Ready when you are" }}
        headline="Or just try Leadkaun alongside your current CRM."
        sub="14-day trial. Run both in parallel. Let ₹ recovered decide which one stays."
      />
      <Footer />
    </main>
  )
}
