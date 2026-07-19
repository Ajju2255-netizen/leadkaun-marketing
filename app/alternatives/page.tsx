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
import { getAlternatives } from "@/lib/pseo/lookup"

export const revalidate = 86400

export const metadata: Metadata = {
  title: "CRM Alternatives (2026) — Honest Alternatives to Every Major CRM | Leadkaun",
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
      <PageHero
        eyebrow="Alternatives"
        h1={<>Looking for an <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}>alternative?</span></>}
        sub="Honest, India-fit alternatives to every major CRM — why teams look elsewhere, and which options actually fit Indian B2B sales. We build Leadkaun and tell you where each competitor still wins."
        primary={undefined}
      />
      <SectionGround variant="cream" size="lg">
        <Container>
          <div className="mb-10">
            <NumberedTag number="01" tone="warm" label="By tool" />
            <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">Pick a tool you're replacing.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            {guides.map((g) => (
              <Link key={g.slug} href={`/alternatives/${g.slug}`} className="group flex items-center justify-between gap-6 rounded-2xl p-6 md:p-7 glass-2 elevate-2 gloss-edge lift aura-sky-hover">
                <div>
                  <p className="text-[18px] font-semibold text-ink group-hover:text-sky-600 transition-colors">{g.name} alternatives</p>
                  <p className="mt-1.5 line-clamp-2 text-[14px] text-ink-soft">{g.intro}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-ink-muted transition-all group-hover:text-sky-500 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </Container>
      </SectionGround>
      <CTABanner />
      <Footer />
    </main>
  )
}
