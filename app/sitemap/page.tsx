import type { Metadata } from "next"
import Link from "next/link"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { Reveal } from "@/app/components/reveal"
import { getBest, getPillars } from "@/lib/pseo/lookup"
import { ogMeta } from "@/lib/seo"

export const revalidate = 86400

const title = "Sitemap, every page on Leadkaun"
const description =
  "A human-readable index of Leadkaun — product, pricing, features, buyer guides, comparisons, learn guides, resources, tools and locations. Machine sitemap at /sitemap.xml."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/sitemap" },
  ...ogMeta({ title, description, path: "/sitemap" }),
  robots: { index: true, follow: true },
}

type L = { href: string; label: string }
const titleCase = (slug: string) =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

function LinkGroup({ n, label, heading, links, ground = "pure" }: {
  n: string; label: string; heading: string; links: L[]; ground?: "pure" | "cream" | "sky"
}) {
  if (links.length === 0) return null
  return (
    <SectionGround variant={ground} size="md">
      <Container>
        <Reveal className="mb-6">
          <NumberedTag number={n} tone={ground === "cream" ? "warm" : undefined} label={label} />
          <h2 className="mt-4 text-[22px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-[26px]">{heading}</h2>
        </Reveal>
        <Reveal delay={0.05} className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-[15px] leading-snug text-ink-soft transition-colors hover:text-sky-600">
              {l.label}
            </Link>
          ))}
        </Reveal>
      </Container>
    </SectionGround>
  )
}

export default async function SitemapPage() {
  const [best, pillars] = await Promise.all([getBest(), getPillars()])
  const bestLinks: L[] = [{ href: "/best", label: "All buyer guides" }, ...(best as { slug: string; h1?: string; metaTitle?: string }[]).map((b) => ({ href: `/best/${b.slug}`, label: b.h1 || b.metaTitle || titleCase(b.slug) }))]
  const learnLinks: L[] = [{ href: "/learn", label: "All guides" }, ...(pillars as { slug: string }[]).map((p) => ({ href: `/learn/${p.slug}`, label: titleCase(p.slug) }))]

  const product: L[] = [
    { href: "/product", label: "Product tour" },
    { href: "/pricing", label: "Pricing" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/methodology", label: "Methodology" },
    { href: "/security", label: "Security" },
    { href: "/demo", label: "Book a walkthrough" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]
  const features: L[] = [
    { href: "/features", label: "All features" },
    { href: "/features/lead-scoring", label: "Lead scoring" },
    { href: "/features/priority-queue", label: "Priority Queue" },
    { href: "/features/missed-opportunity-engine", label: "Missed Opportunity Engine" },
    { href: "/features/intake-intelligence", label: "Intake Intelligence" },
    { href: "/features/whatsapp-tracking", label: "WhatsApp tracking" },
    { href: "/features/sales-rep-tracking", label: "Sales rep tracking" },
    { href: "/features/morning-brief", label: "Morning Brief" },
    { href: "/features/score-evolution", label: "Score Evolution" },
  ]
  const compare: L[] = [
    { href: "/compare", label: "All comparisons" },
    { href: "/alternatives", label: "All alternatives" },
    { href: "/compare/leadkaun-vs-zoho-crm", label: "vs Zoho CRM" },
    { href: "/compare/leadkaun-vs-leadsquared", label: "vs LeadSquared" },
    { href: "/compare/leadkaun-vs-hubspot", label: "vs HubSpot" },
    { href: "/compare/leadkaun-vs-freshsales", label: "vs Freshsales" },
    { href: "/compare/leadkaun-vs-telecrm", label: "vs TeleCRM" },
    { href: "/compare/leadkaun-vs-pipedrive", label: "vs Pipedrive" },
  ]
  const resources: L[] = [
    { href: "/blog", label: "Blog" },
    { href: "/research", label: "Research" },
    { href: "/glossary", label: "Glossary" },
    { href: "/questions", label: "Questions" },
    { href: "/how-to", label: "How-to guides" },
    { href: "/integrations", label: "Integrations" },
    { href: "/resources", label: "Templates & resources" },
    { href: "/tools/crm-cost-calculator", label: "CRM cost calculator" },
    { href: "/tools/missed-revenue-calculator", label: "Missed revenue calculator" },
  ]
  const industries: L[] = [
    { href: "/use-cases", label: "All industries" },
    { href: "/use-cases/real-estate", label: "Real estate" },
    { href: "/use-cases/edtech", label: "EdTech" },
    { href: "/use-cases/bfsi", label: "BFSI" },
    { href: "/use-cases/healthcare", label: "Healthcare" },
    { href: "/use-cases/manufacturing", label: "Manufacturing" },
    { href: "/use-cases/saas", label: "SaaS" },
    { href: "/use-cases/agencies", label: "Agencies" },
    { href: "/use-cases/retail", label: "Retail" },
    { href: "/use-cases/logistics", label: "Logistics" },
    { href: "/use-cases/fintech", label: "Fintech" },
    { href: "/use-cases/hospitality", label: "Hospitality" },
  ]

  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />
      <PageHero
        eyebrow="Sitemap"
        h1="Every page on Leadkaun"
        sub="A human-readable index of the site. Looking for the machine-readable version? It's at /sitemap.xml."
      />
      <LinkGroup n="01" label="Product" heading="Product & pricing" links={product} />
      <LinkGroup n="02" label="Features" heading="What Leadkaun does" links={features} ground="cream" />
      <LinkGroup n="03" label="Buyer guides" heading="Best software guides" links={bestLinks} />
      <LinkGroup n="04" label="Compare" heading="Comparisons & alternatives" links={compare} ground="cream" />
      <LinkGroup n="05" label="Learn" heading="Guides & pillars" links={learnLinks} />
      <LinkGroup n="06" label="Resources" heading="Blog, research & tools" links={resources} ground="cream" />
      <LinkGroup n="07" label="Industries" heading="Solutions by industry" links={industries} />
      <LinkGroup n="08" label="Locations" heading="Cities we serve" links={[{ href: "/city", label: "All cities (600+ across India)" }]} ground="cream" />

      <SectionGround variant="sky" size="sm">
        <Container>
          <Reveal className="text-[14px] text-ink-soft">
            For search engines: <Link href="/sitemap.xml" className="font-semibold text-sky-600 hover:text-sky-500">XML sitemap</Link>.
          </Reveal>
        </Container>
      </SectionGround>

      <CTABanner />
      <Footer />
    </main>
  )
}
