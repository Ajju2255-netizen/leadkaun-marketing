import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BarChart3 } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { getResearch } from "@/lib/pseo/lookup"

export const revalidate = 86400

export const metadata: Metadata = {
  title: "Leadkaun Research — Sourced Sales & Lead-Management Data Reports",
  description:
    "Original, fully-sourced benchmark reports on B2B sales, lead response time, follow-up, and WhatsApp adoption in India. Every figure cited to its research.",
  alternates: { canonical: "/research" },
}

type Report = { slug: string; h1: string; dek: string; updated: string }

export default async function ResearchHub() {
  const reports = (await getResearch()) as Report[]
  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />
      <PageHero
        eyebrow={<><BarChart3 className="h-3 w-3" strokeWidth={2} /> Leadkaun Research</>}
        h1={<>Sales data, <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}>honestly sourced.</span></>}
        sub="Benchmark reports on how B2B sales actually works — lead response time, follow-up discipline, WhatsApp in India, and where reps lose their week. Every figure links to its original research, and we flag anything we couldn't verify."
        primary={undefined}
      />
      <SectionGround variant="cream" size="lg">
        <Container>
          <div className="mb-10">
            <NumberedTag number="01" tone="warm" label="Reports" />
            <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">The data library.</h2>
          </div>
          <div className="grid gap-4 md:gap-5">
            {reports.map((r) => (
              <Link key={r.slug} href={`/research/${r.slug}`} className="group flex items-center justify-between gap-6 rounded-2xl p-6 md:p-7 glass-2 elevate-2 gloss-edge lift aura-sky-hover">
                <div>
                  <p className="text-[18px] font-semibold text-ink group-hover:text-sky-600 transition-colors">{r.h1}</p>
                  <p className="mt-1.5 line-clamp-2 text-[14px] text-ink-soft">{r.dek}</p>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">Updated {r.updated}</p>
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
